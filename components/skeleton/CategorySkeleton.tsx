import { StyleSheet, View } from 'react-native';

function CategorySkeleton() {
	return (
		<View style={styles.card}>
			<View style={styles.skelImg} />
			<View style={styles.skelText} />
		</View>
	);
}
export default CategorySkeleton;
const styles = StyleSheet.create({
	card: {
		width: '23%',
		aspectRatio: 1,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 8,
		marginBottom: 12,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#E5E5E5',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	skelImg: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: '#EEE',
		marginBottom: 8,
	},
	skelText: {
		width: 40,
		height: 10,
		borderRadius: 4,
		backgroundColor: '#EEE',
	},
});
