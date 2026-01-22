import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { usePWADebug } from '@/hooks/use-pwa-debug';

export default function DownloadPage() {
	const router = useRouter();
	const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
	const [isInstalled, setIsInstalled] = useState(false);
	const [isIOS, setIsIOS] = useState(false);
	
	// Debug PWA setup
	usePWADebug();

	useEffect(() => {
		if (Platform.OS !== 'web') return;

		// Check if already installed
		if (window.matchMedia('(display-mode: standalone)').matches) {
			setIsInstalled(true);
			// Redirect to home immediately
			router.replace('/');
			return;
		}

		// Check if iOS
		const userAgent = window.navigator.userAgent.toLowerCase();
		const iOS = /iphone|ipad|ipod/.test(userAgent);
		setIsIOS(iOS);

		// Listen for beforeinstallprompt event (Android/Chrome)
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e);
			// Automatically trigger install prompt immediately
			setTimeout(() => {
				showInstallPrompt(e);
			}, 100);
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
		};
	}, []);

	const showInstallPrompt = async (promptEvent?: any) => {
		const prompt = promptEvent || deferredPrompt;

		if (!prompt) {
			console.log('No install prompt available');
			// If no prompt available, redirect to home
			setTimeout(() => router.replace('/'), 2000);
			return;
		}

		// Show the install prompt
		prompt.prompt();

		// Wait for user response
		const { outcome } = await prompt.userChoice;

		if (outcome === 'accepted') {
			console.log('User accepted the install prompt');
			setDeferredPrompt(null);
			// Redirect to home after installation
			router.replace('/');
		} else {
			console.log('User dismissed the install prompt');
			// Still redirect to home if dismissed
			setTimeout(() => router.replace('/'), 1500);
		}
	};

	const handleManualInstall = () => {
		if (deferredPrompt) {
			showInstallPrompt();
		}
	};

	const handleGoHome = () => {
		router.replace('/');
	};

	if (Platform.OS !== 'web') {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Already Using Native App</Text>
				<Text style={styles.message}>You're using the native version!</Text>
			</View>
		);
	}

	if (isInstalled) {
		return (
			<View style={styles.container}>
				<View style={styles.content}>
					<Text style={styles.icon}>✅</Text>
					<Text style={styles.title}>Already Installed!</Text>
					<Text style={styles.message}>Bazarey is already installed on your device.</Text>
					<Text style={styles.submessage}>Redirecting to app...</Text>
				</View>
			</View>
		);
	}

	if (isIOS) {
		return (
			<View style={styles.container}>
				<View style={styles.content}>
					<Text style={styles.icon}>📱</Text>
					<Text style={styles.title}>Install Bazarey</Text>
					<Text style={styles.message}>To install this app on your iPhone or iPad:</Text>

					<View style={styles.steps}>
						<View style={styles.step}>
							<Text style={styles.stepNumber}>1</Text>
							<Text style={styles.stepText}>
								Tap the <Text style={styles.bold}>Share</Text> button{' '}
								<Text style={styles.icon2}>⎋</Text> at the bottom of Safari
							</Text>
						</View>

						<View style={styles.step}>
							<Text style={styles.stepNumber}>2</Text>
							<Text style={styles.stepText}>
								Scroll down and tap <Text style={styles.bold}>"Add to Home Screen"</Text>{' '}
								<Text style={styles.icon2}>➕</Text>
							</Text>
						</View>

						<View style={styles.step}>
							<Text style={styles.stepNumber}>3</Text>
							<Text style={styles.stepText}>
								Tap <Text style={styles.bold}>"Add"</Text> in the top right
							</Text>
						</View>
					</View>

					<Pressable
						style={styles.button}
						onPress={handleGoHome}>
						<Text style={styles.buttonText}>Open App</Text>
					</Pressable>
				</View>
			</View>
		);
	}

	// Android/Chrome - waiting for prompt or showing manual button
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.icon}>📲</Text>
				<Text style={styles.title}>Install Bazarey</Text>
				<Text style={styles.message}>
					{deferredPrompt
						? 'Click below to install the app on your device'
						: 'Installing Bazarey as an app...'}
				</Text>

				{deferredPrompt && (
					<Pressable
						style={styles.installButton}
						onPress={handleManualInstall}>
						<Text style={styles.installButtonText}>Install App</Text>
					</Pressable>
				)}

				<Pressable
					style={styles.linkButton}
					onPress={handleGoHome}>
					<Text style={styles.linkText}>Use in Browser Instead</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	content: {
		maxWidth: 500,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 40,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 5,
		width: '100%',
	},
	icon: {
		fontSize: 80,
		marginBottom: 20,
	},
	icon2: {
		fontSize: 18,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 16,
		textAlign: 'center',
	},
	message: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		marginBottom: 24,
		lineHeight: 24,
	},
	submessage: {
		fontSize: 14,
		color: '#999',
		textAlign: 'center',
		marginTop: 12,
	},
	steps: {
		width: '100%',
		marginBottom: 24,
	},
	step: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 20,
		paddingLeft: 10,
	},
	stepNumber: {
		width: 32,
		height: 32,
		backgroundColor: '#4CAF50',
		color: 'white',
		borderRadius: 16,
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
		lineHeight: 32,
		marginRight: 12,
	},
	stepText: {
		flex: 1,
		fontSize: 15,
		color: '#555',
		lineHeight: 22,
		paddingTop: 5,
	},
	bold: {
		fontWeight: 'bold',
		color: '#333',
	},
	installButton: {
		backgroundColor: '#4CAF50',
		paddingVertical: 16,
		paddingHorizontal: 40,
		borderRadius: 25,
		marginBottom: 16,
		width: '100%',
		alignItems: 'center',
	},
	installButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	button: {
		backgroundColor: '#4CAF50',
		paddingVertical: 14,
		paddingHorizontal: 32,
		borderRadius: 25,
		width: '100%',
		alignItems: 'center',
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
	},
	linkButton: {
		paddingVertical: 12,
		paddingHorizontal: 24,
	},
	linkText: {
		color: '#4CAF50',
		fontSize: 16,
		textDecorationLine: 'underline',
	},
});
