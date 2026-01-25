import { MobileOnlyGuard } from '@/components/MobileOnlyGuard';
import PWAOnlyGuard from '@/components/PWAOnlyGuard';
import { ToastProvider } from '@/contexts/ToastContext';
import ReduxProvider from '@/store/provider/ReduxProvider';
import { hydrateAuth, loadStoredToken } from '@/store/slices/authSlice';
import { loadFavorites, setFavorites } from '@/store/slices/favoritesSlice';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../store/index';

function AuthHydrator({ children }: { children: React.ReactNode }) {
	const dispatch = useDispatch();

	useEffect(() => {
		// Load token and favorites from storage on app start
		const initApp = async () => {
			// Load auth token
			const token = await loadStoredToken();
			if (token) {
				dispatch(hydrateAuth(token));
			}

			// Load favorites
			const favorites = await loadFavorites();
			dispatch(setFavorites(favorites));
		};

		initApp();
	}, [dispatch]);

	return <>{children}</>;
}

export default function RootLayout() {
	// Register service worker for PWA
	useEffect(() => {
		if (Platform.OS === 'web' && 'serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/sw.js')
				.then(registration => {
					console.log('Service Worker registered:', registration);
				})
				.catch(error => {
					console.log('Service Worker registration failed:', error);
				});
		}
	}, []);

	return (
		<Provider store={store}>
			<ReduxProvider>
				<PaperProvider>
					<ToastProvider>
						<MobileOnlyGuard>
							<PWAOnlyGuard>
								<AuthHydrator>
									<Slot />
								</AuthHydrator>
							</PWAOnlyGuard>
						</MobileOnlyGuard>
					</ToastProvider>
				</PaperProvider>
			</ReduxProvider>
		</Provider>
	);
}
