
import { CustomColors } from '@/constants/theme';
import { useLoginMutation } from '@/store/services/authApi';
import { login } from '@/store/slices/authSlice';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	TouchableWithoutFeedback,
	Keyboard,
	ActivityIndicator,
	BackHandler,
	Platform,
} from 'react-native';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';
import { useDispatch } from 'react-redux';


export default function LoginScreen() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [loginTrigger, loginResponse] = useLoginMutation();
	const [isDialogVisible, setDialogVisible] = useState(false);

	const [errors, setErrors] = useState({
		email: '',
		password: '',
	});

	const router = useRouter();

	const handleLogin = async () => {
		const validationErrors = {
			email: email ? '' : 'Email is required',
			password: password ? '' : 'Password is required',
		};

		setErrors(validationErrors);

		if (validationErrors.email || validationErrors.password) {
			return;
		}

		const res = await loginTrigger({ email, password }).unwrap();

		dispatch(login({
			token: res.token,
			refreshToken: res.refreshToken,
			user: res.user
		}));
	};

	const resetAll = () => {
		setEmail('');
		setPassword('');
		setErrors({ email: '', password: '' });
	};
console.log("login res",loginResponse)
	useEffect(() => {
		if (loginResponse.isSuccess && loginResponse.data) {
			resetAll();

			// Use setTimeout to ensure state updates complete before navigation
			setTimeout(() => {
				if (Platform.OS === 'web') {
					router.replace('/');
				} else {
					router.replace('/');
				}
			}, 100);
		} else if (loginResponse.isError) {
			setDialogVisible(true);
		}
	}, [loginResponse.isSuccess, loginResponse.isError, loginResponse.data]);

	useEffect(() => {
		// Only add back handler on mobile platforms
		if (Platform.OS !== 'web') {
			const backHandler = BackHandler.addEventListener(
				'hardwareBackPress',
				() => {
					if (router.canGoBack()) {
						BackHandler.exitApp();
						return true;
					}
					return false;
				}
			);

			return () => backHandler.remove();
		}
	}, [router]);

	const dismissKeyboard = () => {
		if (Platform.OS !== 'web') {
			Keyboard.dismiss();
		}
	};

	const content = (
		<View style={styles.container}>
			<Text style={styles.title}>Login</Text>

			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					placeholder='Email'
					placeholderTextColor={'#6d6b6b'}
					value={email}
					onChangeText={text => {
						setEmail(text);
						if (errors.email) setErrors({ ...errors, email: '' });
					}}
					keyboardType='email-address'
					autoCapitalize='none'
					autoComplete='email'
				/>
				{errors.email ? (
					<Text style={styles.errorText}>{errors.email}</Text>
				) : null}
			</View>

			<View style={styles.inputContainer}>
				<View style={styles.passwordContainer}>
					<TextInput
						style={[styles.input, styles.passwordInput]}
						placeholder='Password'
						placeholderTextColor={'#6d6b6b'}
						value={password}
						onChangeText={value => {
							setPassword(value);
							if (errors.password)
								setErrors(prev => ({ ...prev, password: '' }));
						}}
						secureTextEntry={!isPasswordVisible}
						autoComplete='password'
					/>
					<TouchableOpacity
						style={styles.eyeButton}
						onPress={() => setIsPasswordVisible(prev => !prev)}
					>
						{isPasswordVisible ? (
							<FontAwesome name='eye' size={20} color='#000' />
						) : (
							<FontAwesome name='eye-slash' size={20} color='#000' />
						)}
					</TouchableOpacity>
				</View>
				{errors.password && (
					<Text style={styles.errorText}>{errors.password}</Text>
				)}
			</View>

			<TouchableOpacity
				style={[
					styles.button,
					loginResponse.isLoading && styles.buttonDisabled,
				]}
				onPress={handleLogin}
				disabled={loginResponse.isLoading}
			>
				<Text style={styles.buttonText}>
					{loginResponse.isLoading ? (
						<ActivityIndicator size={'small'} color={'#fff'} />
					) : (
						'Login'
					)}
				</Text>
			</TouchableOpacity>

			<Text style={styles.footerText}>
				Do not have an account?{' '}
				<Text style={styles.linkText} onPress={() => router.push('/register')}>
					Register now!
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
								if (loginResponse?.error && 'data' in loginResponse.error) {
									const errorData = loginResponse.error.data as {
										message?: string;
									};
									return (
										errorData?.message || 'An error occurred. Please try again.'
									);
								}
								if (loginResponse?.error && 'message' in loginResponse.error) {
									return loginResponse.error.message;
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
	inputContainer: {
		width: '100%',
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
	errorText: {
		color: 'red',
		fontSize: 12,
		marginTop: 4,
	},
	passwordWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		backgroundColor: '#fff',
	},
	eyeButton: {
		padding: 10,
		marginLeft: -39,
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
	passwordContainer: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
	},
	passwordInput: {
		flex: 1,
	},
});