import { RecipeCard } from '@/components/recipe-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGetAllQuery } from '@/store/services/commonApi';
import { router } from 'expo-router';
import React from 'react';
import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 40) / 2; // 16px padding on sides + 8px gap between columns

export default function RecipesScreen() {
	const { data: combosData, isLoading } = useGetAllQuery({
		path: '/combos',
		sort: '-priority',
		filters: { isActive: true },
	}) as any;

	const handleBack = () => {
		router.back();
	};

	const handleRecipePress = (recipeId: string) => {
		router.push(`/recipe/${recipeId}`);
	};

	if (isLoading) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.header}>
					<Pressable onPress={handleBack} style={styles.backButton}>
						<IconSymbol name='chevron.left' size={24} color='#000000' />
					</Pressable>
					<Text style={styles.headerTitle}>All Recipes</Text>
					<View style={{ width: 40 }} />
				</View>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size='large' color='#000000' />
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.header}>
				<Pressable onPress={handleBack} style={styles.backButton}>
					<IconSymbol name='chevron.left' size={24} color='#000000' />
				</Pressable>
				<Text style={styles.headerTitle}>All Recipes</Text>
				<View style={{ width: 40 }} />
			</View>

			<FlatList
				data={combosData?.doc}
				renderItem={({ item }) => (
					<RecipeCard
						key={item.id}
						{...item}
						onPress={handleRecipePress}
						style={styles.recipeCard}
					/>
				)}
				keyExtractor={item => item.id}
				numColumns={2}
				contentContainerStyle={styles.listContainer}
				columnWrapperStyle={styles.columnWrapper}
				showsVerticalScrollIndicator={false}
			/>
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
	listContainer: {
		padding: 16,
	},
	columnWrapper: {
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	recipeCard: {
		width: COLUMN_WIDTH,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
