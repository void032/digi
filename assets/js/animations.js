/**
 * Global Growth Agency - Animations
 * Scroll effects, reveal animations, and micro-interactions
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Show all elements immediately
    document.querySelectorAll('.fade-in, .slide-in, .scale-in').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  // Initialize animations
  initScrollReveal();
  initParallax();
  initCounterAnimation();
  initTextReveal();
  initMagneticButtons();
  initHoverEffects();
  initPageTransitions();
});

/**
 * Scroll Reveal Animation
 * Elements fade in and slide up when entering viewport
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.fade-in, [data-reveal]');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        
        setTimeout(() => {
          entry.target.classList.add('visible');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });
}

/**
 * Stagger Animation for lists/grids
 */
function initStaggerAnimation() {
  const staggerContainers = document.querySelectorAll('[data-stagger]');
  
  staggerContainers.forEach(container => {
    const children = container.children;
    const baseDelay = parseInt(container.dataset.stagger) || 100;
    
    Array.from(children).forEach((child, index) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(20px)';
      child.dataset.delay = index * baseDelay;
    });
  });
}

/**
 * Parallax Effect
 * Subtle background movement on scroll
 */
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        
        parallaxElements.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.5;
          const yPos = -(scrollY * speed);
          el.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
      });
      
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Counter Animation
 * Animate numbers counting up
 */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-counter]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.counter);
        const duration = parseInt(counter.dataset.duration) || 2000;
        const suffix = counter.dataset.suffix || '';
        const prefix = counter.dataset.prefix || '';
        
        animateCounter(counter, target, duration, prefix, suffix);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target, duration, prefix = '', suffix = '') {
  const startTime = performance.now();
  const startValue = 0;
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out-quart)
    const easeOut = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(startValue + (target - startValue) * easeOut);
    
    element.textContent = prefix + current.toLocaleString() + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = prefix + target.toLocaleString() + suffix;
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * Text Reveal Animation
 * Character-by-character or word-by-word reveal
 */
function initTextReveal() {
  const textElements = document.querySelectorAll('[data-text-reveal]');
  
  textElements.forEach(el => {
    const text = el.textContent;
    const type = el.dataset.textReveal || 'word'; // 'word' or 'char'
    
    el.textContent = '';
    el.style.opacity = '1';
    
    const parts = type === 'char' ? text.split('') : text.split(' ');
    
    parts.forEach((part, index) => {
      const span = document.createElement('span');
      span.textContent = type === 'word' ? part + ' ' : part;
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      span.style.transform = 'translateY(20px)';
      span.style.transition = `opacity 0.4s ease ${index * 0.03}s, transform 0.4s ease ${index * 0.03}s`;
      el.appendChild(span);
    });
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const spans = el.querySelectorAll('span');
          spans.forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
          });
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(el);
  });
}

/**
 * Magnetic Buttons
 * Buttons that subtly follow cursor
 */
function initMagneticButtons() {
  const magneticElements = document.querySelectorAll('[data-magnetic]');
  
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  magneticElements.forEach(el => {
    const strength = parseFloat(el.dataset.magnetic) || 0.3;
    
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.3s ease';
    });
    
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.1s ease';
    });
  });
}

/**
 * Hover Effects
 * Enhanced hover states for cards and interactive elements
 */
function initHoverEffects() {
  // Card tilt effect
  const tiltCards = document.querySelectorAll('[data-tilt]');
  
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease';
    });
    
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
  
  // Image zoom on hover
  const zoomImages = document.querySelectorAll('[data-zoom]');
  
  zoomImages.forEach(container => {
    const img = container.querySelector('img');
    if (!img) return;
    
    container.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.1)';
    });
    
    container.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });
  });
}

/**
 * Page Transitions
 * Smooth page load and transition effects
 */
function initPageTransitions() {
  // Fade in page on load
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
  
  // Smooth transition for internal links
  const internalLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="http"]):not([href^="mailto"]):not([href^="tel"])');
  
  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Don't intercept if modifier keys are pressed
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      
      e.preventDefault();
      
      // Fade out
      document.body.style.opacity = '0';
      
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
}

/**
 * Scroll Progress Indicator
 */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) return;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    
    progressBar.style.width = progress + '%';
  }, { passive: true });
}

/**
 * Hero Animation Sequence
 */
function initHeroAnimation() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const elements = hero.querySelectorAll('[data-hero-animate]');
  
  elements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200 + (index * 150));
  });
}

/**
 * Marquee/Scroll Text Animation
 */
function initMarquee() {
  const marquees = document.querySelectorAll('[data-marquee]');
  
  marquees.forEach(marquee => {
    const content = marquee.innerHTML;
    marquee.innerHTML = content + content; // Duplicate for seamless loop
    
    const speed = parseInt(marquee.dataset.marquee) || 50;
    marquee.style.animation = `marquee ${speed}s linear infinite`;
  });
}

// Add marquee keyframes
const marqueeStyle = document.createElement('style');
marqueeStyle.textContent = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;
document.head.appendChild(marqueeStyle);

/**
 * Glitch Effect (for creative elements)
 */
function initGlitchEffect() {
  const glitchElements = document.querySelectorAll('[data-glitch]');
  
  glitchElements.forEach(el => {
    const originalText = el.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    el.addEventListener('mouseenter', () => {
      let iterations = 0;
      const interval = setInterval(() => {
        el.textContent = originalText
          .split('')
          .map((char, index) => {
            if (index < iterations) return originalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        
        iterations += 1/3;
        
        if (iterations >= originalText.length) {
          clearInterval(interval);
          el.textContent = originalText;
        }
      }, 30);
    });
  });
}

/**
 * Wave Animation for backgrounds
 */
function initWaveAnimation() {
  const waves = document.querySelectorAll('.wave');
  
  waves.forEach((wave, index) => {
    wave.style.animationDelay = `${index * 0.5}s`;
  });
}

/**
 * Cursor Follower (custom cursor)
 */
function initCustomCursor() {
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  
  if (!cursor || !cursorDot) return;
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animateCursor() {
    // Smooth follow for outer cursor
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`;
    
    // Faster follow for dot
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    cursorDot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Scale cursor on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });
}

// Initialize hero animation if on homepage
if (document.querySelector('.hero')) {
  window.addEventListener('load', initHeroAnimation);
}
