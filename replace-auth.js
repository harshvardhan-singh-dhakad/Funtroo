const fs = require('fs')
const path = require('path')

function walk(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach(file => {
    file = path.join(dir, file)
    const stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file))
    } else {
      if (file.endsWith('route.ts')) results.push(file)
    }
  })
  return results
}

const files = walk('app/api')
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8')
  if (content.includes("(session.user as any)?.role !== 'admin'")) {
    content = content.replace(/\(session\.user as any\)\?\.role !== 'admin'/g, "!['admin', 'superadmin'].includes((session.user as any)?.role)")
    fs.writeFileSync(file, content, 'utf8')
  }
})
