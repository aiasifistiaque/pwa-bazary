
import { Provider } from "react-redux";
import { store } from "../store/index"
import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import ReduxProvider from "@/store/provider/ReduxProvider";

export default function RootLayout() {

    return (
        <Provider store={store}>
            <ReduxProvider>
                <PaperProvider>
                    <Slot />
                </PaperProvider>
            </ReduxProvider>
        </Provider>
    )
}