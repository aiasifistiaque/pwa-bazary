import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomColors } from '@/constants/theme';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<IconSymbol name='chevron.left' size={24} color='#000000' />
				</Pressable>
				<Text style={styles.headerTitle}>Privacy Policy</Text>
				<View style={{ width: 40 }} />
			</View>

			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.headerSection}>
					<Text style={styles.companyName}>Bazarey Ltd</Text>
					<Text style={styles.tagline}>"Where Quality Comes Home"</Text>
					<Text style={styles.effectiveDate}>Effective Date: 01.01.2026</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Introduction</Text>
					<Text style={styles.paragraph}>
						At Bazarey Ltd, your privacy is our priority. This Privacy Policy
						explains how we collect, use, and protect your personal information
						when you visit or make a purchase from our platform. By using our
						services, you agree to the terms of this Privacy Policy.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Information We Collect</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.boldText}>Personal Information</Text> — such as
						your name, phone number, delivery address, and email address when
						you create an account or place an order.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.boldText}>Account Information</Text> — such as
						your username, password, and preferences.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.boldText}>Payment Information</Text> — for
						online transactions (we accept all kinds of payment methods except
						MasterCard and Visa card).
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.boldText}>Usage Data</Text> — including your
						browsing behavior, pages visited, and time spent on our platform.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.boldText}>Device Information</Text> — like your
						IP address, browser type, and operating system.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>How We Use Your Information</Text>
					<View style={styles.bulletList}>
						<Text style={styles.bulletPoint}>
							• Processing and fulfilling your orders.
						</Text>
						<Text style={styles.bulletPoint}>
							• Communicating order updates, offers, and important notices.
						</Text>
						<Text style={styles.bulletPoint}>
							• Improving our website, services, and customer experience.
						</Text>
						<Text style={styles.bulletPoint}>
							• Providing customer support and handling complaints.
						</Text>
						<Text style={styles.bulletPoint}>
							• Ensuring secure transactions and preventing fraudulent activity.
						</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Sharing Your Information</Text>
					<Text style={styles.paragraph}>
						We respect your privacy and do not sell or rent your personal data.
						However, we may share information with trusted service providers
						(such as delivery partners and payment gateways) only to complete
						your order and improve our services.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Cookies & Tracking</Text>
					<Text style={styles.paragraph}>
						Bazarey uses cookies to enhance user experience, remember your
						preferences, and improve website performance. You can choose to
						disable cookies in your browser settings, but some site features may
						not work properly without them.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Payment Information</Text>
					<Text style={styles.paragraph}>
						We accept all kinds of payment methods except MasterCard and Visa
						card. Your payment data is processed securely through our trusted
						payment partners, and we do not store your sensitive card details.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Data Security</Text>
					<Text style={styles.paragraph}>
						We use modern encryption and secure data storage systems to protect
						your personal information. Only authorized personnel can access your
						data, ensuring confidentiality and integrity at all times.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Your Rights</Text>
					<View style={styles.bulletList}>
						<Text style={styles.bulletPoint}>
							• Access and review your personal information.
						</Text>
						<Text style={styles.bulletPoint}>
							• Request corrections to inaccurate or outdated data.
						</Text>
						<Text style={styles.bulletPoint}>
							• Delete your account and associated data.
						</Text>
						<Text style={styles.bulletPoint}>
							• Withdraw consent for marketing communications.
						</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Changes to This Policy</Text>
					<Text style={styles.paragraph}>
						We may update this Privacy Policy from time to time. All changes
						will be posted on our website with the updated effective date. We
						encourage you to review this page periodically to stay informed
						about how we protect your data.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Contact Information</Text>
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
	boldText: {
		fontWeight: '600',
		color: CustomColors.textColor,
	},
	bulletList: {
		paddingLeft: 8,
	},
	bulletPoint: {
		fontSize: 15,
		lineHeight: 22,
		color: CustomColors.subTextColor,
		marginBottom: 4,
	},
	contactInfo: {
		fontSize: 15,
		lineHeight: 22,
		color: CustomColors.subTextColor,
		fontWeight: '500',
	},
});
