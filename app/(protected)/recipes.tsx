import { RecipeCard } from '@/components/recipe-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGetAllQuery } from '@/store/services/commonApi';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Animated,
	Dimensions,
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomColors } from '@/constants/theme';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 40) / 2; // 16px padding on sides + 8px gap between columns

export default function RecipesScreen() {
	const [allRecipes, setAllRecipes] = useState<any[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const scrollY = useRef(new Animated.Value(0)).current;
	const flatListRef = useRef<FlatList>(null);

	const { data: combosData, isFetching: isLoading } = useGetAllQuery({
		path: '/combos',
		sort: '-priority',
		page: page,
		limit: 10,
		filters: { isActive: true },
	}) as any;

	useEffect(() => {
		if (combosData?.doc) {
			if (page === 1) {
				setAllRecipes(combosData.doc);
			} else {
				setAllRecipes(prev => [...prev, ...combosData.doc]);
			}
			setHasMore(combosData.doc.length === 10);
		}
	}, [combosData]);

	const handleBack = () => {
		router.back();
	};

	const handleRecipePress = (recipeId: string) => {
		router.push(`/recipe/${recipeId}`);
	};

	const handleLoadMore = () => {
		if (hasMore && !isLoading) {
			setPage(prev => prev + 1);
		}
	};

	const scrollToTop = () => {
		flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
	};

	const buttonOpacity = scrollY.interpolate({
		inputRange: [0, 100, 300],
		outputRange: [0, 0, 1],
		extrapolate: 'clamp',
	});

	if (isLoading && page === 1) {
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

			<View style={{ flex: 1 }}>
				<FlatList
					ref={flatListRef}
					data={allRecipes}
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
					onEndReached={handleLoadMore}
					onEndReachedThreshold={0.5}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { y: scrollY } } }],
						{ useNativeDriver: false },
					)}
					scrollEventThrottle={16}
					ListFooterComponent={() => (
						<>
							{isLoading && page > 1 && (
								<View style={styles.footerLoader}>
									<ActivityIndicator
										size='small'
										color={CustomColors.darkBrown}
									/>
								</View>
							)}
						</>
					)}
				/>

				<Animated.View
					style={[styles.backToTopButton, { opacity: buttonOpacity }]}
				>
					<TouchableOpacity
						onPress={scrollToTop}
						activeOpacity={0.8}
						style={styles.backToTopInner}
					>
						<IconSymbol name='chevron.up' size={24} color='#FFF' />
					</TouchableOpacity>
				</Animated.View>
			</View>
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
	footerLoader: {
		paddingVertical: 16,
		alignItems: 'center',
	},
	backToTopButton: {
		position: 'absolute',
		bottom: 24,
		right: 24,
		zIndex: 100,
	},
	backToTopInner: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: CustomColors.darkBrown,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
});
