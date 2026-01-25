import PrimaryButton from '@/components/buttons/PrimaryButton';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomColors } from '@/constants/theme';
import { useGetAllQuery } from '@/store/services/commonApi';
import storage from '@/utils/storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SelectAreaScreen() {
	const [selectedCity, setSelectedCity] = useState('Dhaka');
	const [selectedArea, setSelectedArea] = useState<string>('');

	// Fetch areas from API
	const { data: areasData, isLoading: areasLoading } = useGetAllQuery({
		path: 'areas',
		filters: { isActive: true },
	});

	const areas = areasData?.doc || [];

	const handleContinue = async () => {
		if (!selectedArea) return;

		// Store selected area in local storage
		await storage.setItem('selectedCity', selectedCity);
		await storage.setItem('selectedArea', selectedArea);
		await storage.setItem('hasSelectedArea', 'true');

		// Navigate to home - use push then replace to force re-render
		router.replace('/(protected)/(tabs)');
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.scrollContent}>
				{/* Header Section */}
				<View style={styles.header}>
					<IconSymbol
						name='location.fill'
						size={64}
						color={CustomColors.darkBrown}
					/>
					<Text style={styles.title}>Choose Your Area</Text>
					<Text style={styles.subtitle}>
						Help us serve you better by selecting your delivery area
					</Text>
				</View>

				{/* City Selection - Fixed to Dhaka */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>City</Text>
					<View style={styles.cityCard}>
						<IconSymbol
							name='building.2.fill'
							size={24}
							color={CustomColors.darkBrown}
						/>
						<Text style={styles.cityName}>Dhaka</Text>
						<IconSymbol
							name='checkmark.circle.fill'
							size={24}
							color='#10B981'
						/>
					</View>
				</View>

				{/* Area Selection */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Select Your Delivery Area</Text>

					{areasLoading ? (
						<View style={styles.loadingContainer}>
							<ActivityIndicator
								size='large'
								color={CustomColors.darkBrown}
							/>
							<Text style={styles.loadingText}>Loading areas...</Text>
						</View>
					) : areas.length === 0 ? (
						<View style={styles.emptyContainer}>
							<Text style={styles.emptyText}>No areas available at the moment</Text>
						</View>
					) : (
						<View style={styles.areasGrid}>
							{areas.map((area: any) => (
								<TouchableOpacity
									key={area._id || area.id}
									style={[styles.areaCard, selectedArea === area.name && styles.selectedAreaCard]}
									onPress={() => setSelectedArea(area.name)}>
									<View style={styles.radioCircle}>
										{selectedArea === area.name && <View style={styles.radioSelected} />}
									</View>
									<Text
										style={[
											styles.areaName,
											selectedArea === area.name && styles.selectedAreaName,
										]}>
										{area.name}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					)}
				</View>

				{/* Info Message */}
				<View style={styles.infoCard}>
					<IconSymbol
						name='info.circle'
						size={24}
						color='#3B82F6'
					/>
					<View style={styles.infoContent}>
						<Text style={styles.infoTitle}>We'll be in your area very soon!</Text>
						<Text style={styles.infoText}>
							For now, you can choose any area and explore our app. You'll be notified once we start
							delivering to your area.
						</Text>
					</View>
				</View>

				{/* Bottom Spacer */}
				<View style={{ height: 0 }} />
			</ScrollView>

			{/* Continue Button */}
			<View style={styles.bottomContainer}>
				<PrimaryButton
					title='Continue to App'
					onPress={handleContinue}
					disabled={!selectedArea || areasLoading}
				/>
			</View>
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
		backgroundColor: '#F5F5F5',
	},
	scrollContent: {
		paddingBottom: 20,
	},
	header: {
		backgroundColor: '#FFFFFF',
		paddingVertical: 32,
		paddingHorizontal: 24,
		alignItems: 'center',
		gap: 12,
		marginBottom: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: '#000000',
		marginTop: 8,
	},
	subtitle: {
		fontSize: 14,
		color: '#666666',
		textAlign: 'center',
		lineHeight: 20,
	},
	section: {
		backgroundColor: '#FFFFFF',
		padding: 16,
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#000000',
		marginBottom: 12,
	},
	cityCard: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderRadius: 12,
		backgroundColor: CustomColors.lightBrown,
		gap: 12,
	},
	cityName: {
		flex: 1,
		fontSize: 16,
		fontWeight: '600',
		color: CustomColors.darkBrown,
	},
	areasGrid: {
		gap: 12,
	},
	areaCard: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 14,
		borderRadius: 12,
		borderWidth: 1.5,
		borderColor: '#E5E5E5',
		backgroundColor: '#FFFFFF',
		gap: 12,
	},
	selectedAreaCard: {
		borderColor: CustomColors.darkBrown,
		backgroundColor: CustomColors.lightBrown,
	},
	radioCircle: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#E5E5E5',
		alignItems: 'center',
		justifyContent: 'center',
	},
	radioSelected: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: CustomColors.darkBrown,
	},
	areaName: {
		flex: 1,
		fontSize: 15,
		color: '#333333',
		fontWeight: '500',
	},
	selectedAreaName: {
		color: CustomColors.darkBrown,
		fontWeight: '600',
	},
	infoCard: {
		flexDirection: 'row',
		backgroundColor: '#EFF6FF',
		borderWidth: 1,
		borderColor: '#BFDBFE',
		borderRadius: 12,
		padding: 16,
		marginHorizontal: 16,
		gap: 12,
		marginTop: 8,
	},
	infoContent: {
		flex: 1,
		gap: 4,
	},
	infoTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1E40AF',
		marginBottom: 4,
	},
	infoText: {
		fontSize: 13,
		color: '#1E40AF',
		lineHeight: 18,
	},
	loadingContainer: {
		paddingVertical: 40,
		alignItems: 'center',
		gap: 12,
	},
	loadingText: {
		fontSize: 14,
		color: '#666666',
	},
	emptyContainer: {
		paddingVertical: 40,
		alignItems: 'center',
	},
	emptyText: {
		fontSize: 14,
		color: '#666666',
	},
	bottomContainer: {
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 16,
		paddingTop: 12,
		paddingBottom: 0,
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5',
	},
});
