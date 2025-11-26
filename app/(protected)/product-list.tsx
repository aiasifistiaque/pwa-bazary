import { FavoriteProductCard } from '@/components/favorite-product-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { addToCart } from '@/store/slices/cartSlice';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

// All products organized by section
const allProducts: Record<string, any[]> = {
	'New in the App': [
		{
			id: '1',
			name: 'Pepsi Lemon Zero',
			price: '1,028',
			unit: '6 × 0,33L',
			unitPrice: '৳518/L',
			badge: 'New',
			badgeIcon: 'star.fill',
			image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop',
		},
		{
			id: '2',
			name: 'Organic Honey',
			price: '574',
			originalPrice: '689',
			unit: '250g',
			unitPrice: '৳2,298/kg',
			discount: '15% Off',
			badge: 'New',
			badgeIcon: 'star.fill',
			image: 'https://images.unsplash.com/photo-1587049352846-4a222e784l94?w=400&h=400&fit=crop',
		},
		{
			id: '3',
			name: 'Almond Milk',
			price: '344',
			unit: '1L',
			unitPrice: '৳344/L',
			badge: 'New',
			badgeIcon: 'star.fill',
			image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
		},
		{
			id: '4',
			name: 'Greek Yogurt',
			price: '229',
			unit: '500g',
			unitPrice: '৳459/kg',
			badge: 'New',
			badgeIcon: 'star.fill',
			image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
		},
		{
			id: '5',
			name: 'Sourdough Bread',
			price: '286',
			unit: '500g',
			unitPrice: '৳574/kg',
			badge: 'New',
			badgeIcon: 'star.fill',
			image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
		},
		{
			id: '6',
			name: 'Quinoa',
			price: '459',
			unit: '500g',
			unitPrice: '৳919/kg',
			badge: 'New',
			badgeIcon: 'star.fill',
			image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
		},
	],
	'Popular Products': [
		{
			id: '7',
			name: 'Fresh Milk',
			price: '172',
			unit: '1L',
			unitPrice: '৳172/L',
			image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
		},
		{
			id: '8',
			name: 'Whole Grain Bread',
			price: '217',
			unit: '500g',
			unitPrice: '৳435/kg',
			image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
		},
		{
			id: '9',
			name: 'Free Range Eggs',
			price: '344',
			unit: '10 pieces',
			unitPrice: '৳34/piece',
			image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
		},
		{
			id: '10',
			name: 'Butter',
			price: '401',
			unit: '250g',
			unitPrice: '৳1,605/kg',
			image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop',
		},
		{
			id: '11',
			name: 'Cheddar Cheese',
			price: '574',
			unit: '200g',
			unitPrice: '৳2,872/kg',
			image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop',
		},
		{
			id: '12',
			name: 'Orange Juice',
			price: '286',
			unit: '1L',
			unitPrice: '৳286/L',
			image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
		},
	],
	'Fresh Produce': [
		{
			id: '13',
			name: 'Organic Bananas',
			price: '172',
			unit: '1kg',
			unitPrice: '৳172/kg',
			image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop',
		},
		{
			id: '14',
			name: 'Red Apples',
			price: '229',
			unit: '1kg',
			unitPrice: '৳229/kg',
			image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
		},
		{
			id: '15',
			name: 'Fresh Tomatoes',
			price: '148',
			unit: '500g',
			unitPrice: '৳297/kg',
			image: 'https://images.unsplash.com/photo-1546470427-227c3f7f6984?w=400&h=400&fit=crop',
		},
		{
			id: '16',
			name: 'Carrots',
			price: '115',
			unit: '500g',
			unitPrice: '৳229/kg',
			image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop',
		},
		{
			id: '17',
			name: 'Broccoli',
			price: '172',
			unit: '500g',
			unitPrice: '৳344/kg',
			image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=400&fit=crop',
		},
		{
			id: '18',
			name: 'Spinach',
			price: '148',
			unit: '250g',
			unitPrice: '৳594/kg',
			image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop',
		},
	],
	Beverages: [
		{
			id: '19',
			name: 'Coca Cola Zero',
			price: '919',
			unit: '6 × 1,5L',
			unitPrice: '৳102/L',
			image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop',
		},
		{
			id: '20',
			name: 'Sparkling Water',
			price: '286',
			unit: '6 × 1,5L',
			unitPrice: '৳32/L',
			image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop',
		},
		{
			id: '21',
			name: 'Apple Juice',
			price: '344',
			unit: '1L',
			unitPrice: '৳344/L',
			image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
		},
		{
			id: '22',
			name: 'Green Tea',
			price: '401',
			unit: '20 bags',
			unitPrice: '৳20/bag',
			image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop',
		},
		{
			id: '23',
			name: 'Coconut Water',
			price: '286',
			unit: '1L',
			unitPrice: '৳286/L',
			image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=400&fit=crop',
		},
		{
			id: '24',
			name: 'Lemonade',
			price: '229',
			unit: '1L',
			unitPrice: '৳229/L',
			image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f0f?w=400&h=400&fit=crop',
		},
	],
	'Special Offers': [
		{
			id: '25',
			name: 'Pasta Penne',
			price: '148',
			unit: '500g',
			unitPrice: '৳297/kg',
			badge: 'Sale',
			badgeIcon: 'tag.fill',
			image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop',
		},
		{
			id: '26',
			name: 'Olive Oil',
			price: '689',
			originalPrice: '919',
			unit: '500ml',
			unitPrice: '৳1,378/L',
			discount: '25% Off',
			badge: 'Sale',
			badgeIcon: 'tag.fill',
			image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
		},
		{
			id: '27',
			name: 'Rice',
			price: '401',
			unit: '1kg',
			unitPrice: '৳401/kg',
			badge: 'Sale',
			badgeIcon: 'tag.fill',
			image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
		},
		{
			id: '28',
			name: 'Chocolate Bar',
			price: '172',
			originalPrice: '229',
			unit: '100g',
			unitPrice: '৳1,722/kg',
			discount: '25% Off',
			badge: 'Sale',
			badgeIcon: 'tag.fill',
			image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop',
		},
		{
			id: '29',
			name: 'Peanut Butter',
			price: '344',
			unit: '340g',
			unitPrice: '৳1,012/kg',
			badge: 'Sale',
			badgeIcon: 'tag.fill',
			image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&h=400&fit=crop',
		},
		{
			id: '30',
			name: 'Coffee Beans',
			price: '1,034',
			unit: '500g',
			unitPrice: '৳2,068/kg',
			badge: 'Sale',
			badgeIcon: 'tag.fill',
			image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
		},
	],
};

export default function ProductListScreen() {
	const dispatch = useDispatch();
	const { category } = useLocalSearchParams<{ category: string }>();
	const products = allProducts[category || ''] || [];

	const handleBack = () => {
		router.back();
	};

	const handleAddPress = (product: any) => {
		dispatch(
			addToCart({
				item: {
					id: product.id,
					_id: product.id,
					name: product.name,
					price: parseFloat(product.price.replace(',', '')),
					image: product.image,
					vat: 0,
				},
				qty: 1,
			})
		);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			{/* Header */}
			<View style={styles.header}>
				<Pressable
					onPress={handleBack}
					style={styles.backButton}>
					<IconSymbol
						name='chevron.left'
						size={24}
						color='#000000'
					/>
				</Pressable>
				<Text style={styles.headerTitle}>{category}</Text>
				<View style={{ width: 40 }} />
			</View>

			<ScrollView
				style={styles.container}
				showsVerticalScrollIndicator={false}>
				<View style={styles.productGrid}>
					{products.map(product => (
						<FavoriteProductCard
							key={product.id}
							{...product}
							onPress={() => router.push(`/product/${product.id}`)}
							onAddPress={() => handleAddPress(product)}
						/>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
	},
	backButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
	},
	container: {
		flex: 1,
		backgroundColor: '#F5F5F5',
	},
	productGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		padding: 8,
		gap: 8,
	},
});
