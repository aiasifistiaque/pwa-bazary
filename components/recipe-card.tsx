import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface RecipeCardProps {
	id: string;
	name: string;
	image: string;
	shortDescription?: string;
	onPress: (id: string) => void;
	style?: ViewStyle;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
	id,
	name,
	image,
	shortDescription,
	onPress,
	style,
}) => {
	return (
		<TouchableOpacity
			style={[styles.recipeCard, style]}
			onPress={() => onPress(id)}
			activeOpacity={0.8}>
			<Image
				source={{ uri: image }}
				style={styles.recipeImage}
			/>
			<View style={styles.recipeInfo}>
				<Text
					style={styles.recipeName}
					numberOfLines={1}>
					{name}
				</Text>
				<Text
					style={styles.recipeDescription}
					numberOfLines={2}>
					{shortDescription}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	recipeCard: {
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
		// borderWidth: 1,
		// borderColor: '#E5E5E5',
		overflow: 'hidden',
		// shadowColor: '#000',
		// shadowOffset: { width: 0, height: 2 },
		// shadowOpacity: 0.1,
		// shadowRadius: 4,
		// elevation: 2,
	},
	recipeImage: {
		width: '100%',
		height: 160,
		resizeMode: 'cover',
	},
	recipeInfo: {
		paddingVertical: 12,
		paddingHorizontal: 4,
	},
	recipeName: {
		fontSize: 14,
		fontWeight: '500',
		color: '#000000',
		marginBottom: 4,
	},
	recipeDescription: {
		fontSize: 13,
		color: '#666666',
	},
});
