import { ProductCard } from '@/components/product-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { addToCart } from '@/store/slices/cartSlice';
import { removeFromFavorites } from '@/store/slices/favoritesSlice';
import { RootState } from '@/store';
import { router } from 'expo-router';
import React from 'react';
import {
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomColors } from '@/constants/theme';

export default function FavoritesScreen() {
	const dispatch = useDispatch();
	const favorites = useSelector((state: RootState) => state.favorites.items);

	const handleProductPress = (productId: string) => {
		router.push(`/product/${productId}`);
	};

	const handleAddPress = (product: any) => {
		dispatch(
			addToCart({
				item: {
					id: product.id,
					_id: product.id,
					name: product.name,
					price: product.price,
					image: product.image,
					vat: 0,
				},
				qty: 1,
			}),
		);
	};

	const handleRemovePress = (productId: string) => {
		dispatch(removeFromFavorites(productId));
	};

	return (
		<View style={styles.safeArea}>
			{favorites.length === 0 ? (
				<View style={styles.emptyContainer}>
					<IconSymbol name='heart' size={64} color={CustomColors.darkBrown} />
					<Text style={styles.emptyText}>No favorites yet</Text>
					<TouchableOpacity
						style={styles.browseButton}
						onPress={() => router.push('/(protected)/(tabs)')}
					>
						<Text style={styles.browseButtonText}>Browse Products</Text>
					</TouchableOpacity>
				</View>
			) : (
				<FlatList
					data={favorites}
					numColumns={2}
					ListHeaderComponent={
						<View style={styles.header}>
							<Text style={styles.headerTitle}>My Favorites</Text>
							<Text style={styles.headerSubtitle}>
								{favorites.length} {favorites.length === 1 ? 'item' : 'items'}
							</Text>
						</View>
					}
					renderItem={({ item }) => (
						<View style={styles.itemContainer}>
							<ProductCard
								product={item}
								id={item.id}
								name={item.name}
								price={item.price.toString()}
								image={item.image}
								unit={item.unit}
								unitPrice={item.unitPrice}
								weight={item.weight}
								onPress={() => handleProductPress(item.id)}
								onAddPress={() => handleAddPress(item)}
							/>
							<TouchableOpacity
								style={styles.removeButton}
								onPress={() => handleRemovePress(item.id)}
							>
								<IconSymbol
									name='xmark.circle.fill'
									size={24}
									color={CustomColors.darkBrown}
								/>
							</TouchableOpacity>
						</View>
					)}
					keyExtractor={item => item.id}
					columnWrapperStyle={styles.columnWrapper}
					contentContainerStyle={styles.listContent}
					showsVerticalScrollIndicator={false}
				/>
			)}
		</View>
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
	header: {
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 12,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#000',
		marginBottom: 4,
	},
	headerSubtitle: {
		fontSize: 14,
		color: '#666',
	},
	listContent: {
		paddingHorizontal: 16,
		paddingBottom: 16,
		gap: 12,
	},
	columnWrapper: {
		justifyContent: 'space-between',
		paddingHorizontal: 2,
	},
	itemContainer: {
		position: 'relative',
		width: '48%',
		marginBottom: 12,
	},
	removeButton: {
		position: 'absolute',
		top: 8,
		right: 8,
		zIndex: 10,
		backgroundColor: CustomColors.cardBgColor,
		borderRadius: 12,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	emptyText: {
		fontSize: 18,
		color: '#666',
		marginTop: 16,
		marginBottom: 24,
	},
	browseButton: {
		backgroundColor: CustomColors.lightBrown,
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
	},
	browseButtonText: {
		color: CustomColors.darkBrown,
		fontSize: 16,
		fontWeight: 'bold',
	},
});
