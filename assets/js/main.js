/**
 * Global Growth Agency - Main JavaScript
 * Global logic, navigation, and utility functions
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  initNavigation();
  initMobileMenu();
  initDropdowns();
  initSmoothScroll();
  initFormValidation();
  initBackToTop();
  initCurrentYear();
});

/**
 * Navigation - Sticky header and scroll effects
 */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Hide/show on scroll direction (optional)
    if (!document.body.classList.contains('menu-open')) {
      if (currentScroll > lastScroll && currentScroll > 200) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // Animate hamburger
    const spans = menuToggle.querySelectorAll('span');
    if (menuToggle.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close menu when clicking a link (but not the dropdown toggle)
  const navLinks = navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      document.body.classList.remove('menu-open');
      
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });
}

/**
 * Mobile Dropdowns
 */
function initDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown');
  
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        // Only for mobile
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      });
    }
  });
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Form Validation
 */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        const formGroup = field.closest('.form-group');
        
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          
          // Add error message if not exists
          let errorMsg = formGroup?.querySelector('.form-error');
          if (!errorMsg) {
            errorMsg = document.createElement('span');
            errorMsg.className = 'form-error';
            errorMsg.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> This field is required';
            formGroup?.appendChild(errorMsg);
          }
        } else {
          field.classList.remove('error');
          const errorMsg = formGroup?.querySelector('.form-error');
          if (errorMsg) errorMsg.remove();
        }
      });
      
      // Email validation
      const emailFields = form.querySelectorAll('input[type="email"]');
      emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
          isValid = false;
          field.classList.add('error');
        }
      });
      
      if (isValid) {
        // Show success message
        showFormSuccess(form);
      }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          input.classList.add('error');
        } else {
          input.classList.remove('error');
          const formGroup = input.closest('.form-group');
          const errorMsg = formGroup?.querySelector('.form-error');
          if (errorMsg) errorMsg.remove();
        }
      });
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormSuccess(form) {
  const successMsg = document.createElement('div');
  successMsg.className = 'alert alert-success';
  successMsg.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Thank you! We\'ll be in touch soon.';
  
  form.insertBefore(successMsg, form.firstChild);
  form.reset();
  
  setTimeout(() => {
    successMsg.remove();
  }, 5000);
}

/**
 * Back to Top Button
 */
function initBackToTop() {
  const backToTop = document.querySelector('.back-to-top');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Current Year in Footer
 */
function initCurrentYear() {
  const yearElements = document.querySelectorAll('.current-year');
  yearElements.forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Utility: Intersection Observer helper
 */
function observeElements(selector, callback, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { ...defaultOptions, ...options });
  
  document.querySelectorAll(selector).forEach(el => observer.observe(el));
  
  return observer;
}
