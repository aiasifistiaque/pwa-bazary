import { FavoriteProductCard } from '@/components/favorite-product-card';
import { addToCart } from '@/store/slices/cartSlice';
import { router } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

// Mock favorite products data
const favoriteProducts = [
	{
		id: '507f1f77bcf86cd799439046',
		name: 'Bio Apfel Pink Lady',
		category: 'Sweet-sour',
		price: '367',
		originalPrice: '459',
		unit: '550g',
		unitPrice: '৳667/kg',
		discount: '20% Off',
		image:
			'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
	},
	{
		id: '507f1f77bcf86cd799439047',
		name: 'Bio Apfel Elstar',
		category: 'Sweet-sour',
		price: '344',
		originalPrice: '378',
		unit: '1kg',
		unitPrice: '৳344/kg',
		badge: 'now ৳344',
		image:
			'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop',
	},
	{
		id: '507f1f77bcf86cd799439048',
		name: 'Fresh Raspberries',
		category: 'Berries',
		price: '275',
		originalPrice: '344',
		unit: '125g',
		unitPrice: '৳2,200/kg',
		discount: '20% Off',
		image:
			'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=400&h=400&fit=crop',
	},
	{
		id: '507f1f77bcf86cd799439049',
		name: 'Fresh Strawberries',
		category: 'Berries',
		price: '401',
		unit: '500g',
		unitPrice: '৳802/kg',
		image:
			'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop',
	},
	{
		id: '507f1f77bcf86cd79943904a',
		name: 'Organic Blueberries',
		category: 'Berries',
		price: '459',
		originalPrice: '574',
		unit: '125g',
		unitPrice: '৳3,672/kg',
		discount: '20% Off',
		image:
			'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop',
	},
	{
		id: '507f1f77bcf86cd79943904b',
		name: 'Fresh Blackberries',
		category: 'Berries',
		price: '344',
		unit: '150g',
		unitPrice: '৳2,293/kg',
		image:
			'https://images.unsplash.com/photo-1588169844932-d63cb3d9d220?w=400&h=400&fit=crop',
	},
	{
		id: '507f1f77bcf86cd79943904c',
		name: 'Organic Pears',
		category: 'Sweet',
		price: '286',
		originalPrice: '344',
		unit: '1kg',
		unitPrice: '৳286/kg',
		discount: '15% Off',
		image:
			'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=400&h=400&fit=crop',
	},
	{
		id: '507f1f77bcf86cd79943904d',
		name: 'Red Grapes',
		category: 'Sweet',
		price: '459',
		unit: '500g',
		unitPrice: '৳918/kg',
		badge: 'now ৳459',
		image:
			'https://images.unsplash.com/photo-1599819177121-95d8e4c9c656?w=400&h=400&fit=crop',
	},
];

export default function FavoritesScreen() {
	const dispatch = useDispatch();

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
			<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<Text style={styles.title}>Favorites</Text>
					<Text style={styles.description}>
						Discover a small selection from our diverse range. After your{' '}
						<Text style={styles.bold}>first order</Text> you'll find your
						personal favorites here.{' '}
						<Text style={styles.bold}>More than 10,000 items</Text> are waiting
						to be discovered by you!
					</Text>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Fruit 🍎</Text>
					</View>
					<View style={styles.grid}>
						{favoriteProducts.map(product => (
							<FavoriteProductCard
								key={product.id}
								{...product}
								onPress={() => handleProductPress(product.id)}
								onAddPress={() => handleAddPress(product)}
							/>
						))}
					</View>
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
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	header: {
		padding: 20,
		paddingBottom: 16,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#000',
		marginBottom: 12,
	},
	description: {
		fontSize: 14,
		lineHeight: 20,
		color: '#666',
	},
	bold: {
		fontWeight: '700',
		color: '#000',
	},
	section: {
		paddingHorizontal: 20,
	},
	sectionHeader: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#000',
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
});
