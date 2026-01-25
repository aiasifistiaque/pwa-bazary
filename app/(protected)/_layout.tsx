import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import ReduxProvider from '@/store/provider/ReduxProvider';
import { loadStoredToken } from '@/store/slices/authSlice';
import storage from '@/utils/storage';
import { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const router = useRouter();
	const segments = useSegments();
	const [token, setToken] = useState<string | null>(null);
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [hasSelectedArea, setHasSelectedArea] = useState<string | null>(null);

	useEffect(() => {
		const checkAuth = async () => {
			const storedToken = await loadStoredToken();
			const areaSelected = await storage.getItem('hasSelectedArea');
			setToken(storedToken);
			setHasSelectedArea(areaSelected);
			setIsCheckingAuth(false);
		};

		checkAuth();
	}, []);

	useEffect(() => {
		if (!isCheckingAuth) {
			if (!token) {
				router.replace('/login');
			} else if (token && hasSelectedArea === 'false') {
				// User is logged in but hasn't selected area - only redirect from select-area page
				const currentPath = segments.join('/');
				//Don't redirect if already on select-area page
				if (currentPath !== '(protected)/select-area') {
					router.replace('/(protected)/select-area');
				}
			} else if (token && hasSelectedArea === 'true') {
				// User has selected area, ensure they're not stuck on select-area page
				const currentPath = segments.join('/');
				if (currentPath === '(protected)/select-area') {
					router.replace('/(protected)/(tabs)');
				}
			}
		}
	}, [token, isCheckingAuth, hasSelectedArea, segments, router]);

	// Show nothing while checking authentication
	if (isCheckingAuth || !token) {
		return null;
	}

	return (
		<ReduxProvider>
			<PaperProvider>
				<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
					<Stack>
						<Stack.Screen
							name='select-area'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='(tabs)'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='product'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='category'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='collection'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='all-categories'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='all-products'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='product-list'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='recipe'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='recipes'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='checkout'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='profile'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='orders'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='subscription'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='invite-friends'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='vouchers'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='rewards'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='terms-conditions'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='privacy-policy'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='about'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='coming-soon'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='order-detail'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='help-center'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='new-chat'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='conversation/[id]'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='addresses'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='modal'
							options={{ presentation: 'modal', title: 'Modal' }}
						/>
					</Stack>
					<StatusBar style='auto' />
				</ThemeProvider>
			</PaperProvider>
		</ReduxProvider>
	);
}
