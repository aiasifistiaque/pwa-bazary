import React from 'react';
import { StyleSheet, Text } from 'react-native';

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
	return <Text style={styles.sectionTitle}>{children}</Text>;
};

const styles = StyleSheet.create({
	sectionTitle: {
		fontSize: 18,
		fontWeight: '500',
		color: '#000',
		marginBottom: 12,
	},
});

export default SectionTitle;
