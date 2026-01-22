import { useEffect } from 'react';
import { Platform } from 'react-native';

export function usePWADebug() {
	useEffect(() => {
		if (Platform.OS !== 'web') return;

		console.log('🔍 PWA Debug Info:');

		// Check if manifest is loaded
		const manifestLink = document.querySelector('link[rel="manifest"]');
		console.log('Manifest link:', manifestLink?.getAttribute('href'));

		// Check if service worker is registered
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.getRegistration().then(reg => {
				console.log('Service Worker:', reg ? 'Registered ✅' : 'Not registered ❌');
			});
		} else {
			console.log('Service Worker: Not supported ❌');
		}

		// Check display mode
		const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
		console.log('Display mode:', isStandalone ? 'Standalone ✅' : 'Browser');

		// Check if installable
		window.addEventListener('beforeinstallprompt', e => {
			console.log('Install prompt available ✅');
		});

		// Check manifest
		fetch('/manifest.json')
			.then(r => r.json())
			.then(manifest => {
				console.log('Manifest loaded:', manifest);
			})
			.catch(e => console.error('Manifest error:', e));
	}, []);
}
