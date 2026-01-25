const fs = require('fs');
const path = require('path');

console.log('🔧 Injecting PWA meta tags into ALL HTML files...');

const distDir = path.join(__dirname, '../dist');

const metaTags = `    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Bazarey">
    <meta name="theme-color" content="#4CAF50">
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
`;

// Function to recursively find all HTML files
function findHtmlFiles(dir) {
	const files = [];

	if (!fs.existsSync(dir)) {
		return files;
	}

	const items = fs.readdirSync(dir);

	for (const item of items) {
		const fullPath = path.join(dir, item);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			files.push(...findHtmlFiles(fullPath));
		} else if (item.endsWith('.html')) {
			files.push(fullPath);
		}
	}

	return files;
}

// Find all HTML files
const htmlFiles = findHtmlFiles(distDir);
console.log(`Found ${htmlFiles.length} HTML files to process`);

if (htmlFiles.length === 0) {
	console.error('❌ No HTML files found in dist directory!');
	process.exit(1);
}

let injectedCount = 0;
let skippedCount = 0;

for (const htmlFile of htmlFiles) {
	let html = fs.readFileSync(htmlFile, 'utf-8');
	const relativePath = path.relative(distDir, htmlFile);

	// Check if tags are already present
	if (html.includes('apple-mobile-web-app-capable')) {
		console.log(`⏭️  Skipping ${relativePath} (already has tags)`);
		skippedCount++;
		continue;
	}

	// Inject before </head>
	if (html.includes('</head>')) {
		html = html.replace('</head>', metaTags + '</head>');
		fs.writeFileSync(htmlFile, html, 'utf-8');
		injectedCount++;
		console.log(`✅ Injected into ${relativePath}`);
	} else {
		console.log(`⚠️  No </head> found in ${relativePath}`);
	}
}

console.log(`\n📊 Summary:`);
console.log(`   ✅ Injected: ${injectedCount} files`);
console.log(`   ⏭️  Skipped: ${skippedCount} files`);
console.log(`   📁 Total: ${htmlFiles.length} files`);

// Verify main index.html
const indexPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexPath)) {
	const indexHtml = fs.readFileSync(indexPath, 'utf-8');
	if (indexHtml.includes('apple-mobile-web-app-capable') && indexHtml.includes('rel="manifest"')) {
		console.log('\n✅ Verification: index.html has all required tags');
	} else {
		console.error('\n❌ Verification failed: index.html missing tags');
		process.exit(1);
	}
}
