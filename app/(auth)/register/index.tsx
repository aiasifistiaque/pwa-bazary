import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
	TouchableWithoutFeedback,
	Keyboard,
	ActivityIndicator,
	Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '@/store/services/authApi';
import { login } from '@/store/slices/authSlice';
import { useRouter } from 'expo-router';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { FontAwesome } from '@expo/vector-icons';
import { CustomColors } from '@/constants/theme';

export default function RegisterScreen() {
	const dispatch = useDispatch();
	const router = useRouter();

	// State for input fields and errors
	const [name, setName] = useState('');
	const [email, setemail] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setconfirm] = useState('');
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [showPassword, setShowPassword] = useState(false);
	const [showconfirm, setShowconfirm] = useState(false);
	const [isDialogVisible, setDialogVisible] = useState(false);

	const [registerTrigger, registerResponse] = useRegisterMutation();

	const isPhoneNumber = (value: string) => /^\d+$/.test(value);

	const handleRegister = async () => {
		const newErrors: Record<string, string> = {};

		// Validate all fields
		if (!name) newErrors.name = 'Name is required';
		if (!email) {
			newErrors.email = 'Email is required';
		} else if (isPhoneNumber(email)) {
			// If it's a phone number, validate length
			if (email.length !== 11) {
				newErrors.email = 'Phone number must be 11 digits';
			}
		}
		if (!password) newErrors.password = 'Password is required';
		if (!confirm) newErrors.confirm = 'Confirm Password is required';
		if (password && confirm && password !== confirm) {
			newErrors.confirm = 'Passwords do not match';
		}

		// If there are errors, set them and return early
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		// Trigger registration mutation
		registerTrigger({ name, email, password, confirm });
	};

	const resetAll = () => {
		setName('');
		setemail('');
		setPassword('');
		setconfirm('');
		setErrors({});
	};

	useEffect(() => {
		if (registerResponse.isSuccess && registerResponse.data) {
			dispatch(login(registerResponse.data));
			resetAll();

			// Use setTimeout to ensure state updates complete before navigation
			setTimeout(() => {
				router.replace('/');
			}, 100);
		} else if (registerResponse.isError) {
			setDialogVisible(true);
		}
	}, [
		registerResponse.isSuccess,
		registerResponse.isError,
		registerResponse.data,
	]);

	const dismissKeyboard = () => {
		if (Platform.OS !== 'web') {
			Keyboard.dismiss();
		}
	};

	const content = (
		<View style={styles.container}>
			<Text style={styles.title}>Register</Text>

			<TextInput
				style={styles.input}
				placeholder='Name'
				placeholderTextColor={'#6d6b6b'}
				value={name}
				onChangeText={value => {
					setName(value);
					if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
				}}
				autoCapitalize='words'
			/>
			{errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

			<TextInput
				style={styles.input}
				placeholder='Email'
				placeholderTextColor={'#6d6b6b'}
				value={email}
				onChangeText={value => {
					setemail(value);
					// Clear previous error
					if (errors.email) {
						setErrors(prev => ({ ...prev, email: '' }));
					}
					// If it's a phone number (only contains digits), validate length
					if (isPhoneNumber(value) && value.length > 0 && value.length !== 11) {
						setErrors(prev => ({
							...prev,
							email: 'Phone number must be 11 digits',
						}));
					}
				}}
				autoCapitalize='none'
				keyboardType='default'
			/>
			{errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

			<View style={styles.passwordContainer}>
				<TextInput
					style={[styles.input, styles.passwordInput]}
					placeholder='Password'
					placeholderTextColor={'#6d6b6b'}
					value={password}
					onChangeText={value => {
						setPassword(value);
						if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
					}}
					secureTextEntry={!showPassword}
				/>
				<TouchableOpacity
					style={styles.eyeButton}
					onPress={() => setShowPassword(prev => !prev)}
				>
					{showPassword ? (
						<FontAwesome name='eye' size={20} color='#000' />
					) : (
						<FontAwesome name='eye-slash' size={20} color='#000' />
					)}
				</TouchableOpacity>
			</View>
			{errors.password && (
				<Text style={styles.errorText}>{errors.password}</Text>
			)}

			<View style={styles.passwordContainer}>
				<TextInput
					style={[styles.input, styles.passwordInput]}
					placeholder='Confirm Password'
					placeholderTextColor={'#6d6b6b'}
					value={confirm}
					onChangeText={value => {
						setconfirm(value);
						if (errors.confirm) setErrors(prev => ({ ...prev, confirm: '' }));
					}}
					secureTextEntry={!showconfirm}
				/>
				<TouchableOpacity
					style={styles.eyeButton}
					onPress={() => setShowconfirm(prev => !prev)}
				>
					{showconfirm ? (
						<FontAwesome name='eye' size={20} color='#000' />
					) : (
						<FontAwesome name='eye-slash' size={20} color='#000' />
					)}
				</TouchableOpacity>
			</View>
			{errors.confirm && <Text style={styles.errorText}>{errors.confirm}</Text>}

			<TouchableOpacity
				style={[
					styles.button,
					registerResponse.isLoading && styles.buttonDisabled,
				]}
				onPress={handleRegister}
				disabled={registerResponse.isLoading}
			>
				<Text style={styles.buttonText}>
					{registerResponse.isLoading ? (
						<ActivityIndicator size={'small'} color={'#fff'} />
					) : (
						'Register'
					)}
				</Text>
			</TouchableOpacity>

			<Text style={styles.footerText}>
				Already registered?{' '}
				<Text style={styles.linkText} onPress={() => router.push('/login')}>
					Login now!
				</Text>
			</Text>

			{/* React Native Paper Dialog */}
			<Portal>
				<Dialog
					visible={isDialogVisible}
					onDismiss={() => setDialogVisible(false)}
				>
					<Dialog.Title>Oops!</Dialog.Title>
					<Dialog.Content>
						<Paragraph>
							{(() => {
								if (
									registerResponse?.error &&
									'data' in registerResponse.error
								) {
									const errorData = registerResponse.error.data as {
										message?: string;
									};
									return (
										errorData?.message || 'An error occurred. Please try again.'
									);
								}
								if (
									registerResponse?.error &&
									'message' in registerResponse.error
								) {
									return registerResponse.error.message;
								}
								return 'An error occurred. Please try again.';
							})()}
						</Paragraph>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setDialogVisible(false)}>OK</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</View>
	);

	// Only wrap in TouchableWithoutFeedback on mobile platforms
	if (Platform.OS === 'web') {
		return content;
	}

	return (
		<TouchableWithoutFeedback onPress={dismissKeyboard}>
			{content}
		</TouchableWithoutFeedback>
	);
}

const bodyColor = CustomColors.bodyColor;
const buttonBgColor = CustomColors.buttonBgColor;
const buttonTextColor = CustomColors.buttonTextColor;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
		backgroundColor: bodyColor,
		gap: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	input: {
		width: '100%',
		height: 50,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		backgroundColor: '#fff',
	},
	passwordContainer: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
	},
	passwordInput: {
		flex: 1,
	},
	eyeButton: {
		marginLeft: -39,
		padding: 10,
	},
	errorText: {
		color: 'red',
		fontSize: 12,
		marginBottom: 10,
		alignSelf: 'flex-start',
	},
	button: {
		width: '100%',
		height: 50,
		backgroundColor: buttonBgColor,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
	},
	buttonDisabled: {
		backgroundColor: '#A0A0A0',
	},
	buttonText: {
		color: buttonTextColor,
		fontSize: 16,
		fontWeight: 'bold',
	},
	linkText: {
		color: buttonBgColor,
		fontWeight: 'bold',
	},
	footerText: {
		marginTop: 15,
		fontSize: 14,
		color: '#666',
	},
});
