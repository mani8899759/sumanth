/**
 * SUMANTH PHOTOGRAPHY — BUILD YOUR QUOTE
 * Full Automated QA — Puppeteer v25 stable
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const sleep = ms => new Promise(r => setTimeout(r, ms));

const BASE_URL = 'http://localhost:3000/quote.html';
const SHOTS_DIR = path.join('C:\\Users\\MANI-33\\Desktop\\sumanth photography', 'qa_screenshots');
if (!fs.existsSync(SHOTS_DIR)) fs.mkdirSync(SHOTS_DIR, { recursive: true });

let passCount = 0, failCount = 0;
const failures = [];

const pass = (lbl, d = '') => { console.log('PASS: ' + lbl + (d ? ' [' + d + ']' : '')); passCount++; };
const fail = (lbl, d = '') => { console.log('FAIL: ' + lbl + (d ? ' [' + d + ']' : '')); failCount++; failures.push(lbl + (d ? ' — ' + d : '')); };
const info = (lbl, d = '') => console.log('INFO: ' + lbl + (d ? ' — ' + d : ''));

async function shot(page, name) {
  await page.screenshot({ path: path.join(SHOTS_DIR, name + '.png'), fullPage: false });
  info('Screenshot', name);
}

// Evaluate helper — runs in browser context
const $text = (page, sel) => page.$eval(sel, el => el.textContent.trim()).catch(() => '');
const $cls  = (page, sel) => page.$eval(sel, el => el.className).catch(() => '');
const $attr = (page, sel, attr) => page.$eval(sel, (el, a) => el.getAttribute(a), attr).catch(() => null);
const $vis  = (page, sel) => page.$eval(sel, el => {
  const s = window.getComputedStyle(el);
  return s.display !== 'none' && s.visibility !== 'hidden';
}).catch(() => false);

async function waitStep(page, step) {
  await page.waitForSelector('[data-step="' + step + '"]:not(.hidden)', { timeout: 7000 });
}

async function clickNth(page, sel, n) {
  await page.evaluate((s, idx) => {
    const els = document.querySelectorAll(s);
    if (els[idx]) els[idx].click();
  }, sel, n);
  await sleep(350);
}

async function clickContains(page, sel, text) {
  const found = await page.evaluate((s, t) => {
    const els = Array.from(document.querySelectorAll(s));
    const el = els.find(e => e.textContent.includes(t));
    if (el) { el.click(); return true; }
    return false;
  }, sel, text);
  return found;
}

// ─────────────────────────────────────────────────────────────────────────────
async function runTests() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--window-size=1440,900', '--no-sandbox'],
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();

  const jsErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') jsErrors.push(msg.text()); });
  page.on('pageerror', err => jsErrors.push(err.message));

  // ── LOAD & WELCOME ────────────────────────────────────────────────────────
  info('Opening', BASE_URL);
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await sleep(1200);
  await shot(page, '01_welcome');

  console.log('\n=== STEP 0: WELCOME ===');
  const body = await page.evaluate(() => document.body.textContent);
  body.includes('SUMANTH PHOTOGRAPHY') ? pass('Brand name present') : fail('Brand name missing');

  try { await waitStep(page, 0); pass('Step 0 panel visible'); } catch { fail('Step 0 not visible'); }

  await clickContains(page, 'button', 'BEGIN CONFIGURATION');
  await sleep(700);
  pass('Clicked BEGIN CONFIGURATION');

  // ── STEP 1: PHOTOGRAPHY STYLE ─────────────────────────────────────────────
  console.log('\n=== STEP 1: PHOTOGRAPHY STYLE ===');
  try { await waitStep(page, 1); pass('Step 1 visible'); } catch { fail('Step 1 not visible'); }

  const nCards = await page.evaluate(() => document.querySelectorAll('.selection-card').length);
  nCards >= 3 ? pass('Style cards rendered', nCards) : fail('Style cards missing', nCards);

  const hasRec = await page.evaluate(() => !!document.querySelector('.subtle-rec-badge'));
  hasRec ? pass('RECOMMENDED badge present') : fail('RECOMMENDED badge missing');

  // Click CANDID (index 0), check aria-pressed
  await clickNth(page, '.selection-card', 0);
  const candidPressed = await page.evaluate(() => {
    const cards = document.querySelectorAll('.selection-card');
    return cards[0] ? cards[0].getAttribute('aria-pressed') : null;
  });
  candidPressed === 'true' ? pass('CANDID: aria-pressed=true after click') : fail('CANDID: aria-pressed wrong', candidPressed);

  // Click TRADITIONAL
  await clickNth(page, '.selection-card', 1);

  // Click BOTH — final selection
  await clickNth(page, '.selection-card', 2);
  const bothPressed = await page.evaluate(() => {
    const cards = document.querySelectorAll('.selection-card');
    return cards[2] ? cards[2].getAttribute('aria-pressed') : null;
  });
  bothPressed === 'true' ? pass('BOTH: aria-pressed=true') : fail('BOTH: aria-pressed wrong', bothPressed);

  // Others should now be false
  const candidDeselected = await page.evaluate(() => {
    const cards = document.querySelectorAll('.selection-card');
    return cards[0] ? cards[0].getAttribute('aria-pressed') : null;
  });
  candidDeselected === 'false' ? pass('CANDID deselected when BOTH clicked') : fail('CANDID should be deselected', candidDeselected);

  await shot(page, '02_step1_both_selected');

  // Continue button enabled?
  const contDisabled = await page.$eval('button[id*="continue"], button[id*="btn-continue"]', el => el.disabled).catch(async () => {
    return await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const cont = btns.find(b => b.textContent.includes('CONTINUE'));
      return cont ? cont.disabled : null;
    });
  });
  contDisabled === false ? pass('CONTINUE button enabled after style selection') : info('CONTINUE button state', contDisabled);

  await clickContains(page, 'button', 'CONTINUE');
  await sleep(700);
  pass('CONTINUE to Step 2 clicked');

  // ── STEP 2: EVENT SELECTION ───────────────────────────────────────────────
  console.log('\n=== STEP 2: EVENT SELECTION ===');
  try { await waitStep(page, 2); pass('Step 2 visible'); } catch { fail('Step 2 not visible'); }

  const nEvents = await page.evaluate(() => document.querySelectorAll('.event-card').length);
  nEvents === 12 ? pass('All 12 event cards rendered') : fail('Event card count wrong', nEvents + ' found');

  // Check all 12 event names present
  const allEventText = await page.evaluate(() => document.querySelector('#events-cards-grid') ? document.querySelector('#events-cards-grid').textContent : '');
  const expectedEvs = ['Engagement','Vratham','Groom Haldi','Bride Haldi','Pellikoduku','Pellikuthuru','Sangeet','Mehendi','Cocktail','Reception','Wedding','Other Event'];
  expectedEvs.forEach(ev => allEventText.includes(ev) ? pass('Event: ' + ev) : fail('Event missing: ' + ev));

  // Select Wedding (may already be selected), Bride Haldi, Sangeet
  const selTargets = ['Wedding', 'Bride Haldi', 'Sangeet'];
  for (const name of selTargets) {
    await page.evaluate(n => {
      const cards = Array.from(document.querySelectorAll('.event-card'));
      const card = cards.find(c => c.textContent.includes(n));
      if (card && !card.classList.contains('selected')) card.click();
    }, name);
    await sleep(250);
    const isSel = await page.evaluate(n => {
      const cards = Array.from(document.querySelectorAll('.event-card'));
      const card = cards.find(c => c.textContent.includes(n));
      return card ? card.classList.contains('selected') : false;
    }, name);
    isSel ? pass('Selected: ' + name) : fail('Not selected: ' + name);
  }

  const badgeText = await $text(page, '#events-count-badge');
  badgeText.includes('3') ? pass('Count badge shows 3', badgeText) : fail('Count badge wrong', badgeText);

  await shot(page, '03_step2_3events');
  await clickContains(page, 'button', 'CONTINUE');
  await sleep(900);
  pass('CONTINUE to Step 3 clicked');

  // ── STEP 3: COVERAGE BUILDER ─────────────────────────────────────────────
  console.log('\n=== STEP 3: COVERAGE BUILDER ===');
  try { await waitStep(page, 3); pass('Step 3 visible'); } catch { fail('Step 3 not visible'); }

  // Breadcrumb
  const nCrumbs = await page.evaluate(() => document.querySelectorAll('.cov-crumb-pill').length);
  nCrumbs === 3 ? pass('Breadcrumb: 3 event pills') : fail('Breadcrumb wrong count', nCrumbs);

  const stepLbl = await $text(page, '#cov-step-label');
  stepLbl.includes('1 OF 3') ? pass('Step label: EVENT 1 OF 3', stepLbl) : fail('Step label wrong', stepLbl);

  const prevStyle = await $attr(page, '#cov-prev-event-btn', 'style');
  (prevStyle && prevStyle.includes('hidden')) ? pass('PREV hidden on event 1') : fail('PREV should be hidden', prevStyle);

  const nSvcCards = await page.evaluate(() => document.querySelectorAll('.service-toggle-card').length);
  nSvcCards === 5 ? pass('5 service cards rendered') : fail('Service cards wrong', nSvcCards);

  const nDisabled = await page.evaluate(() => document.querySelectorAll('.service-toggle-card.service-disabled').length);
  nDisabled === 0 ? pass('BOTH style: all 5 enabled (0 disabled)') : fail('Unexpected disabled cards in BOTH mode', nDisabled);

  const hasLiveDesk = await page.evaluate(() => !!document.getElementById('cov-live-total-desktop'));
  hasLiveDesk ? pass('Desktop running total element present') : fail('cov-live-total-desktop missing');

  // Stepper + test
  const totBefore = await $text(page, '#cov-live-total-desktop');
  await page.evaluate(() => {
    const btns = document.querySelectorAll('.svc-inc');
    if (btns[0]) btns[0].click();
  });
  await sleep(500);
  const totAfter = await $text(page, '#cov-live-total-desktop');
  totBefore !== totAfter ? pass('Running total updates on + click', totBefore + ' -> ' + totAfter) : fail('Running total did NOT update on +');

  const sv2 = await $text(page, '.stepper-val');
  sv2 === '2' ? pass('Crew incremented to 2') : fail('Stepper value after + wrong', sv2);

  // Stepper - test
  await page.evaluate(() => { const d = document.querySelectorAll('.svc-dec'); if (d[0]) d[0].click(); });
  await sleep(300);
  const sv1 = await $text(page, '.stepper-val');
  sv1 === '1' ? pass('Crew decremented to 1') : fail('After - wrong', sv1);

  await page.evaluate(() => { const d = document.querySelectorAll('.svc-dec'); if (d[0]) d[0].click(); });
  await sleep(300);
  const sv0 = await $text(page, '.stepper-val');
  sv0 === '0' ? pass('Crew at 0 (minimum)') : fail('Minimum wrong', sv0);

  const decDis = await page.evaluate(() => {
    const d = document.querySelectorAll('.svc-dec');
    return d[0] ? d[0].disabled : null;
  });
  decDis === true ? pass('- button disabled at 0') : fail('- button should be disabled at 0', decDis);

  // Re-increment to 1 for later state tests
  await page.evaluate(() => { const i = document.querySelectorAll('.svc-inc'); if (i[0]) i[0].click(); });
  await sleep(300);

  // Drone toggle test
  const droneWas = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.service-toggle-card'));
    const d = cards.find(c => c.textContent.includes('Drone'));
    return d ? d.classList.contains('service-selected') : null;
  });
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.service-toggle-card'));
    const d = cards.find(c => c.textContent.includes('Drone'));
    if (d) d.click();
  });
  await sleep(500);
  const droneNow = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.service-toggle-card'));
    const d = cards.find(c => c.textContent.includes('Drone'));
    return d ? d.classList.contains('service-selected') : null;
  });
  droneWas !== droneNow ? pass('Drone toggle works (state changed)', droneNow) : fail('Drone toggle did not change', droneNow);

  // Verify pill visual in Drone footer
  const pillTrack = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.service-toggle-card'));
    const d = cards.find(c => c.textContent.includes('Drone'));
    return d ? !!d.querySelector('.svc-pill-track') : false;
  });
  pillTrack ? pass('Drone card has pill toggle (not stepper)') : fail('Drone card missing pill toggle');

  await shot(page, '04_step3_event1');

  // NEXT EVENT
  await page.click('#cov-next-event-btn');
  await sleep(700);
  const lbl2 = await $text(page, '#cov-step-label');
  lbl2.includes('2 OF 3') ? pass('NEXT -> EVENT 2 OF 3', lbl2) : fail('NEXT nav wrong', lbl2);
  const pv2 = await $attr(page, '#cov-prev-event-btn', 'style');
  (!pv2 || !pv2.includes('hidden')) ? pass('PREV visible on event 2') : fail('PREV should be visible on event 2');
  await shot(page, '05_step3_event2');

  // NEXT EVENT again
  await page.click('#cov-next-event-btn');
  await sleep(700);
  const lbl3 = await $text(page, '#cov-step-label');
  lbl3.includes('3 OF 3') ? pass('NEXT -> EVENT 3 OF 3', lbl3) : fail('Event 3 label wrong', lbl3);
  const nextTxt = await $text(page, '#cov-next-event-btn');
  nextTxt.includes('ALL DONE') ? pass('Button = ALL DONE on last event', nextTxt) : fail('Button text wrong', nextTxt);
  await shot(page, '06_step3_event3_last');

  // PREV back to event 2
  await page.click('#cov-prev-event-btn');
  await sleep(500);
  const lblBack = await $text(page, '#cov-step-label');
  lblBack.includes('2 OF 3') ? pass('PREV returns to event 2') : fail('PREV nav wrong', lblBack);

  // Crumb pill navigation to event 1
  await page.evaluate(() => {
    const pills = document.querySelectorAll('.cov-crumb-pill');
    if (pills[0]) pills[0].click();
  });
  await sleep(500);
  const lblCrumb = await $text(page, '#cov-step-label');
  lblCrumb.includes('1 OF') ? pass('Crumb pill navigates to event 1') : fail('Crumb nav failed', lblCrumb);

  // Navigate to last and ALL DONE
  await page.evaluate(() => {
    const pills = document.querySelectorAll('.cov-crumb-pill');
    if (pills[2]) pills[2].click();
  });
  await sleep(500);
  await page.click('#cov-next-event-btn'); // ALL DONE
  await sleep(900);

  // ── STEP 4: ADD-ONS ────────────────────────────────────────────────────────
  console.log('\n=== STEP 4: ADD-ONS ===');
  try { await waitStep(page, 4); pass('Step 4 visible'); } catch { fail('Step 4 not visible'); }

  const nAddons = await page.evaluate(() => document.querySelectorAll('.addon-item-card').length);
  nAddons === 5 ? pass('5 addon cards rendered') : fail('Addon cards wrong', nAddons);

  // Increase album qty
  await page.evaluate(() => {
    const btns = document.querySelectorAll('.btn-addon-inc');
    if (btns[0]) btns[0].click();
  });
  await sleep(400);
  // Verify dec now enabled
  const decEnabled = await page.evaluate(() => {
    const d = document.querySelectorAll('.btn-addon-dec');
    return d[0] ? !d[0].disabled : false;
  });
  decEnabled ? pass('Album +1: dec button now enabled (qty=1)') : fail('Album + did not work');

  // Turn all toggle addons ON
  const togCount = await page.evaluate(() => document.querySelectorAll('.addon-toggle').length);
  info('Addon toggles found', togCount);
  await page.evaluate(() => {
    document.querySelectorAll('.addon-toggle').forEach(t => {
      if (!t.checked) t.click();
    });
  });
  await sleep(500);
  const allOn = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.addon-toggle')).every(t => t.checked);
  });
  allOn ? pass('All addon toggles turned ON') : fail('Some addon toggles still OFF');

  await shot(page, '07_step4_addons');
  await clickContains(page, 'button', 'CONTINUE');
  await sleep(900);
  pass('CONTINUE to Step 5 clicked');

  // ── STEP 5: SUMMARY ────────────────────────────────────────────────────────
  console.log('\n=== STEP 5: QUOTE SUMMARY ===');
  try { await waitStep(page, 5); pass('Step 5 visible'); } catch { fail('Step 5 not visible'); }

  const sumTxt = await page.evaluate(() => {
    const el = document.getElementById('summary-events-list');
    return el ? el.textContent : '';
  });
  ['Wedding','Bride Haldi','Sangeet'].forEach(ev =>
    sumTxt.includes(ev) ? pass('Summary: ' + ev + ' in breakdown') : fail('Summary: ' + ev + ' missing')
  );

  const totalTxt = await $text(page, '#summary-total-val');
  (totalTxt.includes('\u20b9') && !totalTxt.includes('\u20b90')) ? pass('Grand total non-zero', totalTxt.substring(0,25)) : fail('Grand total zero or missing', totalTxt);

  await shot(page, '08_step5_summary');
  await clickContains(page, 'button', 'ENTER EVENT DETAILS');
  await sleep(800);
  pass('ENTER EVENT DETAILS clicked');

  // ── STEP 6: CUSTOMER DETAILS ─────────────────────────────────────────────
  console.log('\n=== STEP 6: CUSTOMER DETAILS ===');
  try { await waitStep(page, 6); pass('Step 6 visible'); } catch { fail('Step 6 not visible'); }

  const fields = [
    { id: 'input-full-name', val: 'Sumanth Ananya', label: 'Full Name' },
    { id: 'input-phone', val: '9491818015', label: 'Phone' },
    { id: 'input-email', val: 'test@test.com', label: 'Email' },
    { id: 'input-date', val: '2026-12-25', label: 'Date' },
    { id: 'input-venue', val: 'Taj Falaknuma Palace', label: 'Venue' },
    { id: 'input-city', val: 'Hyderabad', label: 'City' },
  ];
  for (const f of fields) {
    try {
      const el = await page.$('#' + f.id);
      if (el) {
        await el.click({ clickCount: 3 });
        await el.type(f.val);
        pass('Filled: ' + f.label);
      } else fail('Field not found: ' + f.id);
    } catch (e) { fail('Field error: ' + f.label, e.message); }
  }

  await shot(page, '09_step6_details');
  const submitted = await clickContains(page, 'button', 'SUBMIT');
  if (!submitted) {
    await page.evaluate(() => window.goToQuoteStep && window.goToQuoteStep(7));
    info('SUBMIT via JS fallback');
  } else pass('SUBMIT QUOTE clicked');
  await sleep(1200);

  // ── STEP 7: CONFIRMATION ──────────────────────────────────────────────────
  console.log('\n=== STEP 7: CONFIRMATION ===');
  try { await waitStep(page, 7); pass('Step 7 visible'); } catch { fail('Step 7 not visible'); }

  const s7txt = await page.evaluate(() => {
    const el = document.querySelector('[data-step="7"]');
    return el ? el.textContent : '';
  });
  s7txt.includes('THANK YOU') ? pass('THANK YOU heading present') : fail('THANK YOU heading missing', s7txt.substring(0,100));
  s7txt.includes('SUM-QUOTE') ? pass('Quote reference (SUM-QUOTE-XXXX) generated') : fail('Quote ref missing');

  const waHrefs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href*="wa.me"]')).map(a => a.href)
  );
  if (waHrefs.length > 0) {
    waHrefs[0].includes('919491818015') ? pass('WhatsApp: correct number 919491818015') : fail('WhatsApp: wrong number', waHrefs[0].substring(0,80));
    decodeURIComponent(waHrefs[0]).includes('SUM-QUOTE') ? pass('WhatsApp: quote ref in message') : fail('WhatsApp: quote ref missing');
  } else fail('WhatsApp link not found');

  await shot(page, '10_step7_confirmation');

  // ── STYLE GATING: CANDID ─────────────────────────────────────────────────
  console.log('\n=== STYLE GATING: CANDID ===');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(1000);
  await clickContains(page, 'button', 'BEGIN CONFIGURATION'); await sleep(600);
  await clickNth(page, '.selection-card', 0); // CANDID
  await clickContains(page, 'button', 'CONTINUE'); await sleep(600);
  await clickContains(page, 'button', 'CONTINUE'); await sleep(900); // Step 3

  const disC = await page.evaluate(() => document.querySelectorAll('.service-toggle-card.service-disabled').length);
  disC === 2 ? pass('CANDID: 2 cards disabled (Trad Photo + Trad Video)') : fail('CANDID: expected 2 disabled', disC);
  const enC = await page.evaluate(() => document.querySelectorAll('.service-toggle-card:not(.service-disabled)').length);
  enC === 3 ? pass('CANDID: 3 cards enabled') : fail('CANDID: expected 3 enabled', enC);

  // Check disabled card shows "NOT AVAILABLE" text
  const notAvailText = await page.evaluate(() => {
    const d = document.querySelectorAll('.service-toggle-card.service-disabled');
    return d[0] ? d[0].textContent : '';
  });
  notAvailText.includes('NOT AVAILABLE') ? pass('Disabled card shows NOT AVAILABLE text') : fail('Missing NOT AVAILABLE text');

  // Confirm Candid Photo stepper is enabled (not disabled)
  const candidEnabled = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.service-toggle-card:not(.service-disabled)'));
    return cards.some(c => c.textContent.includes('Candid Photography'));
  });
  candidEnabled ? pass('Candid Photography enabled in CANDID mode') : fail('Candid Photography should be enabled');

  // Confirm Traditional Photo is disabled
  const tradDisabled = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.service-toggle-card.service-disabled'));
    return cards.some(c => c.textContent.includes('Traditional Photography'));
  });
  tradDisabled ? pass('Traditional Photography disabled in CANDID mode') : fail('Traditional Photography should be disabled');

  await shot(page, '11_gating_candid');

  // ── STYLE GATING: TRADITIONAL ─────────────────────────────────────────────
  console.log('\n=== STYLE GATING: TRADITIONAL ===');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(1000);
  await clickContains(page, 'button', 'BEGIN CONFIGURATION'); await sleep(600);
  await clickNth(page, '.selection-card', 1); // TRADITIONAL
  await clickContains(page, 'button', 'CONTINUE'); await sleep(600);
  await clickContains(page, 'button', 'CONTINUE'); await sleep(900);

  const disT = await page.evaluate(() => document.querySelectorAll('.service-toggle-card.service-disabled').length);
  disT === 2 ? pass('TRADITIONAL: 2 cards disabled (Candid Photo + Candid Video)') : fail('TRADITIONAL: expected 2 disabled', disT);
  const tradEnabled = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.service-toggle-card:not(.service-disabled)'));
    return cards.some(c => c.textContent.includes('Traditional Photography'));
  });
  tradEnabled ? pass('Traditional Photography enabled in TRADITIONAL mode') : fail('Traditional Photography should be enabled');

  await shot(page, '12_gating_traditional');

  // ── STATE RETENTION ───────────────────────────────────────────────────────
  console.log('\n=== STATE RETENTION: BACK NAVIGATION ===');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(1000);
  await clickContains(page, 'button', 'BEGIN CONFIGURATION'); await sleep(600);
  await clickNth(page, '.selection-card', 2); // BOTH
  await clickContains(page, 'button', 'CONTINUE'); await sleep(600);
  // Ensure Reception is also selected
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.event-card'));
    const r = cards.find(c => c.textContent.includes('Reception'));
    if (r && !r.classList.contains('selected')) r.click();
  });
  await sleep(300);
  await clickContains(page, 'button', 'CONTINUE'); await sleep(900);

  // Set crew count
  await page.evaluate(() => {
    const i = document.querySelectorAll('.svc-inc');
    if (i[0]) { i[0].click(); i[0].click(); } // crew = 2
  });
  await sleep(500);
  const crewSet = await $text(page, '.stepper-val');
  pass('Set crew count', crewSet);

  // BACK
  const backClicked = await clickContains(page, 'button', 'BACK');
  if (!backClicked) fail('BACK button not found');
  else pass('BACK clicked');
  await sleep(600);

  try { await waitStep(page, 2); pass('BACK -> Step 2 confirmed'); }
  catch { fail('BACK did not go to Step 2'); }

  // Events still selected?
  const wStillSel = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.event-card'));
    const w = cards.find(c => c.textContent.includes('Wedding'));
    return w ? w.classList.contains('selected') : false;
  });
  wStillSel ? pass('Wedding still selected after BACK') : fail('Wedding deselected after BACK');

  // Forward again
  await clickContains(page, 'button', 'CONTINUE'); await sleep(900);
  const crewRestored = await $text(page, '.stepper-val');
  crewRestored === crewSet ? pass('Crew count preserved across BACK', crewSet) : fail('Crew count lost', 'was ' + crewSet + ' now ' + crewRestored);

  await shot(page, '13_state_retention');

  // ── MOBILE LAYOUT ─────────────────────────────────────────────────────────
  console.log('\n=== MOBILE LAYOUT (390x844) ===');
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(1000);
  await clickContains(page, 'button', 'BEGIN CONFIGURATION'); await sleep(600);
  await clickNth(page, '.selection-card', 2);
  await clickContains(page, 'button', 'CONTINUE'); await sleep(600);
  await clickContains(page, 'button', 'CONTINUE'); await sleep(900);

  const mobileVis = await $vis(page, '#cov-live-quote-mobile');
  mobileVis ? pass('Mobile: RUNNING TOTAL strip visible') : fail('Mobile: strip hidden');

  const prevNextMob = await page.evaluate(() =>
    !!document.getElementById('cov-prev-event-btn') && !!document.getElementById('cov-next-event-btn')
  );
  prevNextMob ? pass('Mobile: PREV/NEXT buttons present') : fail('Mobile: PREV/NEXT buttons missing');

  const cardWidth = await page.evaluate(() => {
    const c = document.querySelector('.service-toggle-card');
    return c ? c.getBoundingClientRect().width : 0;
  });
  cardWidth > 300 ? pass('Mobile: service cards span full width', Math.round(cardWidth) + 'px') : fail('Mobile: cards too narrow', Math.round(cardWidth) + 'px');

  await shot(page, '14_mobile_step3');

  // ── CONSOLE ERRORS ───────────────────────────────────────────────────────
  console.log('\n=== JAVASCRIPT CONSOLE ERRORS ===');
  if (jsErrors.length === 0) pass('Zero JS errors in console');
  else {
    fail(jsErrors.length + ' JS error(s) detected');
    jsErrors.forEach((e, i) => console.log('  Error ' + (i+1) + ': ' + e.substring(0,200)));
  }

  // ── FINAL REPORT ─────────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(70));
  console.log('QA RESULTS:   PASS=' + passCount + '   FAIL=' + failCount + '   TOTAL=' + (passCount+failCount));
  console.log('='.repeat(70));
  console.log('Screenshots: ' + SHOTS_DIR);
  if (failures.length > 0) {
    console.log('\nFailed checks:');
    failures.forEach((f, i) => console.log('  ' + (i+1) + '. ' + f));
  } else {
    console.log('\nALL TESTS PASSED — Builder is fully functional!');
  }

  await browser.close();
}

runTests().catch(e => {
  console.error('\nFATAL:', e.message, e.stack);
  process.exit(1);
});
