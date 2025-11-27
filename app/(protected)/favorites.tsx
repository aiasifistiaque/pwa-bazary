// import { FavoriteProductCard } from '@/components/favorite-product-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { addToCart } from '@/store/slices/cartSlice';
import { removeFromFavorites } from '@/store/slices/favoritesSlice';
import { RootState } from '@/store';
import { router } from 'expo-router';
import React from 'react';
import {
	FlatList,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FavoriteProductCard } from '@/components/favorite-product-card';

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
			})
		);
	};

	const handleRemovePress = (productId: string) => {
		dispatch(removeFromFavorites(productId));
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			{favorites.length === 0 ? (
				<View style={styles.emptyContainer}>
					<IconSymbol name='heart' size={64} color='#CCC' />
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
					renderItem={({ item }) => (
						<View style={styles.itemContainer}>
							<FavoriteProductCard
								{...item}
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
									color='#E63946'
								/>
							</TouchableOpacity>
						</View>
					)}
					keyExtractor={item => item.id}
					contentContainerStyle={styles.listContent}
					numColumns={2}
					columnWrapperStyle={styles.columnWrapper}
				/>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},

	listContent: {
		padding: 16,
	},
	columnWrapper: {
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	itemContainer: {
		position: 'relative',
		width: '48%',
	},
	removeButton: {
		position: 'absolute',
		top: 8,
		right: 8,
		zIndex: 10,
		backgroundColor: 'white',
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
		backgroundColor: '#E63946',
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
	},
	browseButtonText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
