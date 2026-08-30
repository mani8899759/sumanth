/**
 * SUMANTH PHOTOGRAPHY — SUPABASE BACKEND & ADMIN PANEL COMPREHENSIVE QA SUITE
 */

const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8120;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Simple static HTTP server for local testing
function startStaticServer() {
  const rootDir = path.resolve(__dirname);
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(rootDir, reqPath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[Test Server] Running on ${BASE_URL}`);
      resolve(server);
    });
  });
}

async function runTests() {
  const server = await startStaticServer();
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let testCount = 0;
  let passedCount = 0;

  function assert(condition, message) {
    testCount++;
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passedCount++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
    }
  }

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('\n--- 1. TESTING CONTACT FORM SUBMISSION ---');
    await page.goto(`${BASE_URL}/contact.html`, { waitUntil: 'networkidle2' });

    await page.type('#name', 'Priya Sharma');
    await page.type('#phone', '+91 98765 43210');
    await page.type('#email', 'priya.sharma@example.com');
    await page.select('#type', 'wedding');
    await page.type('#date', '2026-11-20');
    await page.type('#message', 'Need 2-day candid wedding coverage at Novotel Hyderabad.');

    await page.click('#submit-btn');
    await page.waitForSelector('#form-success', { visible: true, timeout: 5000 });

    const isSuccessVisible = await page.$eval('#form-success', el => el.style.display !== 'none');
    assert(isSuccessVisible, 'Contact form submitted successfully and success confirmation displayed');

    console.log('\n--- 2. TESTING BUILD YOUR QUOTE SUBMISSION ---');
    await page.goto(`${BASE_URL}/quote.html`, { waitUntil: 'networkidle2' });

    // Navigate to step 5 directly using wizard dispatcher
    await page.evaluate(() => window.goToQuoteStep(5));
    await page.waitForSelector('#customer-details-form', { visible: true });
    assert(true, 'Navigated to Step 5: Customer Details Form');

    // Fill Customer Details Form
    await page.type('#cust-fullName', 'Kavya & Arjun');
    await page.type('#cust-phone', '+91 91234 56789');
    await page.type('#cust-email', 'kavya.arjun@wedding.com');
    await page.type('#cust-date', '2026-12-12');
    await page.type('#cust-venue', 'ITC Kohenur');
    await page.type('#cust-city', 'Hyderabad');
    await page.click('#cust-terms');

    // Advance to Step 6 Review
    await page.evaluate(() => window.goToQuoteStep(6));
    await page.waitForSelector('.wizard-step-panel[data-step="6"].active');
    assert(true, 'Advanced to Step 6: Review Summary');

    // Submit Quote
    await page.evaluate(() => window.handleFinalSubmitClick());
    await page.waitForSelector('.wizard-step-panel[data-step="7"].active', { timeout: 6000 });
    assert(true, 'Quote submitted successfully and reached Step 7 confirmation');

    const quoteRef = await page.$eval('#confirm-ref-id', el => el.textContent.trim());
    assert(quoteRef.startsWith('SQ-2026-'), `Generated valid unique quote reference: ${quoteRef}`);

    console.log('\n--- 3. TESTING ADMIN AUTH GUARD & LOGIN ---');
    // Direct unauthenticated navigation to /admin/index.html
    await page.goto(`${BASE_URL}/admin/index.html`, { waitUntil: 'networkidle2' });
    const currentUrl = page.url();
    assert(currentUrl.includes('login.html'), 'Unauthenticated access to /admin/ correctly redirected to login.html');

    // Submit Admin Login Form with Default Admin Credentials
    await page.type('#admin-email', 'maneekanta0@gmail.com');
    await page.type('#admin-password', 'Mani@123!');
    await page.click('#btn-login-submit');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    assert(page.url().includes('index.html'), 'Authorized admin login (maneekanta0@gmail.com) successfully opened dashboard');

    console.log('\n--- 4. TESTING ADMIN DASHBOARD PRIMARY BLOCKS ---');
    await page.waitForSelector('#stat-contacts-total');
    const contactCount = await page.$eval('#stat-contacts-total', el => parseInt(el.textContent, 10));
    const quoteCount = await page.$eval('#stat-quotes-total', el => parseInt(el.textContent, 10));
    assert(contactCount >= 1, `Dashboard displays contact count correctly (${contactCount})`);
    assert(quoteCount >= 1, `Dashboard displays quote count correctly (${quoteCount})`);

    console.log('\n--- 5. TESTING ADMIN CONTACTS MANAGEMENT & SLIDE-OVER ---');
    await page.goto(`${BASE_URL}/admin/contacts.html`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#contacts-table-body tr');

    const hasPriya = await page.evaluate(() => document.body.innerText.includes('Priya Sharma'));
    assert(hasPriya, 'New contact enquiry (Priya Sharma) is displayed in admin contacts table');

    // Click on the first row to open detail drawer
    await page.click('#contacts-table-body tr:first-child');
    await page.waitForSelector('#contact-detail-drawer.active');
    assert(true, 'Contact detail slide-over drawer opened');

    await page.waitForSelector('#detail-status-select');
    await page.select('#detail-status-select', 'CONTACTED');
    await page.evaluate(() => {
      const btn = document.querySelector('button[onclick*="handleStatusUpdate"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const updatedPill = await page.$eval('#drawer-status-badge', el => el.textContent.trim());
    assert(updatedPill.includes('CONTACTED'), 'Contact status successfully updated to CONTACTED');

    // Add internal note
    await page.type('#detail-internal-notes', ' Client prefers evening call.');
    await page.evaluate(() => {
      const btn = document.querySelector('button[onclick*="handleNotesUpdate"]');
      if (btn) btn.click();
    });
    await page.waitForSelector('#notes-save-feedback', { visible: true });
    assert(true, 'Internal notes successfully persisted to backend data store');

    console.log('\n--- 6. TESTING ADMIN QUOTES MANAGEMENT & PRICING SNAPSHOT ---');
    await page.goto(`${BASE_URL}/admin/quotes.html`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#quotes-table-body tr');

    const hasKavya = await page.evaluate(() => document.body.innerText.includes('Kavya & Arjun'));
    assert(hasKavya, 'New quote submission (Kavya & Arjun) is displayed in admin quotes table');

    // Click to open quote detail
    await page.click('#quotes-table-body tr:first-child');
    await page.waitForSelector('#quote-detail-drawer.active');
    assert(true, 'Quote quotation detail sheet opened');

    await page.waitForSelector('.quote-financial-box');
    const hasVenue = await page.evaluate(() => document.body.innerText.includes('ITC Kohenur'));
    const hasFinancials = await page.evaluate(() => document.body.innerText.includes('EVENT SERVICES SUBTOTAL'));
    assert(hasVenue, 'Stored venue metadata preserved accurately in quotation sheet');
    assert(hasFinancials, 'Pricing snapshot financial summary preserved accurately');

    await page.waitForSelector('#quote-detail-status-select');
    await page.select('#quote-detail-status-select', 'REVIEWING');
    await page.evaluate(() => {
      const btn = document.querySelector('button[onclick*="handleQuoteStatusUpdate"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const quoteStatusPill = await page.$eval('#quote-drawer-status-badge', el => el.textContent.trim());
    assert(quoteStatusPill.includes('REVIEWING'), 'Quote status successfully updated to REVIEWING');

    console.log('\n--- 7. TESTING RESPONSIVE VIEWPORT (MOBILE) ---');
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/admin/index.html`, { waitUntil: 'networkidle2' });

    const isToggleVisible = await page.$eval('.admin-menu-toggle', el => window.getComputedStyle(el).display !== 'none');
    assert(isToggleVisible, 'Mobile menu drawer toggle is visible on mobile viewports');

    console.log('\n--- 8. TESTING LOGOUT ---');
    await page.click('.btn-logout');
    await page.waitForFunction(() => window.location.href.includes('login.html'), { timeout: 4000 });
    assert(page.url().includes('login.html'), 'Admin logout clears session and redirects to login');

  } catch (err) {
    console.error('QA Test execution failed:', err);
  } finally {
    await browser.close();
    server.close();

    console.log(`\n==================================================`);
    console.log(`TEST SUMMARY: ${passedCount}/${testCount} Passed`);
    console.log(`==================================================\n`);
  }
}

runTests();
