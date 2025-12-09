import { StyleSheet, View } from 'react-native';

function CategorySkeleton() {
	return (
		<View style={styles.card}>
			<View style={styles.skelContent} />
			<View style={styles.skelOverlay} />
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
		padding: 0,
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
	skelContent: {
		flex: 1,
		backgroundColor: '#EEE',
	},
	skelOverlay: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 28,
		backgroundColor: 'rgba(0,0,0,0.1)',
	},
});
