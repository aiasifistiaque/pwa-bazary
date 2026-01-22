import { ProductCard } from '@/components/product-card';
import { SectionHeader } from '@/components/section-header';
import { useGetAllQuery } from '@/store/services/commonApi';
import { addToCart } from '@/store/slices/cartSlice';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

export const FeaturedCategorySection = ({ category }: { category: any }) => {
	const dispatch = useDispatch();
	const { data: productsData, isLoading } = useGetAllQuery({
		path: '/products',
		filters: { category: category.id },
	});

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
					price: product.sellPrice,
					image: product.image,
					vat: 0,
				},
				qty: 1,
			})
		);
	};

	const handleSeeAllPress = () => {
		router.push(`/category/${category.id}`);
	};

	if (isLoading || !productsData?.doc?.length) return null;

	return (
		<View style={styles.section}>
			<SectionHeader title={category.name} onSeeAllPress={handleSeeAllPress} />
			<FlatList
				horizontal
				data={productsData.doc}
				renderItem={({ item }) => (
					<ProductCard
						product={item}
						id={item.id}
						name={item.name}
						price={item.sellPrice.toString()}
						image={item.image}
						unit={item.unit}
						unitPrice={item.unitPrice}
						weight={item.weight}
						onPress={() => handleProductPress(item.id)}
						onAddPress={() => handleAddPress(item)}
					/>
				)}
				keyExtractor={item => item.id}
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.productList}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		marginBottom: 16,
		backgroundColor: '#FFFFFF',
		paddingVertical: 8,
	},
	productList: {
		paddingHorizontal: 16,
		gap: 12,
		paddingVertical: 8,
	},
});
