import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomColors } from '@/constants/theme';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsConditionsScreen() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<IconSymbol name='chevron.left' size={24} color='#000000' />
				</Pressable>
				<Text style={styles.headerTitle}>Terms & Conditions</Text>
				<View style={{ width: 40 }} />
			</View>

			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.headerSection}>
					<Text style={styles.companyName}>Bazarey Ltd</Text>
					<Text style={styles.tagline}>"Where Quality Comes Home"</Text>
					<Text style={styles.effectiveDate}>Effective Date: 01.01.2026</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
					<Text style={styles.paragraph}>
						By accessing or using the services provided by Bazarey Ltd, you
						agree to comply with and be bound by these Terms & Conditions. If
						you do not agree to any part of these terms, please discontinue
						using our services.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						2. Account and User Responsibilities
					</Text>
					<Text style={styles.paragraph}>
						To place an order on Bazarey, users must create an account in the
						mobile app. You are responsible for maintaining the confidentiality
						of your account credentials and for all activities that occur under
						your account. Please ensure all information provided is accurate and
						up to date.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>3. Product Information</Text>
					<Text style={styles.paragraph}>
						We strive to ensure all product descriptions, images, and prices are
						accurate. However, minor variations may occur. Bazarey reserves the
						right to correct any errors or update information without prior
						notice.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>4. Ordering & Delivery</Text>
					<Text style={styles.paragraph}>
						Bazarey provides both a mobile app and a website. While the website
						is available for browsing products and accessing information, orders
						can be placed only through the Bazarey mobile app. Once confirmed,
						you will receive an order notification.
					</Text>
					<Text style={styles.paragraph}>
						Bazarey offers next-day delivery, allowing customers to schedule
						their preferred delivery time to ensure freshness and convenience.
					</Text>
					<Text style={styles.paragraph}>
						Orders above 500 BDT qualify for free delivery, while fees may apply
						for orders below this amount.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>5. Payment Policy</Text>
					<Text style={styles.paragraph}>
						Bazarey accepts all kinds of payment methods except MasterCard and
						Visa card. Payments can be made securely via bKash, Nagad, Rocket,
						Upay, or Cash on Delivery (COD). All payments must be completed
						before or at the time of delivery.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>6. Return & Refund Policy</Text>
					<Text style={styles.paragraph}>
						Our return and refund process is outlined in a separate policy
						document. Customers are encouraged to review the official 'Return &
						Refund Policy' for detailed information.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
					<Text style={styles.paragraph}>
						Bazarey Ltd shall not be liable for any indirect, incidental, or
						consequential damages arising from the use of our app or products.
						We make every effort to ensure the accuracy and safety of all
						products delivered to our customers.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>8. Intellectual Property</Text>
					<Text style={styles.paragraph}>
						All content on the Bazarey app and website, including text,
						graphics, logos, images, and software, is the property of Bazarey
						Ltd and protected by copyright laws. Reproduction or redistribution
						without written permission is prohibited.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>9. Governing Law</Text>
					<Text style={styles.paragraph}>
						These Terms & Conditions are governed by and construed in accordance
						with the laws of the People’s Republic of Bangladesh. Any disputes
						shall be subject to the exclusive jurisdiction of the courts of
						Dhaka.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>10. Contact Information</Text>
					<Text style={styles.contactInfo}>Bazarey Ltd</Text>
					<Text style={styles.contactInfo}>
						House 29, Road-18, Block-M, Sector 3,
					</Text>
					<Text style={styles.contactInfo}>
						Jahurul Islam City, Aftabnagar, Badda, Dhaka-1219
					</Text>
					<Text style={styles.contactInfo}>Email: bazarey2026@gmail.com</Text>
				</View>

				<View style={{ height: 40 }} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FFFFFF',
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
		marginBottom: 24,
		alignItems: 'center',
	},
	companyName: {
		fontSize: 24,
		fontWeight: 'bold',
		color: CustomColors.textColor,
		marginBottom: 4,
	},
	tagline: {
		fontSize: 16,
		fontStyle: 'italic',
		color: CustomColors.subTextColor,
		marginBottom: 8,
	},
	effectiveDate: {
		fontSize: 14,
		color: '#999999',
	},
	section: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: CustomColors.textColor,
		marginBottom: 8,
	},
	paragraph: {
		fontSize: 15,
		lineHeight: 22,
		color: CustomColors.subTextColor,
		marginBottom: 8,
	},
	contactInfo: {
		fontSize: 15,
		lineHeight: 22,
		color: CustomColors.subTextColor,
		fontWeight: '500',
	},
});
