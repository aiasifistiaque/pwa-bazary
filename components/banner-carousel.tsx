import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { PromoBanner } from './promo-banner';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const SPACING = 12;

type BannerCarouselProps = {
	banners: Array<{
		id: string;
		title: string;
		description: string;
		couponCode?: string;
		image: string;
	}>;
	onBannerPress?: (id: string) => void;
};

export function BannerCarousel({ banners, onBannerPress }: BannerCarouselProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const flatListRef = useRef<FlatList>(null);

	const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
		if (viewableItems.length > 0) {
			setActiveIndex(viewableItems[0].index || 0);
		}
	}).current;

	const viewabilityConfig = useRef({
		itemVisiblePercentThreshold: 50,
	}).current;

	return (
		<View style={styles.container}>
			<FlatList
				ref={flatListRef}
				data={banners}
				horizontal
				showsHorizontalScrollIndicator={false}
				pagingEnabled={false}
				snapToInterval={CARD_WIDTH + SPACING}
				decelerationRate='fast'
				contentContainerStyle={styles.flatListContent}
				onViewableItemsChanged={onViewableItemsChanged}
				viewabilityConfig={viewabilityConfig}
				renderItem={({ item }) => (
					<View style={[styles.cardContainer, { width: CARD_WIDTH }]}>
						<PromoBanner
							title={item.title}
							description={item.description}
							couponCode={item.couponCode}
							image={item.image}
							onPress={() => onBannerPress?.(item.id)}
						/>
					</View>
				)}
				keyExtractor={item => item.id}
			/>

			{/* Pagination Dots */}
			<View style={styles.pagination}>
				{banners?.map((_, index) => (
					<View
						key={index}
						style={[
							styles.dot,
							index === activeIndex ? styles.activeDot : styles.inactiveDot,
						]}
					/>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 8,
		marginTop: 8,
	},
	flatListContent: {
		paddingHorizontal: SPACING,
	},
	cardContainer: {
		marginRight: SPACING,
	},
	pagination: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 8,
		gap: 6,
	},
	dot: {
		height: 6,
		borderRadius: 3,
	},
	activeDot: {
		width: 20,
		backgroundColor: '#E63946',
	},
	inactiveDot: {
		width: 6,
		backgroundColor: '#D1D1D1',
	},
});
