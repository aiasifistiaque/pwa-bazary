import { Provider, useDispatch } from 'react-redux';
import { store } from '../store/index';
import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import ReduxProvider from '@/store/provider/ReduxProvider';
import { useEffect } from 'react';
import { hydrateAuth, loadStoredToken } from '@/store/slices/authSlice';
import { loadFavorites, setFavorites } from '@/store/slices/favoritesSlice';
import { ToastProvider } from '@/contexts/ToastContext';

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
	return (
		<Provider store={store}>
			<ReduxProvider>
				<PaperProvider>
					<ToastProvider>
						<AuthHydrator>
							<Slot />
						</AuthHydrator>
					</ToastProvider>
				</PaperProvider>
			</ReduxProvider>
		</Provider>
	);
}
