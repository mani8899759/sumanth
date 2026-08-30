const URL = 'https://spnbwlalhffdmjixqjgc.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbmJ3bGFsaGZmZG1qaXhxamdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMDU2MzcsImV4cCI6MjEwMzY4MTYzN30.ul-jhwU9-OxvhL-cNqw_TXte6Za7RIToKFG9yqenDJM';

async function testQuoteInsert() {
  const quotePayload = {
    quote_number: 'SQ-2026-TEST01',
    customer_name: 'Kavya & Arjun (Live Test)',
    phone: '+91 94918 18015',
    email: 'kavya.test@example.com',
    wedding_date: '2026-12-25',
    venue: 'Taj Krishna',
    city: 'Hyderabad',
    photography_style: 'BOTH',
    event_subtotal: 150000,
    addon_subtotal: 25000,
    raw_subtotal: 175000,
    discount_total: 15000,
    estimated_total: 160000,
    status: 'NEW',
    terms_accepted: true,
    internal_notes: '',
    pricing_snapshot: {
      subtotal: 175000,
      discount: 15000,
      estimatedTotal: 160000
    }
  };

  console.log('\n--- TEST QUOTE SUBMISSION INSERT WITHOUT SELECT ---');
  const res = await fetch(`${URL}/rest/v1/quote_submissions`, {
    method: 'POST',
    headers: {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([quotePayload])
  });

  console.log(`HTTP Status: ${res.status}`);
  const text = await res.text();
  console.log(`Response Body: ${text || '(Empty - Success 201 Created)'}`);
}

testQuoteInsert();
