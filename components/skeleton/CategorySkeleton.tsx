import { StyleSheet, View } from 'react-native';

function CategorySkeleton() {
	return (
		<View style={styles.card}>
			<View style={styles.skelOverlay}>
				<View style={styles.skelText} />
			</View>
		</View>
	);
}
export default CategorySkeleton;
const styles = StyleSheet.create({
	card: {
		width: '23%',
		aspectRatio: 1,
		backgroundColor: '#EEE',
		borderRadius: 12,
		marginBottom: 12,
		justifyContent: 'flex-end',
		borderWidth: 1,
		borderColor: '#E5E5E5',
		overflow: 'hidden',
	},
	skelOverlay: {
		width: '100%',
		paddingVertical: 6,
		paddingHorizontal: 4,
		backgroundColor: 'rgba(255,255,255,0.3)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	skelText: {
		width: '80%',
		height: 10,
		borderRadius: 4,
		backgroundColor: '#CCC',
	},
});
