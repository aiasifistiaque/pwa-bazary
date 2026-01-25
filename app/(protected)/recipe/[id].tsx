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
	Platform,
	ScrollView,
	Share,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { CustomColors } from '@/constants/theme';

const fallback = require('../../../assets/images/fallback-fruit.png');

// Component to fetch and display individual product
const IngredientWithProduct = ({
	item,
	isSelected,
	isRequired,
	onToggle,
	onProductDataLoaded,
}: {
	item: any;
	isSelected: boolean;
	isRequired: boolean;
	onToggle: () => void;
	onProductDataLoaded: (productId: string, productName: string) => void;
}) => {
	const { data: productData, isLoading } = useGetByIdQuery(
		{
			path: 'products',
			id: item.product,
		},
		{
			skip: !item.product,
		},
	);

	const productName = productData?.name || 'Loading...';
	const productImage = productData?.image || productData?.images?.[0] || '';

	// Pass product name to parent when loaded
	useEffect(() => {
		if (productData?.name && item.product) {
			onProductDataLoaded(item.product, productData.name);
		}
	}, [productData?.name, item.product]);

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
					<ActivityIndicator size='small' color={CustomColors.lightBrown} />
				</View>
			) : (
				<Image
					source={productImage ? { uri: productImage } : fallback}
					style={styles.ingredientImage}
				/>
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

	// Store product names as they're loaded
	const [productNames, setProductNames] = useState<Record<string, string>>({});

	const handleShare = async () => {
		try {
			await Share.share({
				message: `Check out this recipe: ${recipe?.name} on Bazarey! ${recipe?.shortDescription || ''}`,
				url: `https://bazarey.com/recipe/${recipe?.id}`,
			});
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (recipe && Array.isArray(recipe.items)) {
			setSelectedIngredients(
				recipe.items.reduce(
					(acc: any, ing: any) => ({ ...acc, [ing.id]: true }),
					{},
				),
			);
		}
	}, [recipe]);

	// Callback to receive product names from child components
	const handleProductDataLoaded = (productId: string, productName: string) => {
		setProductNames(prev => ({
			...prev,
			[productId]: productName,
		}));
	};

	const toggleIngredient = (ingredientId: string) => {
		const ingredient = recipe?.items?.find(
			(item: any) => item.id === ingredientId,
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

	// Helper function to get removed ingredients with their names
	const getRemovedIngredients = () => {
		if (!recipe || !recipe.items) return [];

		return recipe.items.filter(
			(item: any) => item.isRemovable && !selectedIngredients[item.id],
		);
	};

	// Build the note with actual product names - both removed and included
	const buildNote = () => {
		if (!recipe || !recipe.items) return '';

		const removedIngredients = recipe.items.filter(
			(item: any) => item.isRemovable && !selectedIngredients[item.id],
		);

		const includedIngredients = recipe.items.filter(
			(item: any) => selectedIngredients[item.id],
		);

		const parts: string[] = [];

		// Add included items
		if (includedIngredients.length > 0) {
			const includedNames = includedIngredients
				.map(
					(item: any) => productNames[item.product] || `Item ${item.product}`,
				)
				.join(', ');
			parts.push(`Includes: ${includedNames}`);
		}

		// Add removed items
		if (removedIngredients.length > 0) {
			const removedNames = removedIngredients
				.map(
					(item: any) => productNames[item.product] || `Item ${item.product}`,
				)
				.join(', ');
			parts.push(`Removed: ${removedNames}`);
		}

		return parts.join(' | ');
	};

	const handleAddAllToCart = () => {
		if (!recipe || !recipe.items) return;

		const adjustedPrice = calculateTotal();
		const note = buildNote();

		// Create unique ID for the combo with customization
		const baseId = recipe.id || recipe._id;
		const customizationHash = getRemovedIngredients()
			.map((item: any) => item.id)
			.sort()
			.join('-');
		const uniqueId = customizationHash
			? `${baseId}-custom-${customizationHash}`
			: baseId;

		// Add combo as a single item to cart
		dispatch(
			addToCart({
				item: {
					id: recipe.id || recipe._id,
					_id: recipe._id,
					name: recipe.name,
					price: adjustedPrice,
					image: recipe.image,
					vat: recipe.vat || 0,
					// Add note if there are removed ingredients
					...(note && { note: note }),
				},
				qty: 1,
			}),
		);

		router.replace('/(protected)/(tabs)/cart');
	};

	if (combosLoading) {
		return <Loader />;
	}

	if (!recipe || !recipe?.items) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={{ padding: 16 }}>
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
	const removedIngredients = getRemovedIngredients();
	const removedCount = removedIngredients.length;
	const totalDeduction = removedIngredients.reduce(
		(sum: number, item: any) => sum + (item.dedactablePrice || 0),
		0,
	);

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
				{/* Recipe Image with Overlay Back Button */}
				<View style={styles.imageContainer}>
					<Image source={{ uri: recipe?.image }} style={styles.recipeImage} />
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.backButton}
						activeOpacity={0.7}
					>
						<IconSymbol name='chevron.left' size={24} color='#000' />
					</TouchableOpacity>
				</View>

				{/* Recipe Info */}
				<View style={styles.recipeInfo}>
					<View style={styles.titleHeader}>
						<Text style={styles.recipeTitle}>{recipe?.name}</Text>
						<TouchableOpacity onPress={handleShare} style={styles.shareButton}>
							<IconSymbol name='square.and.arrow.up' size={24} color='#666' />
						</TouchableOpacity>
					</View>
					<Text style={styles.recipeDescription}>{recipe?.description}</Text>
					{recipe?.saveAmount > 0 && (
						<View style={styles.saveBadge}>
							<Text style={styles.saveText}>Save ৳{recipe.saveAmount}</Text>
						</View>
					)}
				</View>

				{/* Show removed items info if any */}
				{removedCount > 0 && (
					<View style={styles.removedInfoContainer}>
						<IconSymbol
							name='info.circle'
							size={18}
							color='#856404'
							style={styles.infoIcon}
						/>
						<View style={styles.removedInfoTextContainer}>
							<Text style={styles.removedInfoText}>
								{removedCount} ingredient{removedCount > 1 ? 's' : ''} removed
							</Text>
							<Text style={styles.removedInfoSubtext}>
								Price adjusted by ৳{totalDeduction}
							</Text>
						</View>
					</View>
				)}

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
								onProductDataLoaded={handleProductDataLoaded}
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
					<View>
						<Text style={styles.totalLabel}>Total</Text>
						{removedCount > 0 && (
							<Text style={styles.originalPriceText}>
								Was ৳{recipe.sellPrice}
							</Text>
						)}
					</View>
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
					<Text style={styles.addButtonText}>Add combo to cart</Text>
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
	imageContainer: {
		width: '100%',
		height: 300,
		backgroundColor: '#F5F5F5',
		position: 'relative',
	},
	backButton: {
		position: 'absolute',
		top: 16,
		left: 16,
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#FFFFFF',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.15,
		shadowRadius: 3,
		elevation: 3,
		zIndex: 10,
	},
	recipeImage: {
		width: '100%',
		height: 300,
		objectFit: 'cover',
	},
	recipeInfo: {
		padding: 20,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	titleHeader: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		gap: 12,
		marginBottom: 8,
	},
	shareButton: {
		padding: 4,
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
		backgroundColor: CustomColors.lightBrown,
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
		backgroundColor: CustomColors.lightBrown,
		borderColor: CustomColors.lightBrown,
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
	removedInfoContainer: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginHorizontal: 20,
		marginVertical: 16,
		padding: 14,
		backgroundColor: '#FFF3CD',
		borderRadius: 10,
		borderLeftWidth: 4,
		borderLeftColor: '#FFC107',
	},
	infoIcon: {
		marginRight: 10,
		marginTop: 2,
	},
	removedInfoTextContainer: {
		flex: 1,
	},
	removedInfoText: {
		fontSize: 14,
		color: '#856404',
		fontWeight: '600',
		marginBottom: 2,
	},
	removedInfoSubtext: {
		fontSize: 13,
		color: '#856404',
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
	originalPriceText: {
		fontSize: 13,
		color: '#999999',
		textDecorationLine: 'line-through',
		marginTop: 2,
	},
	totalPrice: {
		fontSize: 24,
		fontWeight: 'bold',
		color: CustomColors.lightBrown,
	},
	addButton: {
		backgroundColor: CustomColors.lightBrown,
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
