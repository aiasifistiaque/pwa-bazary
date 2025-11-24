import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function Loader({ text = 'Loading...' }: { text?: string }) {
	return (
		<View style={styles.container}>
			<ActivityIndicator size='large' color='#52bf90' />
			<Text style={styles.text}>{text}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#FFF',
	},
	text: {
		marginTop: 10,
		fontSize: 16,
		color: '#555',
	},
});
