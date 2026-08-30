/**
 * SUMANTH PHOTOGRAPHY — ADMIN CORE ENGINE
 * Shared Auth Guard, Navigation, Formatting & Quick Actions
 */

(function () {
  'use strict';

  // 1. AUTH GUARD
  function checkAdminAuth() {
    const isLoginPage = window.location.pathname.includes('login.html');
    const session = window.SumanthDB ? window.SumanthDB.getActiveAdminSession() : null;

    if (!session || !session.user || session.user.role !== 'admin') {
      if (!isLoginPage) {
        window.location.replace('login.html');
      }
      return null;
    } else {
      if (isLoginPage) {
        window.location.replace('index.html');
      }
      return session;
    }
  }

  // Execute auth check immediately if not on login page
  const currentSession = checkAdminAuth();

  // 2. CURRENCY & DATE FORMATTING
  function formatCurrency(amount) {
    const num = Number(amount) || 0;
    return '₹' + num.toLocaleString('en-IN');
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).toUpperCase();
    } catch (e) {
      return dateStr;
    }
  }

  function formatDateTime(dateStr) {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).toUpperCase() + ' · ' + d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateStr;
    }
  }

  // 3. STATUS BADGE GENERATOR
  function renderStatusPill(status) {
    const clean = (status || 'NEW').toUpperCase();
    return `<span class="status-pill status-${clean}">${clean}</span>`;
  }

  // 4. LOGOUT HANDLER
  async function handleLogout() {
    if (window.SumanthDB && typeof window.SumanthDB.signOutAdmin === 'function') {
      await window.SumanthDB.signOutAdmin();
    }
    sessionStorage.removeItem('sumanth_admin_auth_session');
    window.location.replace('login.html');
  }

  // 5. QUICK ACTIONS BUILDER
  function buildQuickActions(phone, email, customMessage = '') {
    const cleanPhone = String(phone || '').replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('91') ? cleanPhone : ('91' + cleanPhone);
    const waText = encodeURIComponent(customMessage || 'Hello, this is Sumanth Photography regarding your inquiry.');

    return `
      <div class="quick-actions-bar">
        ${phone ? `
          <a href="tel:${phone}" class="btn-quick-action">
            <span>CALL</span>
          </a>
          <a href="https://wa.me/${intlPhone}?text=${waText}" target="_blank" rel="noopener" class="btn-quick-action primary">
            <span>WHATSAPP &rarr;</span>
          </a>
        ` : ''}
        ${email ? `
          <a href="mailto:${email}" class="btn-quick-action">
            <span>EMAIL &rarr;</span>
          </a>
        ` : ''}
      </div>
    `;
  }

  // 6. INITIALIZE NAVIGATION AND INTERACTIVITY
  document.addEventListener('DOMContentLoaded', () => {
    // Wire up logout buttons
    document.querySelectorAll('.btn-logout').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
      });
    });

    // Mobile navigation toggle
    const toggleBtn = document.querySelector('.admin-menu-toggle');
    const drawer = document.querySelector('.mobile-admin-drawer');
    const closeBtn = document.querySelector('.mobile-drawer-close');

    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', () => drawer.classList.add('active'));
    }
    if (closeBtn && drawer) {
      closeBtn.addEventListener('click', () => drawer.classList.remove('active'));
    }

    // Mark active nav link
    const currentPath = window.location.pathname;
    document.querySelectorAll('.admin-nav a, .mobile-drawer-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && currentPath.endsWith(href)) {
        link.classList.add('active');
      }
    });
  });

  // Export to Admin Engine
  window.AdminCore = {
    session: currentSession,
    formatCurrency,
    formatDate,
    formatDateTime,
    renderStatusPill,
    buildQuickActions,
    handleLogout
  };

})();
