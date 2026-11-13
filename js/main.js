const FormValidator = {
  rules: {
    required: (value) => value.trim() !== '',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => /^[\d\s\-\+\(\)]{10,}$/.test(value.replace(/\s/g, '')),
    minLength: (min) => (value) => value.trim().length >= min,
  },

  messages: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    minLength: (min) => `Must be at least ${min} characters`,
  },

  validateField(field, rules) {
    const value = field.value;
    const errors = [];

    for (const rule of rules) {
      if (typeof rule === 'string') {
        if (rule === 'required' && !this.rules.required(value)) {
          errors.push(this.messages.required);
        } else if (rule === 'email' && value && !this.rules.email(value)) {
          errors.push(this.messages.email);
        } else if (rule === 'phone' && value && !this.rules.phone(value)) {
          errors.push(this.messages.phone);
        }
      } else if (typeof rule === 'object') {
        if (rule.minLength && !this.rules.minLength(rule.minLength)(value)) {
          errors.push(this.messages.minLength(rule.minLength));
        }
      }
    }

    return errors;
  },

  showError(field, message) {
    this.clearError(field);
    field.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
    field.classList.remove('border-gray-300', 'focus:ring-navy', 'focus:border-navy');
    
    const errorEl = document.createElement('p');
    errorEl.className = 'text-red-500 text-sm mt-1 field-error';
    errorEl.setAttribute('role', 'alert');
    errorEl.textContent = message;
    field.parentNode.appendChild(errorEl);
    
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorEl.id || 'error-' + field.id);
  },

  clearError(field) {
    field.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
    field.classList.add('border-gray-300', 'focus:ring-navy', 'focus:border-navy');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
    
    field.setAttribute('aria-invalid', 'false');
    field.removeAttribute('aria-describedby');
  },

  validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('[data-validate]');
    
    fields.forEach(field => {
      const rules = field.getAttribute('data-validate').split(' ');
      const errors = this.validateField(field, rules);
      
      if (errors.length > 0) {
        this.showError(field, errors[0]);
        isValid = false;
      } else {
        this.clearError(field);
      }
    });
    
    return isValid;
  },

  init(form) {
    const fields = form.querySelectorAll('[data-validate]');
    
    fields.forEach(field => {
      field.addEventListener('blur', () => {
        const rules = field.getAttribute('data-validate').split(' ');
        const errors = this.validateField(field, rules);
        if (errors.length > 0) {
          this.showError(field, errors[0]);
        } else {
          this.clearError(field);
        }
      });
      
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') {
          const rules = field.getAttribute('data-validate').split(' ');
          const errors = this.validateField(field, rules);
          if (errors.length === 0) {
            this.clearError(field);
          }
        }
      });
    });
    
    form.addEventListener('submit', (e) => {
      if (!this.validateForm(form)) {
        e.preventDefault();
        const firstError = form.querySelector('[aria-invalid="true"]');
        if (firstError) {
          firstError.focus();
        }
      }
    });
  }
};

const Toast = {
  container: null,
  
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'fixed bottom-6 right-6 z-50 space-y-2';
      this.container.setAttribute('role', 'region');
      this.container.setAttribute('aria-label', 'Notifications');
      document.body.appendChild(this.container);
    }
  },
  
  show(message, type = 'success', duration = 5000) {
    this.init();
    
    const toast = document.createElement('div');
    toast.className = `
      px-6 py-4 rounded-lg shadow-lg text-white font-medium
      transform transition-all duration-300
      translate-x-full opacity-0
      ${type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-navy'}
    `;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    
    this.container.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
    });
    
    setTimeout(() => {
      toast.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
  
  success(message, duration) { this.show(message, 'success', duration); },
  error(message, duration) { this.show(message, 'error', duration); },
  info(message, duration) { this.show(message, 'info', duration); }
};

const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('header')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      });
    });
  }
};

const IntersectionAnimations = {
  observer: null,
  
  init() {
    if (!('IntersectionObserver' in window)) return;
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.fade-in').forEach(el => {
      this.observer.observe(el);
    });
  }
};

const ServiceCards = {
  init() {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
};

const PhoneLinks = {
  init() {
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', (e) => {
        if (!link.hasAttribute('data-tracked')) {
          link.setAttribute('data-tracked', 'true');
        }
      });
    });
  }
};

function initPage() {
  const basePath = getBasePath();
  
  HeaderComponent.init(basePath);
  FooterComponent.init(basePath);
  
  SmoothScroll.init();
  IntersectionAnimations.init();
  ServiceCards.init();
  PhoneLinks.init();
  
  initForms();
  initFAQs();
  initServiceImages();
}

function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/services/')) {
    return '../';
  }
  return '';
}

function initForms() {
  const requestCareForm = document.getElementById('requestCareForm');
  if (requestCareForm) {
    FormValidator.init(requestCareForm);
    requestCareForm.addEventListener('submit', handleRequestCareSubmit);
  }
  
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    FormValidator.init(contactForm);
    contactForm.addEventListener('submit', handleContactSubmit);
  }
  
  const referForm = document.getElementById('referClientForm');
  if (referForm) {
    FormValidator.init(referForm);
    referForm.addEventListener('submit', handleReferSubmit);
  }
}

async function handleRequestCareSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  if (!FormValidator.validateForm(form)) return;
  
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  const templateParams = {
    to_email: 'bedsidelenorplus@gmail.com',
    from_name: data.fullName,
    from_email: data.email || 'Not provided',
    phone: data.phone,
    location: data.location,
    service: data.serviceRequired || 'Not specified',
    urgency: data.urgency || 'Not specified',
    description: data.description,
    contact_method: data.contactMethod,
    form_type: 'Care Request'
  };
  
  try {
    await sendEmail(EMAIL_TEMPLATES.requestCare, templateParams);
    Toast.success(`Thank you ${data.fullName}. Your care request has been received. We will contact you shortly.`);
    form.reset();
  } catch (error) {
    console.error('EmailJS error:', error);
    Toast.error('Something went wrong. Please try again or call us directly.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

async function handleContactSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  if (!FormValidator.validateForm(form)) return;
  
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading"></span> Sending...';
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  const templateParams = {
    to_email: 'bedsidelenorplus@gmail.com',
    from_name: `${data.firstName} ${data.lastName}`,
    from_email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
    form_type: 'Contact Form'
  };
  
  try {
    await sendEmail(EMAIL_TEMPLATES.contact, templateParams);
    Toast.success('Your message has been sent. We will get back to you within 24 hours.');
    form.reset();
  } catch (error) {
    console.error('EmailJS error:', error);
    Toast.error('Failed to send message. Please try again or email us directly.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

async function handleReferSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  if (!FormValidator.validateForm(form)) return;
  
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  const templateParams = {
    to_email: 'bedsidelenorplus@gmail.com',
    from_name: data.refName,
    from_email: data.refEmail,
    phone: data.refPhone,
    organization: data.organization,
    role: data.professionRole,
    client_name: data.clientName,
    client_contact: data.clientContact || 'Not provided',
    service: data.requestedServiceRef,
    referral_info: data.referralInfo,
    contact_method: data.preferredContactRef,
    form_type: 'Professional Referral'
  };
  
  try {
    await sendEmail(EMAIL_TEMPLATES.referClient, templateParams);
    Toast.success('Thank you for your referral. We will review and contact you shortly.');
    form.reset();
  } catch (error) {
    console.error('EmailJS error:', error);
    Toast.error('Something went wrong. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

const EMAILJS_PUBLIC_KEY = 'Qvzs9zxqwVeM2pbAD';
const EMAILJS_SERVICE_ID = 'service_lenorplus'; // REPLACE: Your EmailJS Service ID

const EMAIL_TEMPLATES = {
  requestCare: 'template_request_care',    // REPLACE: Your template ID for care requests
  contact: 'template_contact',              // REPLACE: Your template ID for contact form
  referClient: 'template_referral'          // REPLACE: Your template ID for referrals
};

function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
}

async function sendEmail(templateId, params) {
  if (typeof emailjs === 'undefined') {
    throw new Error('EmailJS not loaded');
  }
  return emailjs.send(EMAILJS_SERVICE_ID, templateId, params);
}

function initFAQs() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('[data-lucide="chevron-down"]');
    
    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            const otherAnswer = other.querySelector('.faq-answer');
            const otherIcon = other.querySelector('[data-lucide="chevron-down"]');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
          }
        });
        
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          if (icon) icon.style.transform = 'rotate(180deg)';
        } else {
          item.classList.remove('open');
          answer.style.maxHeight = '0';
          if (icon) icon.style.transform = 'rotate(0deg)';
        }
      });
      
      answer.style.maxHeight = '0';
      answer.style.overflow = 'hidden';
      answer.style.transition = 'max-height 0.3s ease';
    }
  });
}

function initServiceImages() {
  const images = document.querySelectorAll('.service-image img, .hero-image img');
  images.forEach(img => {
    img.addEventListener('load', () => {
      img.classList.add('loaded');
    });
    
    if (img.complete) {
      img.classList.add('loaded');
    }
  });
}

document.addEventListener('DOMContentLoaded', initPage);

window.FormValidator = FormValidator;
window.Toast = Toast;