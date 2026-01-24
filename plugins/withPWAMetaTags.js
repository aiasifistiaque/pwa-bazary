const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withPWAMetaTags = config => {
	return withDangerousMod(config, [
		'web',
		async config => {
			const indexPath = path.join(config.modRequest.platformProjectRoot, 'index.html');

			if (fs.existsSync(indexPath)) {
				let html = fs.readFileSync(indexPath, 'utf-8');

				// Add PWA meta tags if not already present
				if (!html.includes('apple-mobile-web-app-capable')) {
					const metaTags = `
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Bazarey">
    <meta name="theme-color" content="#4CAF50">
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
`;
					html = html.replace('</head>', metaTags + '</head>');
					fs.writeFileSync(indexPath, html);
				}
			}

			return config;
		},
	]);
};

module.exports = withPWAMetaTags;
