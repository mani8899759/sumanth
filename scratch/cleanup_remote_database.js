const URL = 'https://spnbwlalhffdmjixqjgc.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbmJ3bGFsaGZmZG1qaXhxamdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMDU2MzcsImV4cCI6MjEwMzY4MTYzN30.ul-jhwU9-OxvhL-cNqw_TXte6Za7RIToKFG9yqenDJM';

async function cleanupRemoteDatabase() {
  console.log('======================================================');
  console.log(' CLEANING ALL TEMPORARY/TEST DATA FROM SUPABASE');
  console.log(' Project:', URL);
  console.log('======================================================\n');

  const headers = {
    'apikey': KEY,
    'Authorization': `Bearer ${KEY}`,
    'Content-Type': 'application/json'
  };

  // 1. Delete all quote_preferences
  try {
    const res = await fetch(`${URL}/rest/v1/quote_preferences?id=neq.00000000-0000-0000-0000-000000000000`, { method: 'DELETE', headers });
    console.log(`quote_preferences delete status: ${res.status}`);
  } catch (e) { console.warn('quote_preferences error:', e.message); }

  // 2. Delete all quote_addons
  try {
    const res = await fetch(`${URL}/rest/v1/quote_addons?id=neq.00000000-0000-0000-0000-000000000000`, { method: 'DELETE', headers });
    console.log(`quote_addons delete status: ${res.status}`);
  } catch (e) { console.warn('quote_addons error:', e.message); }

  // 3. Delete all quote_line_items
  try {
    const res = await fetch(`${URL}/rest/v1/quote_line_items?id=neq.00000000-0000-0000-0000-000000000000`, { method: 'DELETE', headers });
    console.log(`quote_line_items delete status: ${res.status}`);
  } catch (e) { console.warn('quote_line_items error:', e.message); }

  // 4. Delete all quote_events
  try {
    const res = await fetch(`${URL}/rest/v1/quote_events?id=neq.00000000-0000-0000-0000-000000000000`, { method: 'DELETE', headers });
    console.log(`quote_events delete status: ${res.status}`);
  } catch (e) { console.warn('quote_events error:', e.message); }

  // 5. Delete all quote_submissions
  try {
    const res = await fetch(`${URL}/rest/v1/quote_submissions?id=neq.00000000-0000-0000-0000-000000000000`, { method: 'DELETE', headers });
    console.log(`quote_submissions delete status: ${res.status}`);
  } catch (e) { console.warn('quote_submissions error:', e.message); }

  // 6. Delete all contact_submissions
  try {
    const res = await fetch(`${URL}/rest/v1/contact_submissions?id=neq.00000000-0000-0000-0000-000000000000`, { method: 'DELETE', headers });
    console.log(`contact_submissions delete status: ${res.status}`);
  } catch (e) { console.warn('contact_submissions error:', e.message); }

  // 7. Verify empty count
  const resContacts = await fetch(`${URL}/rest/v1/contact_submissions?select=*`, { headers });
  const contacts = await resContacts.json();

  const resQuotes = await fetch(`${URL}/rest/v1/quote_submissions?select=*`, { headers });
  const quotes = await resQuotes.json();

  console.log('\n======================================================');
  console.log(' DATABASE CLEANUP COMPLETE');
  console.log(` CONTACTS COUNT: ${Array.isArray(contacts) ? contacts.length : 0}`);
  console.log(` QUOTES COUNT:   ${Array.isArray(quotes) ? quotes.length : 0}`);
  console.log('======================================================\n');
}

cleanupRemoteDatabase();
