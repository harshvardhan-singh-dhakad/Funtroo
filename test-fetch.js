const http = require('http');

async function testFetch() {
  const projectId = 'funtrooo'
  const dbRes = await fetch('https://firestore.googleapis.com/v1/projects/' + projectId + '/databases/(default)/documents/customers')
  const dbData = await dbRes.json()
  if (dbData.documents) {
    for (const doc of dbData.documents) {
      console.log(doc.fields.email?.stringValue, doc.fields.role?.stringValue)
    }
  }
}
testFetch();
