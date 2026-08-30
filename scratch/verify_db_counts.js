const URL = 'https://spnbwlalhffdmjixqjgc.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbmJ3bGFsaGZmZG1qaXhxamdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMDU2MzcsImV4cCI6MjEwMzY4MTYzN30.ul-jhwU9-OxvhL-cNqw_TXte6Za7RIToKFG9yqenDJM';

async function verifyState() {
  const headers = { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` };

  const resC = await fetch(`${URL}/rest/v1/contact_submissions?select=id`, { headers });
  const cData = await resC.json();

  const resQ = await fetch(`${URL}/rest/v1/quote_submissions?select=id`, { headers });
  const qData = await resQ.json();

  console.log('======================================================');
  console.log(' CURRENT REMOTE DATABASE STATUS');
  console.log(' Contact Submissions:', Array.isArray(cData) ? cData.length : cData);
  console.log(' Quote Submissions:', Array.isArray(qData) ? qData.length : qData);
  console.log('======================================================');
}

verifyState();
