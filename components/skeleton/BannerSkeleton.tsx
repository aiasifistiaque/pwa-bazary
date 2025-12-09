import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.8;

export function BannerSkeleton() {
	return (
		<View style={[styles.container, { width: CARD_WIDTH }]}>
			<View style={styles.imageSkeleton} />
			<View style={styles.textContainer}>
				<View style={styles.titleSkeleton} />
				<View style={styles.descriptionSkeleton} />
				<View style={styles.descriptionSkeletonShort} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 180,
		backgroundColor: '#FFF',
		borderRadius: 12,
		overflow: 'hidden',
		position: 'relative',
		// Maintain similar shadow/elevation as PromoBanner if desired,
		// but skeletons typically are flat or just have a subtle border.
		borderWidth: 1,
		borderColor: '#EFEFEF',
	},
	imageSkeleton: {
		width: '100%',
		height: '100%',
		backgroundColor: '#E5E5E5', // Skeleton gray
	},
	textContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		padding: 16,
		justifyContent: 'center',
	},
	titleSkeleton: {
		width: '60%',
		height: 24,
		backgroundColor: 'rgba(255,255,255,0.5)', // Semi-transparent on top of image bg
		marginBottom: 12,
		borderRadius: 4,
	},
	descriptionSkeleton: {
		width: '80%',
		height: 14,
		backgroundColor: 'rgba(255,255,255,0.5)',
		marginBottom: 6,
		borderRadius: 4,
	},
	descriptionSkeletonShort: {
		width: '40%',
		height: 14,
		backgroundColor: 'rgba(255,255,255,0.5)',
		borderRadius: 4,
	},
});
