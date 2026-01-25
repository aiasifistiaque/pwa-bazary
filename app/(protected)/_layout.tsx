import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import ReduxProvider from '@/store/provider/ReduxProvider';
import { PaperProvider } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { loadStoredToken } from '@/store/slices/authSlice';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const router = useRouter();
	const [token, setToken] = useState<string | null>(null);
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			const storedToken = await loadStoredToken();
			setToken(storedToken);
			setIsCheckingAuth(false);
		};

		checkAuth();
	}, []);

	useEffect(() => {
		if (!isCheckingAuth && !token) {
			router.replace('/login');
		}
	}, [token, isCheckingAuth, router]);

	// Show nothing while checking authentication
	if (isCheckingAuth || !token) {
		return null;
	}

	return (
		<ReduxProvider>
			<PaperProvider>
				<ThemeProvider
					value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
				>
					<Stack>
						<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
						<Stack.Screen name='product' options={{ headerShown: false }} />
						<Stack.Screen name='category' options={{ headerShown: false }} />
						<Stack.Screen name='collection' options={{ headerShown: false }} />
						<Stack.Screen
							name='all-categories'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='product-list'
							options={{ headerShown: false }}
						/>
						<Stack.Screen name='recipe' options={{ headerShown: false }} />
						<Stack.Screen name='recipes' options={{ headerShown: false }} />
						<Stack.Screen name='checkout' options={{ headerShown: false }} />
						<Stack.Screen name='profile' options={{ headerShown: false }} />
						<Stack.Screen name='orders' options={{ headerShown: false }} />
						<Stack.Screen
							name='subscription'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='invite-friends'
							options={{ headerShown: false }}
						/>
						<Stack.Screen name='vouchers' options={{ headerShown: false }} />
						<Stack.Screen name='rewards' options={{ headerShown: false }} />
						<Stack.Screen
							name='terms-conditions'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='privacy-policy'
							options={{ headerShown: false }}
						/>
						<Stack.Screen name='about' options={{ headerShown: false }} />
						<Stack.Screen name='coming-soon' options={{ headerShown: false }} />
						<Stack.Screen
							name='order-detail'
							options={{ headerShown: false }}
						/>
						<Stack.Screen name='help-center' options={{ headerShown: false }} />
						<Stack.Screen name='new-chat' options={{ headerShown: false }} />
						<Stack.Screen
							name='conversation/[id]'
							options={{ headerShown: false }}
						/>
						<Stack.Screen name='addresses' options={{ headerShown: false }} />
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
