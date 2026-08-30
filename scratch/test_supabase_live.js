const { createClient } = require('@supabase/supabase-js');

const URL = 'https://spnbwlalhffdmjixqjgc.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbmJ3bGFsaGZmZG1qaXhxamdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMDU2MzcsImV4cCI6MjEwMzY4MTYzN30.ul-jhwU9-OxvhL-cNqw_TXte6Za7RIToKFG9yqenDJM';

const supabase = createClient(URL, KEY);

async function testConnection() {
  console.log('Testing connection to live Supabase project:', URL);

  // 1. Test inserting into contact_submissions
  const contactPayload = {
    full_name: 'TEST CONTACT LIVE',
    email: 'test.live@example.com',
    phone: '+91 94918 18015',
    session_type: 'wedding',
    event_date: '2026-12-01',
    message: 'Testing live Supabase integration',
    status: 'NEW'
  };

  const { data: contactData, error: contactError } = await supabase
    .from('contact_submissions')
    .insert([contactPayload])
    .select();

  console.log('\n--- CONTACT SUBMISSION INSERT TEST ---');
  if (contactError) {
    console.error('Contact Insert Error:', contactError);
  } else {
    console.log('Contact Insert Success! Returned Data:', contactData);
  }

  // 2. Test querying contact_submissions
  const { data: selectData, error: selectError } = await supabase
    .from('contact_submissions')
    .select('*');

  console.log('\n--- CONTACT SUBMISSION SELECT TEST ---');
  if (selectError) {
    console.error('Contact Select Error:', selectError);
  } else {
    console.log('Contact Select Success! Count:', selectData ? selectData.length : 0);
  }
}

testConnection();
