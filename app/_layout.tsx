import { Provider, useDispatch } from 'react-redux';
import { store } from '../store/index';
import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import ReduxProvider from '@/store/provider/ReduxProvider';
import { useEffect } from 'react';
import { hydrateAuth, loadStoredToken } from '@/store/slices/authSlice';

function AuthHydrator({ children }: { children: React.ReactNode }) {
	const dispatch = useDispatch();

	useEffect(() => {
		// Load token from secure storage on app start
		const initAuth = async () => {
			const token = await loadStoredToken();
			if (token) {
				dispatch(hydrateAuth(token));
			}
		};

		initAuth();
	}, [dispatch]);

	return <>{children}</>;
}

export default function RootLayout() {
	return (
		<Provider store={store}>
			<ReduxProvider>
				<PaperProvider>
					<AuthHydrator>
						<Slot />
					</AuthHydrator>
				</PaperProvider>
			</ReduxProvider>
		</Provider>
	);
}
