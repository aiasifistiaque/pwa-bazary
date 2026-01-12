import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomColors } from '@/constants/theme';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ComingSoonScreen() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<IconSymbol name='chevron.left' size={24} color='#000000' />
				</Pressable>
				<Text style={styles.headerTitle}>Coming Soon</Text>
				<View style={{ width: 40 }} />
			</View>

			<View style={styles.content}>
				<View style={styles.iconContainer}>
					<IconSymbol name='sparkles' size={64} color='#FFFFFF' />
				</View>

				<Text style={styles.title}>Something Amazing is in the Works!</Text>
				<Text style={styles.description}>
					We are working hard to bring you this excitement feature. Stay tuned
					for the next update of Bazarey!
				</Text>

				<View style={styles.progressContainer}>
					<View style={styles.progressBar}>
						<View style={styles.progressFill} />
					</View>
					<Text style={styles.progressText}>Development in progress...</Text>
				</View>

				<Pressable style={styles.notifyButton} onPress={() => router.back()}>
					<Text style={styles.notifyButtonText}>Back to Home</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	backButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
	},
	content: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 32,
	},
	iconContainer: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: CustomColors.darkGreen,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 32,
		shadowColor: CustomColors.darkGreen,
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 16,
		elevation: 8,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: CustomColors.textColor,
		textAlign: 'center',
		marginBottom: 16,
	},
	description: {
		fontSize: 16,
		color: CustomColors.subTextColor,
		textAlign: 'center',
		marginBottom: 48,
		lineHeight: 24,
	},
	progressContainer: {
		width: '100%',
		marginBottom: 48,
	},
	progressBar: {
		height: 8,
		backgroundColor: '#F0F0F0',
		borderRadius: 4,
		overflow: 'hidden',
		marginBottom: 8,
	},
	progressFill: {
		width: '70%',
		height: '100%',
		backgroundColor: CustomColors.lightBrown,
		borderRadius: 4,
	},
	progressText: {
		fontSize: 12,
		color: '#999999',
		textAlign: 'center',
		fontStyle: 'italic',
	},
	notifyButton: {
		backgroundColor: CustomColors.darkBrown,
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 12,
		width: '100%',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4,
	},
	notifyButtonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
});
