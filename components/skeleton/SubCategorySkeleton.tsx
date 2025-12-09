import React from 'react';
import { StyleSheet, View } from 'react-native';

export function SubCategorySkeleton() {
	return (
		<View style={styles.card}>
			<View style={styles.imageSkeleton} />
			<View style={styles.textSkeleton} />
			<View style={styles.iconSkeleton} />
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FAFAFA',
		padding: 12,
		borderRadius: 12,
		gap: 12,
		marginBottom: 12,
	},
	imageSkeleton: {
		width: 60,
		height: 60,
		borderRadius: 8,
		backgroundColor: '#E0E0E0',
	},
	textSkeleton: {
		flex: 1,
		height: 16,
		backgroundColor: '#E0E0E0',
		borderRadius: 4,
	},
	iconSkeleton: {
		width: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: '#E0E0E0',
	},
});
