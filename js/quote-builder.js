/**
 * SUMANTH PHOTOGRAPHY — BUILD YOUR QUOTE CONFIGURATOR
 * Phase 05: Customer Details + Final Review Summary + Secure Submission + Analytics Hooks
 */

(function () {
  'use strict';

  // -------------------------------------------------------------
  // ANALYTICS DISPATCHER
  // -------------------------------------------------------------
  function trackEvent(eventName, payload = {}) {
    try {
      const eventDetail = {
        event: eventName,
        timestamp: new Date().toISOString(),
        ...payload
      };
      // Dispatch custom DOM event for analytics hooks
      document.dispatchEvent(new CustomEvent('sumanth_analytics', { detail: eventDetail }));
      if (window._sumanthAnalyticsLog) {
        window._sumanthAnalyticsLog.push(eventDetail);
      } else {
        window._sumanthAnalyticsLog = [eventDetail];
      }
    } catch (e) {
      console.warn('Analytics event dispatch error:', e);
    }
  }

  // -------------------------------------------------------------
  // BUSINESS SOURCE OF TRUTH & CONFIGURATION
  // -------------------------------------------------------------
  const CONFIG = {
    brandName: 'SUMANTH PHOTOGRAPHY',
    whatsappNumber: '+919491818015',
    whatsappCleanNumber: '919491818015',
    totalSteps: 6,

    styles: [
      {
        id: 'candid',
        title: 'CANDID PHOTOGRAPHY',
        tagline: 'Natural & Emotional Storytelling',
        description: 'Spontaneous, unposed emotional moments captured with artistic depth and documentary intimacy.',
        image: 'images/candid_camera.jpg',
        imageAlt: 'Professional mirrorless camera representing candid photography'
      },
      {
        id: 'traditional',
        title: 'TRADITIONAL PHOTOGRAPHY',
        tagline: 'Ritual Documentation & Formal Portraits',
        description: 'Comprehensive coverage of every sacred ritual, family stage portraits, and ceremonial documentation.',
        image: 'images/traditional_camera.jpg',
        imageAlt: 'Professional DSLR camera with flash representing traditional photography'
      },
      {
        id: 'both',
        title: 'CANDID + TRADITIONAL (BOTH)',
        tagline: 'The Complete Luxury Experience',
        description: 'Seamless integration of fine-art candid moments and classical family heirloom portraiture.',
        image: 'images/candid_camera.jpg',
        imageAlt: 'Professional camera setup representing complete candid and traditional photography'
      }
    ],

    events: [
      { id: 'engagement', name: 'Engagement / Ring Ceremony', category: 'PRE-WEDDING CELEBRATION', image: 'images/event_engagement.jpg', imageAlt: 'Indian wedding engagement ring ceremony detail', defaultSelected: false, droneAllowed: true },
      { id: 'pellikoothuru', name: 'Pellikuthuru / Haldi Ceremony', category: 'SACRED BRIDAL RITUAL', image: 'images/event_mehendi.jpg', imageAlt: 'Intricate bridal henna and ritual detail', defaultSelected: false, droneAllowed: true },
      { id: 'pellikkoduku', name: 'Pellikoduku / Groom Ceremony', category: 'SACRED GROOM RITUAL', image: 'images/event_haldi.jpg', imageAlt: 'Sacred groom Haldi ceremony detail', defaultSelected: false, droneAllowed: true },
      { id: 'mehendi', name: 'Mehendi Soirée', category: 'COLOR & FESTIVITY', image: 'images/event_mehendi.jpg', imageAlt: 'Intricate bridal mehendi hands detail', defaultSelected: false, droneAllowed: false },
      { id: 'sangeet', name: 'Sangeet & Cocktail Night', category: 'EVENING SPECTACLE', image: 'images/event_sangeet.jpg', imageAlt: 'Sangeet night stage dance performance', defaultSelected: false, droneAllowed: true },
      { id: 'vratham', name: 'Gauri Pooja / Satyanarayana Vratham', category: 'DEVOTIONAL RITUAL', image: 'images/event_haldi.jpg', imageAlt: 'Devotional vratham ceremony detail', defaultSelected: false, droneAllowed: false },
      { id: 'wedding', name: 'Wedding (Muhurtham)', category: 'THE SACRED UNION', image: 'images/event_engagement.jpg', imageAlt: 'Sacred wedding muhurtham ceremony detail', defaultSelected: true, droneAllowed: true },
      { id: 'reception', name: 'Grand Wedding Reception', category: 'FORMAL GALA', image: 'images/event_sangeet.jpg', imageAlt: 'Grand reception stage celebration', defaultSelected: false, droneAllowed: true },
      { id: 'brideHaldi', name: 'Bride Haldi & Mangala Snanam', category: 'MORNING RITUAL', image: 'images/event_haldi.jpg', imageAlt: 'Bride Haldi ceremony turmeric detail', defaultSelected: false, droneAllowed: true },
      { id: 'groomHaldi', name: 'Groom Haldi & Mangala Snanam', category: 'MORNING RITUAL', image: 'images/event_haldi.jpg', imageAlt: 'Groom Haldi ceremony detail', defaultSelected: false, droneAllowed: true },
      { id: 'cocktailParty', name: 'Cocktail & After-Party', category: 'NIGHT CELEBRATION', image: 'images/event_sangeet.jpg', imageAlt: 'Cocktail after-party celebration', defaultSelected: false, droneAllowed: false },
      { id: 'poolParty', name: 'Pool Party / Welcome Brunch', category: 'INFORMAL CELEBRATION', image: 'images/event_haldi.jpg', imageAlt: 'Pool party welcome brunch detail', defaultSelected: false, droneAllowed: true }
    ],

    servicesCatalog: {
      candidPhoto: { id: 'candidPhoto', name: 'Senior Candid Photographer', unitPrice: 45000, desc: 'Fine art storytelling & raw emotion capture', image: 'images/candid_camera.jpg', imageAlt: 'Professional mirrorless camera representing senior candid photographer' },
      candidVideo: { id: 'candidVideo', name: 'Candid Cinematographer', unitPrice: 50000, desc: '4K cinema primes & dynamic gimbal footage', image: 'images/cinema_camera.jpg', imageAlt: 'Cinema video camera representing candid cinematographer' },
      tradPhoto: { id: 'tradPhoto', name: 'Traditional Photographer', unitPrice: 25000, desc: 'Ceremonial stage & guest group portraiture', image: 'images/traditional_camera.jpg', imageAlt: 'Professional DSLR camera with flash representing traditional photographer' },
      tradVideo: { id: 'tradVideo', name: 'Traditional Videographer', unitPrice: 25000, desc: 'Full-length continuous high-definition documentation', image: 'images/broadcast_camcorder.jpg', imageAlt: 'Broadcast camcorder representing traditional videographer' },
      drone: { id: 'drone', name: '4K Drone Aerial Cinematography', unitPrice: 15000, desc: 'Epic venue overviews and outdoor processional shots', image: 'images/drone_equipment.jpg', imageAlt: 'Professional quadcopter drone representing aerial cinematography' }
    },

    addonsCatalog: {
      preWedding: {
        id: 'preWedding',
        name: 'Pre-Wedding Editorial Shoot',
        basePricePhoto: 30000,
        basePriceBoth: 55000,
        fullDaySurcharge: 15000
      },
      candidAlbum: {
        id: 'candidAlbum',
        name: 'Handcrafted Candid Heirloom Album',
        unitPrice: 25000,
        desc: '35 Sheets (70 Pages) Fine Art Luster, custom linen embossing'
      },
      traditionalAlbum: {
        id: 'traditionalAlbum',
        name: 'Traditional / Parent Keepsake Album',
        unitPrice: 18000,
        desc: '25 Sheets (50 Pages) Hardbound UV coated archival paper'
      },
      liveStream: {
        id: 'liveStream',
        name: 'Multi-Cam YouTube/Zoom Live Broadcast',
        unitPricePerEvent: 15000,
        applicableEvents: ['engagement', 'reception', 'sangeet', 'wedding']
      },
      filmStyle: {
        cinematic: { name: 'Cinematic Feature (3-5 min teaser + 15-20 min story film)', price: 0 },
        documentary: { name: 'Documentary Extended (Full chronological ritual edit)', price: 0 },
        hybrid: { name: 'Hybrid Director’s Cut (Trailer + Chaptered Ceremonies)', price: 10000 }
      },
      delivery: {
        standard: { name: 'Standard Editorial Delivery (60-90 Days)', price: 0 },
        fastTrack: { name: 'Fast-Track Priority (21 Days + 48hr Social Teaser)', price: 25000 }
      },
      extraTeam: {
        extraPhoto: { name: 'Additional Associate Photographer', unitPrice: 15000 },
        extraVideo: { name: 'Additional Associate Videographer', unitPrice: 18000 },
        extraHours: { name: 'Overtime Coverage (Per Hour)', unitPrice: 5000 }
      },
      rawMasterDrive: {
        id: 'rawMasterDrive',
        name: '2TB Rugged Master SSD (Uncompressed Raw Archive)',
        price: 15000
      },
      sameDayReels: {
        id: 'sameDayReels',
        name: 'Same-Day 3-Reel Social Media Story Package',
        price: 18000
      }
    },

    discounts: {
      multiEventPackage: {
        thresholdEvents: 3,
        discountAmount: 25000,
        label: 'Multi-Celebration Package Credit'
      },
      promoCodes: {
        'SUMANTH2026': { type: 'fixed', amount: 15000, label: 'Studio Signature Promo (₹15,000 Off)' },
        'ROYAL': { type: 'percent', percent: 5, label: 'Royal Wedding Privilege (5% Off)' },
        'HERITAGE': { type: 'fixed', amount: 20000, label: 'Heritage Booking Privilege (₹20,000 Off)' }
      }
    }
  };

  // -------------------------------------------------------------
  // STATE MANAGEMENT WITH LOCALSTORAGE PERSISTENCE
  // -------------------------------------------------------------
  const STORAGE_KEY = 'sumanth_quote_state_v5';

  function getInitialState() {
    return {
      currentStep: 0,
      activeCoverageEventIndex: 0,
      photographyStyle: 'both',
      selectedEvents: ['wedding'],
      eventServices: {
        wedding: {
          candidPhoto: 1,
          candidVideo: 1,
          tradPhoto: 1,
          tradVideo: 1,
          drone: true
        }
      },
      addons: {
        preWedding: {
          included: false,
          scope: 'both',
          duration: 'halfDay'
        },
        candidAlbum: 1,
        traditionalAlbum: 0,
        liveStreaming: {
          included: false,
          events: []
        },
        filmStyle: 'cinematic',
        delivery: 'standard',
        rawDrive: true,
        sameDayReels: false,
        extraCrew: {
          extraPhoto: 0,
          extraVideo: 0,
          extraHours: 0
        }
      },
      promoCode: '',
      appliedPromo: null,
      customerDetails: {
        fullName: '',
        phone: '',
        email: '',
        date: '',
        venue: '',
        city: 'Hyderabad',
        notes: '',
        termsAccepted: false
      },
      generatedQuoteId: null,
      isSubmitting: false
    };
  }

  let state = loadInitialState();

  function loadInitialState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const initial = getInitialState();
        return {
          ...initial,
          ...parsed,
          addons: {
            ...initial.addons,
            ...(parsed.addons || {}),
            preWedding: { ...initial.addons.preWedding, ...(parsed.addons?.preWedding || {}) },
            liveStreaming: { ...initial.addons.liveStreaming, ...(parsed.addons?.liveStreaming || {}) },
            extraCrew: { ...initial.addons.extraCrew, ...(parsed.addons?.extraCrew || {}) }
          },
          customerDetails: {
            ...initial.customerDetails,
            ...(parsed.customerDetails || {})
          }
        };
      }
    } catch (e) {
      console.warn('Storage read error, starting fresh state:', e);
    }
    return getInitialState();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  }

  function resetState() {
    localStorage.removeItem(STORAGE_KEY);
    state = getInitialState();
    saveState();
  }

  // -------------------------------------------------------------
  // CENTRAL UNIFIED PRICING ENGINE
  // Equation: eventTotal + addonTotal - discount = estimatedTotal
  // -------------------------------------------------------------
  function calculateQuoteTotals() {
    const lineItems = [];
    let eventSubtotal = 0;
    let addonSubtotal = 0;
    let discountTotal = 0;
    const appliedDiscounts = [];

    // 1. Event Services Line Items
    state.selectedEvents.forEach(eventId => {
      const eventMeta = CONFIG.events.find(e => e.id === eventId) || { name: eventId, category: 'EVENT' };
      const config = state.eventServices[eventId] || {};

      ['candidPhoto', 'candidVideo', 'tradPhoto', 'tradVideo'].forEach(srvKey => {
        const qty = config[srvKey] || 0;
        if (qty > 0) {
          const srvMeta = CONFIG.servicesCatalog[srvKey];
          const total = qty * srvMeta.unitPrice;
          eventSubtotal += total;
          lineItems.push({
            id: `${eventId}_${srvKey}`,
            eventId: eventId,
            eventName: eventMeta.name,
            name: `${eventMeta.name} — ${srvMeta.name}`,
            category: 'EVENT_SERVICE',
            quantity: qty,
            unitPrice: srvMeta.unitPrice,
            total: total
          });
        }
      });

      if (config.drone) {
        const srvMeta = CONFIG.servicesCatalog.drone;
        eventSubtotal += srvMeta.unitPrice;
        lineItems.push({
          id: `${eventId}_drone`,
          eventId: eventId,
          eventName: eventMeta.name,
          name: `${eventMeta.name} — ${srvMeta.name}`,
          category: 'EVENT_SERVICE',
          quantity: 1,
          unitPrice: srvMeta.unitPrice,
          total: srvMeta.unitPrice
        });
      }
    });

    // 2. Add-on Line Items
    // A. Pre-Wedding Shoot
    if (state.addons.preWedding?.included) {
      const pw = state.addons.preWedding;
      const base = pw.scope === 'both' ? CONFIG.addonsCatalog.preWedding.basePriceBoth : CONFIG.addonsCatalog.preWedding.basePricePhoto;
      const surcharge = pw.duration === 'fullDay' ? CONFIG.addonsCatalog.preWedding.fullDaySurcharge : 0;
      const total = base + surcharge;
      addonSubtotal += total;
      lineItems.push({
        id: 'addon_prewedding',
        name: `Pre-Wedding Editorial Shoot (${pw.scope === 'both' ? 'Photo + Cinema' : 'Photo Only'}, ${pw.duration === 'fullDay' ? 'Full Day' : 'Half Day'})`,
        category: 'ADDON',
        quantity: 1,
        unitPrice: total,
        total: total
      });
    }

    // B. Candid Heirloom Album
    const candidQty = state.addons.candidAlbum || 0;
    if (candidQty > 0) {
      const unit = CONFIG.addonsCatalog.candidAlbum.unitPrice;
      const total = candidQty * unit;
      addonSubtotal += total;
      lineItems.push({
        id: 'addon_candid_album',
        name: `Handcrafted Fine-Art Candid Album (35 Sheets / 70 Pages)`,
        category: 'ADDON',
        quantity: candidQty,
        unitPrice: unit,
        total: total
      });
    }

    // C. Traditional Keepsake Album
    const tradQty = state.addons.traditionalAlbum || 0;
    if (tradQty > 0) {
      const unit = CONFIG.addonsCatalog.traditionalAlbum.unitPrice;
      const total = tradQty * unit;
      addonSubtotal += total;
      lineItems.push({
        id: 'addon_trad_album',
        name: `Traditional Parent Keepsake Album (25 Sheets / 50 Pages)`,
        category: 'ADDON',
        quantity: tradQty,
        unitPrice: unit,
        total: total
      });
    }

    // D. Live Streaming
    if (state.addons.liveStreaming?.included && state.addons.liveStreaming.events?.length > 0) {
      const streamEvents = state.addons.liveStreaming.events;
      const unit = CONFIG.addonsCatalog.liveStream.unitPricePerEvent;
      const total = streamEvents.length * unit;
      addonSubtotal += total;
      lineItems.push({
        id: 'addon_livestream',
        name: `Multi-Cam Live HD Broadcast (${streamEvents.length} Event${streamEvents.length > 1 ? 's' : ''})`,
        category: 'ADDON',
        quantity: streamEvents.length,
        unitPrice: unit,
        total: total
      });
    }

    // E. Film Style (Hybrid Surcharge)
    if (state.addons.filmStyle === 'hybrid') {
      const price = CONFIG.addonsCatalog.filmStyle.hybrid.price;
      addonSubtotal += price;
      lineItems.push({
        id: 'addon_film_style',
        name: `Film Style: Hybrid Director’s Cut (Trailer + Full Ritual Chapters)`,
        category: 'OUTPUT',
        quantity: 1,
        unitPrice: price,
        total: price
      });
    }

    // F. Fast-Track Delivery
    if (state.addons.delivery === 'fastTrack') {
      const price = CONFIG.addonsCatalog.delivery.fastTrack.price;
      addonSubtotal += price;
      lineItems.push({
        id: 'addon_delivery_fast',
        name: `Fast-Track Priority Post-Production (21-Day Delivery)`,
        category: 'OUTPUT',
        quantity: 1,
        unitPrice: price,
        total: price
      });
    }

    // G. Extra Team & Hours
    const extraPhoto = state.addons.extraCrew?.extraPhoto || 0;
    if (extraPhoto > 0) {
      const unit = CONFIG.addonsCatalog.extraTeam.extraPhoto.unitPrice;
      const total = extraPhoto * unit;
      addonSubtotal += total;
      lineItems.push({
        id: 'addon_extra_photo',
        name: `Additional Associate Photographer`,
        category: 'ADDON',
        quantity: extraPhoto,
        unitPrice: unit,
        total: total
      });
    }

    const extraVideo = state.addons.extraCrew?.extraVideo || 0;
    if (extraVideo > 0) {
      const unit = CONFIG.addonsCatalog.extraTeam.extraVideo.unitPrice;
      const total = extraVideo * unit;
      addonSubtotal += total;
      lineItems.push({
        id: 'addon_extra_video',
        name: `Additional Associate Videographer`,
        category: 'ADDON',
        quantity: extraVideo,
        unitPrice: unit,
        total: total
      });
    }

    const extraHours = state.addons.extraCrew?.extraHours || 0;
    if (extraHours > 0) {
      const unit = CONFIG.addonsCatalog.extraTeam.extraHours.unitPrice;
      const total = extraHours * unit;
      addonSubtotal += total;
      lineItems.push({
        id: 'addon_extra_hours',
        name: `Overtime Coverage Hours`,
        category: 'ADDON',
        quantity: extraHours,
        unitPrice: unit,
        total: total
      });
    }

    // H. Digital Deliverables
    if (state.addons.rawDrive) {
      const price = CONFIG.addonsCatalog.rawMasterDrive.price;
      addonSubtotal += price;
      lineItems.push({
        id: 'addon_raw_drive',
        name: `2TB Rugged Master SSD (Uncompressed Raw Archive)`,
        category: 'OUTPUT',
        quantity: 1,
        unitPrice: price,
        total: price
      });
    }

    if (state.addons.sameDayReels) {
      const price = CONFIG.addonsCatalog.sameDayReels.price;
      addonSubtotal += price;
      lineItems.push({
        id: 'addon_same_day_reels',
        name: `Same-Day 3-Reel Social Media Story Package`,
        category: 'ADDON',
        quantity: 1,
        unitPrice: price,
        total: price
      });
    }

    const rawSubtotal = eventSubtotal + addonSubtotal;

    // 3. Discounts Engine
    if (state.selectedEvents.length >= CONFIG.discounts.multiEventPackage.thresholdEvents) {
      const credit = CONFIG.discounts.multiEventPackage.discountAmount;
      discountTotal += credit;
      appliedDiscounts.push({
        id: 'discount_multi_event',
        name: CONFIG.discounts.multiEventPackage.label,
        amount: credit
      });
    }

    if (state.promoCode && CONFIG.discounts.promoCodes[state.promoCode]) {
      const promoConfig = CONFIG.discounts.promoCodes[state.promoCode];
      let promoAmount = 0;
      if (promoConfig.type === 'fixed') {
        promoAmount = promoConfig.amount;
      } else if (promoConfig.type === 'percent') {
        promoAmount = Math.round((rawSubtotal * promoConfig.percent) / 100);
      }
      discountTotal += promoAmount;
      appliedDiscounts.push({
        id: `discount_promo_${state.promoCode}`,
        name: promoConfig.label,
        amount: promoAmount,
        code: state.promoCode
      });
    }

    const estimatedTotal = Math.max(0, Math.round(rawSubtotal - discountTotal));

    return {
      lineItems,
      eventSubtotal,
      addonSubtotal,
      rawSubtotal,
      discountTotal,
      appliedDiscounts,
      estimatedTotal
    };
  }

  function formatCurrency(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return '₹0';
    return '₹' + amount.toLocaleString('en-IN');
  }

  // -------------------------------------------------------------
  // RENDERERS & STEP LOGIC
  // -------------------------------------------------------------

  function updateGlobalChrome() {
    const tracker = document.getElementById('step-progress-text');
    if (tracker) {
      tracker.textContent = state.currentStep === 0
        ? 'WELCOME'
        : `0${Math.min(state.currentStep, CONFIG.totalSteps)} / 0${CONFIG.totalSteps}`;
    }

    document.querySelectorAll('.step-dot-item').forEach(dot => {
      const stepVal = parseInt(dot.getAttribute('data-step'), 10);
      dot.classList.toggle('active-step', stepVal === state.currentStep);
    });

    const bottomBar = document.getElementById('wizard-bottom-bar');
    if (bottomBar) {
      if (state.currentStep === 0 || state.currentStep === 7) {
        bottomBar.style.display = 'none';
      } else {
        bottomBar.style.display = 'flex';
      }
    }

    const backBtn = document.getElementById('btn-wizard-back');
    if (backBtn) {
      backBtn.style.visibility = state.currentStep <= 1 ? 'hidden' : 'visible';
    }

    const continueLabel = document.getElementById('btn-continue-label');
    if (continueLabel) {
      if (state.currentStep === 4) {
        continueLabel.textContent = 'CONTINUE TO DETAILS →';
      } else if (state.currentStep === 5) {
        continueLabel.textContent = 'REVIEW EXACT QUOTE →';
      } else if (state.currentStep === 6) {
        continueLabel.textContent = 'REQUEST MY QUOTE →';
      } else {
        continueLabel.textContent = 'CONTINUE →';
      }
    }

    const totals = calculateQuoteTotals();
    const liveDesktop = document.getElementById('cov-live-total-desktop');
    if (liveDesktop) liveDesktop.textContent = formatCurrency(totals.estimatedTotal);
    const liveMobile = document.getElementById('cov-live-total-mobile');
    if (liveMobile) liveMobile.textContent = formatCurrency(totals.estimatedTotal);
  }

  // STEP 1: STYLE
  function renderStep1Style() {
    const grid = document.getElementById('style-cards-grid');
    if (!grid) return;

    grid.innerHTML = CONFIG.styles.map((style, index) => {
      const isSelected = state.photographyStyle === style.id;
      const numStr = `0${index + 1}`;
      return `
        <div class="selection-card ${isSelected ? 'selected' : ''}" data-style-id="${style.id}" onclick="window.selectPhotographyStyle('${style.id}')" tabindex="0" role="button" aria-pressed="${isSelected}">
          <div class="card-mobile-header">
            <span class="card-number">${numStr}</span>
            <div class="card-select-control" aria-hidden="true">${isSelected ? '✓' : ''}</div>
          </div>
          <div class="card-image-wrap">
            <img src="${style.image}" alt="${style.title}" loading="lazy" />
          </div>
          <div class="card-content">
            <h3 class="card-title">${style.title}</h3>
            <span class="card-subtitle">${style.tagline}</span>
            <p class="card-description">${style.description}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  window.selectPhotographyStyle = function (styleId) {
    state.photographyStyle = styleId;
    saveState();
    renderStep1Style();
    trackEvent('style_selected', { style: styleId });
  };

  // STEP 2: EVENTS
  function renderStep2Events() {
    const grid = document.getElementById('events-cards-grid');
    if (!grid) return;

    grid.innerHTML = CONFIG.events.map(event => {
      const isSelected = state.selectedEvents.includes(event.id);
      return `
        <div class="event-card ${isSelected ? 'selected' : ''}" data-event-id="${event.id}" onclick="window.toggleEventSelection('${event.id}')" tabindex="0" role="button" aria-pressed="${isSelected}">
          <div class="card-image-wrap" style="aspect-ratio:1/1;">
            <img src="${event.image}" alt="${event.imageAlt}" class="img-cover" loading="lazy" />
            <div class="event-checkbox" style="position:absolute; top:8px; right:8px; margin:0;">${isSelected ? '✓' : ''}</div>
          </div>
          <div class="event-info">
            <span class="event-cat">${event.category}</span>
            <h3 class="event-name">${event.name}</h3>
          </div>
        </div>
      `;
    }).join('');

    const countBadge = document.getElementById('events-count-badge');
    if (countBadge) {
      const count = state.selectedEvents.length;
      countBadge.textContent = `${count} EVENT${count !== 1 ? 'S' : ''} SELECTED`;
    }
  }

  window.toggleEventSelection = function (eventId) {
    if (state.selectedEvents.includes(eventId)) {
      if (state.selectedEvents.length === 1) {
        alert('Please keep at least one celebration event selected.');
        return;
      }
      state.selectedEvents = state.selectedEvents.filter(id => id !== eventId);
      delete state.eventServices[eventId];
    } else {
      state.selectedEvents.push(eventId);
      if (!state.eventServices[eventId]) {
        state.eventServices[eventId] = {
          candidPhoto: state.photographyStyle === 'traditional' ? 0 : 1,
          candidVideo: state.photographyStyle === 'traditional' ? 0 : 1,
          tradPhoto: state.photographyStyle === 'candid' ? 0 : 1,
          tradVideo: state.photographyStyle === 'candid' ? 0 : 1,
          drone: true
        };
      }
    }

    if (state.activeCoverageEventIndex >= state.selectedEvents.length) {
      state.activeCoverageEventIndex = 0;
    }

    saveState();
    renderStep2Events();
    trackEvent('events_selected', { selectedEvents: state.selectedEvents });
    updateGlobalChrome();
  };

  // STEP 3: COVERAGE
  function renderStep3Coverage() {
    if (!state.selectedEvents || state.selectedEvents.length === 0) {
      state.selectedEvents = ['wedding'];
    }

    if (state.activeCoverageEventIndex >= state.selectedEvents.length) {
      state.activeCoverageEventIndex = 0;
    }

    const currentEventId = state.selectedEvents[state.activeCoverageEventIndex];
    const eventMeta = CONFIG.events.find(e => e.id === currentEventId) || { name: 'Wedding', category: 'THE SACRED UNION' };

    if (!state.eventServices[currentEventId]) {
      state.eventServices[currentEventId] = {
        candidPhoto: state.photographyStyle === 'traditional' ? 0 : 1,
        candidVideo: state.photographyStyle === 'traditional' ? 0 : 1,
        tradPhoto: state.photographyStyle === 'candid' ? 0 : 1,
        tradVideo: state.photographyStyle === 'candid' ? 0 : 1,
        drone: true
      };
    }
    const currentConfig = state.eventServices[currentEventId];

    const crumb = document.getElementById('cov-event-crumb');
    if (crumb) {
      crumb.innerHTML = state.selectedEvents.map((evId, idx) => {
        const ev = CONFIG.events.find(e => e.id === evId) || { name: evId };
        const isActive = idx === state.activeCoverageEventIndex;
        return `
          <button type="button" class="btn-action ${isActive ? 'btn-action-primary' : 'btn-action-outline'}" style="font-size:10px; padding:6px 14px; border-radius:0;" onclick="window.switchCoverageEvent(${idx})">
            ${idx + 1}. ${ev.name.split('/')[0].trim()}
          </button>
        `;
      }).join('');
    }

    const stepLabel = document.getElementById('cov-step-label');
    if (stepLabel) stepLabel.textContent = `STEP 03 OF 06 — EVENT ${state.activeCoverageEventIndex + 1} OF ${state.selectedEvents.length}`;
    const eventTitle = document.getElementById('cov-event-title');
    if (eventTitle) eventTitle.textContent = `${eventMeta.name.toUpperCase()} COVERAGE`;
    const eventCat = document.getElementById('cov-event-cat');
    if (eventCat) eventCat.textContent = eventMeta.category;

    const srvGrid = document.getElementById('coverage-services-grid');
    if (srvGrid) {
      const services = [
        { key: 'candidPhoto', srv: CONFIG.servicesCatalog.candidPhoto },
        { key: 'candidVideo', srv: CONFIG.servicesCatalog.candidVideo },
        { key: 'tradPhoto', srv: CONFIG.servicesCatalog.tradPhoto },
        { key: 'tradVideo', srv: CONFIG.servicesCatalog.tradVideo }
      ];

      let html = services.map(({ key, srv }) => {
        const qty = currentConfig[key] || 0;
        return `
          <div class="service-tier-card ${qty > 0 ? 'selected' : ''}" data-service-key="${key}">
            <div class="card-image-wrap">
              <img src="${srv.image}" alt="${srv.imageAlt}" loading="lazy" />
            </div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <h4 style="font-family:var(--font-serif); font-size:18px; font-weight:500; text-transform:uppercase;">${srv.name}</h4>
              <span class="service-rate">${formatCurrency(srv.unitPrice)}</span>
            </div>
            <p style="font-size:12px; color:var(--text-secondary); line-height:1.5; margin-bottom:16px;">${srv.desc}</p>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="mono-label" style="font-size:10px;">CREW COUNT:</span>
              <div class="stepper-wrap">
                <button type="button" class="stepper-btn" onclick="window.updateCoverageQty('${currentEventId}', '${key}', -1)" aria-label="Decrease quantity">-</button>
                <span class="stepper-val">${qty}</span>
                <button type="button" class="stepper-btn" onclick="window.updateCoverageQty('${currentEventId}', '${key}', 1)" aria-label="Increase quantity">+</button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      const droneSrv = CONFIG.servicesCatalog.drone;
      const droneActive = currentConfig.drone !== false;
      html += `
        <div class="service-tier-card ${droneActive ? 'selected' : ''}" data-service-key="drone">
          <div class="card-image-wrap">
            <img src="${droneSrv.image}" alt="${droneSrv.imageAlt}" loading="lazy" />
          </div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <h4 style="font-family:var(--font-serif); font-size:18px; font-weight:500; text-transform:uppercase;">${droneSrv.name}</h4>
            <span class="service-rate">${formatCurrency(droneSrv.unitPrice)}</span>
          </div>
          <p style="font-size:12px; color:var(--text-secondary); line-height:1.5; margin-bottom:16px;">${droneSrv.desc}</p>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="mono-label" style="font-size:10px;">AERIAL COVERAGE:</span>
            <button type="button" class="btn-action ${droneActive ? 'btn-action-primary' : 'btn-action-outline'}" style="font-size:10px; padding:6px 14px;" onclick="window.toggleCoverageDrone('${currentEventId}')">
              ${droneActive ? 'INCLUDED ✓' : 'ADD DRONE +'}
            </button>
          </div>
        </div>
      `;

      srvGrid.innerHTML = html;
    }

    const prevBtn = document.getElementById('cov-prev-event-btn');
    if (prevBtn) prevBtn.style.visibility = state.activeCoverageEventIndex === 0 ? 'hidden' : 'visible';

    const counter = document.getElementById('cov-event-counter');
    if (counter) counter.textContent = `${state.activeCoverageEventIndex + 1} / ${state.selectedEvents.length}`;

    const nextBtn = document.getElementById('cov-next-event-btn');
    if (nextBtn) {
      if (state.activeCoverageEventIndex < state.selectedEvents.length - 1) {
        nextBtn.innerHTML = 'NEXT EVENT &rarr;';
      } else {
        nextBtn.innerHTML = 'ALL DONE ✓';
      }
    }
  }

  window.switchCoverageEvent = function (idx) {
    state.activeCoverageEventIndex = idx;
    saveState();
    renderStep3Coverage();
  };

  window.updateCoverageQty = function (eventId, serviceKey, delta) {
    if (!state.eventServices[eventId]) {
      state.eventServices[eventId] = {};
    }
    const current = state.eventServices[eventId][serviceKey] || 0;
    const next = Math.max(0, Math.min(4, current + delta));
    state.eventServices[eventId][serviceKey] = next;
    saveState();
    renderStep3Coverage();
    updateGlobalChrome();
    trackEvent('coverage_selected', { eventId, serviceKey, quantity: next });
  };

  window.toggleCoverageDrone = function (eventId) {
    if (!state.eventServices[eventId]) {
      state.eventServices[eventId] = {};
    }
    state.eventServices[eventId].drone = !state.eventServices[eventId].drone;
    saveState();
    renderStep3Coverage();
    updateGlobalChrome();
    trackEvent('coverage_selected', { eventId, serviceKey: 'drone', included: state.eventServices[eventId].drone });
  };

  // STEP 4: ADD-ONS
  function renderStep4Addons() {
    const container = document.getElementById('addons-list-container');
    if (!container) return;

    const totals = calculateQuoteTotals();
    const pw = state.addons.preWedding;
    const hasVideoSelected = state.selectedEvents.some(id => {
      const cfg = state.eventServices[id] || {};
      return (cfg.candidVideo || 0) > 0 || (cfg.tradVideo || 0) > 0;
    });

    const applicableStreamEvents = state.selectedEvents.filter(evId =>
      CONFIG.addonsCatalog.liveStream.applicableEvents.includes(evId)
    );

    let html = `
      <!-- Top Running Total & Discount Indicator -->
      <div style="border:1px solid var(--border-color); background:var(--surface-secondary); padding:16px 20px; margin-bottom:28px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <span class="mono-label" style="display:block; margin-bottom:2px;">RUNNING TOTAL (ESTIMATED)</span>
          <span class="font-serif" style="font-size:26px; font-weight:400; color:var(--text-primary);">${formatCurrency(totals.estimatedTotal)}</span>
        </div>
        ${totals.discountTotal > 0 ? `
          <div class="discount-pill">
            ✓ ${formatCurrency(totals.discountTotal)} TOTAL SAVINGS APPLIED
          </div>
        ` : ''}
      </div>

      <!-- ADD-ON 01: PRE-WEDDING SHOOT -->
      <div class="addon-section-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
          <div>
            <span class="mono-label">ADD-ON 01</span>
            <h3 class="addon-section-title">ADD A PRE-WEDDING SHOOT?</h3>
            <p class="addon-section-desc">Editorial couple portraits in scenic natural landscapes, private estates, or heritage architecture.</p>
          </div>
          <div class="toggle-pill-btn-group">
            <button type="button" class="toggle-pill-btn ${!pw.included ? 'active' : ''}" data-pw-toggle="no" onclick="window.setPreWeddingToggle(false)">NO</button>
            <button type="button" class="toggle-pill-btn ${pw.included ? 'active' : ''}" data-pw-toggle="yes" onclick="window.setPreWeddingToggle(true)">YES</button>
          </div>
        </div>

        ${pw.included ? `
          <div class="progressive-panel">
            <span class="mono-label" style="display:block; margin-bottom:8px;">1. SELECT SERVICE SCOPE:</span>
            <div class="choice-pills-grid" style="margin-bottom:16px;">
              <div class="choice-pill-card ${pw.scope === 'photoOnly' ? 'active' : ''}" data-pw-scope="photoOnly" onclick="window.setPreWeddingScope('photoOnly')">
                <div>
                  <strong style="display:block; font-size:14px; text-transform:uppercase;">PHOTO ONLY</strong>
                  <span style="font-size:12px; color:var(--text-secondary);">Senior Candid Photographer</span>
                </div>
                <div style="margin-top:12px; font-family:var(--font-mono); font-size:13px; font-weight:600;">₹30,000</div>
              </div>

              <div class="choice-pill-card ${pw.scope === 'both' ? 'active' : ''}" data-pw-scope="both" onclick="window.setPreWeddingScope('both')">
                <div>
                  <strong style="display:block; font-size:14px; text-transform:uppercase;">PHOTO + CINEMA FILM</strong>
                  <span style="font-size:12px; color:var(--text-secondary);">Photographer + Cinematographer + Drone</span>
                </div>
                <div style="margin-top:12px; font-family:var(--font-mono); font-size:13px; font-weight:600;">₹55,000</div>
              </div>
            </div>

            <span class="mono-label" style="display:block; margin-bottom:8px;">2. SELECT SHOOT DURATION:</span>
            <div class="choice-pills-grid">
              <div class="choice-pill-card ${pw.duration === 'halfDay' ? 'active' : ''}" data-pw-duration="halfDay" onclick="window.setPreWeddingDuration('halfDay')">
                <div>
                  <strong style="display:block; font-size:14px; text-transform:uppercase;">HALF DAY (4-5 HRS)</strong>
                  <span style="font-size:12px; color:var(--text-secondary);">1-2 Outfits / Single Location</span>
                </div>
                <div style="margin-top:12px; font-family:var(--font-mono); font-size:11px; color:var(--text-secondary);">STANDARD DURATION</div>
              </div>

              <div class="choice-pill-card ${pw.duration === 'fullDay' ? 'active' : ''}" data-pw-duration="fullDay" onclick="window.setPreWeddingDuration('fullDay')">
                <div>
                  <strong style="display:block; font-size:14px; text-transform:uppercase;">FULL DAY (8-10 HRS)</strong>
                  <span style="font-size:12px; color:var(--text-secondary);">3-4 Outfits / Multi-Location / Golden Hour</span>
                </div>
                <div style="margin-top:12px; font-family:var(--font-mono); font-size:13px; font-weight:600;">+ ₹15,000</div>
              </div>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- ADD-ON 02 & 03: FINE ART HEIRLOOM ALBUMS -->
      <div class="addon-section-card">
        <span class="mono-label">ADD-ONS 02 &amp; 03</span>
        <h3 class="addon-section-title">FINE ART HEIRLOOM ALBUMS</h3>
        <p class="addon-section-desc">Archival quality luster books bound with flush-mount binding, handcrafted linen covers, and seamless panoramic spreads.</p>

        <div class="album-item-grid" style="margin-top:16px;">
          <!-- Candid Album -->
          <div class="album-card ${(state.addons.candidAlbum || 0) > 0 ? 'has-qty' : ''}">
            <div class="album-thumb">
              <img src="images/candid_album.jpg" alt="Handcrafted open fine art layflat candid photo album" loading="lazy" />
            </div>
            <div class="album-body">
              <h4 class="album-title">CANDID HEIRLOOM ALBUM</h4>
              <p class="album-desc">${CONFIG.addonsCatalog.candidAlbum.desc}</p>
              <div class="album-footer">
                <div>
                  <span class="mono-label" style="font-size:9px;">UNIT PRICE</span>
                  <div style="font-family:var(--font-mono); font-size:13px; font-weight:600;">${formatCurrency(CONFIG.addonsCatalog.candidAlbum.unitPrice)}</div>
                </div>
                <div class="stepper-wrap">
                  <button type="button" class="stepper-btn" id="candid-album-dec" onclick="window.updateAlbumQty('candidAlbum', -1)">-</button>
                  <span class="stepper-val">${state.addons.candidAlbum || 0}</span>
                  <button type="button" class="stepper-btn" id="candid-album-inc" onclick="window.updateAlbumQty('candidAlbum', 1)">+</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Traditional Album -->
          <div class="album-card ${(state.addons.traditionalAlbum || 0) > 0 ? 'has-qty' : ''}">
            <div class="album-thumb">
              <img src="images/traditional_album.jpg" alt="Hardbound dark leather traditional parent keepsake album" loading="lazy" />
            </div>
            <div class="album-body">
              <h4 class="album-title">TRADITIONAL / PARENT ALBUM</h4>
              <p class="album-desc">${CONFIG.addonsCatalog.traditionalAlbum.desc}</p>
              <div class="album-footer">
                <div>
                  <span class="mono-label" style="font-size:9px;">UNIT PRICE</span>
                  <div style="font-family:var(--font-mono); font-size:13px; font-weight:600;">${formatCurrency(CONFIG.addonsCatalog.traditionalAlbum.unitPrice)}</div>
                </div>
                <div class="stepper-wrap">
                  <button type="button" class="stepper-btn" id="trad-album-dec" onclick="window.updateAlbumQty('traditionalAlbum', -1)">-</button>
                  <span class="stepper-val">${state.addons.traditionalAlbum || 0}</span>
                  <button type="button" class="stepper-btn" id="trad-album-inc" onclick="window.updateAlbumQty('traditionalAlbum', 1)">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ADD-ON 04: LIVE STREAMING -->
      <div class="addon-section-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
          <div>
            <span class="mono-label">ADD-ON 04</span>
            <h3 class="addon-section-title">MULTI-CAM LIVE STREAMING (HD)</h3>
            <p class="addon-section-desc">Broadcast your wedding ceremonies in real-time to overseas relatives via private YouTube / Zoom high-bitrate streaming.</p>
          </div>
          <div class="toggle-pill-btn-group">
            <button type="button" class="toggle-pill-btn ${!state.addons.liveStreaming.included ? 'active' : ''}" onclick="window.setLiveStreamToggle(false)">NO</button>
            <button type="button" class="toggle-pill-btn ${state.addons.liveStreaming.included ? 'active' : ''}" id="stream-toggle-yes" onclick="window.setLiveStreamToggle(true)">YES</button>
          </div>
        </div>

        ${state.addons.liveStreaming.included ? `
          <div class="progressive-panel">
            <span class="mono-label" style="display:block; margin-bottom:8px;">SELECT CELEBRATIONS TO BROADCAST (${formatCurrency(CONFIG.addonsCatalog.liveStream.unitPricePerEvent)} / Event):</span>
            ${applicableStreamEvents.length > 0 ? `
              <div class="choice-pills-grid">
                ${applicableStreamEvents.map(evId => {
                  const ev = CONFIG.events.find(e => e.id === evId) || { name: evId };
                  const isChecked = state.addons.liveStreaming.events.includes(evId);
                  return `
                    <div class="choice-pill-card ${isChecked ? 'active' : ''}" data-stream-event="${evId}" onclick="window.toggleLiveStreamEvent('${evId}')">
                      <div class="card-image-wrap">
                        <img src="images/livestream_setup.jpg" alt="Broadcast camera and stream monitor setup" class="img-contain" loading="lazy" />
                      </div>
                      <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="font-size:14px; text-transform:uppercase;">${ev.name}</strong>
                        <span>${isChecked ? '✓' : '+'}</span>
                      </div>
                      <div style="margin-top:8px; font-family:var(--font-mono); font-size:12px; color:var(--text-secondary);">${isChecked ? 'BROADCAST SELECTED' : 'CLICK TO ADD'}</div>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : `
              <p style="font-size:13px; color:var(--text-secondary);">None of your currently selected events support live streaming. Applicable events: Engagement, Reception, Sangeet, Wedding.</p>
            `}
          </div>
        ` : ''}
      </div>

      <!-- ADD-ON 05: WEDDING FILM STYLE -->
      ${hasVideoSelected ? `
        <div class="addon-section-card">
          <span class="mono-label">ADD-ON 05</span>
          <h3 class="addon-section-title">WEDDING FILM EDITORIAL DIRECTION</h3>
          <p class="addon-section-desc">Choose the narrative editing treatment for your wedding cinema deliverables.</p>

          <div class="choice-pills-grid" style="margin-top:16px;">
            <div class="choice-pill-card ${state.addons.filmStyle === 'cinematic' ? 'active' : ''}" data-film-style="cinematic" onclick="window.setFilmStyle('cinematic')">
              <div class="card-image-wrap">
                <img src="images/cinema_camera.jpg" alt="Professional 4K cinema camera representing cinematic feature film style" class="img-contain" loading="lazy" />
              </div>
              <div>
                <strong style="display:block; font-size:14px; text-transform:uppercase;">CINEMATIC FEATURE</strong>
                <span style="font-size:12px; color:var(--text-secondary);">3-5 min Teaser + 15-20 min Story Film</span>
              </div>
              <div style="margin-top:12px; font-family:var(--font-mono); font-size:11px; color:var(--text-secondary);">INCLUDED IN VIDEO</div>
            </div>

            <div class="choice-pill-card ${state.addons.filmStyle === 'documentary' ? 'active' : ''}" data-film-style="documentary" onclick="window.setFilmStyle('documentary')">
              <div class="card-image-wrap">
                <img src="images/broadcast_camcorder.jpg" alt="Broadcast HD camcorder representing documentary extended film style" class="img-contain" loading="lazy" />
              </div>
              <div>
                <strong style="display:block; font-size:14px; text-transform:uppercase;">DOCUMENTARY EXTENDED</strong>
                <span style="font-size:12px; color:var(--text-secondary);">Complete uninterrupted ceremony documentation</span>
              </div>
              <div style="margin-top:12px; font-family:var(--font-mono); font-size:11px; color:var(--text-secondary);">INCLUDED IN VIDEO</div>
            </div>

            <div class="choice-pill-card ${state.addons.filmStyle === 'hybrid' ? 'active' : ''}" data-film-style="hybrid" onclick="window.setFilmStyle('hybrid')">
              <div class="card-image-wrap">
                <img src="images/cinema_camera.jpg" alt="Cinema camera rig representing hybrid director cut" class="img-contain" loading="lazy" />
              </div>
              <div>
                <strong style="display:block; font-size:14px; text-transform:uppercase;">HYBRID DIRECTOR'S CUT</strong>
                <span style="font-size:12px; color:var(--text-secondary);">Cinema Trailer + Chaptered Ceremonies</span>
              </div>
              <div style="margin-top:12px; font-family:var(--font-mono); font-size:13px; font-weight:600;">+ ₹10,000</div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- ADD-ON 06: DELIVERY TIMELINE -->
      <div class="addon-section-card">
        <span class="mono-label">ADD-ON 06</span>
        <h3 class="addon-section-title">POST-PRODUCTION DELIVERY TIMELINE</h3>
        <p class="addon-section-desc">Select standard color grading queue or fast-track priority turnaround.</p>

        <div class="choice-pills-grid" style="margin-top:16px;">
          <div class="choice-pill-card ${state.addons.delivery === 'standard' ? 'active' : ''}" data-delivery-option="standard" onclick="window.setDeliveryOption('standard')">
            <div class="card-image-wrap">
              <img src="images/candid_camera.jpg" alt="Standard editorial delivery workflow" class="img-contain" loading="lazy" />
            </div>
            <div>
              <strong style="display:block; font-size:14px; text-transform:uppercase;">STANDARD EDITORIAL</strong>
              <span style="font-size:12px; color:var(--text-secondary);">60-90 Business Days Thorough Master Grade</span>
            </div>
            <div style="margin-top:12px; font-family:var(--font-mono); font-size:11px; color:var(--text-secondary);">STANDARD SCHEDULE</div>
          </div>

          <div class="choice-pill-card ${state.addons.delivery === 'fastTrack' ? 'active' : ''}" data-delivery-option="fastTrack" onclick="window.setDeliveryOption('fastTrack')">
            <div class="card-image-wrap">
              <img src="images/cinema_camera.jpg" alt="Fast-track priority 21-day turnaround delivery" class="img-contain" loading="lazy" />
            </div>
            <div>
              <strong style="display:block; font-size:14px; text-transform:uppercase;">FAST-TRACK PRIORITY (21 DAYS)</strong>
              <span style="font-size:12px; color:var(--text-secondary);">Dedicated Senior Editor + 48hr Social Teaser</span>
            </div>
            <div style="margin-top:12px; font-family:var(--font-mono); font-size:13px; font-weight:600;">+ ₹25,000</div>
          </div>
        </div>
      </div>

      <!-- ADD-ON 08: EXTRA CREW & EXTENDED OVERTIME -->
      <div class="addon-section-card">
        <span class="mono-label">ADD-ON 08</span>
        <h3 class="addon-section-title">EXTRA CREW MEMBERS &amp; EXTENDED HOURS</h3>
        <p class="addon-section-desc">Scale up your photography team for massive guest lists (>1,000 guests) or extended late-night rituals.</p>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-top:16px;">
          <!-- Extra Photo -->
          <div style="border:1px solid var(--border-color); padding:16px; background:var(--bg);">
            <div class="card-image-wrap">
              <img src="images/candid_camera.jpg" alt="Professional camera equipment representing associate photographer" class="img-contain" loading="lazy" />
            </div>
            <div style="font-size:13px; font-weight:600; margin-bottom:4px;">EXTRA PHOTOGRAPHER</div>
            <div style="font-family:var(--font-mono); font-size:12px; color:var(--text-secondary); margin-bottom:12px;">₹15,000 / Crew Member</div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="mono-label" style="font-size:10px;">QUANTITY:</span>
              <div class="stepper-wrap">
                <button type="button" class="stepper-btn" id="extra-photo-dec" onclick="window.updateExtraCrewQty('extraPhoto', -1)">-</button>
                <span class="stepper-val">${state.addons.extraCrew?.extraPhoto || 0}</span>
                <button type="button" class="stepper-btn" id="extra-photo-inc" onclick="window.updateExtraCrewQty('extraPhoto', 1)">+</button>
              </div>
            </div>
          </div>

          <!-- Extra Video -->
          <div style="border:1px solid var(--border-color); padding:16px; background:var(--bg);">
            <div class="card-image-wrap">
              <img src="images/cinema_camera.jpg" alt="Cinema camera equipment representing associate videographer" class="img-contain" loading="lazy" />
            </div>
            <div style="font-size:13px; font-weight:600; margin-bottom:4px;">EXTRA VIDEOGRAPHER</div>
            <div style="font-family:var(--font-mono); font-size:12px; color:var(--text-secondary); margin-bottom:12px;">₹18,000 / Crew Member</div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="mono-label" style="font-size:10px;">QUANTITY:</span>
              <div class="stepper-wrap">
                <button type="button" class="stepper-btn" id="extra-video-dec" onclick="window.updateExtraCrewQty('extraVideo', -1)">-</button>
                <span class="stepper-val">${state.addons.extraCrew?.extraVideo || 0}</span>
                <button type="button" class="stepper-btn" id="extra-video-inc" onclick="window.updateExtraCrewQty('extraVideo', 1)">+</button>
              </div>
            </div>
          </div>

          <!-- Extra Hours -->
          <div style="border:1px solid var(--border-color); padding:16px; background:var(--bg);">
            <div class="card-image-wrap">
              <img src="images/traditional_camera.jpg" alt="DSLR camera representing overtime coverage" class="img-contain" loading="lazy" />
            </div>
            <div style="font-size:13px; font-weight:600; margin-bottom:4px;">OVERTIME COVERAGE</div>
            <div style="font-family:var(--font-mono); font-size:12px; color:var(--text-secondary); margin-bottom:12px;">₹5,000 / Hour</div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="mono-label" style="font-size:10px;">HOURS:</span>
              <div class="stepper-wrap">
                <button type="button" class="stepper-btn" id="extra-hours-dec" onclick="window.updateExtraCrewQty('extraHours', -1)">-</button>
                <span class="stepper-val">${state.addons.extraCrew?.extraHours || 0}</span>
                <button type="button" class="stepper-btn" id="extra-hours-inc" onclick="window.updateExtraCrewQty('extraHours', 1)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MASTER DRIVE & SAME-DAY REELS -->
      <div class="addon-section-card">
        <span class="mono-label">DIGITAL DELIVERABLES</span>
        <h3 class="addon-section-title">MASTER STORAGE &amp; SOCIAL STORIES</h3>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-top:16px;">
          <div class="choice-pill-card ${state.addons.rawDrive ? 'active' : ''}" id="toggle-raw-drive" onclick="window.toggleMasterRawDrive()">
            <div class="card-image-wrap">
              <img src="images/master_ssd.jpg" alt="SanDisk Extreme rugged 2TB portable SSD hard drive" class="img-contain" loading="lazy" />
            </div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <strong style="display:block; font-size:14px; text-transform:uppercase;">2TB RUGGED MASTER SSD</strong>
                <span style="font-size:12px; color:var(--text-secondary);">Raw archival footage &amp; hi-res TIFF master</span>
              </div>
              <span>${state.addons.rawDrive ? '✓' : '+'}</span>
            </div>
            <div style="margin-top:12px; font-family:var(--font-mono); font-size:13px; font-weight:600;">${formatCurrency(CONFIG.addonsCatalog.rawMasterDrive.price)}</div>
          </div>

          <div class="choice-pill-card ${state.addons.sameDayReels ? 'active' : ''}" id="toggle-same-day-reel" onclick="window.toggleSameDayReels()">
            <div class="card-image-wrap">
              <img src="images/cinema_camera.jpg" alt="Cinema video camera setup for same-day social media reels" class="img-contain" loading="lazy" />
            </div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <strong style="display:block; font-size:14px; text-transform:uppercase;">3 SAME-DAY REELS PACKAGE</strong>
                <span style="font-size:12px; color:var(--text-secondary);">Delivered within 6 hours of the ceremony</span>
              </div>
              <span>${state.addons.sameDayReels ? '✓' : '+'}</span>
            </div>
            <div style="margin-top:12px; font-family:var(--font-mono); font-size:13px; font-weight:600;">${formatCurrency(CONFIG.addonsCatalog.sameDayReels.price)}</div>
          </div>
        </div>
      </div>

      <!-- PROMO CODE BOX -->
      <div class="addon-section-card">
        <span class="mono-label">STUDIO PRIVILEGES</span>
        <h3 class="addon-section-title">HAVE A PROMOTIONAL CODE?</h3>
        <p class="addon-section-desc">Enter a studio VIP code or seasonal privilege code to apply exclusive credits.</p>

        <div class="promo-input-group">
          <input type="text" id="promo-code-input" class="promo-input" placeholder="ENTER CODE (e.g. SUMANTH2026)" value="${state.promoCode || ''}" />
          <button type="button" class="promo-btn" id="apply-promo-btn" onclick="window.applyPromoCode()">APPLY CODE</button>
        </div>

        ${state.promoCode && CONFIG.discounts.promoCodes[state.promoCode] ? `
          <div style="margin-top:12px; display:flex; align-items:center; gap:8px;">
            <span class="discount-pill">✓ COUPON APPLIED: ${state.promoCode} (${CONFIG.discounts.promoCodes[state.promoCode].label})</span>
            <a href="javascript:void(0)" onclick="window.removePromoCode()" style="font-family:var(--font-mono); font-size:11px; color:var(--text-primary); text-decoration:underline;">REMOVE</a>
          </div>
        ` : ''}
      </div>
    `;

    container.innerHTML = html;
  }

  window.setPreWeddingToggle = function (val) {
    state.addons.preWedding.included = val;
    saveState();
    renderStep4Addons();
    updateGlobalChrome();
    trackEvent('addon_selected', { addon: 'preWedding', included: val });
  };

  window.setPreWeddingScope = function (scope) {
    state.addons.preWedding.scope = scope;
    saveState();
    renderStep4Addons();
    updateGlobalChrome();
  };

  window.setPreWeddingDuration = function (dur) {
    state.addons.preWedding.duration = dur;
    saveState();
    renderStep4Addons();
    updateGlobalChrome();
  };

  window.updateAlbumQty = function (key, delta) {
    const curr = state.addons[key] || 0;
    state.addons[key] = Math.max(0, Math.min(5, curr + delta));
    saveState();
    renderStep4Addons();
    updateGlobalChrome();
    trackEvent('addon_selected', { addon: key, quantity: state.addons[key] });
  };

  window.setLiveStreamToggle = function (val) {
    state.addons.liveStreaming.included = val;
    if (val && state.addons.liveStreaming.events.length === 0) {
      const applicable = state.selectedEvents.filter(evId => CONFIG.addonsCatalog.liveStream.applicableEvents.includes(evId));
      if (applicable.length > 0) state.addons.liveStreaming.events = [applicable[0]];
    }
    saveState();
    renderStep4Addons();
    updateGlobalChrome();
    trackEvent('addon_selected', { addon: 'liveStreaming', included: val });
  };

  window.toggleLiveStreamEvent = function (evId) {
    const list = state.addons.liveStreaming.events;
    if (list.includes(evId)) {
      state.addons.liveStreaming.events = list.filter(id => id !== evId);
    } else {
      state.addons.liveStreaming.events.push(evId);
    }
    saveState();
    renderStep4Addons();
    updateGlobalChrome();
  };

  window.setFilmStyle = function (style) {
    state.addons.filmStyle = style;
    saveState();
    renderStep4Addons();
    updateGlobalChrome();
  };

  window.setDeliveryOption = function (opt) {
    state.addons.delivery = opt;
    saveState();
    renderStep4Addons();
    updateGlobalChrome();
  };

  window.updateExtraCrewQty = function (key, delta) {
    if (!state.addons.extraCrew) state.addons.extraCrew = {};
    const curr = state.addons.extraCrew[key] || 0;
    state.addons.extraCrew[key] = Math.max(0, Math.min(10, curr + delta));
    saveState();
    renderStep4Addons();
    updateGlobalChrome();
  };

  window.toggleMasterRawDrive = function () {
    state.addons.rawDrive = !state.addons.rawDrive;
    saveState();
    renderStep4Addons();
    updateGlobalChrome();
  };

  window.toggleSameDayReels = function () {
    state.addons.sameDayReels = !state.addons.sameDayReels;
    saveState();
    renderStep4Addons();
    updateGlobalChrome();
  };

  window.applyPromoCode = function () {
    const inp = document.getElementById('promo-code-input');
    if (!inp) return;
    const code = inp.value.trim().toUpperCase();
    if (!code) return;

    if (CONFIG.discounts.promoCodes[code]) {
      state.promoCode = code;
      saveState();
      renderStep4Addons();
      updateGlobalChrome();
      trackEvent('addon_selected', { promoCode: code });
    } else {
      alert(`The promo code "${code}" is invalid or expired.`);
    }
  };

  window.removePromoCode = function () {
    state.promoCode = '';
    saveState();
    renderStep4Addons();
    updateGlobalChrome();
  };

  // -------------------------------------------------------------
  // STEP 5: CUSTOMER DETAILS (FORM UX & VALIDATION)
  // -------------------------------------------------------------
  function hydrateCustomerDetailsForm() {
    const cust = state.customerDetails || {};
    const nameInp = document.getElementById('cust-fullName');
    const phoneInp = document.getElementById('cust-phone');
    const emailInp = document.getElementById('cust-email');
    const dateInp = document.getElementById('cust-date');
    const venueInp = document.getElementById('cust-venue');
    const cityInp = document.getElementById('cust-city');
    const notesInp = document.getElementById('cust-notes');
    const termsInp = document.getElementById('cust-terms');

    if (nameInp) nameInp.value = cust.fullName || '';
    if (phoneInp) phoneInp.value = cust.phone || '';
    if (emailInp) emailInp.value = cust.email || '';
    if (dateInp) dateInp.value = cust.date || '';
    if (venueInp) venueInp.value = cust.venue || '';
    if (cityInp) cityInp.value = cust.city || 'Hyderabad';
    if (notesInp) notesInp.value = cust.notes || '';
    if (termsInp) termsInp.checked = cust.termsAccepted === true;
  }

  function validateCustomerDetails() {
    let isValid = true;
    let firstInvalidElem = null;

    const nameInp = document.getElementById('cust-fullName');
    const phoneInp = document.getElementById('cust-phone');
    const emailInp = document.getElementById('cust-email');
    const dateInp = document.getElementById('cust-date');
    const venueInp = document.getElementById('cust-venue');
    const cityInp = document.getElementById('cust-city');
    const notesInp = document.getElementById('cust-notes');
    const termsInp = document.getElementById('cust-terms');
    const termsContainer = document.getElementById('terms-container');

    // 1. Name validation
    const nameVal = nameInp?.value.trim() || '';
    if (nameVal.length < 2) {
      setFieldError('cust-fullName', true);
      isValid = false;
      if (!firstInvalidElem) firstInvalidElem = nameInp;
    } else {
      setFieldError('cust-fullName', false);
    }

    // 2. Phone validation (at least 10 digits)
    const phoneVal = phoneInp?.value.replace(/\D/g, '') || '';
    if (phoneVal.length < 10) {
      setFieldError('cust-phone', true);
      isValid = false;
      if (!firstInvalidElem) firstInvalidElem = phoneInp;
    } else {
      setFieldError('cust-phone', false);
    }

    // 3. Email validation
    const emailVal = emailInp?.value.trim() || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      setFieldError('cust-email', true);
      isValid = false;
      if (!firstInvalidElem) firstInvalidElem = emailInp;
    } else {
      setFieldError('cust-email', false);
    }

    // 4. Date validation
    const dateVal = dateInp?.value.trim() || '';
    if (!dateVal) {
      setFieldError('cust-date', true);
      isValid = false;
      if (!firstInvalidElem) firstInvalidElem = dateInp;
    } else {
      setFieldError('cust-date', false);
    }

    // 5. Venue validation
    const venueVal = venueInp?.value.trim() || '';
    if (venueVal.length < 2) {
      setFieldError('cust-venue', true);
      isValid = false;
      if (!firstInvalidElem) firstInvalidElem = venueInp;
    } else {
      setFieldError('cust-venue', false);
    }

    // 6. Terms validation
    const termsChecked = termsInp?.checked === true;
    if (!termsChecked) {
      const errTerms = document.getElementById('err-cust-terms');
      if (errTerms) errTerms.classList.add('visible');
      if (termsContainer) termsContainer.classList.add('is-invalid');
      isValid = false;
      if (!firstInvalidElem) firstInvalidElem = termsInp;
    } else {
      const errTerms = document.getElementById('err-cust-terms');
      if (errTerms) errTerms.classList.remove('visible');
      if (termsContainer) termsContainer.classList.remove('is-invalid');
    }

    // Sync values to state
    state.customerDetails = {
      fullName: nameVal,
      phone: phoneInp?.value.trim() || '',
      email: emailVal,
      date: dateVal,
      venue: venueVal,
      city: cityInp?.value.trim() || 'Hyderabad',
      notes: notesInp?.value.trim() || '',
      termsAccepted: termsChecked
    };
    saveState();

    if (!isValid && firstInvalidElem) {
      firstInvalidElem.focus();
      firstInvalidElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
  }

  function setFieldError(fieldId, isError) {
    const input = document.getElementById(fieldId);
    const err = document.getElementById(`err-${fieldId}`);
    if (input) {
      input.classList.toggle('is-invalid', isError);
      input.setAttribute('aria-invalid', isError ? 'true' : 'false');
    }
    if (err) {
      err.classList.toggle('visible', isError);
    }
  }

  // -------------------------------------------------------------
  // STEP 6: SCREEN 02 — FINAL EXACT QUOTE REVIEW
  // -------------------------------------------------------------
  function renderStep6Review() {
    const totals = calculateQuoteTotals();
    const cust = state.customerDetails || {};

    // 01. Client Details Review
    const clientBox = document.getElementById('review-client-details-list');
    if (clientBox) {
      clientBox.innerHTML = `
        <div class="review-line-item">
          <div>
            <span class="review-item-name">${cust.fullName || '—'}</span>
            <span class="review-item-meta">${cust.phone} &bull; ${cust.email}</span>
          </div>
          <div class="review-item-price">CLIENT SPECIFICATION</div>
        </div>
        <div class="review-line-item">
          <div>
            <span class="review-item-name">${cust.venue || 'Main Venue'}</span>
            <span class="review-item-meta">Celebration Date: <strong>${cust.date || 'TBD'}</strong> &bull; Location: <strong>${cust.city || 'Hyderabad'}</strong></span>
            ${cust.notes ? `<div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">Special Notes: "${cust.notes}"</div>` : ''}
          </div>
          <div class="review-item-price">DATE &amp; VENUE</div>
        </div>
      `;
    }

    // 02. Photography Style Review
    const styleBox = document.getElementById('review-style-list');
    if (styleBox) {
      const currentStyle = CONFIG.styles.find(s => s.id === state.photographyStyle) || CONFIG.styles[2];
      styleBox.innerHTML = `
        <div class="review-line-item">
          <div>
            <span class="review-item-name">${currentStyle.title}</span>
            <span class="review-item-meta">${currentStyle.tagline} &bull; ${currentStyle.description}</span>
          </div>
          <div class="review-item-price">SELECTED</div>
        </div>
      `;
    }

    // 03. Events & Coverage Breakdown Review
    const eventsBox = document.getElementById('review-events-list');
    if (eventsBox) {
      const eventItems = totals.lineItems.filter(item => item.category === 'EVENT_SERVICE');
      if (eventItems.length > 0) {
        eventsBox.innerHTML = eventItems.map(item => `
          <div class="review-line-item">
            <div>
              <span class="review-item-name">${item.name}</span>
              <span class="review-item-meta">${item.quantity} Senior Lead &times; ${formatCurrency(item.unitPrice)}</span>
            </div>
            <div class="review-item-price">${formatCurrency(item.total)}</div>
          </div>
        `).join('');
      } else {
        eventsBox.innerHTML = `<div class="review-line-item"><span class="review-item-name">No event services selected</span></div>`;
      }
    }

    // 04. Add-ons & Deliverables Review
    const addonsBox = document.getElementById('review-addons-list');
    if (addonsBox) {
      const addonItems = totals.lineItems.filter(item => item.category === 'ADDON');
      if (addonItems.length > 0) {
        addonsBox.innerHTML = addonItems.map(item => `
          <div class="review-line-item">
            <div>
              <span class="review-item-name">${item.name}</span>
              <span class="review-item-meta">${item.quantity > 1 ? `${item.quantity} &times; ${formatCurrency(item.unitPrice)}` : 'Bespoke Curated Deliverable'}</span>
            </div>
            <div class="review-item-price">${formatCurrency(item.total)}</div>
          </div>
        `).join('');
      } else {
        addonsBox.innerHTML = `<div class="review-line-item" style="color:var(--text-secondary); font-size:13px;">No optional physical add-ons selected.</div>`;
      }
    }

    // 05. Digital Outputs & Post-Production
    const outputsBox = document.getElementById('review-outputs-list');
    if (outputsBox) {
      const outputItems = totals.lineItems.filter(item => item.category === 'OUTPUT');
      let html = '';
      if (outputItems.length > 0) {
        html += outputItems.map(item => `
          <div class="review-line-item">
            <div>
              <span class="review-item-name">${item.name}</span>
              <span class="review-item-meta">Digital Master Asset</span>
            </div>
            <div class="review-item-price">${formatCurrency(item.total)}</div>
          </div>
        `).join('');
      }
      // Add default included items if standard
      if (state.addons.delivery === 'standard') {
        html += `
          <div class="review-line-item">
            <div>
              <span class="review-item-name">Standard Post-Production Editorial Queue</span>
              <span class="review-item-meta">60–90 Business Days color grading &amp; private cloud gallery</span>
            </div>
            <div class="review-item-price">INCLUDED</div>
          </div>
        `;
      }
      outputsBox.innerHTML = html;
    }

    // 06. Studio Privileges & Discounts
    const discountCard = document.getElementById('review-discounts-card');
    const discountsBox = document.getElementById('review-discounts-list');
    if (discountCard && discountsBox) {
      if (totals.appliedDiscounts.length > 0) {
        discountCard.style.display = 'block';
        discountsBox.innerHTML = totals.appliedDiscounts.map(d => `
          <div class="review-line-item">
            <div>
              <span class="review-item-name">${d.name}</span>
              <span class="review-item-meta">Special Privilege Credit Applied</span>
            </div>
            <div class="review-item-price">- ${formatCurrency(d.amount)}</div>
          </div>
        `).join('');
      } else {
        discountCard.style.display = 'none';
      }
    }

    // Grand Total Banner
    const totalVal = document.getElementById('review-total-val');
    if (totalVal) totalVal.textContent = formatCurrency(totals.estimatedTotal);

    const savingsMsg = document.getElementById('review-savings-msg');
    if (savingsMsg) {
      if (totals.discountTotal > 0) {
        savingsMsg.style.display = 'block';
        savingsMsg.textContent = `✓ Total Privilege Savings: ${formatCurrency(totals.discountTotal)}`;
      } else {
        savingsMsg.style.display = 'none';
      }
    }

    trackEvent('quote_reviewed', {
      quoteSubtotal: totals.rawSubtotal,
      discountTotal: totals.discountTotal,
      estimatedTotal: totals.estimatedTotal
    });
  }

  // -------------------------------------------------------------
  // SUBMISSION LOGIC & DOUBLE-SUBMIT PREVENTION
  // -------------------------------------------------------------
  window.handleFinalSubmitClick = async function () {
    if (state.isSubmitting) return;

    const totals = calculateQuoteTotals();
    const cust = state.customerDetails || {};

    // Validate state integrity
    if (!cust.fullName || !cust.phone || !cust.email || !cust.date || !cust.venue || !cust.termsAccepted) {
      window.goToQuoteStep(5);
      validateCustomerDetails();
      return;
    }

    state.isSubmitting = true;
    const submitBtn = document.getElementById('btn-final-submit-quote');
    const submitText = document.getElementById('submit-btn-text');
    const errorBox = document.getElementById('submission-error-box');

    if (errorBox) errorBox.classList.remove('visible');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
    }
    if (submitText) {
      submitText.textContent = 'SUBMITTING ENQUIRY...';
    }

    // Generate unique ID in SQ-2026-XXXX format
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const quoteId = `SQ-2026-${randomSuffix}`;
    state.generatedQuoteId = quoteId;

    const payload = {
      quoteId: quoteId,
      timestamp: new Date().toISOString(),
      customerDetails: { ...cust },
      photographyStyle: state.photographyStyle,
      selectedEvents: state.selectedEvents,
      eventServices: state.eventServices,
      addons: state.addons,
      promoCode: state.promoCode,
      lineItems: totals.lineItems,
      addonsSelected: totals.lineItems.filter(i => i.category === 'ADDON' || i.category === 'OUTPUT'),
      preferences: {
        film_style: state.addons.filmStyle,
        delivery_preference: state.addons.delivery,
        streaming_preference: state.addons.liveStreaming?.included ? state.addons.liveStreaming.events?.join(', ') : 'none',
        raw_drive: Boolean(state.addons.rawDrive),
        reels_package: Boolean(state.addons.sameDayReels),
        notes: cust.notes || ''
      },
      eventSubtotal: totals.eventSubtotal,
      addonSubtotal: totals.addonSubtotal,
      rawSubtotal: totals.rawSubtotal,
      discountTotal: totals.discountTotal,
      estimatedTotal: totals.estimatedTotal,
      termsAccepted: true
    };

    try {
      // 1. Submit to Supabase / Backend Data Layer
      if (window.SumanthDB && typeof window.SumanthDB.submitQuoteSubmission === 'function') {
        await window.SumanthDB.submitQuoteSubmission(payload);
      }

      // 2. Save to active local history archive for immediate offline access
      const historyKey = 'sumanth_quotes_history';
      const existing = JSON.parse(localStorage.getItem(historyKey) || '[]');
      existing.unshift(payload);
      localStorage.setItem(historyKey, JSON.stringify(existing.slice(0, 20)));
      localStorage.setItem('sumanth_latest_quote', JSON.stringify(payload));

      state.isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
      if (submitText) {
        submitText.textContent = 'REQUEST MY QUOTE →';
      }

      saveState();
      trackEvent('quote_submitted', { quoteId: quoteId, total: totals.estimatedTotal });
      window.goToQuoteStep(7);
    } catch (err) {
      console.error('Quote submission error:', err);
      state.isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
      if (submitText) {
        submitText.textContent = 'REQUEST MY QUOTE →';
      }
      if (errorBox) {
        errorBox.classList.add('visible');
        const errDesc = errorBox.querySelector('p');
        if (errDesc) {
          errDesc.textContent = err.message || 'Unable to store your quote submission. Please verify your connection.';
        }
      }
      trackEvent('quote_submission_failed', { error: err.message });
    }
  };

  window.retrySubmitQuote = function () {
    const errorBox = document.getElementById('submission-error-box');
    if (errorBox) errorBox.classList.remove('visible');
    window.handleFinalSubmitClick();
  };

  // -------------------------------------------------------------
  // STEP 7: SCREEN 03 — CONFIRMATION & WHATSAPP GENERATION
  // -------------------------------------------------------------
  function renderStep7Confirmation() {
    const cust = state.customerDetails || {};
    const totals = calculateQuoteTotals();
    const quoteId = state.generatedQuoteId || `SQ-2026-9042`;

    const refElem = document.getElementById('confirm-ref-id');
    if (refElem) refElem.textContent = quoteId;

    const summaryBox = document.getElementById('confirm-summary-box');
    if (summaryBox) {
      summaryBox.innerHTML = `
        <div style="font-family:var(--font-serif); font-size:18px; margin-bottom:12px; text-transform:uppercase;">
          ${cust.fullName} &bull; ${cust.venue} (${cust.city})
        </div>
        <div style="font-family:var(--font-mono); font-size:11px; color:var(--text-secondary); line-height:1.7; margin-bottom:16px;">
          &bull; Wedding Date: <strong>${cust.date}</strong><br />
          &bull; Celebrations: <strong>${state.selectedEvents.map(e => (CONFIG.events.find(x => x.id === e)?.name || e).split('/')[0]).join(', ')}</strong><br />
          &bull; Estimated Investment: <strong style="color:var(--text-primary); font-size:13px;">${formatCurrency(totals.estimatedTotal)}</strong>
        </div>
        <p style="font-size:12px; color:var(--text-secondary); line-height:1.5;">
          Our creative director will reach out within 24 hours to verify date availability and answer any creative questions.
        </p>
      `;
    }

    // Build verified WhatsApp deep link
    const waBtn = document.getElementById('confirm-whatsapp-btn');
    if (waBtn) {
      const waText = [
        `Hello Sumanth Photography! ✨`,
        `I have created a custom wedding quote on your website.`,
        ``,
        `📋 *Reference ID:* ${quoteId}`,
        `👤 *Client Name:* ${cust.fullName}`,
        `📅 *Celebration Date:* ${cust.date}`,
        `📍 *Venue & City:* ${cust.venue}, ${cust.city}`,
        `🎉 *Selected Celebrations:* ${state.selectedEvents.map(e => CONFIG.events.find(x => x.id === e)?.name || e).join(', ')}`,
        `💎 *Estimated Quote:* ${formatCurrency(totals.estimatedTotal)}`,
        ``,
        `Please let me know your availability for our dates.`
      ].join('\n');

      waBtn.href = `https://wa.me/${CONFIG.whatsappCleanNumber}?text=${encodeURIComponent(waText)}`;
    }

    // Accessibility: focus heading
    const heading = document.getElementById('confirm-step-heading');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    }
  }

  // -------------------------------------------------------------
  // MASTER NAVIGATION DISPATCHER
  // -------------------------------------------------------------
  window.goToQuoteStep = function (stepIndex) {
    const previousStep = typeof state.currentStep === 'number' ? state.currentStep : 0;

    // If attempting to advance from Step 5 -> Step 6, validate customer details first
    if (state.currentStep === 5 && stepIndex === 6) {
      const isValid = validateCustomerDetails();
      if (!isValid) return;
    }

    state.currentStep = stepIndex;
    saveState();

    const isForward = stepIndex >= previousStep;
    const enterClass = isForward ? 'step-enter-left' : 'step-enter-right';

    document.querySelectorAll('.wizard-step-panel').forEach(panel => {
      const step = parseInt(panel.getAttribute('data-step'), 10);
      if (step === stepIndex) {
        panel.classList.remove('step-enter-left', 'step-enter-right');
        panel.classList.add(enterClass);
        panel.classList.add('active');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            panel.classList.remove('step-enter-left', 'step-enter-right');
          });
        });
      } else {
        panel.classList.remove('active', 'step-enter-left', 'step-enter-right');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (stepIndex === 0) {
      trackEvent('quote_started');
    } else if (stepIndex === 1) {
      renderStep1Style();
    } else if (stepIndex === 2) {
      renderStep2Events();
    } else if (stepIndex === 3) {
      renderStep3Coverage();
    } else if (stepIndex === 4) {
      renderStep4Addons();
    } else if (stepIndex === 5) {
      hydrateCustomerDetailsForm();
    } else if (stepIndex === 6) {
      renderStep6Review();
    } else if (stepIndex === 7) {
      renderStep7Confirmation();
    }

    updateGlobalChrome();
  };

  // -------------------------------------------------------------
  // EVENT LISTENERS & INITIALIZATION
  // -------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    // Top logo click
    const logo = document.querySelector('.logo');
    if (logo) {
      logo.addEventListener('click', e => {
        if (state.currentStep > 0) {
          e.preventDefault();
          window.goToQuoteStep(0);
        }
      });
    }

    // Bottom Navigation Handlers
    const continueBtn = document.getElementById('btn-wizard-continue');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        if (state.currentStep === 0) {
          window.goToQuoteStep(1);
        } else if (state.currentStep === 1) {
          window.goToQuoteStep(2);
        } else if (state.currentStep === 2) {
          window.goToQuoteStep(3);
        } else if (state.currentStep === 3) {
          if (state.activeCoverageEventIndex < state.selectedEvents.length - 1) {
            state.activeCoverageEventIndex++;
            saveState();
            renderStep3Coverage();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            window.goToQuoteStep(4);
          }
        } else if (state.currentStep === 4) {
          window.goToQuoteStep(5);
        } else if (state.currentStep === 5) {
          const isValid = validateCustomerDetails();
          if (isValid) window.goToQuoteStep(6);
        } else if (state.currentStep === 6) {
          window.handleFinalSubmitClick();
        }
      });
    }

    const backBtn = document.getElementById('btn-wizard-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (state.currentStep === 3 && state.activeCoverageEventIndex > 0) {
          state.activeCoverageEventIndex--;
          saveState();
          renderStep3Coverage();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (state.currentStep > 0) {
          window.goToQuoteStep(state.currentStep - 1);
        }
      });
    }

    // Step 3 Event Next/Prev Buttons
    const covPrevBtn = document.getElementById('cov-prev-event-btn');
    if (covPrevBtn) {
      covPrevBtn.addEventListener('click', () => {
        if (state.activeCoverageEventIndex > 0) {
          state.activeCoverageEventIndex--;
          saveState();
          renderStep3Coverage();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    const covNextBtn = document.getElementById('cov-next-event-btn');
    if (covNextBtn) {
      covNextBtn.addEventListener('click', () => {
        if (state.activeCoverageEventIndex < state.selectedEvents.length - 1) {
          state.activeCoverageEventIndex++;
          saveState();
          renderStep3Coverage();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.goToQuoteStep(4);
        }
      });
    }

    // Step 5 Form Submit
    const custForm = document.getElementById('customer-details-form');
    if (custForm) {
      custForm.addEventListener('submit', e => {
        e.preventDefault();
        const isValid = validateCustomerDetails();
        if (isValid) {
          window.goToQuoteStep(6);
        }
      });

      // Clear inline errors on input
      custForm.querySelectorAll('.form-control').forEach(inp => {
        inp.addEventListener('input', () => {
          inp.classList.remove('is-invalid');
          const err = document.getElementById(`err-${inp.id}`);
          if (err) err.classList.remove('visible');
        });
      });

      const terms = document.getElementById('cust-terms');
      if (terms) {
        terms.addEventListener('change', () => {
          const err = document.getElementById('err-cust-terms');
          const container = document.getElementById('terms-container');
          if (err) err.classList.remove('visible');
          if (container) container.classList.remove('is-invalid');
        });
      }
    }

    // Desktop Side Navigation Clicks
    document.querySelectorAll('.step-dot-item').forEach(dot => {
      dot.addEventListener('click', () => {
        const targetStep = parseInt(dot.getAttribute('data-step'), 10);
        if (targetStep <= state.currentStep || targetStep === state.currentStep + 1) {
          window.goToQuoteStep(targetStep);
        }
      });
    });

    // Unified Mobile Menu
    const menuBtn = document.getElementById('menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobClose = document.getElementById('mob-close');

    if (menuBtn && mobileNav) {
      menuBtn.addEventListener('click', () => {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (mobClose && mobileNav) {
      mobClose.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Initial Screen Activation
    window.goToQuoteStep(state.currentStep);
  });

})();
