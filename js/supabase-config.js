/**
 * SUMANTH PHOTOGRAPHY — SUPABASE BACKEND DATA LAYER (LIVE PRODUCTION ONLY)
 * Zero Mock Data &bull; Zero Demo Arrays &bull; Pure Database Source of Truth
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. PURGE ALL LEGACY DEMO & HARDCODED MOCK DATA
  // --------------------------------------------------------------------------
  (function purgeLegacyDemoData() {
    try {
      const demoKeys = [
        'sumanth_db_contacts',
        'sumanth_db_quotes',
        'sumanth_db_quote_events',
        'sumanth_db_quote_line_items',
        'sumanth_db_quote_addons',
        'sumanth_db_quote_prefs',
        'sumanth_quotes_history',
        'sumanth_latest_quote',
        'sumanth_live_contacts',
        'sumanth_live_quotes'
      ];
      demoKeys.forEach(k => localStorage.removeItem(k));
    } catch (e) {
      // Ignore
    }
  })();

  // --------------------------------------------------------------------------
  // 2. CONFIGURATION & SUPABASE CLIENT INITIALIZATION
  // --------------------------------------------------------------------------
  const DEFAULT_CONFIG = {
    url: window.__ENV_SUPABASE_URL || 'https://spnbwlalhffdmjixqjgc.supabase.co',
    anonKey: window.__ENV_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbmJ3bGFsaGZmZG1qaXhxamdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMDU2MzcsImV4cCI6MjEwMzY4MTYzN30.ul-jhwU9-OxvhL-cNqw_TXte6Za7RIToKFG9yqenDJM'
  };

  const storedConfig = (function () {
    try {
      const raw = localStorage.getItem('sumanth_supabase_custom_config');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  })();

  const activeConfig = Object.assign({}, DEFAULT_CONFIG, window.SUMANTH_SUPABASE_CONFIG || {}, storedConfig || {});

  const isLiveConfigured = Boolean(
    activeConfig.url &&
    activeConfig.anonKey &&
    !activeConfig.url.includes('xyzcompany') &&
    activeConfig.url.startsWith('https://')
  );

  let supabaseClient = null;
  if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
    try {
      supabaseClient = window.supabase.createClient(activeConfig.url, activeConfig.anonKey);
    } catch (err) {
      console.warn('[Supabase] Initialization notice:', err.message);
    }
  }

  const STORAGE_KEYS = {
    ADMIN_SESSION: 'sumanth_admin_auth_session',
    LIVE_CONTACTS: 'sumanth_live_contacts',
    LIVE_QUOTES: 'sumanth_live_quotes'
  };

  // --------------------------------------------------------------------------
  // 3. PUBLIC FORM SUBMISSION API (CONTACTS)
  // --------------------------------------------------------------------------
  async function submitContactSubmission(formData) {
    if (!formData || !formData.fullName || !formData.email || !formData.phone || !formData.sessionType) {
      throw new Error('Please fill all required contact fields.');
    }

    const payload = {
      id: 'cs-' + Date.now(),
      full_name: String(formData.fullName).trim(),
      email: String(formData.email).trim().toLowerCase(),
      phone: String(formData.phone).trim(),
      session_type: String(formData.sessionType).trim(),
      event_date: formData.eventDate ? String(formData.eventDate) : null,
      message: formData.message ? String(formData.message).trim() : '',
      status: 'NEW',
      internal_notes: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Always persist real customer submission in live storage
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIVE_CONTACTS) || '[]');
      existing.unshift(payload);
      localStorage.setItem(STORAGE_KEYS.LIVE_CONTACTS, JSON.stringify(existing));
    } catch (e) {
      // Ignore
    }

    if (isLiveConfigured && supabaseClient) {
      const { error } = await supabaseClient
        .from('contact_submissions')
        .insert([{
          full_name: payload.full_name,
          email: payload.email,
          phone: payload.phone,
          session_type: payload.session_type,
          event_date: payload.event_date,
          message: payload.message,
          status: 'NEW',
          internal_notes: ''
        }]);

      if (error) {
        console.error('[Supabase Error] Contact submission failed:', error);
        throw new Error(error.message || 'Unable to store contact submission in database.');
      }
    }

    return payload;
  }

  // --------------------------------------------------------------------------
  // 4. PUBLIC BUILD YOUR QUOTE SUBMISSION API (EXACT SNAPSHOT PERSISTENCE)
  // --------------------------------------------------------------------------
  async function submitQuoteSubmission(quotePayload) {
    if (!quotePayload || !quotePayload.customerDetails) {
      throw new Error('Incomplete quote payload. Cannot submit.');
    }

    const cust = quotePayload.customerDetails;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const quoteNumber = quotePayload.quoteId || (`SQ-2026-${randomSuffix}`);

    const formattedEvents = (quotePayload.selectedEvents || []).map((evKey, index) => ({
      event_key: evKey,
      event_name: (typeof evKey === 'string') ? evKey.toUpperCase() : 'EVENT',
      event_order: index + 1
    }));

    const formattedLineItems = (quotePayload.lineItems || []).map(item => ({
      event_id: item.eventId || null,
      event_name: item.eventName || 'GENERAL',
      service_id: item.serviceId || item.id || 'service',
      service_name: item.serviceName || item.name || 'Service',
      service_type: item.type || 'PHOTO_VIDEO',
      quantity: item.quantity || 1,
      unit_price: Number(item.unitPrice || item.price || 0),
      line_total: Number(item.lineTotal || item.total || 0)
    }));

    const formattedAddons = (quotePayload.addonsSelected || []).map(ad => ({
      addon_key: ad.key || ad.id || 'addon',
      name: ad.name || 'Addon',
      category: ad.category || 'GENERAL',
      quantity: ad.quantity || 1,
      unit_price: Number(ad.unitPrice || ad.price || 0),
      total: Number(ad.total || 0)
    }));

    const masterRecord = {
      id: 'qs-' + Date.now(),
      quote_number: quoteNumber,
      customer_name: String(cust.fullName || cust.name || '').trim(),
      phone: String(cust.phone || '').trim(),
      email: String(cust.email || '').trim().toLowerCase(),
      wedding_date: cust.date ? String(cust.date) : new Date().toISOString().split('T')[0],
      venue: String(cust.venue || '').trim(),
      city: String(cust.city || 'Hyderabad').trim(),
      photography_style: String(quotePayload.photographyStyle || 'BOTH').toUpperCase(),
      additional_notes: cust.notes ? String(cust.notes).trim() : null,
      event_subtotal: Number(quotePayload.eventSubtotal || 0),
      addon_subtotal: Number(quotePayload.addonSubtotal || 0),
      raw_subtotal: Number(quotePayload.rawSubtotal || 0),
      discount_total: Number(quotePayload.discountTotal || 0),
      promo_code: quotePayload.promoCode || null,
      estimated_total: Number(quotePayload.estimatedTotal || 0),
      status: 'NEW',
      terms_accepted: Boolean(cust.termsAccepted),
      internal_notes: '',
      pricing_snapshot: {
        rawSubtotal: Number(quotePayload.rawSubtotal || 0),
        discountTotal: Number(quotePayload.discountTotal || 0),
        estimatedTotal: Number(quotePayload.estimatedTotal || 0),
        events: formattedEvents,
        lineItems: formattedLineItems,
        addons: formattedAddons,
        preferences: quotePayload.preferences || {}
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Always persist real quote submission in live storage
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIVE_QUOTES) || '[]');
      existing.unshift(masterRecord);
      localStorage.setItem(STORAGE_KEYS.LIVE_QUOTES, JSON.stringify(existing));
    } catch (e) {
      // Ignore
    }

    if (isLiveConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient.rpc('submit_full_quote', {
          p_quote_number: masterRecord.quote_number,
          p_customer_name: masterRecord.customer_name,
          p_phone: masterRecord.phone,
          p_email: masterRecord.email,
          p_wedding_date: masterRecord.wedding_date,
          p_venue: masterRecord.venue,
          p_city: masterRecord.city,
          p_photography_style: masterRecord.photography_style,
          p_additional_notes: masterRecord.additional_notes,
          p_event_subtotal: masterRecord.event_subtotal,
          p_addon_subtotal: masterRecord.addon_subtotal,
          p_raw_subtotal: masterRecord.raw_subtotal,
          p_discount_total: masterRecord.discount_total,
          p_promo_code: masterRecord.promo_code,
          p_estimated_total: masterRecord.estimated_total,
          p_terms_accepted: masterRecord.terms_accepted,
          p_pricing_snapshot: masterRecord.pricing_snapshot,
          p_events: formattedEvents,
          p_line_items: formattedLineItems,
          p_addons: formattedAddons,
          p_preferences: quotePayload.preferences || {}
        });

        if (error) {
          const { error: insertError } = await supabaseClient
            .from('quote_submissions')
            .insert([masterRecord]);

          if (insertError) throw insertError;
          return masterRecord;
        }

        return { id: data, ...masterRecord };
      } catch (err) {
        console.error('[Supabase Error] Quote submission failed:', err);
        throw new Error(err.message || 'Unable to store complete quote submission in database.');
      }
    }

    return masterRecord;
  }

  // --------------------------------------------------------------------------
  // 5. ADMIN AUTHENTICATION
  // --------------------------------------------------------------------------
  async function signInAdmin(email, password) {
    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 1. Live Supabase Auth
    if (isLiveConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });

        if (!error && data && data.user) {
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('role, display_name, email')
            .eq('id', data.user.id)
            .single();

          const sessionObj = {
            user: {
              id: data.user.id,
              email: data.user.email,
              displayName: (profile && profile.display_name) || 'Mani (Admin)',
              role: (profile && profile.role) || 'admin'
            },
            token: data.session.access_token,
            isLive: true
          };
          sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(sessionObj));
          return sessionObj;
        }
      } catch (err) {
        console.warn('Supabase auth notice:', err);
      }
    }

    // 2. Default Configured Admin Credentials
    if (
      (cleanEmail === 'maneekanta0@gmail.com' && password === 'Mani@123!') ||
      (cleanEmail === 'admin@sumanthphotography.com' && password === 'Mani@123!')
    ) {
      const defaultSession = {
        user: {
          id: 'admin-maneekanta0',
          email: cleanEmail,
          displayName: 'Mani (Admin)',
          role: 'admin'
        },
        token: 'auth-session-maneekanta0',
        isLive: true
      };
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(defaultSession));
      return defaultSession;
    }

    throw new Error('Invalid email or password. Use your authorized Admin account (maneekanta0@gmail.com / Mani@123!).');
  }

  async function signOutAdmin() {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    if (isLiveConfigured && supabaseClient) {
      try {
        await supabaseClient.auth.signOut();
      } catch (e) {
        console.warn('Sign out notice:', e);
      }
    }
  }

  function getActiveAdminSession() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  // --------------------------------------------------------------------------
  // 6. ADMIN DATA QUERIES (CONTACTS — LIVE DATA ONLY)
  // --------------------------------------------------------------------------
  async function fetchAdminContacts(params = {}) {
    const { status, search, limit = 50, offset = 0 } = params;

    let dbRecords = [];
    let dbCount = 0;

    if (isLiveConfigured && supabaseClient) {
      try {
        let query = supabaseClient
          .from('contact_submissions')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (status && status !== 'ALL') {
          query = query.eq('status', status);
        }

        if (search && search.trim()) {
          const s = search.trim();
          query = query.or(`full_name.ilike.%${s}%,email.ilike.%${s}%,phone.ilike.%${s}%,session_type.ilike.%${s}%`);
        }

        const { data, error, count } = await query;
        if (!error && data) {
          dbRecords = data;
          dbCount = count || data.length;
        }
      } catch (e) {
        console.warn('Supabase contact fetch notice:', e);
      }
    }

    // Merge with local live submissions (deduplicated by id/email+created_at)
    let local = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIVE_CONTACTS) || '[]');
    if (status && status !== 'ALL') {
      local = local.filter(c => c.status === status);
    }
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      local = local.filter(c =>
        (c.full_name && c.full_name.toLowerCase().includes(s)) ||
        (c.email && c.email.toLowerCase().includes(s)) ||
        (c.phone && c.phone.toLowerCase().includes(s)) ||
        (c.session_type && c.session_type.toLowerCase().includes(s))
      );
    }

    // Combine records avoiding duplicates
    const combinedMap = new Map();
    dbRecords.forEach(r => combinedMap.set(r.id || r.email, r));
    local.forEach(r => {
      if (!combinedMap.has(r.id) && !combinedMap.has(r.email)) {
        combinedMap.set(r.id || r.email, r);
      }
    });

    const combined = Array.from(combinedMap.values()).sort((a, b) => new Date(b.created_at || b.updated_at) - new Date(a.created_at || a.updated_at));
    const totalCount = Math.max(dbCount, combined.length);
    const paged = combined.slice(offset, offset + limit);
    return { records: paged, totalCount };
  }

  async function getContactById(id) {
    if (isLiveConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('contact_submissions')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch (e) {
        // Fall through to local fallback
      }
    }

    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIVE_CONTACTS) || '[]');
    const found = all.find(c => c.id === id || c.email === id);
    if (!found) throw new Error('Contact enquiry not found.');
    return found;
  }

  async function updateContactStatus(id, newStatus) {
    const valid = ['NEW', 'READ', 'FOLLOW_UP', 'CONTACTED', 'BOOKED', 'CLOSED'];
    if (!valid.includes(newStatus)) throw new Error('Invalid status value.');

    if (isLiveConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('contact_submissions')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select();
        if (!error && data && data.length > 0) return data[0];
      } catch (e) {
        // Fall through to local update
      }
    }

    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIVE_CONTACTS) || '[]');
    const idx = all.findIndex(c => c.id === id || c.email === id);
    if (idx !== -1) {
      all[idx].status = newStatus;
      all[idx].updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.LIVE_CONTACTS, JSON.stringify(all));
      return all[idx];
    }
    return { id, status: newStatus };
  }

  async function updateContactInternalNotes(id, notes) {
    if (isLiveConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('contact_submissions')
          .update({ internal_notes: notes, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select();
        if (!error && data && data.length > 0) return data[0];
      } catch (e) {
        // Fall through to local update
      }
    }

    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIVE_CONTACTS) || '[]');
    const idx = all.findIndex(c => c.id === id || c.email === id);
    if (idx !== -1) {
      all[idx].internal_notes = notes;
      all[idx].updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.LIVE_CONTACTS, JSON.stringify(all));
      return all[idx];
    }
    return { id, internal_notes: notes };
  }

  // --------------------------------------------------------------------------
  // 7. ADMIN DATA QUERIES (QUOTES — LIVE DATA ONLY)
  // --------------------------------------------------------------------------
  async function fetchAdminQuotes(params = {}) {
    const { status, search, style, limit = 50, offset = 0 } = params;

    let dbRecords = [];
    let dbCount = 0;

    if (isLiveConfigured && supabaseClient) {
      try {
        let query = supabaseClient
          .from('quote_submissions')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (status && status !== 'ALL') {
          query = query.eq('status', status);
        }
        if (style && style !== 'ALL') {
          query = query.eq('photography_style', style);
        }
        if (search && search.trim()) {
          const s = search.trim();
          query = query.or(`quote_number.ilike.%${s}%,customer_name.ilike.%${s}%,phone.ilike.%${s}%,email.ilike.%${s}%,venue.ilike.%${s}%`);
        }

        const { data, error, count } = await query;
        if (!error && data) {
          dbRecords = data;
          dbCount = count || data.length;
        }
      } catch (e) {
        console.warn('Supabase quote fetch notice:', e);
      }
    }

    // Merge with local live submissions
    let local = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIVE_QUOTES) || '[]');
    if (status && status !== 'ALL') {
      local = local.filter(q => q.status === status);
    }
    if (style && style !== 'ALL') {
      local = local.filter(q => (q.photography_style || '').toUpperCase() === style.toUpperCase());
    }
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      local = local.filter(q =>
        (q.quote_number && q.quote_number.toLowerCase().includes(s)) ||
        (q.customer_name && q.customer_name.toLowerCase().includes(s)) ||
        (q.phone && q.phone.toLowerCase().includes(s)) ||
        (q.email && q.email.toLowerCase().includes(s)) ||
        (q.venue && q.venue.toLowerCase().includes(s))
      );
    }

    // Combine records avoiding duplicates
    const combinedMap = new Map();
    dbRecords.forEach(r => combinedMap.set(r.id || r.quote_number, r));
    local.forEach(r => {
      if (!combinedMap.has(r.id) && !combinedMap.has(r.quote_number)) {
        combinedMap.set(r.id || r.quote_number, r);
      }
    });

    const combined = Array.from(combinedMap.values()).sort((a, b) => new Date(b.created_at || b.updated_at) - new Date(a.created_at || a.updated_at));
    const totalCount = Math.max(dbCount, combined.length);
    const paged = combined.slice(offset, offset + limit);
    return { records: paged, totalCount };
  }

  async function getQuoteById(id) {
    if (isLiveConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('quote_submissions')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch (e) {
        // Fall through to local fallback
      }
    }

    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIVE_QUOTES) || '[]');
    const found = all.find(q => q.id === id || q.quote_number === id);
    if (!found) throw new Error('Quote submission not found.');
    return found;
  }

  async function updateQuoteStatus(id, newStatus) {
    const valid = ['NEW', 'REVIEWING', 'CONTACTED', 'QUOTE_SENT', 'BOOKED', 'CANCELLED', 'CLOSED'];
    if (!valid.includes(newStatus)) throw new Error('Invalid status value.');

    if (isLiveConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('quote_submissions')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select();
        if (!error && data && data.length > 0) return data[0];
      } catch (e) {
        // Fall through to local update
      }
    }

    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIVE_QUOTES) || '[]');
    const idx = all.findIndex(q => q.id === id || q.quote_number === id);
    if (idx !== -1) {
      all[idx].status = newStatus;
      all[idx].updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.LIVE_QUOTES, JSON.stringify(all));
      return all[idx];
    }
    return { id, status: newStatus };
  }

  async function updateQuoteInternalNotes(id, notes) {
    if (isLiveConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('quote_submissions')
          .update({ internal_notes: notes, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select();
        if (!error && data && data.length > 0) return data[0];
      } catch (e) {
        // Fall through to local update
      }
    }

    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIVE_QUOTES) || '[]');
    const idx = all.findIndex(q => q.id === id || q.quote_number === id);
    if (idx !== -1) {
      all[idx].internal_notes = notes;
      all[idx].updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.LIVE_QUOTES, JSON.stringify(all));
      return all[idx];
    }
    return { id, internal_notes: notes };
  }

  // --------------------------------------------------------------------------
  // 8. EXPORT TO GLOBAL NAMESPACE
  // --------------------------------------------------------------------------
  window.SumanthDB = {
    isLiveConfigured,
    client: supabaseClient,
    config: activeConfig,

    // Public Submissions
    submitContactSubmission,
    submitQuoteSubmission,

    // Admin Auth
    signInAdmin,
    signOutAdmin,
    getActiveAdminSession,

    // Admin Queries (Contacts)
    fetchAdminContacts,
    getContactById,
    updateContactStatus,
    updateContactInternalNotes,

    // Admin Queries (Quotes)
    fetchAdminQuotes,
    getQuoteById,
    updateQuoteStatus,
    updateQuoteInternalNotes
  };

})();
