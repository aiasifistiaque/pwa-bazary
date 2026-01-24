const fs = require('fs');
const path = require('path');

console.log('🔧 Injecting PWA meta tags into index.html...');

const indexPath = path.join(__dirname, '../dist/index.html');

if (!fs.existsSync(indexPath)) {
  console.error('❌ dist/index.html not found!');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf-8');

// Check if tags are already present
if (html.includes('apple-mobile-web-app-capable')) {
  console.log('✅ PWA meta tags already present');
  process.exit(0);
}

const metaTags = `    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Bazarey">
    <meta name="theme-color" content="#4CAF50">
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
`;

// Inject before </head>
html = html.replace('</head>', metaTags + '</head>');

fs.writeFileSync(indexPath, html, 'utf-8');

console.log('✅ PWA meta tags injected successfully!');

// Verify injection
const verifyHtml = fs.readFileSync(indexPath, 'utf-8');
if (verifyHtml.includes('apple-mobile-web-app-capable') && verifyHtml.includes('manifest')) {
  console.log('✅ Verification successful - meta tags are present');
} else {
  console.error('❌ Verification failed - meta tags not found after injection');
  process.exit(1);
}
