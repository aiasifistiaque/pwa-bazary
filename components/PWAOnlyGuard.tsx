import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface PWAOnlyGuardProps {
	children: React.ReactNode;
}

export default function PWAOnlyGuard({ children }: PWAOnlyGuardProps) {
	const [isStandalone, setIsStandalone] = useState<boolean | null>(null);
	const [isIOS, setIsIOS] = useState(false);

	useEffect(() => {
		if (Platform.OS !== 'web') {
			setIsStandalone(true);
			return;
		}

		// Check if running in standalone mode
		const checkStandalone = () => {
			const standalone =
				(window.navigator as any).standalone === true || // iOS Safari
				window.matchMedia('(display-mode: standalone)').matches || // Standard PWA
				window.matchMedia('(display-mode: fullscreen)').matches;

			setIsStandalone(standalone);

			// Check if iOS
			const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
			setIsIOS(iOS);
		};

		checkStandalone();

		// Listen for display mode changes
		const mediaQuery = window.matchMedia('(display-mode: standalone)');
		const handler = (e: MediaQueryListEvent) => setIsStandalone(e.matches);
		mediaQuery.addEventListener('change', handler);

		return () => mediaQuery.removeEventListener('change', handler);
	}, []);

	// Still checking
	if (isStandalone === null) {
		return (
			<View style={styles.container}>
				<View style={styles.loader} />
			</View>
		);
	}

	// Running in standalone mode - show the app
	if (isStandalone) {
		return <>{children}</>;
	}

	// Running in browser - show install prompt
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				{/* App Icon */}
				<View style={styles.iconContainer}>
					<Text style={styles.iconText}>🛒</Text>
				</View>

				<Text style={styles.title}>Bazarey</Text>
				<Text style={styles.subtitle}>Install our app for the best experience</Text>

				<View style={styles.divider} />

				{isIOS ? (
					<View style={styles.instructions}>
						<Text style={styles.instructionTitle}>How to install on iPhone/iPad:</Text>

						<View style={styles.step}>
							<View style={styles.stepNumber}>
								<Text style={styles.stepNumberText}>1</Text>
							</View>
							<Text style={styles.stepText}>
								Tap the <Text style={styles.bold}>Share</Text> button{' '}
								<Text style={styles.icon}>⎋</Text> at the bottom of Safari
							</Text>
						</View>

						<View style={styles.step}>
							<View style={styles.stepNumber}>
								<Text style={styles.stepNumberText}>2</Text>
							</View>
							<Text style={styles.stepText}>
								Scroll down and tap <Text style={styles.bold}>"Add to Home Screen"</Text>{' '}
								<Text style={styles.icon}>⊕</Text>
							</Text>
						</View>

						<View style={styles.step}>
							<View style={styles.stepNumber}>
								<Text style={styles.stepNumberText}>3</Text>
							</View>
							<Text style={styles.stepText}>
								Tap <Text style={styles.bold}>"Add"</Text> in the top right corner
							</Text>
						</View>

						<View style={styles.step}>
							<View style={styles.stepNumber}>
								<Text style={styles.stepNumberText}>4</Text>
							</View>
							<Text style={styles.stepText}>
								Open <Text style={styles.bold}>Bazarey</Text> from your home screen
							</Text>
						</View>
					</View>
				) : (
					<View style={styles.instructions}>
						<Text style={styles.instructionTitle}>How to install on Android:</Text>

						<View style={styles.step}>
							<View style={styles.stepNumber}>
								<Text style={styles.stepNumberText}>1</Text>
							</View>
							<Text style={styles.stepText}>
								Tap the <Text style={styles.bold}>menu</Text> button{' '}
								<Text style={styles.icon}>⋮</Text> in Chrome
							</Text>
						</View>

						<View style={styles.step}>
							<View style={styles.stepNumber}>
								<Text style={styles.stepNumberText}>2</Text>
							</View>
							<Text style={styles.stepText}>
								Tap <Text style={styles.bold}>"Install app"</Text> or{' '}
								<Text style={styles.bold}>"Add to Home screen"</Text>
							</Text>
						</View>

						<View style={styles.step}>
							<View style={styles.stepNumber}>
								<Text style={styles.stepNumberText}>3</Text>
							</View>
							<Text style={styles.stepText}>
								Tap <Text style={styles.bold}>"Install"</Text> to confirm
							</Text>
						</View>

						<View style={styles.step}>
							<View style={styles.stepNumber}>
								<Text style={styles.stepNumberText}>4</Text>
							</View>
							<Text style={styles.stepText}>
								Open <Text style={styles.bold}>Bazarey</Text> from your home screen
							</Text>
						</View>
					</View>
				)}

				<View style={styles.note}>
					<Text style={styles.noteText}>
						💡 This app is designed to work as an installed app for the best mobile experience.
					</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8f9fa',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	loader: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 3,
		borderColor: '#4CAF50',
		borderTopColor: 'transparent',
	},
	content: {
		backgroundColor: '#fff',
		borderRadius: 20,
		padding: 30,
		maxWidth: 400,
		width: '100%',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 5,
	},
	iconContainer: {
		width: 80,
		height: 80,
		borderRadius: 20,
		backgroundColor: '#4CAF50',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		marginBottom: 20,
	},
	iconText: {
		fontSize: 40,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#1a1a1a',
		textAlign: 'center',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		marginBottom: 20,
	},
	divider: {
		height: 1,
		backgroundColor: '#e0e0e0',
		marginVertical: 20,
	},
	instructions: {
		marginBottom: 20,
	},
	instructionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 16,
	},
	step: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 14,
	},
	stepNumber: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: '#4CAF50',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
		marginTop: 2,
	},
	stepNumberText: {
		color: '#fff',
		fontSize: 12,
		fontWeight: 'bold',
	},
	stepText: {
		flex: 1,
		fontSize: 15,
		color: '#444',
		lineHeight: 22,
	},
	bold: {
		fontWeight: '600',
		color: '#1a1a1a',
	},
	icon: {
		fontSize: 16,
	},
	note: {
		backgroundColor: '#f0f9f0',
		borderRadius: 12,
		padding: 16,
		borderLeftWidth: 4,
		borderLeftColor: '#4CAF50',
	},
	noteText: {
		fontSize: 14,
		color: '#2e7d32',
		lineHeight: 20,
	},
});
