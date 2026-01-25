import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, StyleProp, ViewStyle } from 'react-native';

const RecipeCardSkeleton = ({ style }: { style?: StyleProp<ViewStyle> }) => {
	const shimmerAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(shimmerAnim, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(shimmerAnim, {
					toValue: 0,
					duration: 1000,
					useNativeDriver: true,
				}),
			]),
		).start();
	}, []);

	const opacity = shimmerAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0.3, 0.7],
	});

	return (
		<View style={[styles.card, style]}>
			<Animated.View style={[styles.imageSkeleton, { opacity }]} />
			<View style={styles.info}>
				<Animated.View style={[styles.titleSkeleton, { opacity }]} />
				<Animated.View style={[styles.descriptionSkeleton, { opacity }]} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		width: '100%',
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5E5',
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	imageSkeleton: {
		width: '100%',
		height: 160,
		backgroundColor: '#E5E5E5',
	},
	info: {
		padding: 12,
	},
	titleSkeleton: {
		height: 18,
		backgroundColor: '#E5E5E5',
		borderRadius: 4,
		marginBottom: 8,
		width: '70%',
	},
	descriptionSkeleton: {
		height: 14,
		backgroundColor: '#E5E5E5',
		borderRadius: 4,
		width: '90%',
	},
});

export default RecipeCardSkeleton;
