import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useEffect } from 'react';
import {
	Dimensions,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSequence,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastProps = {
	message: string;
	visible: boolean;
	onDismiss: () => void;
	duration?: number;
};

const { width } = Dimensions.get('window');

export const Toast = ({
	message,
	visible,
	onDismiss,
	duration = 2000,
}: ToastProps) => {
	const insets = useSafeAreaInsets();
	const translateX = useSharedValue(-width); // Start off-screen left

	useEffect(() => {
		if (visible) {
			// Reset position to left
			translateX.value = -width;

			// Animation sequence:
			// 1. Slide in from left to center (smooth timing)
			// 2. Wait for duration
			// 3. Slide out to right (slow motion)
			translateX.value = withSequence(
				withTiming(0, { duration: 500 }), // Slide in smoothly
				withDelay(
					duration,
					withTiming(
						width,
						{ duration: 800 }, // Slow motion exit
						finished => {
							if (finished) {
								runOnJS(onDismiss)();
							}
						}
					)
				)
			);
		}
	}, [visible, duration, onDismiss]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }],
		};
	});

	if (!visible) return null;

	return (
		<Modal
			transparent
			visible={visible}
			animationType='none'
			onRequestClose={onDismiss}
		>
			<View style={styles.modalOverlay} pointerEvents='box-none'>
				<Animated.View
					style={[styles.container, { top: insets.top }, animatedStyle]}
				>
					<View style={styles.content}>
						<Text style={styles.message}>{message}</Text>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={onDismiss}
							activeOpacity={0.7}
						>
							<IconSymbol name='xmark' size={14} color='#65451D' />
						</TouchableOpacity>
					</View>
				</Animated.View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		// No background color to be transparent
	},
	container: {
		position: 'absolute',
		left: 20,
		right: 20,
		// top is handled dynamically
		alignItems: 'center',
		zIndex: 9999,
	},
	content: {
		backgroundColor: '#E1C28B', // Subtle brown background
		borderColor: '#65451D',
		borderWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 6,
		minWidth: 200,
	},
	message: {
		color: '#65451D',
		fontSize: 14,
		fontWeight: '600',
		flex: 1,
		marginRight: 12,
	},
	closeButton: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
