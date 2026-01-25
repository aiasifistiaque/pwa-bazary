import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';

const CustomHeader = ({ children }: any) => {
	return (
		<View style={styles.header}>
			<Pressable
				onPress={() => router.back()}
				style={styles.backButton}>
				<IconSymbol
					name='chevron.left'
					size={16}
					color='#000000'
				/>
			</Pressable>
			<Text style={styles.headerTitle}>{children}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 16,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
		// shadowColor: '#000',
		// shadowOffset: { width: 0, height: 2 },
		// shadowOpacity: 0.05,
		// shadowRadius: 3,
		elevation: 2,
		zIndex: 10,
	},
	backButton: {
		width: 14,
		height: 14,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 0,
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: '400',
		color: '#000000',
		flex: 1,
	},
});

export default CustomHeader;
