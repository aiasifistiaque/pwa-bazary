import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

export function IOSInstallPrompt() {
	const [showPrompt, setShowPrompt] = useState(false);

	useEffect(() => {
		if (Platform.OS !== 'web') return;

		// Check if iOS
		const userAgent = window.navigator.userAgent.toLowerCase();
		const isIOS = /iphone|ipad|ipod/.test(userAgent);

		// Check if already installed (standalone mode)
		const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

		// Check if user has dismissed before
		const dismissed = localStorage.getItem('ios-install-dismissed');

		if (isIOS && !isStandalone && !dismissed) {
			setShowPrompt(true);
		}
	}, []);

	const handleDismiss = () => {
		localStorage.setItem('ios-install-dismissed', 'true');
		setShowPrompt(false);
	};

	if (!showPrompt) return null;

	return (
		<View style={styles.banner}>
			<View style={styles.content}>
				<Text style={styles.icon}>📲</Text>
				<View style={styles.textContainer}>
					<Text style={styles.title}>Install Bazarey</Text>
					<Text style={styles.message}>
						Tap <Text style={styles.bold}>Share ⎋</Text> then{' '}
						<Text style={styles.bold}>Add to Home Screen</Text>
					</Text>
				</View>
				<Pressable
					onPress={handleDismiss}
					style={styles.closeButton}>
					<Text style={styles.closeText}>✕</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	banner: {
		backgroundColor: '#4CAF50',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#45a049',
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		fontSize: 24,
		marginRight: 12,
	},
	textContainer: {
		flex: 1,
	},
	title: {
		color: 'white',
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 2,
	},
	message: {
		color: 'rgba(255, 255, 255, 0.9)',
		fontSize: 12,
	},
	bold: {
		fontWeight: 'bold',
		color: 'white',
	},
	closeButton: {
		padding: 8,
		marginLeft: 8,
	},
	closeText: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
	},
});
