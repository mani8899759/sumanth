/**
 * SUMANTH PHOTOGRAPHY — EDITORIAL & CINEMATIC MOTION SYSTEM
 * Global Left-to-Right Entrance Reveal System
 */

(function () {
  'use strict';

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Signal JS readiness immediately for non-flash CSS activation
  if (document.documentElement) {
    document.documentElement.classList.add('js-ready');
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js-ready');
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
     02 — HERO TEXT LEFT-TO-RIGHT ENTRANCE STAGGER
     -------------------------------------------------------------------------- */
  function initHeroSequence() {
    const heroSection = document.querySelector('section.hero, header.hero, .hero-section, .hero, .about-hero-section, .contact-hero-section, .byq-hero, .portfolio-hero');
    
    // Always activate any italic elements above the fold
    document.querySelectorAll('.about-hero-section .italic, .contact-hero-section .italic, .hero .italic, .hero-section .italic').forEach(el => {
      el.classList.add('is-visible', 'on');
    });

    if (!heroSection) return;

    if (prefersReducedMotion) {
      heroSection.querySelectorAll('h1, h2, p, .mono-label, .btn-primary, .btn-secondary, .btn-byq, .arrow-link, .italic, span.italic').forEach(el => {
        el.classList.add('is-visible', 'on');
      });
      return;
    }

    const headings = heroSection.querySelectorAll('h1, h2, .editorial-title');
    const subtexts = heroSection.querySelectorAll('p, .mono-label, .hero-sub, .lead-text');
    const ctas = heroSection.querySelectorAll('.btn-primary, .btn-secondary, .btn-byq, .btn-byq-dark, .btn-cta, .arrow-link, .hero-cta-primary, .hero-cta-secondary');

    headings.forEach(el => {
      el.classList.add('reveal-left-heading');
    });

    subtexts.forEach(el => {
      el.classList.add('reveal-left-sub');
    });

    ctas.forEach(el => {
      el.classList.add('reveal-left-cta');
    });

    // Trigger hero entrance after page paint
    setTimeout(() => {
      heroSection.querySelectorAll('.reveal-left-heading, .reveal-left-sub, .reveal-left-cta, .italic, span.italic').forEach(el => {
        el.classList.add('is-visible', 'on', 'visible');
      });
    }, 60);
  }

  /* --------------------------------------------------------------------------
     03 — GLOBAL VIEWPORT SCROLL OBSERVER (ANIMATE ONCE)
     -------------------------------------------------------------------------- */
  function initScrollObserver() {
    const allRevealElements = document.querySelectorAll(
      '.reveal-left, .reveal-left-heading, .reveal-left-sub, .reveal-left-cta, .reveal-left-group, .reveal, .editorial-title, .reveal-stagger, [data-reveal="left"], [data-reveal]'
    );

    // Auto-discover section headings and content blocks if not explicitly tagged
    const sectionBlocks = document.querySelectorAll('main section, body > section, article section');
    sectionBlocks.forEach(sec => {
      if (sec.closest('.hero-section, .hero, header.hero, .about-hero-section, .contact-hero-section')) return;

      const secHeadings = sec.querySelectorAll('h1, h2, h3, .section-title, .content-heading, .editorial-title');
      secHeadings.forEach(h => {
        if (!h.classList.contains('reveal-left') && !h.classList.contains('reveal-left-heading') && !h.classList.contains('reveal')) {
          h.classList.add('reveal-left-heading');
        }
      });

      const secSubs = sec.querySelectorAll('p.lead-text, p.section-sub, .mono-label');
      secSubs.forEach(s => {
        if (!s.classList.contains('reveal-left') && !s.classList.contains('reveal-left-sub') && !s.classList.contains('reveal')) {
          s.classList.add('reveal-left-sub');
        }
      });

      const secCtas = sec.querySelectorAll('.btn-primary, .btn-secondary, .btn-byq, .btn-byq-dark, .btn-cta, .arrow-link');
      secCtas.forEach(c => {
        if (!c.classList.contains('reveal-left') && !c.classList.contains('reveal-left-cta') && !c.classList.contains('reveal')) {
          c.classList.add('reveal-left-cta');
        }
      });
    });

    if (prefersReducedMotion) {
      document.querySelectorAll(
        '.reveal-left, .reveal-left-heading, .reveal-left-sub, .reveal-left-cta, .reveal-left-group, .reveal, .editorial-title, .reveal-stagger, .italic, span.italic, [data-reveal="left"], [data-reveal]'
      ).forEach(el => {
        el.classList.add('is-visible', 'on', 'visible');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;

          // Reveal target element
          target.classList.add('is-visible', 'on', 'visible');

          // If container has group or stagger class, activate child elements
          if (target.classList.contains('reveal-left-group') || target.classList.contains('reveal-stagger') || target.classList.contains('contact-sheet-grid') || target.classList.contains('featured-grid')) {
            const children = Array.from(target.children);
            children.forEach(child => child.classList.add('is-visible', 'on', 'visible'));
          }

          // Also activate child italic words
          target.querySelectorAll('.italic, span.italic').forEach(it => it.classList.add('is-visible', 'on', 'visible'));

          // ANIMATE ONCE — unobserve immediately
          obs.unobserve(target);
        }
      });
    }, observerOptions);

    // Re-query all elements after auto-discovery tagging
    const elementsToObserve = document.querySelectorAll(
      '.reveal-left, .reveal-left-heading, .reveal-left-sub, .reveal-left-cta, .reveal-left-group, .reveal, .editorial-title, .reveal-stagger, .contact-sheet-grid, .featured-grid, [data-reveal="left"], [data-reveal]'
    );

    elementsToObserve.forEach(el => revealObserver.observe(el));
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
              nav.classList.add('nav-scrolled-down');
              nav.classList.remove('nav-scrolled-up');
            } else if (currentScrollY < lastScrollY - 10) {
              nav.classList.add('nav-scrolled-up');
              nav.classList.remove('nav-scrolled-down');
            }
          } else {
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

  /* --------------------------------------------------------------------------
     05 — MOBILE MENU & STAGGERED REVEAL (LEFT → RIGHT)
     -------------------------------------------------------------------------- */
  const mobileNavigation = [
    { label: 'WEDDING<br />PHOTOGRAPHY', href: 'weddings.html' },
    { label: 'BABY BUMP<br />SHOOTS', href: 'baby-maternity.html' },
    { label: 'OTHERS', href: 'birthdays-events.html' },
    { label: 'ABOUT', href: 'about.html' },
    { label: 'CONTACT', href: 'contact.html' },
    { label: 'BUILD YOUR QUOTE &rarr;', href: 'quote.html', isPrimary: true }
  ];

  function initMobileMenu() {
    let mobileNav = document.getElementById('mobile-nav');
    const menuBtns = document.querySelectorAll('#menu-btn, .menu-btn, #mobile-menu-btn');

    if (!mobileNav) {
      mobileNav = document.createElement('div');
      mobileNav.id = 'mobile-nav';
      mobileNav.setAttribute('role', 'dialog');
      mobileNav.setAttribute('aria-modal', 'true');
      mobileNav.setAttribute('aria-label', 'Mobile Navigation Menu');
      document.body.appendChild(mobileNav);
    }

    mobileNav.innerHTML = `
      <div class="mobile-nav-top">
        <a href="index.html" class="mobile-nav-logo">SUMANTH PHOTOGRAPHY</a>
        <button id="mob-close" class="mobile-close-btn" aria-label="Close menu">
          <span>&times;&nbsp; CLOSE</span>
        </button>
      </div>
      <div class="mobile-nav-body">
        <nav class="mobile-menu-list">
          ${mobileNavigation.map(item => `
            <a href="${item.href}" class="mobile-menu-item${item.isPrimary ? ' mobile-menu-item--byq' : ''}"${item.isPrimary ? ' id="mobile-byq-cta"' : ''}>
              ${item.label}
            </a>
          `).join('\n          ')}
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

      // Subtle Left-to-Right stagger sequence: 0ms, 60ms, 120ms, 180ms, 240ms, 300ms
      navItems.forEach((link, idx) => {
        link.style.transitionDelay = `${idx * 60}ms`;
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

    navItems.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMenu();
      }
    });

    window.addEventListener('pageshow', () => {
      closeMenu();
    });

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
    const ctas = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-byq, .btn-cta, .arrow-link, a.mono-label');

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
