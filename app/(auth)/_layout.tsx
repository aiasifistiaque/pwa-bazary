import { Provider } from "react-redux";
import { store } from "../../store/index"
import { Slot } from "expo-router";
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
    return (
        <Provider store={store}>
            <PaperProvider>
                <Slot />
            </PaperProvider>
        </Provider>
    )
}