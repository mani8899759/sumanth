const URL = 'https://spnbwlalhffdmjixqjgc.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbmJ3bGFsaGZmZG1qaXhxamdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMDU2MzcsImV4cCI6MjEwMzY4MTYzN30.ul-jhwU9-OxvhL-cNqw_TXte6Za7RIToKFG9yqenDJM';

async function performLiveVerification() {
  console.log('======================================================');
  console.log(' PERFORMING REAL LIVE SUBMISSION TO SUPABASE');
  console.log(' URL:', URL);
  console.log('======================================================\n');

  // 1. Submit a Contact Enquiry
  const newContact = {
    full_name: 'Mani Kanta (Live Contact Test)',
    email: 'maneekanta0@gmail.com',
    phone: '+91 94918 18015',
    session_type: 'wedding',
    event_date: '2026-11-20',
    message: 'Testing live data insertion from website to Supabase.',
    status: 'NEW'
  };

  console.log('--> Submitting Contact Enquiry...');
  const res1 = await fetch(`${URL}/rest/v1/contact_submissions`, {
    method: 'POST',
    headers: {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([newContact])
  });

  console.log(`    Status: ${res1.status} ${res1.statusText}`);

  // 2. Submit a Build Your Quote Request
  const newQuote = {
    quote_number: 'SQ-2026-LIVE01',
    customer_name: 'Mani & Family (Live Quote Test)',
    phone: '+91 94918 18015',
    email: 'maneekanta0@gmail.com',
    wedding_date: '2026-12-15',
    venue: 'Taj Falaknuma Palace',
    city: 'Hyderabad',
    photography_style: 'BOTH',
    event_subtotal: 250000,
    addon_subtotal: 45000,
    raw_subtotal: 295000,
    discount_total: 25000,
    estimated_total: 270000,
    status: 'NEW',
    terms_accepted: true,
    pricing_snapshot: {
      subtotal: 295000,
      discount: 25000,
      estimatedTotal: 270000,
      venue: 'Taj Falaknuma Palace'
    }
  };

  console.log('\n--> Submitting Build Your Quote Request...');
  const res2 = await fetch(`${URL}/rest/v1/quote_submissions`, {
    method: 'POST',
    headers: {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([newQuote])
  });

  console.log(`    Status: ${res2.status} ${res2.statusText}`);

  // 3. Query the records back from Supabase
  console.log('\n--> Fetching all stored Contact Submissions from Supabase...');
  const res3 = await fetch(`${URL}/rest/v1/contact_submissions?select=*`, {
    headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
  });
  const contacts = await res3.json();
  console.log('    Stored Contacts Count:', contacts.length);
  console.log('    Contacts Data:', JSON.stringify(contacts, null, 2));

  console.log('\n--> Fetching all stored Quote Submissions from Supabase...');
  const res4 = await fetch(`${URL}/rest/v1/quote_submissions?select=*`, {
    headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
  });
  const quotes = await res4.json();
  console.log('    Stored Quotes Count:', quotes.length);
  console.log('    Quotes Data:', JSON.stringify(quotes, null, 2));
}

performLiveVerification();
