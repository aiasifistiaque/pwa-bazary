import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';

type SectionHeaderProps = {
	title: string;
	onSeeAllPress?: () => void;
};

export function SectionHeader({ title, onSeeAllPress }: SectionHeaderProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>
			{onSeeAllPress && (
				<TouchableOpacity
					style={styles.seeAllButton}
					onPress={onSeeAllPress}
					activeOpacity={0.7}
				>
					<Text style={styles.seeAllText}>View all</Text>
					<IconSymbol name='chevron.right' size={14} color='#666' />
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000',
	},
	seeAllButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	seeAllText: {
		fontSize: 14,
		color: '#666',
		fontWeight: '500',
	},
});
