const HeaderComponent = {
  template: `
    <header class="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <a href="{{HOME_URL}}" class="flex items-center space-x-3 no-underline" aria-label="Lenorplus Home">
            <img src="{{LOGO_URL}}" alt="" class="w-10 h-10 object-contain" aria-hidden="true">
            <div>
              <div class="text-sm font-bold text-navy">Lenorplus</div>
              <div class="text-xs text-gray-500 -mt-1">Home Health & Bedside Care</div>
            </div>
          </a>
          
          <nav class="hidden lg:flex items-center space-x-1" aria-label="Main navigation" id="desktopNav">
            {{DESKTOP_NAV}}
          </nav>
          
          <div class="flex items-center space-x-3">
            <a href="tel:0752406556" class="hidden xl:inline-block px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90 transition-colors" aria-label="Call us">
              Call Us
            </a>
            <a href="{{REQUEST_CARE_URL}}" class="hidden xl:inline-block px-5 py-2 bg-medical-blue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors" aria-label="Request care">
              Request Care
            </a>
            <button type="button" class="lg:hidden p-2 text-gray-600 hover:text-navy rounded-lg" aria-expanded="false" aria-controls="mobileNav" aria-label="Toggle navigation menu" id="mobileMenuBtn">
              <i data-lucide="menu" class="w-6 h-6"></i>
            </button>
          </div>
        </div>
      </div>
      
      <nav class="lg:hidden hidden bg-white border-t border-gray-200" id="mobileNav" aria-label="Mobile navigation">
        <div class="px-4 py-4 space-y-2">
          {{MOBILE_NAV}}
          <div class="pt-4 border-t border-gray-200 space-y-2">
            <a href="tel:0752406556" class="block px-4 py-3 bg-navy text-white text-center font-medium rounded-lg">Call Us</a>
            <a href="{{REQUEST_CARE_URL}}" class="block px-4 py-3 bg-medical-blue text-white text-center font-medium rounded-lg">Request Care</a>
          </div>
        </div>
      </nav>
    </header>
  `,

  navItems: [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'about.html', label: 'About', key: 'about' },
    { href: 'services.html', label: 'Services', key: 'services' },
    { href: 'families.html', label: 'For Families', key: 'families' },
    { href: 'professionals.html', label: 'Professionals', key: 'professionals' },
    { href: 'partnerships.html', label: 'Partnerships', key: 'partnerships' },
    { href: 'faqs.html', label: 'FAQs', key: 'faqs' },
    { href: 'contact.html', label: 'Contact', key: 'contact' }
  ],

  render(currentPage = 'home', basePath = '') {
    const homeUrl = basePath + 'index.html';
    const requestCareUrl = basePath + 'request-care.html';
    const logoUrl = basePath + 'images/logo.jpeg';

    const desktopNav = this.navItems.map(item => {
      const isActive = item.key === currentPage;
      const href = basePath + item.href;
      const classes = `font-medium px-3 py-2 rounded-lg transition-colors ${isActive ? 'text-navy bg-navy/5' : 'text-gray-600 hover:text-navy'}`;
      return `<a href="${href}" class="${classes}" ${isActive ? 'aria-current="page"' : ''}>${item.label}</a>`;
    }).join('');

    const mobileNav = this.navItems.map(item => {
      const isActive = item.key === currentPage;
      const href = basePath + item.href;
      const classes = `block px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-navy/5 text-navy' : 'text-gray-600 hover:bg-gray-50'}`;
      return `<a href="${href}" class="${classes}" ${isActive ? 'aria-current="page"' : ''}>${item.label}</a>`;
    }).join('');

    return this.template
      .replace('{{HOME_URL}}', homeUrl)
      .replace('{{LOGO_URL}}', logoUrl)
      .replace('{{REQUEST_CARE_URL}}', requestCareUrl)
      .replace('{{DESKTOP_NAV}}', desktopNav)
      .replace('{{MOBILE_NAV}}', mobileNav);
  },

  init(basePath = '') {
    const headerContainer = document.getElementById('header');
    if (headerContainer) {
      const currentPage = this.getCurrentPage(basePath);
      headerContainer.innerHTML = this.render(currentPage, basePath);
      this.initMobileMenu();
      lucide.createIcons();
    }
  },

  getCurrentPage(basePath) {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    const pageMap = {
      'index.html': 'home',
      'about.html': 'about',
      'services.html': 'services',
      'families.html': 'families',
      'professionals.html': 'professionals',
      'partnerships.html': 'partnerships',
      'faqs.html': 'faqs',
      'contact.html': 'contact',
      'request-care.html': 'request-care',
      'refer-client.html': 'refer-client'
    };
    return pageMap[filename] || 'home';
  },

  initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    if (menuBtn && mobileNav) {
      menuBtn.addEventListener('click', () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        mobileNav.classList.toggle('hidden');
        
        const icon = menuBtn.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', isExpanded ? 'menu' : 'x');
          lucide.createIcons();
        }
      });

      mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileNav.classList.add('hidden');
          menuBtn.setAttribute('aria-expanded', 'false');
          const icon = menuBtn.querySelector('i');
          if (icon) {
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
          }
        });
      });
    }
  }
};

const FooterComponent = {
  template: `
    <footer class="bg-navy text-white" role="contentinfo">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <a href="{{HOME_URL}}" class="flex items-center space-x-3 mb-4 no-underline" aria-label="Lenorplus Home">
              <img src="{{LOGO_URL}}" alt="" class="w-10 h-10 object-contain" aria-hidden="true">
              <div>
                <div class="text-sm font-bold text-white">Lenorplus</div>
                <div class="text-xs text-gray-300">Home Health & Bedside Care</div>
              </div>
            </a>
            <p class="text-gray-400 text-sm">Professional Care. Compassionate Support. Better Living at Home.</p>
          </div>
          
          <div>
            <h3 class="font-bold text-white mb-4">Quick Links</h3>
            <ul class="space-y-2 text-sm" role="list">
              {{QUICK_LINKS}}
            </ul>
          </div>
          
          <div>
            <h3 class="font-bold text-white mb-4">Services</h3>
            <ul class="space-y-2 text-sm" role="list">
              {{SERVICE_LINKS}}
            </ul>
          </div>
          
          <div>
            <h3 class="font-bold text-white mb-4">Contact</h3>
            <div class="space-y-2 text-sm">
              <p class="text-gray-400">Address</p>
              <p class="text-white">Plot 12 Biina Road<br>Mutungo-Biina<br>Kampala, Uganda</p>
              <p class="text-gray-400 mt-2">Phone</p>
              <p class="text-white">
                <a href="tel:0752406556" class="hover:text-medical-blue">0752 406556</a><br>
                <a href="tel:0763609851" class="hover:text-medical-blue">0763 609851</a>
              </p>
              <p class="text-gray-400 mt-2">Email</p>
              <p class="text-white">
                <a href="mailto:bedsidelenorplus@gmail.com" class="hover:text-medical-blue">bedsidelenorplus@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-700 pt-6">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
            <p>&copy; {{YEAR}} Lenorplus Home Health and Bedside Care. All rights reserved.</p>
            <div class="flex space-x-6">
              <a href="privacy.html" class="hover:text-white transition-colors">Privacy Policy</a>
              <a href="terms.html" class="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,

  quickLinks: [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'about.html', label: 'About', key: 'about' },
    { href: 'services.html', label: 'Services', key: 'services' },
    { href: 'families.html', label: 'For Families', key: 'families' },
    { href: 'professionals.html', label: 'Professionals', key: 'professionals' },
    { href: 'partnerships.html', label: 'Partnerships', key: 'partnerships' },
    { href: 'faqs.html', label: 'FAQs', key: 'faqs' },
    { href: 'contact.html', label: 'Contact', key: 'contact' }
  ],

  serviceLinks: [
    { href: 'services/bedside-nursing.html', label: 'Bedside Nursing' },
    { href: 'services/caregiving.html', label: 'Caregiving' },
    { href: 'services/elderly-care.html', label: 'Elderly Care' },
    { href: 'services/post-op-care.html', label: 'Post-operative Care' },
    { href: 'services/palliative-care.html', label: 'Palliative Care' },
    { href: 'services/physiotherapy.html', label: 'Physiotherapy' },
    { href: 'services/mental-health.html', label: 'Mental Health' },
    { href: 'services/family-support.html', label: 'Family Support' },
    { href: 'services/orthopedic-care.html', label: 'Orthopedic Care' },
    { href: 'services/child-mental-health.html', label: 'Child Mental Health' }
  ],

  render(basePath = '') {
    const homeUrl = basePath + 'index.html';
    const logoUrl = basePath + 'images/logo.jpeg';
    const year = new Date().getFullYear();

    const quickLinks = this.quickLinks.map(item => {
      const href = basePath + item.href;
      return `<li><a href="${href}" class="text-gray-400 hover:text-white transition-colors no-underline">${item.label}</a></li>`;
    }).join('');

    const serviceLinks = this.serviceLinks.map(item => {
      const href = basePath + item.href;
      return `<li><a href="${href}" class="text-gray-400 hover:text-white transition-colors no-underline">${item.label}</a></li>`;
    }).join('');

    return this.template
      .replace('{{HOME_URL}}', homeUrl)
      .replace('{{LOGO_URL}}', logoUrl)
      .replace('{{QUICK_LINKS}}', quickLinks)
      .replace('{{SERVICE_LINKS}}', serviceLinks)
      .replace('{{YEAR}}', year);
  },

  init(basePath = '') {
    const footerContainer = document.getElementById('footer');
    if (footerContainer) {
      footerContainer.innerHTML = this.render(basePath);
      lucide.createIcons();
    }
  }
};

window.HeaderComponent = HeaderComponent;
window.FooterComponent = FooterComponent;