const URL = 'https://spnbwlalhffdmjixqjgc.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbmJ3bGFsaGZmZG1qaXhxamdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMDU2MzcsImV4cCI6MjEwMzY4MTYzN30.ul-jhwU9-OxvhL-cNqw_TXte6Za7RIToKFG9yqenDJM';

async function testInsertWithoutReturn() {
  const payload = [{
    full_name: 'SUPABASE TEST CONTACT',
    email: 'test.live@example.com',
    phone: '+91 94918 18015',
    session_type: 'wedding',
    event_date: '2026-12-01',
    message: 'Test submission',
    status: 'NEW',
    internal_notes: ''
  }];

  console.log('\n--- 1. TEST INSERT WITHOUT SELECT RETURN ---');
  const res1 = await fetch(`${URL}/rest/v1/contact_submissions`, {
    method: 'POST',
    headers: {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  console.log(`HTTP Status: ${res1.status}`);
  const text1 = await res1.text();
  console.log(`Response Body: ${text1 || '(Empty - Success 201 Created)'}`);

  console.log('\n--- 2. TEST INSERT WITH SELECT RETURN ---');
  const res2 = await fetch(`${URL}/rest/v1/contact_submissions`, {
    method: 'POST',
    headers: {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(payload)
  });

  console.log(`HTTP Status: ${res2.status}`);
  const text2 = await res2.text();
  console.log(`Response Body: ${text2}`);
}

testInsertWithoutReturn();
