const URL = 'https://spnbwlalhffdmjixqjgc.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbmJ3bGFsaGZmZG1qaXhxamdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMDU2MzcsImV4cCI6MjEwMzY4MTYzN30.ul-jhwU9-OxvhL-cNqw_TXte6Za7RIToKFG9yqenDJM';

async function purgeAllRows() {
  const headers = {
    'apikey': KEY,
    'Authorization': `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  console.log('Purging all contact_submissions...');
  const res1 = await fetch(`${URL}/rest/v1/contact_submissions?id=not.is.null`, { method: 'DELETE', headers });
  const deletedContacts = await res1.json();
  console.log('Deleted Contacts count:', deletedContacts.length);

  console.log('Purging all quote_submissions...');
  const res2 = await fetch(`${URL}/rest/v1/quote_submissions?id=not.is.null`, { method: 'DELETE', headers });
  const deletedQuotes = await res2.json();
  console.log('Deleted Quotes count:', deletedQuotes.length);

  // Verify final count
  const cRes = await fetch(`${URL}/rest/v1/contact_submissions?select=*`, { headers });
  const cData = await cRes.json();
  const qRes = await fetch(`${URL}/rest/v1/quote_submissions?select=*`, { headers });
  const qData = await qRes.json();

  console.log('\n======================================================');
  console.log(' FINAL DATABASE STATE');
  console.log(` CONTACTS IN DATABASE: ${cData.length}`);
  console.log(` QUOTES IN DATABASE:   ${qData.length}`);
  console.log('======================================================\n');
}

purgeAllRows();
