const URL = 'https://spnbwlalhffdmjixqjgc.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbmJ3bGFsaGZmZG1qaXhxamdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMDU2MzcsImV4cCI6MjEwMzY4MTYzN30.ul-jhwU9-OxvhL-cNqw_TXte6Za7RIToKFG9yqenDJM';

async function checkTables() {
  console.log('Checking tables on Supabase project:', URL);

  // Check contact_submissions
  try {
    const res = await fetch(`${URL}/rest/v1/contact_submissions?select=count`, {
      headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
    });
    console.log(`contact_submissions HTTP Status: ${res.status}`);
    const text = await res.text();
    console.log(`contact_submissions Response: ${text}`);
  } catch (e) {
    console.error('contact_submissions Check Error:', e);
  }

  // Check quote_submissions
  try {
    const res = await fetch(`${URL}/rest/v1/quote_submissions?select=count`, {
      headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
    });
    console.log(`quote_submissions HTTP Status: ${res.status}`);
    const text = await res.text();
    console.log(`quote_submissions Response: ${text}`);
  } catch (e) {
    console.error('quote_submissions Check Error:', e);
  }
}

checkTables();
