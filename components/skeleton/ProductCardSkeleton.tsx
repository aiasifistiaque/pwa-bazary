import React from 'react';
import { StyleSheet, View } from 'react-native';

export function ProductCardSkeleton() {
	return (
		<View style={styles.card}>
			<View style={styles.imageContainer} />
			<View style={styles.info}>
				<View style={styles.nameLine} />
				<View style={styles.nameLineShort} />
				<View style={styles.priceLine} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#FFF',
		borderRadius: 12,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		marginBottom: 12,
		minWidth: 180,
		maxWidth: 220,
	},
	imageContainer: {
		width: '100%',
		aspectRatio: 1,
		backgroundColor: '#E0E0E0',
	},
	info: {
		padding: 12,
		gap: 8,
	},
	nameLine: {
		height: 14,
		backgroundColor: '#E0E0E0',
		borderRadius: 4,
		width: '90%',
	},
	nameLineShort: {
		height: 14,
		backgroundColor: '#E0E0E0',
		borderRadius: 4,
		width: '60%',
	},
	priceLine: {
		height: 16,
		backgroundColor: '#E0E0E0',
		borderRadius: 4,
		width: '40%',
		marginTop: 4,
	},
});
