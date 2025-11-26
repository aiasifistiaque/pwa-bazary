import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import ReduxProvider from '@/store/provider/ReduxProvider';
import { PaperProvider } from 'react-native-paper';
import { useGetSelfQuery } from '@/store/services/authApi';
import { useEffect, useState } from 'react';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const router = useRouter();
const token = localStorage.getItem("TOKEN_NAME")
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isMounted) return;

		if (!token) {
			router.replace('/login');
		}
	}, [token, isMounted, router]);

	if (!isMounted) {
		return null;
	}

	if (!token) {
		return null;
	}

	return (
		<ReduxProvider>
			<PaperProvider>
				<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
					<Stack>
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
							name='all-categories'
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
							name='order-detail'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='help-center'
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