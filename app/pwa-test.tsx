import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';

export default function PWATestPage() {
	const [checks, setChecks] = useState<any>({});

	useEffect(() => {
		if (Platform.OS !== 'web') {
			setChecks({ notWeb: true });
			return;
		}

		const runChecks = async () => {
			const results: any = {};

			// Check 1: Is HTTPS?
			results.https = window.location.protocol === 'https:' || window.location.hostname === 'localhost';

			// Check 2: Service Worker support
			results.swSupported = 'serviceWorker' in navigator;

			// Check 3: Service Worker registered?
			if (results.swSupported) {
				const reg = await navigator.serviceWorker.getRegistration();
				results.swRegistered = !!reg;
			}

			// Check 4: Manifest link present?
			const manifestLink = document.querySelector('link[rel="manifest"]');
			results.manifestLink = !!manifestLink;

			// Check 5: Can fetch manifest?
			if (results.manifestLink) {
				try {
					const response = await fetch('/manifest.json');
					results.manifestFetch = response.ok;
					if (response.ok) {
						const manifest = await response.json();
						results.manifestData = manifest;
					}
				} catch (e) {
					results.manifestFetch = false;
				}
			}

			// Check 6: Apple meta tags?
			results.appleMeta = !!document.querySelector('meta[name="apple-mobile-web-app-capable"]');

			// Check 7: Display mode
			results.standalone = window.matchMedia('(display-mode: standalone)').matches;

			// Check 8: User agent
			results.userAgent = navigator.userAgent;
			results.isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
			results.isAndroid = /android/i.test(navigator.userAgent);

			// Check 9: Install prompt available?
			window.addEventListener('beforeinstallprompt', () => {
				results.installPrompt = true;
				setChecks({ ...results });
			});

			setChecks(results);
		};

		runChecks();
	}, []);

	if (Platform.OS !== 'web') {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Not on Web Platform</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>PWA Installation Checklist</Text>
				<Text style={styles.subtitle}>Debug your PWA setup</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Environment</Text>
				<CheckItem label="HTTPS or localhost" value={checks.https} />
				<CheckItem label="iOS Device" value={checks.isIOS} />
				<CheckItem label="Android Device" value={checks.isAndroid} />
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Service Worker</Text>
				<CheckItem label="Service Worker Supported" value={checks.swSupported} />
				<CheckItem label="Service Worker Registered" value={checks.swRegistered} />
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Manifest</Text>
				<CheckItem label="Manifest Link Present" value={checks.manifestLink} />
				<CheckItem label="Manifest Fetchable" value={checks.manifestFetch} />
				{checks.manifestData && (
					<View style={styles.detail}>
						<Text style={styles.detailText}>Name: {checks.manifestData.name}</Text>
						<Text style={styles.detailText}>Display: {checks.manifestData.display}</Text>
						<Text style={styles.detailText}>Start URL: {checks.manifestData.start_url}</Text>
						<Text style={styles.detailText}>Icons: {checks.manifestData.icons?.length || 0}</Text>
					</View>
				)}
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>iOS PWA Support</Text>
				<CheckItem label="Apple Meta Tags Present" value={checks.appleMeta} />
				<CheckItem label="Running in Standalone Mode" value={checks.standalone} />
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Android PWA Support</Text>
				<CheckItem label="Install Prompt Available" value={checks.installPrompt} />
			</View>

			<View style={styles.instructions}>
				<Text style={styles.instructionsTitle}>Installation Instructions</Text>
				
				{checks.isIOS && (
					<View style={styles.instructionBlock}>
						<Text style={styles.instructionPlatform}>📱 iOS (Safari)</Text>
						<Text style={styles.instructionText}>1. Tap Share button (⎋)</Text>
						<Text style={styles.instructionText}>2. Scroll and tap "Add to Home Screen"</Text>
						<Text style={styles.instructionText}>3. Tap "Add"</Text>
						<Text style={styles.instructionText}>4. Open from home screen icon</Text>
					</View>
				)}

				{checks.isAndroid && (
					<View style={styles.instructionBlock}>
						<Text style={styles.instructionPlatform}>🤖 Android (Chrome)</Text>
						<Text style={styles.instructionText}>1. Tap menu (⋮)</Text>
						<Text style={styles.instructionText}>2. Tap "Install app" or "Add to Home Screen"</Text>
						<Text style={styles.instructionText}>3. Tap "Install"</Text>
						<Text style={styles.instructionText}>4. Open from home screen icon</Text>
					</View>
				)}

				{!checks.https && (
					<View style={styles.warning}>
						<Text style={styles.warningText}>⚠️ HTTPS required for PWA installation!</Text>
						<Text style={styles.warningSubtext}>Deploy to Vercel or use localhost for testing</Text>
					</View>
				)}

				{checks.standalone && (
					<View style={styles.success}>
						<Text style={styles.successText}>✅ App is running in standalone mode!</Text>
					</View>
				)}
			</View>
		</ScrollView>
	);
}

function CheckItem({ label, value }: { label: string; value: boolean | undefined }) {
	const icon = value === true ? '✅' : value === false ? '❌' : '⏳';
	const color = value === true ? '#4CAF50' : value === false ? '#f44336' : '#999';

	return (
		<View style={styles.checkItem}>
			<Text style={styles.checkIcon}>{icon}</Text>
			<Text style={[styles.checkLabel, { color }]}>{label}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		backgroundColor: '#4CAF50',
		padding: 24,
		paddingTop: 60,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'white',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: 'rgba(255,255,255,0.9)',
	},
	section: {
		backgroundColor: 'white',
		margin: 16,
		padding: 16,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 12,
	},
	checkItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
	},
	checkIcon: {
		fontSize: 20,
		marginRight: 12,
	},
	checkLabel: {
		fontSize: 16,
	},
	detail: {
		backgroundColor: '#f9f9f9',
		padding: 12,
		borderRadius: 8,
		marginTop: 8,
	},
	detailText: {
		fontSize: 14,
		color: '#666',
		marginBottom: 4,
	},
	instructions: {
		margin: 16,
		padding: 16,
		backgroundColor: 'white',
		borderRadius: 12,
	},
	instructionsTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 16,
	},
	instructionBlock: {
		marginBottom: 16,
	},
	instructionPlatform: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#4CAF50',
		marginBottom: 8,
	},
	instructionText: {
		fontSize: 14,
		color: '#666',
		marginLeft: 8,
		marginBottom: 4,
	},
	warning: {
		backgroundColor: '#fff3cd',
		padding: 16,
		borderRadius: 8,
		marginTop: 16,
		borderLeftWidth: 4,
		borderLeftColor: '#ff9800',
	},
	warningText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#856404',
		marginBottom: 4,
	},
	warningSubtext: {
		fontSize: 14,
		color: '#856404',
	},
	success: {
		backgroundColor: '#d4edda',
		padding: 16,
		borderRadius: 8,
		marginTop: 16,
		borderLeftWidth: 4,
		borderLeftColor: '#4CAF50',
	},
	successText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#155724',
	},
});
