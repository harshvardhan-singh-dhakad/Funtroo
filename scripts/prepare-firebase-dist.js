// Script to prepare dist folder for Firebase Hosting from Next.js build output
const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

function prepareDist() {
  console.log('📦 Preparing Firebase Hosting deployment folder (dist)...');
  
  const distDir = path.resolve(__dirname, '../dist');
  const publicDir = path.resolve(__dirname, '../public');
  const nextStaticDir = path.resolve(__dirname, '../.next/static');
  const nextAppServerDir = path.resolve(__dirname, '../.next/server/app');

  // Clean dist directory
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  // 1. Copy public/ assets
  if (fs.existsSync(publicDir)) {
    copyRecursiveSync(publicDir, distDir);
    console.log('✅ Copied public/ assets to dist');
  }

  // 2. Copy .next/static to dist/_next/static
  const distNextStatic = path.join(distDir, '_next/static');
  if (fs.existsSync(nextStaticDir)) {
    copyRecursiveSync(nextStaticDir, distNextStatic);
    console.log('✅ Copied .next/static assets to dist/_next/static');
  }

  // 3. Copy HTML pages from .next/server/app
  if (fs.existsSync(nextAppServerDir)) {
    const copyHtmlFiles = (dir, baseTarget) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          const targetSubDir = path.join(baseTarget, item);
          copyHtmlFiles(fullPath, targetSubDir);
        } else if (item.endsWith('.html')) {
          let targetName = item;
          if (item === 'page.html') targetName = 'index.html';
          const targetFile = path.join(baseTarget, targetName);
          copyRecursiveSync(fullPath, targetFile);
          console.log(`📄 Copied HTML: ${path.relative(nextAppServerDir, fullPath)} -> ${path.relative(distDir, targetFile)}`);
        }
      }
    };

    copyHtmlFiles(nextAppServerDir, distDir);
  }

  // Ensure root index.html exists
  const distIndex = path.join(distDir, 'index.html');
  if (!fs.existsSync(distIndex)) {
    const shopIndex = path.join(distDir, 'shop/index.html');
    if (fs.existsSync(shopIndex)) {
      fs.copyFileSync(shopIndex, distIndex);
    }
  }

  console.log('🎉 Firebase dist folder ready for deployment!');
}

try {
  prepareDist();
} catch (err) {
  console.error('❌ Error preparing dist:', err);
  process.exit(1);
}
