import { Redirect, Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { RootState } from '@/store';
import { useGetSelfQuery } from '@/store/services/authApi';
import ReduxProvider from '@/store/provider/ReduxProvider';

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const cartItemCount = useSelector((state: RootState) => state.cart.totalItems) || 0;

	return (
		<ReduxProvider>
			<SafeAreaView style={styles.safeArea}>
				<Tabs
					screenOptions={{
						tabBarActiveTintColor: '#E63946',
						tabBarInactiveTintColor: '#666666',
						headerShown: false,
						tabBarButton: HapticTab,
						tabBarStyle: {
							backgroundColor: '#FFFFFF',
							borderTopWidth: 1,
							borderTopColor: '#E5E5E5',
							paddingBottom: Platform.OS === 'ios' ? 0 : 5,
							paddingTop: 5,
							height: Platform.OS === 'ios' ? 60 : 65,
						},
						tabBarLabelStyle: {
							fontSize: 11,
							fontWeight: '500',
						},
					}}>
					<Tabs.Screen
						name='index'
						options={{
							title: 'Discover',
							tabBarIcon: ({ color }) => (
								<IconSymbol
									size={24}
									name='storefront.fill'
									color={color}
								/>
							),
						}}
					/>
					<Tabs.Screen
						name='search'
						options={{
							title: 'Search',
							tabBarIcon: ({ color }) => (
								<IconSymbol
									size={24}
									name='magnifyingglass'
									color={color}
								/>
							),
						}}
					/>
					<Tabs.Screen
						name='cart'
						options={{
							title: 'Cart',
							tabBarIcon: ({ color }) => (
								<View style={styles.cartIconContainer}>
									<IconSymbol
										size={24}
										name='cart.fill'
										color={color}
									/>
									{cartItemCount > 0 && (
										<View style={styles.badge}>
											<Text style={styles.badgeText}>{cartItemCount}</Text>
										</View>
									)}
								</View>
							),
						}}
					/>
					<Tabs.Screen
						name='favorites'
						options={{
							title: 'Favorites',
							tabBarIcon: ({ color }) => (
								<IconSymbol
									size={24}
									name='checkmark.circle.fill'
									color={color}
								/>
							),
						}}
					/>
					<Tabs.Screen
						name='menu'
						options={{
							title: 'Menu',
							tabBarIcon: ({ color }) => (
								<IconSymbol
									size={24}
									name='line.3.horizontal'
									color={color}
								/>
							),
						}}
					/>
					<Tabs.Screen
						name='cooking'
						options={{
							href: null, // Hide this tab from the tab bar
						}}
					/>
					<Tabs.Screen
						name='explore'
						options={{
							href: null, // Hide this tab from the tab bar
						}}
					/>
				</Tabs>
			</SafeAreaView>
		</ReduxProvider>

	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	cartIconContainer: {
		position: 'relative',
	},
	badge: {
		position: 'absolute',
		top: -6,
		right: -10,
		backgroundColor: '#E63946',
		borderRadius: 10,
		minWidth: 20,
		height: 20,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 5,
	},
	badgeText: {
		color: '#FFFFFF',
		fontSize: 11,
		fontWeight: 'bold',
	},
});
