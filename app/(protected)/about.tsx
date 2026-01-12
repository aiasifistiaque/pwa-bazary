import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomColors } from '@/constants/theme';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FeatureCardProps = {
	icon: React.ComponentProps<typeof IconSymbol>['name'];
	title: string;
	description: string;
};

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
	<View style={styles.card}>
		<View style={styles.iconContainer}>
			<IconSymbol name={icon} size={28} color={CustomColors.darkGreen} />
		</View>
		<View style={styles.cardContent}>
			<Text style={styles.cardTitle}>{title}</Text>
			<Text style={styles.cardDescription}>{description}</Text>
		</View>
	</View>
);

export default function AboutScreen() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<IconSymbol name='chevron.left' size={24} color='#000000' />
				</Pressable>
				<Text style={styles.headerTitle}>About Bazarey</Text>
				<View style={{ width: 40 }} />
			</View>

			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.headerSection}>
					<View style={styles.logoContainer}>
						<IconSymbol name='storefront.fill' size={40} color='#FFFFFF' />
					</View>
					<Text style={styles.companyName}>Bazarey Ltd</Text>
					<Text style={styles.tagline}>"Where Quality Comes Home"</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.paragraph}>
						Welcome to Bazarey Ltd, your trusted online marketplace for fresh
						groceries, everyday essentials, and quality food products —
						delivered right to your doorstep.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>What We Offer</Text>
					<FeatureCard
						icon='leaf.fill'
						title='Fresh Vegetables & Fruits'
						description='Sourced daily from local growers.'
					/>
					<FeatureCard
						icon='basket.fill'
						title='Dry Food & Essentials'
						description='Everything your kitchen needs.'
					/>
					<FeatureCard
						icon='fish.fill'
						title='Fish & Meat'
						description='Fresh, hygienically packed, and delivered cold-chain safe.'
					/>
					<FeatureCard
						icon='drop.fill'
						title='Beverages & Drinks'
						description='Local and imported favorites.'
					/>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Why Shop with Bazarey</Text>
					<View style={styles.gridContainer}>
						<View style={styles.gridCard}>
							<IconSymbol
								name='clock.fill'
								size={32}
								color={CustomColors.darkBrown}
							/>
							<Text style={styles.gridTitle}>Next-Day Delivery</Text>
							<Text style={styles.gridText}>Choose your time slot.</Text>
						</View>
						<View style={styles.gridCard}>
							<IconSymbol
								name='truck.fill'
								size={32}
								color={CustomColors.darkBrown}
							/>
							<Text style={styles.gridTitle}>Free Delivery</Text>
							<Text style={styles.gridText}>On orders over 500 BDT.</Text>
						</View>
						<View style={styles.gridCard}>
							<IconSymbol
								name='creditcard.fill'
								size={32}
								color={CustomColors.darkBrown}
							/>
							<Text style={styles.gridTitle}>Flexible Payments</Text>
							<Text style={styles.gridText}>COD, bKash, Nagad + more.</Text>
						</View>
						<View style={styles.gridCard}>
							<IconSymbol
								name='star.fill'
								size={32}
								color={CustomColors.darkBrown}
							/>
							<Text style={styles.gridTitle}>Loyalty Rewards</Text>
							<Text style={styles.gridText}>Earn points on every order.</Text>
						</View>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Our Mission</Text>
					<View style={styles.missionCard}>
						<Text style={styles.missionText}>
							To simplify grocery shopping in Bangladesh by delivering fresh,
							high-quality products quickly and reliably, while empowering local
							suppliers and building customer trust through transparency and
							service excellence.
						</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Our Vision</Text>
					<View style={styles.visionCard}>
						<Text style={styles.missionText}>
							To become Bangladesh’s most trusted online food marketplace —
							where quality, speed, and customer satisfaction meet innovation
							and community care.
						</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Contact Us</Text>
					<View style={styles.contactCard}>
						<IconSymbol name='mappin.circle.fill' size={24} color='#FFFFFF' />
						<Text style={styles.contactText}>
							House 29, Road-18, Block-M, Sector 3, Jahurul Islam City,
							Aftabnagar, Badda, Dhaka-1212
						</Text>
					</View>
					<View style={styles.contactCard}>
						<IconSymbol name='envelope.fill' size={24} color='#FFFFFF' />
						<Text style={styles.contactText}>bazarey2026@gmail.com</Text>
					</View>
				</View>

				<View style={{ height: 40 }} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#F8F9FA',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	backButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
	},
	content: {
		padding: 20,
	},
	headerSection: {
		marginBottom: 32,
		alignItems: 'center',
	},
	logoContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: CustomColors.darkGreen,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 16,
		shadowColor: CustomColors.darkGreen,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
	},
	companyName: {
		fontSize: 28,
		fontWeight: 'bold',
		color: CustomColors.textColor,
		marginBottom: 4,
	},
	tagline: {
		fontSize: 16,
		fontStyle: 'italic',
		color: CustomColors.subTextColor,
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: CustomColors.textColor,
		marginBottom: 16,
	},
	paragraph: {
		fontSize: 16,
		lineHeight: 24,
		color: CustomColors.subTextColor,
		textAlign: 'center',
	},
	card: {
		flexDirection: 'row',
		backgroundColor: '#FFFFFF',
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: '#E8F5E9', // Light green background for icons
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
	},
	cardContent: {
		flex: 1,
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: CustomColors.textColor,
		marginBottom: 4,
	},
	cardDescription: {
		fontSize: 14,
		color: CustomColors.subTextColor,
	},
	gridContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
	},
	gridCard: {
		width: '48%',
		backgroundColor: CustomColors.lightBrown,
		padding: 16,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	gridTitle: {
		fontSize: 14,
		fontWeight: 'bold',
		color: CustomColors.darkBrown,
		marginTop: 8,
		marginBottom: 4,
		textAlign: 'center',
	},
	gridText: {
		fontSize: 12,
		color: CustomColors.darkBrown,
		textAlign: 'center',
	},
	missionCard: {
		backgroundColor: CustomColors.darkGreen,
		padding: 24,
		borderRadius: 16,
	},
	missionText: {
		fontSize: 16,
		color: '#FFFFFF',
		textAlign: 'center',
		lineHeight: 24,
		fontWeight: '500',
	},
	contactCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: CustomColors.darkBrown,
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
	},
	contactText: {
		marginLeft: 12,
		color: '#FFFFFF',
		fontSize: 14,
		fontWeight: '500',
		flex: 1,
	},
	visionCard: {
		backgroundColor: CustomColors.darkGreen,
		padding: 24,
		borderRadius: 16,
	},
});
