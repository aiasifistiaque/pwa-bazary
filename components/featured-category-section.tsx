import { CompactProductCard } from '@/components/CompactProductCard';
import { SectionHeader } from '@/components/section-header';
import { useGetAllQuery } from '@/store/services/commonApi';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

export const FeaturedCategorySection = ({ category }: { category: any }) => {
	const { data: productsData, isLoading } = useGetAllQuery({
		path: '/products',
		sort: '-priority',
		limit: 10,
		filters: { category_in: category.id, isActive: true },
	});

	const handleProductPress = (productId: string) => {
		router.push(`/product/${productId}`);
	};

	const handleSeeAllPress = () => {
		router.push(`/category/${category.id}`);
	};

	// Don't render if loading or no products
	if (isLoading) return null;
	if (!productsData?.doc || productsData.doc.length === 0) return null;

	return (
		<View style={styles.section}>
			<SectionHeader
				title={category.name}
				onSeeAllPress={handleSeeAllPress}
			/>
			<FlatList
				horizontal
				data={productsData.doc}
				renderItem={({ item }) => (
					<CompactProductCard
						product={item}
						id={item.id}
						name={item.name}
						price={item.sellPrice.toString()}
						image={item.image}
						unit={item.unit}
						unitPrice={item.unitPrice}
						weight={item.weight}
						onPress={() => handleProductPress(item.id)}
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
		marginBottom: 0,
		paddingVertical: 8,
	},
	productList: {
		paddingHorizontal: 16,
		gap: 10,
		paddingVertical: 8,
	},
});
