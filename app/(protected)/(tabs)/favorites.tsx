import { ProductCard } from '@/components/product-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { addToCart } from '@/store/slices/cartSlice';
import { removeFromFavorites } from '@/store/slices/favoritesSlice';
import { RootState } from '@/store';
import { router } from 'expo-router';
import React from 'react';
import {
	FlatList,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

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
				<ScrollView style={styles.container}>
					<View style={styles.header}>
						<Text style={styles.headerTitle}>My Favorites</Text>
						<Text style={styles.headerSubtitle}>
							{favorites.length} {favorites.length === 1 ? 'item' : 'items'}
						</Text>
					</View>
					<FlatList
						horizontal
						data={favorites}
						renderItem={({ item }) => (
							<View style={styles.itemContainer}>
								<ProductCard
									id={item.id}
									name={item.name}
									price={item.price.toString()}
									image={item.image}
									unit={item.unit}
									unitPrice={item.unitPrice}
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
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.listContent}
					/>
				</ScrollView>
			)}
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
	},
	itemContainer: {
		position: 'relative',
		marginRight: 12,
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
