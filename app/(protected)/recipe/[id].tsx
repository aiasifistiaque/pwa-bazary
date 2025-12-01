import { Loader } from '@/components/Loader';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGetAllQuery, useGetByIdQuery } from '@/store/services/commonApi';
import { addToCart } from '@/store/slices/cartSlice';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

// Component to fetch and display individual product
const IngredientWithProduct = ({
	item,
	isSelected,
	isRequired,
	onToggle,
}: {
	item: any;
	isSelected: boolean;
	isRequired: boolean;
	onToggle: () => void;
}) => {
	const { data: productData, isLoading } = useGetByIdQuery(
		{
			path: 'products',
			id: item.product,
		},
		{
			skip: !item.product,
		}
	);

	const productName = productData?.name || 'Loading...';
	const productImage = productData?.image || productData?.images?.[0] || '';
	const productPrice = productData?.price || productData?.sellPrice || 0;

	// Calculate actual price (product price - deductible price)
	const actualPrice = Math.max(0, productPrice - (item.dedactablePrice || 0));

	return (
		<Pressable
			style={[
				styles.ingredientCard,
				!isSelected && styles.ingredientCardDisabled,
			]}
			onPress={onToggle}
			disabled={isRequired || isLoading}
		>
			{/* Checkbox */}
			<Pressable
				style={styles.checkboxContainer}
				onPress={onToggle}
				disabled={isRequired || isLoading}
			>
				<View
					style={[
						styles.checkbox,
						isSelected && styles.checkboxChecked,
						isRequired && styles.checkboxDisabled,
					]}
				>
					{isSelected && (
						<IconSymbol name='checkmark' size={16} color='#FFFFFF' />
					)}
				</View>
			</Pressable>

			{/* Ingredient Image */}
			{isLoading ? (
				<View style={[styles.ingredientImage, styles.loadingImageContainer]}>
					<ActivityIndicator size='small' color='#E63946' />
				</View>
			) : (
				<Image source={{ uri: productImage }} style={styles.ingredientImage} />
			)}

			{/* Ingredient Info */}
			<View style={styles.ingredientInfo}>
				<Text
					style={[
						styles.ingredientName,
						!isSelected && styles.ingredientNameDisabled,
					]}
				>
					{productName}
				</Text>
				<Text
					style={[
						styles.ingredientQuantity,
						!isSelected && styles.ingredientQuantityDisabled,
					]}
				>
					{item.qty}g
				</Text>
			</View>

			{/* Price */}
			{/* <Text
				style={[
					styles.ingredientPrice,
					!isSelected && styles.ingredientPriceDisabled,
				]}
			>
				৳{actualPrice}
			</Text> */}
		</Pressable>
	);
};

export default function RecipeDetailScreen() {
	const { data: combosData, isLoading: combosLoading } = useGetAllQuery({
		path: '/combos',
		filters: { isFeatured: true },
	});
	const { id } = useLocalSearchParams<{ id: string }>();
	const dispatch = useDispatch();
	const recipe = combosData?.doc?.find((item: any) => item.id === id);

	// Track selected ingredients with all selected by default
	const [selectedIngredients, setSelectedIngredients] = useState<
		Record<string, boolean>
	>({});

	// Store fetched product data
	const [productPrices, setProductPrices] = useState<Record<string, number>>(
		{}
	);

	useEffect(() => {
		if (recipe && Array.isArray(recipe.items)) {
			setSelectedIngredients(
				recipe.items.reduce(
					(acc: any, ing: any) => ({ ...acc, [ing.id]: true }),
					{}
				)
			);
		}
	}, [recipe]);

	const toggleIngredient = (ingredientId: string) => {
		const ingredient = recipe?.items?.find(
			(item: any) => item.id === ingredientId
		);

		if (ingredient && !ingredient.isRemovable) return;

		setSelectedIngredients(prev => ({
			...prev,
			[ingredientId]: !prev[ingredientId],
		}));
	};

	const calculateTotal = () => {
		if (!recipe || !recipe.items) return 0;

		// Start with the base recipe sellPrice
		let total = recipe.sellPrice || 0;

		// Subtract deductable price for unselected removable items
		recipe.items.forEach((item: any) => {
			if (item.isRemovable && !selectedIngredients[item.id]) {
				total -= item.dedactablePrice || 0;
			}
		});

		return total;
	};

	const handleAddAllToCart = () => {
		if (!recipe || !recipe.items) return;

		// Get all selected items
		const selectedItems = recipe.items.filter(
			(item: any) => selectedIngredients[item.id]
		);

		// Add each selected product to cart
		selectedItems.forEach((item: any) => {
			dispatch(
				addToCart({
					item: {
						id: item.product,
						_id: item.product,
						name: recipe.name, // We'll use recipe name for now
						price: recipe.sellPrice / recipe.items.length, // Divide price equally
						image: recipe.image,
						vat: recipe.vat || 0,
					},
					qty: 1,
				})
			);
		});
		router.back();
	};

	if (combosLoading) {
		return <Loader />;
	}

	if (!recipe || !recipe?.items) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.headerActions}>
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.backButton}
						activeOpacity={0.7}
					>
						<IconSymbol name='chevron.left' size={24} color='#000' />
					</TouchableOpacity>
				</View>
				<View
					style={[
						styles.container,
						{ justifyContent: 'center', alignItems: 'center' },
					]}
				>
					<Text style={styles.sectionTitle}>Recipe not found</Text>
				</View>
			</SafeAreaView>
		);
	}

	const selectedCount =
		Object.values(selectedIngredients).filter(Boolean).length;
	const total = calculateTotal();

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
				{/* Header Actions */}
				<View style={styles.headerActions}>
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.backButton}
						activeOpacity={0.7}
					>
						<IconSymbol name='chevron.left' size={24} color='#000' />
					</TouchableOpacity>
				</View>

				{/* Recipe Image */}
				<Image source={{ uri: recipe?.image }} style={styles.recipeImage} />

				{/* Recipe Info */}
				<View style={styles.recipeInfo}>
					<Text style={styles.recipeTitle}>{recipe?.name}</Text>
					<Text style={styles.recipeDescription}>{recipe?.description}</Text>
					{recipe?.saveAmount > 0 && (
						<View style={styles.saveBadge}>
							<Text style={styles.saveText}>Save ৳{recipe.saveAmount}</Text>
						</View>
					)}
				</View>

				{/* Ingredients Section */}
				<View style={styles.ingredientsSection}>
					<Text style={styles.sectionTitle}>
						Ingredients ({selectedCount}/{recipe?.items?.length})
					</Text>

					{recipe?.items?.map((item: any) => {
						const isSelected = selectedIngredients[item.id];
						const isRequired = item.isRemovable === false;
						return (
							<IngredientWithProduct
								key={item.id}
								item={item}
								isSelected={isSelected}
								isRequired={isRequired}
								onToggle={() => toggleIngredient(item.id)}
							/>
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
					style={[
						styles.addButton,
						selectedCount === 0 && styles.addButtonDisabled,
					]}
					onPress={handleAddAllToCart}
					disabled={selectedCount === 0}
				>
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
		height: 250,
		resizeMode: 'cover',
	},
	recipeInfo: {
		padding: 20,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	recipeTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#000000',
		marginBottom: 8,
	},
	recipeDescription: {
		fontSize: 15,
		color: '#666666',
		lineHeight: 22,
		marginBottom: 12,
	},
	saveBadge: {
		backgroundColor: '#E63946',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
		alignSelf: 'flex-start',
	},
	saveText: {
		color: '#FFFFFF',
		fontSize: 14,
		fontWeight: '600',
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
	loadingImageContainer: {
		backgroundColor: '#F0F0F0',
		justifyContent: 'center',
		alignItems: 'center',
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
