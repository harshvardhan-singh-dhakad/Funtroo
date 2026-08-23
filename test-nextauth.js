const http = require('http');

async function testLogin() {
  console.log('Fetching CSRF token...');
  const csrfRes = await fetch('http://localhost:3000/api/auth/csrf');
  const csrfData = await csrfRes.json();
  const csrfToken = csrfData.csrfToken;
  
  // Need to get cookies to send back
  const cookies = csrfRes.headers.get('set-cookie');
  console.log('CSRF Token:', csrfToken);
  
  console.log('Attempting login...');
  const loginRes = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies
    },
    body: new URLSearchParams({
      csrfToken: csrfToken,
      email: 'deepakdhakad5421@gmail.com',
      password: 'FUNtroo@7811',
      json: 'true'
    })
  });
  
  const loginData = await loginRes.json();
  console.log('Login Response:', loginData);
}
testLogin();
