import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

export function MobileOnlyGuard({ children }: { children: React.ReactNode }) {
	const [isMobile, setIsMobile] = useState(true);

	useEffect(() => {
		if (Platform.OS === 'web') {
			const checkIfMobile = () => {
				const userAgent = navigator.userAgent.toLowerCase();
				const isMobileDevice =
					/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
				const windowWidth = window.innerWidth;
				const isSmallScreen = windowWidth <= 768;

				// Check if it's a mobile device OR a small screen
				setIsMobile(isMobileDevice || isSmallScreen);
			};

			checkIfMobile();
			window.addEventListener('resize', checkIfMobile);

			return () => window.removeEventListener('resize', checkIfMobile);
		}
	}, []);

	// On native platforms, always show content
	if (Platform.OS !== 'web') {
		return <>{children}</>;
	}

	// On web, show content only for mobile
	if (!isMobile) {
		return (
			<View style={styles.container}>
				<View style={styles.content}>
					<Text style={styles.icon}>📱</Text>
					<Text style={styles.title}>Mobile Only</Text>
					<Text style={styles.message}>
						This application is designed exclusively for mobile devices.
					</Text>
					<Text style={styles.submessage}>
						Please access this app from your smartphone or tablet.
					</Text>
					<View style={styles.qrContainer}>
						<Text style={styles.qrText}>Scan QR code with your mobile device:</Text>
						{/* Add QR code generation here if needed */}
					</View>
				</View>
			</View>
		);
	}

	return <>{children}</>;
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
	},
	icon: {
		fontSize: 80,
		marginBottom: 20,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 16,
		textAlign: 'center',
	},
	message: {
		fontSize: 18,
		color: '#666',
		textAlign: 'center',
		marginBottom: 12,
		lineHeight: 26,
	},
	submessage: {
		fontSize: 16,
		color: '#999',
		textAlign: 'center',
		marginBottom: 30,
	},
	qrContainer: {
		marginTop: 20,
		padding: 20,
		backgroundColor: '#f9f9f9',
		borderRadius: 12,
		alignItems: 'center',
	},
	qrText: {
		fontSize: 14,
		color: '#666',
		marginBottom: 12,
	},
});
