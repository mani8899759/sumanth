/**
 * SUMANTH PHOTOGRAPHY — EDITORIAL & CINEMATIC MOTION SYSTEM
 * Quiet, intentional, precise JavaScript interaction engine.
 */

(function () {
  'use strict';

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initHeroSequence();
    initScrollObserver();
    initHeaderScroll();
    initMobileMenu();
    initCTAArrows();
    initLightboxAnimations();
  });

  /* --------------------------------------------------------------------------
     01 — PAGE TRANSITIONS (EDITORIAL PAGE TURN)
     -------------------------------------------------------------------------- */
  function initPageTransitions() {
    if (prefersReducedMotion) return;

    // Entrance
    document.body.classList.add('page-entering');
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.body.classList.remove('page-entering');
      }, 50);
    });

    // Exit transition on internal navigation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      const target = link.getAttribute('target');

      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('javascript:') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target === '_blank' ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey
      ) {
        return;
      }

      // Ensure link is internal HTML page
      if (href.endsWith('.html') || (!href.includes('://') && !href.startsWith('//'))) {
        e.preventDefault();
        document.body.classList.add('page-exiting');
        setTimeout(() => {
          window.location.href = href;
        }, 380);
      }
    });

    // Handle back button caching
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        document.body.classList.remove('page-exiting');
        document.body.classList.remove('page-entering');
      }
    });
  }

  /* --------------------------------------------------------------------------
     02 — HERO TEXT & ELEMENT STAGING
     -------------------------------------------------------------------------- */
  function initHeroSequence() {
    const heroSection = document.querySelector('section.hero, header.hero, .hero-section, .hero');
    if (!heroSection) return;

    const heroElements = heroSection.querySelectorAll('h1, h2, p, .mono-label, .btn-primary, .btn-secondary, .italic');
    heroElements.forEach((el, idx) => {
      el.style.transitionDelay = `${150 + idx * 120}ms`;
      el.classList.add('reveal');
    });

    // Trigger hero entrance quickly after load
    setTimeout(() => {
      heroElements.forEach(el => el.classList.add('on'));
    }, 100);
  }

  /* --------------------------------------------------------------------------
     03 — SCROLL REVEALS & CONTACT SHEET STAGGER
     -------------------------------------------------------------------------- */
  function initScrollObserver() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal, .reveal-stagger, .reveal-clip, .editorial-title').forEach(el => {
        el.classList.add('on');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;

          // If container has reveal-stagger class, stagger immediate children
          if (target.classList.contains('reveal-stagger') || target.classList.contains('contact-sheet-grid') || target.classList.contains('featured-grid')) {
            const children = Array.from(target.children);
            children.forEach((child, idx) => {
              child.style.transitionDelay = `${idx * 60}ms`;
            });
          }

          target.classList.add('on');
          obs.unobserve(target);
        }
      });
    }, observerOptions);

    // Observe reveal elements
    const elementsToObserve = document.querySelectorAll(
      '.reveal, .reveal-stagger, .reveal-clip, .contact-sheet-grid, .featured-grid, .portfolio-grid, .editorial-title'
    );

    elementsToObserve.forEach(el => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     04 — HEADER SCROLL PROMINENCE BEHAVIOR
     -------------------------------------------------------------------------- */
  function initHeaderScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > 100) {
            if (currentScrollY > lastScrollY + 10) {
              // Scrolling down: reduce prominence
              nav.classList.add('nav-scrolled-down');
              nav.classList.remove('nav-scrolled-up');
            } else if (currentScrollY < lastScrollY - 10) {
              // Scrolling up: restore full visibility
              nav.classList.add('nav-scrolled-up');
              nav.classList.remove('nav-scrolled-down');
            }
          } else {
            // Near top
            nav.classList.remove('nav-scrolled-down');
            nav.classList.remove('nav-scrolled-up');
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* -----------------------------------------------------------------  /* --------------------------------------------------------------------------
     05 — MOBILE MENU & STAGGERED REVEAL (ONE GLOBAL COMPONENT)
     -------------------------------------------------------------------------- */
  const mobileNavigation = [
    { label: 'WEDDING<br />PHOTOGRAPHY', href: 'weddings.html' },
    { label: 'BABY BUMP<br />SHOOTS', href: 'baby-maternity.html' },
    { label: 'OTHERS', href: 'birthdays-events.html' },
    { label: 'ABOUT', href: 'about.html' },
    { label: 'CONTACT', href: 'contact.html' }
  ];

  function initMobileMenu() {
    let mobileNav = document.getElementById('mobile-nav');
    const menuBtns = document.querySelectorAll('#menu-btn, .menu-btn, #mobile-menu-btn');

    // Ensure universal mobile nav HTML is present
    if (!mobileNav) {
      mobileNav = document.createElement('div');
      mobileNav.id = 'mobile-nav';
      mobileNav.setAttribute('role', 'dialog');
      mobileNav.setAttribute('aria-modal', 'true');
      mobileNav.setAttribute('aria-label', 'Mobile Navigation Menu');
      document.body.appendChild(mobileNav);
    }

    // Standardize mobile nav internal content matching visual reference
    mobileNav.innerHTML = `
      <div class="mobile-nav-top">
        <a href="index.html" class="mobile-nav-logo">SUMANTH PHOTOGRAPHY</a>
        <button id="mob-close" class="mobile-close-btn" aria-label="Close menu">
          <span>&times;&nbsp; CLOSE</span>
        </button>
      </div>
      <div class="mobile-nav-body">
        <nav class="mobile-menu-list">
          ${mobileNavigation.map(item => `<a href="${item.href}" class="mobile-menu-item">${item.label}</a>`).join('\n          ')}
        </nav>
      </div>
    `;

    const mobClose = document.getElementById('mob-close');
    const navItems = mobileNav.querySelectorAll('.mobile-menu-item');

    const openMenu = () => {
      mobileNav.style.display = 'flex';
      requestAnimationFrame(() => {
        mobileNav.classList.add('open');
        document.body.classList.add('menu-open');
        menuBtns.forEach(btn => {
          btn.classList.add('menu-open');
          btn.setAttribute('aria-expanded', 'true');
          btn.setAttribute('aria-label', 'Close navigation menu');
        });
      });

      navItems.forEach((link, idx) => {
        link.style.transitionDelay = `${50 + idx * 45}ms`;
      });
    };

    const closeMenu = () => {
      mobileNav.classList.remove('open');
      document.body.classList.remove('menu-open');
      menuBtns.forEach(btn => {
        btn.classList.remove('menu-open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open navigation menu');
      });

      setTimeout(() => {
        if (!mobileNav.classList.contains('open')) {
          mobileNav.style.display = 'none';
        }
      }, 350);

      navItems.forEach(link => {
        link.style.transitionDelay = '0ms';
      });
    };

    menuBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (mobileNav.classList.contains('open')) {
          closeMenu();
        } else {
          openMenu();
        }
      };
    });

    if (mobClose) {
      mobClose.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
      };
    }

    // Close menu when tapping any link inside
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // ESC Key listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMenu();
      }
    });

    // Reset state on pageshow (back button navigation)
    window.addEventListener('pageshow', () => {
      closeMenu();
    });

    // Reset state on desktop resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && mobileNav.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* --------------------------------------------------------------------------
     06 — CTA BUTTON ARROW AUTO-WRAPPER
     -------------------------------------------------------------------------- */
  function initCTAArrows() {
    const ctas = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-cta, .arrow-link, a.mono-label');

    ctas.forEach(cta => {
      const html = cta.innerHTML;
      if ((html.includes('&rarr;') || html.includes('→')) && !html.includes('class="arrow"')) {
        cta.innerHTML = html
          .replace(/&rarr;/g, '<span class="arrow">&rarr;</span>')
          .replace(/→/g, '<span class="arrow">&rarr;</span>');
      }
    });
  }

  /* --------------------------------------------------------------------------
     07 — ENHANCED LIGHTBOX ANIMATIONS
     -------------------------------------------------------------------------- */
  function initLightboxAnimations() {
    const modal = document.getElementById('lightbox-modal');
    const lbImg = document.getElementById('lb-img');
    const lbPrev = document.getElementById('lb-prev') || document.getElementById('lb-prev-btn');
    const lbNext = document.getElementById('lb-next') || document.getElementById('lb-next-btn');
    const lbClose = document.getElementById('lb-close') || document.getElementById('lb-close-btn');

    if (!modal || !lbImg) return;

    // Smooth transition on prev / next image change
    function transitionImage(direction) {
      const slideOutClass = direction === 'next' ? 'lb-slide-out-next' : 'lb-slide-out-prev';
      lbImg.classList.add(slideOutClass);

      setTimeout(() => {
        lbImg.classList.remove(slideOutClass);
        lbImg.classList.add('lb-slide-in');
        setTimeout(() => {
          lbImg.classList.remove('lb-slide-in');
        }, 350);
      }, 150);
    }

    if (lbPrev) {
      lbPrev.addEventListener('click', () => transitionImage('prev'));
    }

    if (lbNext) {
      lbNext.addEventListener('click', () => transitionImage('next'));
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'ArrowLeft' && lbPrev) {
        lbPrev.click();
      } else if (e.key === 'ArrowRight' && lbNext) {
        lbNext.click();
      } else if (e.key === 'Escape' && lbClose) {
        lbClose.click();
      }
    });
  }

})();
