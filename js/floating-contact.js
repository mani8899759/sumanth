/**
 * SUMANTH PHOTOGRAPHY — GLOBAL FLOATING CONTACT BAR COMPONENT
 * Shared component script across the entire website.
 * Features: Icon-Only Collapsed Rail (WhatsApp & Instagram), Visible CONTACT US Tab,
 * Persistent Form Focus Lock, Top Scroll Arrow, & Supabase Integration.
 */

(function () {
  'use strict';

  // Shared Verified Contact Configuration
  const CONFIG = {
    phone: "+919491818015",
    phoneDisplay: "+91 94918 18015",
    whatsappUrl: "https://wa.me/919491818015",
    instagramUrl: "https://www.instagram.com/sumanth__photography07/",
    instagramHandle: "@sumanth__photography07",
    contactPage: "contact.html"
  };

  // SVG Icons
  const ICONS = {
    top: `<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>`,
    contact: `<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0012.04 2zm5.83 14.16c-.25.69-1.47 1.32-2.04 1.36-.53.04-1.21.19-3.92-.91-3.26-1.33-5.32-4.63-5.48-4.85-.16-.22-1.32-1.76-1.32-3.36 0-1.6.83-2.38 1.13-2.7.3-.32.65-.4.87-.4.22 0 .43.01.62.01.2 0 .48-.08.75.57.28.66.95 2.33 1.03 2.5.08.17.14.37.03.59-.11.22-.17.36-.33.55-.16.19-.34.42-.49.57-.16.15-.33.32-.14.65.19.33.85 1.4 1.82 2.27 1.25 1.11 2.3 1.46 2.63 1.63.33.17.53.14.73-.08.2-.22.84-.98 1.06-1.31.22-.33.45-.28.75-.17.3.11 1.91.9 2.24 1.06.33.16.55.24.63.38.08.14.08.8-.17 1.49z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
  };

  let activePanelId = null;
  let closeTimer = null;
  let isFormFocused = false; // Persistent lock while user interacts with Contact Form
  const HOVER_GRACE_PERIOD = 250; // ms

  function initFloatingContactBar() {
    if (document.getElementById('floating-contact-wrapper')) return;

    // Inject HTML Component
    const container = document.createElement('div');
    container.id = 'floating-contact-wrapper';
    container.className = 'floating-contact-wrapper';

    container.innerHTML = `
      <!-- Vertical Contact Rail Stack -->
      <div class="floating-contact-rail" role="toolbar" aria-label="Floating Contact Toolbar">
        
        <!-- Top Utility Scroll Arrow -->
        <button type="button" class="floating-contact-tab floating-contact-tab--top" id="fc-scroll-top" aria-label="Scroll to top">
          ${ICONS.top}
        </button>

        <!-- CONTACT US ITEM (Text + Mail Icon) -->
        <div class="floating-contact-item" data-id="panel-contact">
          <button type="button" class="floating-contact-tab floating-contact-tab--contact" aria-expanded="false" aria-label="Open Contact Form">
            ${ICONS.contact} <span>CONTACT US</span>
          </button>
          
          <!-- Anchored Contact Form Panel (Unchanged Approved Design) -->
          <div id="panel-contact" class="floating-contact-panel" role="region" aria-label="Contact Form Panel">
            <div class="floating-panel__header">
              <h3 class="floating-panel__title">Contact Us</h3>
              <button class="floating-panel__close" aria-label="Close panel" data-close>&times;</button>
            </div>
            <form id="floating-contact-form" class="floating-panel__form">
              <div class="floating-panel__field">
                <label for="fc-name">Full Name *</label>
                <input type="text" id="fc-name" name="name" required placeholder="Your full name">
              </div>
              <div class="floating-panel__field">
                <label for="fc-email">Email Address *</label>
                <input type="email" id="fc-email" name="email" required placeholder="email@example.com">
              </div>
              <div class="floating-panel__field">
                <label for="fc-phone">Phone / WhatsApp *</label>
                <input type="tel" id="fc-phone" name="phone" required placeholder="+91 98765 43210">
              </div>
              <div class="floating-panel__field">
                <label for="fc-session">Session Type</label>
                <select id="fc-session" name="session_type">
                  <option value="Wedding Photography">Wedding Photography</option>
                  <option value="Baby Bump & Maternity">Baby Bump & Maternity</option>
                  <option value="Newborn / Baby Session">Newborn / Baby Session</option>
                  <option value="Birthday & Events">Birthday & Events</option>
                  <option value="Editorial & Portrait">Editorial & Portrait</option>
                  <option value="Other Enquiries">Other Enquiries</option>
                </select>
              </div>
              <div class="floating-panel__field">
                <label for="fc-date">Event / Session Date</label>
                <input type="date" id="fc-date" name="event_date">
              </div>
              <div class="floating-panel__field">
                <label for="fc-message">Message *</label>
                <textarea id="fc-message" name="message" required placeholder="Tell us about your event & requirements..."></textarea>
              </div>
              <button type="submit" id="fc-submit" class="floating-panel__submit">SEND ENQUIRY &rarr;</button>
              <div id="fc-status" class="floating-panel__status"></div>
            </form>
          </div>
        </div>

        <!-- WHATSAPP ITEM (Icon-Only Trigger) -->
        <div class="floating-contact-item" data-id="panel-whatsapp">
          <button type="button" class="floating-contact-tab" aria-expanded="false" aria-label="WhatsApp">
            ${ICONS.whatsapp}
          </button>
          
          <!-- Anchored WhatsApp Panel -->
          <div id="panel-whatsapp" class="floating-contact-panel" role="region" aria-label="WhatsApp Chat Panel">
            <div class="floating-panel__header">
              <h3 class="floating-panel__title">WhatsApp Chat</h3>
              <button class="floating-panel__close" aria-label="Close panel" data-close>&times;</button>
            </div>
            <div class="floating-panel__content">
              <div class="floating-panel__value">${CONFIG.phoneDisplay}</div>
              <p style="font-size:11.5px; color:#666666; margin:0; line-height:1.4;">Connect directly for quick quotes & booking availability.</p>
              <a href="${CONFIG.whatsappUrl}" target="_blank" rel="noopener noreferrer" class="floating-panel__btn">
                ${ICONS.whatsapp} CHAT ON WHATSAPP &rarr;
              </a>
            </div>
          </div>
        </div>

        <!-- INSTAGRAM ITEM (Icon-Only Trigger) -->
        <div class="floating-contact-item" data-id="panel-instagram">
          <button type="button" class="floating-contact-tab" aria-expanded="false" aria-label="Instagram">
            ${ICONS.instagram}
          </button>
          
          <!-- Anchored Instagram Panel -->
          <div id="panel-instagram" class="floating-contact-panel" role="region" aria-label="Instagram Profile Panel">
            <div class="floating-panel__header">
              <h3 class="floating-panel__title">Instagram Archive</h3>
              <button class="floating-panel__close" aria-label="Close panel" data-close>&times;</button>
            </div>
            <div class="floating-panel__content">
              <div class="floating-panel__value">${CONFIG.instagramHandle}</div>
              <p style="font-size:11.5px; color:#666666; margin:0; line-height:1.4;">Explore recent wedding stories, reels & editorial archives.</p>
              <a href="${CONFIG.instagramUrl}" target="_blank" rel="noopener noreferrer" class="floating-panel__btn">
                ${ICONS.instagram} VIEW INSTAGRAM &rarr;
              </a>
            </div>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(container);
    setupEventListeners(container);
  }

  function setupEventListeners(container) {
    const items = container.querySelectorAll('.floating-contact-item');
    const panels = container.querySelectorAll('.floating-contact-panel');
    const closeBtns = container.querySelectorAll('[data-close]');
    const scrollTopBtn = document.getElementById('fc-scroll-top');
    const form = document.getElementById('floating-contact-form');

    // Scroll to Top Handler
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Input Focus Lock: Lock form open whenever user interacts with form fields
    if (form) {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          isFormFocused = true;
          clearTimeout(closeTimer);
        });
        input.addEventListener('input', () => {
          isFormFocused = true;
          clearTimeout(closeTimer);
        });
      });
    }

    // Panel switching helper
    function openPanel(targetId) {
      clearTimeout(closeTimer);

      items.forEach(item => {
        const itemId = item.dataset.id;
        const panel = item.querySelector('.floating-contact-panel');
        const tab = item.querySelector('.floating-contact-tab');

        if (itemId === targetId) {
          if (panel) panel.classList.add('is-open');
          if (tab) {
            tab.classList.add('is-active');
            tab.setAttribute('aria-expanded', 'true');
          }
        } else {
          if (panel) panel.classList.remove('is-open');
          if (tab) {
            tab.classList.remove('is-active');
            tab.setAttribute('aria-expanded', 'false');
          }
        }
      });

      activePanelId = targetId;

      // Focus first field if opening contact form
      if (targetId === 'panel-contact') {
        const nameField = document.getElementById('fc-name');
        if (nameField) setTimeout(() => nameField.focus(), 100);
      }
    }

    function closeAllPanels() {
      clearTimeout(closeTimer);
      panels.forEach(p => p.classList.remove('is-open'));
      items.forEach(item => {
        const tab = item.querySelector('.floating-contact-tab');
        if (tab) {
          tab.classList.remove('is-active');
          tab.setAttribute('aria-expanded', 'false');
        }
      });
      activePanelId = null;
      isFormFocused = false;
    }

    // Hover & Tap behavior per contextual item (Unified Interaction Region)
    items.forEach(item => {
      const targetId = item.dataset.id;
      const tab = item.querySelector('.floating-contact-tab');

      // Desktop Hover on Item Wrapper (Trigger + Panel Region)
      item.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
          openPanel(targetId);
        }
      });

      item.addEventListener('mouseleave', () => {
        // Do NOT close if user is actively filling out the contact form
        if (window.innerWidth > 768 && (!isFormFocused || targetId !== 'panel-contact')) {
          closeTimer = setTimeout(closeAllPanels, HOVER_GRACE_PERIOD);
        }
      });

      // Tap / Click Toggle
      if (tab) {
        tab.addEventListener('click', (e) => {
          e.stopPropagation();
          if (activePanelId === targetId) {
            closeAllPanels();
          } else {
            openPanel(targetId);
          }
        });
      }
    });

    // Close buttons (Intentional Close)
    closeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllPanels();
      });
    });

    // Outside click & ESC key dismissal
    document.addEventListener('click', (e) => {
      if (activePanelId && !container.contains(e.target)) {
        closeAllPanels();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activePanelId) {
        closeAllPanels();
      }
    });

    // Supabase Form Submission Handler
    if (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const submitBtn = document.getElementById('fc-submit');
        const statusEl = document.getElementById('fc-status');

        const payload = {
          full_name: document.getElementById('fc-name').value.trim(),
          email: document.getElementById('fc-email').value.trim(),
          phone: document.getElementById('fc-phone').value.trim(),
          session_type: document.getElementById('fc-session').value,
          event_date: document.getElementById('fc-date').value || null,
          message: document.getElementById('fc-message').value.trim()
        };

        if (!payload.full_name || !payload.email || !payload.phone || !payload.message) {
          statusEl.textContent = 'Please complete all required fields.';
          statusEl.className = 'floating-panel__status is-error';
          return;
        }

        try {
          submitBtn.disabled = true;
          submitBtn.textContent = 'SENDING...';
          statusEl.className = 'floating-panel__status';
          statusEl.style.display = 'none';

          if (window.SumanthAPI && typeof window.SumanthAPI.submitContactForm === 'function') {
            await window.SumanthAPI.submitContactForm(payload);
          } else {
            // Direct fallback
            console.warn('[FloatingContact] SumanthAPI not found, using direct store.');
            const existing = JSON.parse(localStorage.getItem('sumanth_live_contacts') || '[]');
            existing.unshift({ ...payload, id: 'fc_' + Date.now(), status: 'NEW', created_at: new Date().toISOString() });
            localStorage.setItem('sumanth_live_contacts', JSON.stringify(existing));
          }

          statusEl.textContent = "ENQUIRY RECEIVED. We'll be in touch soon.";
          statusEl.className = 'floating-panel__status is-success';
          form.reset();

          setTimeout(() => {
            closeAllPanels();
            submitBtn.disabled = false;
            submitBtn.textContent = 'SEND ENQUIRY →';
            statusEl.style.display = 'none';
          }, 3000);

        } catch (err) {
          console.error('[FloatingContact Error]', err);
          statusEl.textContent = 'Unable to send enquiry. Please try again.';
          statusEl.className = 'floating-panel__status is-error';
          submitBtn.disabled = false;
          submitBtn.textContent = 'SEND ENQUIRY →';
        }
      });
    }

    // Monitor Mobile Menu & Lightbox state to hide widget cleanly
    const observer = new MutationObserver(() => {
      const isMobileMenuOpen = document.getElementById('mobile-nav')?.classList.contains('is-open') || document.body.classList.contains('menu-open');
      const isLightboxOpen = document.body.classList.contains('lightbox-open') || document.querySelector('.lg-outer');
      if (isMobileMenuOpen || isLightboxOpen) {
        container.classList.add('is-hidden');
      } else {
        container.classList.remove('is-hidden');
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  // Auto-initialize on DOMReady
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingContactBar);
  } else {
    initFloatingContactBar();
  }

})();
