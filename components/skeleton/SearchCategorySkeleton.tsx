import { StyleSheet, View } from 'react-native';

function SearchCategorySkeleton() {
	return (
		<View style={styles.card}>
			<View style={styles.skelImg} />
			<View style={styles.skelText} />
			<View style={styles.skelChevron} />
		</View>
	);
}

export default SearchCategorySkeleton;

const styles = StyleSheet.create({
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FAFAFA',
		padding: 12,
		borderRadius: 12,
		gap: 12,
		marginBottom: 12,
	},
	skelImg: {
		width: 60,
		height: 60,
		borderRadius: 8,
		backgroundColor: '#EEE',
	},
	skelText: {
		flex: 1,
		height: 20,
		borderRadius: 4,
		backgroundColor: '#EEE',
	},
	skelChevron: {
		width: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: '#EEE',
	},
});
