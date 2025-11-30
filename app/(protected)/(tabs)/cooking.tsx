import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CookingScreen() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView style={styles.container}>
				<ThemedView style={styles.content}>
					<ThemedText type='title'>Cooking</ThemedText>
					<ThemedText>Cooking recipes and meal planning will appear here.</ThemedText>
				</ThemedView>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	content: {
		padding: 20,
		gap: 16,
	},
});
