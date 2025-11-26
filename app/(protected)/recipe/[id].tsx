import { IconSymbol } from '@/components/ui/icon-symbol';
import { addToCart } from '@/store/slices/cartSlice';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
	Image,
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useDispatch } from 'react-redux';

type Ingredient = {
	id: string;
	name: string;
	quantity: string;
	price: number;
	image: string;
	productId: string;
};

type Recipe = {
	id: string;
	name: string;
	description: string;
	image: string;
	ingredients: Ingredient[];
};

const recipesData: Record<string, Recipe> = {
	recipe1: {
		id: 'recipe1',
		name: 'Khichuri Recipe',
		description: 'Traditional Bengali comfort food - perfect for rainy days',
		image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=400&fit=crop',
		ingredients: [
			{
				id: 'ing1',
				name: 'Basmati Rice',
				quantity: '500g',
				price: 150,
				image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop',
				productId: 'rice1',
			},
			{
				id: 'ing2',
				name: 'Moong Dal (Yellow Lentils)',
				quantity: '250g',
				price: 80,
				image: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=200&h=200&fit=crop',
				productId: 'dal1',
			},
			{
				id: 'ing3',
				name: 'Khichuri Masala',
				quantity: '50g',
				price: 45,
				image: 'https://images.unsplash.com/photo-1596040033229-a0b34e5e5a88?w=200&h=200&fit=crop',
				productId: 'masala1',
			},
			{
				id: 'ing4',
				name: 'Ghee (Clarified Butter)',
				quantity: '100ml',
				price: 120,
				image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop',
				productId: 'ghee1',
			},
			{
				id: 'ing5',
				name: 'Mixed Vegetables',
				quantity: '300g',
				price: 60,
				image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200&h=200&fit=crop',
				productId: 'veg1',
			},
		],
	},
	recipe2: {
		id: 'recipe2',
		name: 'Teheri Recipe',
		description: 'Flavorful rice dish with aromatic spices',
		image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=400&fit=crop',
		ingredients: [
			{
				id: 'ing1',
				name: 'Basmati Rice',
				quantity: '500g',
				price: 150,
				image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop',
				productId: 'rice1',
			},
			{
				id: 'ing2',
				name: 'Potatoes',
				quantity: '400g',
				price: 40,
				image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop',
				productId: 'potato1',
			},
			{
				id: 'ing3',
				name: 'Teheri Masala Mix',
				quantity: '60g',
				price: 55,
				image: 'https://images.unsplash.com/photo-1596040033229-a0b34e5e5a88?w=200&h=200&fit=crop',
				productId: 'masala2',
			},
			{
				id: 'ing4',
				name: 'Cooking Oil',
				quantity: '200ml',
				price: 90,
				image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop',
				productId: 'oil1',
			},
			{
				id: 'ing5',
				name: 'Fried Onions',
				quantity: '100g',
				price: 70,
				image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cbe?w=200&h=200&fit=crop',
				productId: 'onion1',
			},
		],
	},
	recipe3: {
		id: 'recipe3',
		name: 'Biryani Recipe',
		description: 'Aromatic rice with tender meat and rich spices',
		image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=400&fit=crop',
		ingredients: [
			{
				id: 'ing1',
				name: 'Basmati Rice',
				quantity: '1kg',
				price: 280,
				image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop',
				productId: 'rice1',
			},
			{
				id: 'ing2',
				name: 'Chicken (Cut Pieces)',
				quantity: '800g',
				price: 350,
				image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200&h=200&fit=crop',
				productId: 'chicken1',
			},
			{
				id: 'ing3',
				name: 'Biryani Masala',
				quantity: '80g',
				price: 85,
				image: 'https://images.unsplash.com/photo-1596040033229-a0b34e5e5a88?w=200&h=200&fit=crop',
				productId: 'masala3',
			},
			{
				id: 'ing4',
				name: 'Yogurt',
				quantity: '250g',
				price: 65,
				image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop',
				productId: 'yogurt1',
			},
			{
				id: 'ing5',
				name: 'Ghee (Clarified Butter)',
				quantity: '150ml',
				price: 180,
				image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop',
				productId: 'ghee1',
			},
		],
	},
	recipe4: {
		id: 'recipe4',
		name: 'Polao Recipe',
		description: 'Fragrant basmati rice dish with subtle spices',
		image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=400&fit=crop',
		ingredients: [
			{
				id: 'ing1',
				name: 'Basmati Rice',
				quantity: '500g',
				price: 150,
				image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop',
				productId: 'rice1',
			},
			{
				id: 'ing2',
				name: 'Whole Spices (Bay Leaf, Cinnamon)',
				quantity: '30g',
				price: 50,
				image: 'https://images.unsplash.com/photo-1596040033229-a0b34e5e5a88?w=200&h=200&fit=crop',
				productId: 'spices1',
			},
			{
				id: 'ing3',
				name: 'Ghee (Clarified Butter)',
				quantity: '100ml',
				price: 120,
				image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop',
				productId: 'ghee1',
			},
			{
				id: 'ing4',
				name: 'Green Peas',
				quantity: '200g',
				price: 45,
				image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200&h=200&fit=crop',
				productId: 'peas1',
			},
		],
	},
};

export default function RecipeDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const dispatch = useDispatch();
	const recipe = recipesData[id || 'recipe1'];

	// Track selected ingredients with all selected by default
	const [selectedIngredients, setSelectedIngredients] = useState<Record<string, boolean>>(
		recipe.ingredients.reduce((acc, ing) => ({ ...acc, [ing.id]: true }), {})
	);

	const toggleIngredient = (ingredientId: string, index: number) => {
		// First two ingredients cannot be unchecked
		if (index < 2) return;

		setSelectedIngredients(prev => ({
			...prev,
			[ingredientId]: !prev[ingredientId],
		}));
	};

	const calculateTotal = () => {
		return recipe.ingredients.reduce((total, ingredient) => {
			if (selectedIngredients[ingredient.id]) {
				return total + ingredient.price;
			}
			return total;
		}, 0);
	};

	const handleAddAllToCart = () => {
		recipe.ingredients.forEach(ingredient => {
			if (selectedIngredients[ingredient.id]) {
				dispatch(
					addToCart({
						item: {
							id: ingredient.productId,
							_id: ingredient.productId,
							name: ingredient.name,
							price: ingredient.price,
							image: ingredient.image,
							vat: 0,
						},
						qty: 1,
					})
				);
			}
		});
		router.back();
	};

	const selectedCount = Object.values(selectedIngredients).filter(Boolean).length;
	const total = calculateTotal();

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView
				style={styles.container}
				showsVerticalScrollIndicator={false}>
				{/* Header Actions */}
				<View style={styles.headerActions}>
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.backButton}
						activeOpacity={0.7}>
						<IconSymbol
							name='chevron.left'
							size={24}
							color='#000'
						/>
					</TouchableOpacity>
				</View>

				{/* Recipe Image */}
				<Image
					source={{ uri: recipe.image }}
					style={styles.recipeImage}
				/>

				{/* Recipe Info */}
				<View style={styles.recipeInfo}>
					<Text style={styles.recipeDescription}>{recipe.description}</Text>
				</View>

				{/* Ingredients Section */}
				<View style={styles.ingredientsSection}>
					<Text style={styles.sectionTitle}>
						Ingredients ({selectedCount}/{recipe.ingredients.length})
					</Text>

					{recipe.ingredients.map((ingredient, index) => {
						const isSelected = selectedIngredients[ingredient.id];
						const isRequired = index < 2; // First two ingredients are required
						return (
							<Pressable
								key={ingredient.id}
								style={[styles.ingredientCard, !isSelected && styles.ingredientCardDisabled]}
								onPress={() => toggleIngredient(ingredient.id, index)}
								disabled={isRequired}>
								{/* Checkbox */}
								<Pressable
									style={styles.checkboxContainer}
									onPress={() => toggleIngredient(ingredient.id, index)}
									disabled={isRequired}>
									<View
										style={[
											styles.checkbox,
											isSelected && styles.checkboxChecked,
											isRequired && styles.checkboxDisabled,
										]}>
										{isSelected && (
											<IconSymbol
												name='checkmark'
												size={16}
												color='#FFFFFF'
											/>
										)}
									</View>
								</Pressable>

								{/* Ingredient Image */}
								<Image
									source={{ uri: ingredient.image }}
									style={styles.ingredientImage}
								/>

								{/* Ingredient Info */}
								<View style={styles.ingredientInfo}>
									<Text
										style={[styles.ingredientName, !isSelected && styles.ingredientNameDisabled]}>
										{ingredient.name}
									</Text>
									<Text
										style={[
											styles.ingredientQuantity,
											!isSelected && styles.ingredientQuantityDisabled,
										]}>
										{ingredient.quantity}
									</Text>
								</View>

								{/* Price */}
								<Text
									style={[styles.ingredientPrice, !isSelected && styles.ingredientPriceDisabled]}>
									৳{ingredient.price}
								</Text>
							</Pressable>
						);
					})}
				</View>

				{/* Bottom spacing for fixed button */}
				<View style={{ height: 124 }} />
			</ScrollView>

			{/* Fixed Bottom Button */}
			<View style={styles.bottomContainer}>
				<View style={styles.totalContainer}>
					<Text style={styles.totalLabel}>Total</Text>
					<Text style={styles.totalPrice}>৳{total}</Text>
				</View>
				<Pressable
					style={[styles.addButton, selectedCount === 0 && styles.addButtonDisabled]}
					onPress={handleAddAllToCart}
					disabled={selectedCount === 0}>
					<Text style={styles.addButtonText}>
						Add {selectedCount} {selectedCount === 1 ? 'item' : 'items'} to cart
					</Text>
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
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	headerActions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#FFFFFF',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	recipeImage: {
		width: '100%',
		height: 200,
		resizeMode: 'cover',
	},
	recipeInfo: {
		padding: 20,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	recipeDescription: {
		fontSize: 15,
		color: '#666666',
		lineHeight: 22,
	},
	ingredientsSection: {
		padding: 20,
		paddingBottom: 24,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#000000',
		marginBottom: 16,
	},
	ingredientCard: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		marginBottom: 12,
	},
	ingredientCardDisabled: {
		backgroundColor: '#F8F8F8',
		opacity: 0.6,
	},
	checkboxContainer: {
		marginRight: 12,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 6,
		borderWidth: 2,
		borderColor: '#D0D0D0',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFFFFF',
	},
	checkboxChecked: {
		backgroundColor: '#E63946',
		borderColor: '#E63946',
	},
	checkboxDisabled: {
		backgroundColor: '#9CA3AF',
		borderColor: '#9CA3AF',
		opacity: 0.7,
	},
	ingredientImage: {
		width: 60,
		height: 60,
		borderRadius: 8,
		marginRight: 12,
		resizeMode: 'cover',
	},
	ingredientInfo: {
		flex: 1,
	},
	ingredientName: {
		fontSize: 15,
		fontWeight: '600',
		color: '#000000',
		marginBottom: 4,
	},
	ingredientNameDisabled: {
		color: '#999999',
	},
	ingredientQuantity: {
		fontSize: 13,
		color: '#666666',
	},
	ingredientQuantityDisabled: {
		color: '#AAAAAA',
	},
	ingredientPrice: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#E63946',
		marginLeft: 8,
	},
	ingredientPriceDisabled: {
		color: '#AAAAAA',
	},
	bottomContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: '#FFFFFF',
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5',
		paddingHorizontal: 20,
		paddingVertical: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},
	totalContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	totalLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: '#000000',
	},
	totalPrice: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#E63946',
	},
	addButton: {
		backgroundColor: '#E63946',
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: 'center',
	},
	addButtonDisabled: {
		backgroundColor: '#D0D0D0',
	},
	addButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
});
