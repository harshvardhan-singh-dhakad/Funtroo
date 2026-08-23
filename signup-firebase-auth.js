const apiKey = 'AIzaSyCxaXgTcYCZxzLvE6UKy9f4MkrEdJlL44c'
const email = 'deepakdhakad5421@gmail.com'
const password = 'FUNtroo@7811'

async function signUp() {
  const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true })
  })
  const data = await res.json()
  console.log(data)
}
signUp()
