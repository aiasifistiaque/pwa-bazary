import { StyleSheet, View } from 'react-native';

function CategorySkeleton() {
	return (
		<View style={styles.container}>
			<View style={styles.imageContainer} />
			<View style={styles.textLine} />
		</View>
	);
}
export default CategorySkeleton;
const styles = StyleSheet.create({
	container: {
		width: '23%',
		marginBottom: 16,
		alignItems: 'center',
	},
	imageContainer: {
		width: '100%',
		aspectRatio: 1,
		backgroundColor: '#EEE',
		borderRadius: 12,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		overflow: 'hidden',
	},
	textLine: {
		width: '80%',
		height: 12,
		backgroundColor: '#EEE',
		borderRadius: 6,
	},
});
