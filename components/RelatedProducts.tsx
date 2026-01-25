import { CustomColors } from '@/constants/theme';
import { useGetAllQuery } from '@/store/services/commonApi';
import { router } from 'expo-router';
import React from 'react';
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { CompactProductCard } from './CompactProductCard';
import SectionTitle from './header/SectionTitle';

type RelatedProductsProps = {
	categoryId: string;
	currentProductId: string;
};

export function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
	const { data: productsData, isLoading } = useGetAllQuery({
		path: 'products',
		sort: '-priority',
		limit: 8,
		filters: {
			category_in: categoryId,
			isActive: true,
		},
	});

	// Filter out current product on frontend
	const relatedProducts =
		productsData?.doc?.filter(
			(product: any) => product._id !== currentProductId && product.id !== currentProductId,
		) || [];

	// Don't render if no related products
	if (!isLoading && relatedProducts.length === 0) {
		return null;
	}

	const handleViewMore = () => {
		router.push(`/category/${categoryId}`);
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<SectionTitle>Similar Items</SectionTitle>
			</View>

			{isLoading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator
						size='large'
						color={CustomColors.darkBrown}
					/>
				</View>
			) : (
				<>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.scrollContent}>
						{relatedProducts.slice(0, 8).map((product: any) => (
							<View
								key={product._id || product.id}
								style={styles.productWrapper}>
								<CompactProductCard
									product={product}
									id={product._id || product.id}
									name={product.name}
									price={product.sellPrice || product.price}
									unit={product.unit}
									unitPrice={product.unitPrice}
									weight={product.weight || product.unitValue}
									badge={product.badge}
									badgeIcon={product.badgeIcon}
									image={product.image}
									onPress={() => router.push(`/product/${product._id || product.id}`)}
								/>
							</View>
						))}
					</ScrollView>

					{relatedProducts.length > 0 && (
						<TouchableOpacity
							style={styles.viewMoreButton}
							onPress={handleViewMore}
							activeOpacity={0.8}>
							<Text style={styles.viewMoreText}>View More Similar Items</Text>
						</TouchableOpacity>
					)}
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 20,
		borderTopWidth: 1,
		borderTopColor: '#F0F0F0',
	},
	header: {
		paddingHorizontal: 20,
		marginBottom: 4,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: '#000',
	},
	scrollContent: {
		paddingHorizontal: 20,
		gap: 8,
	},
	productWrapper: {
		// width: 160,
	},
	loadingContainer: {
		paddingVertical: 40,
		alignItems: 'center',
	},
	viewMoreButton: {
		marginHorizontal: 20,
		marginTop: 16,
		// backgroundColor: CustomColors.lightBrown,
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	viewMoreText: {
		fontSize: 14,
		fontWeight: '400',
		color: '#000',
	},
});
