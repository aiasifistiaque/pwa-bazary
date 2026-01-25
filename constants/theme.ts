/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
	light: {
		text: '#11181C',
		background: '#fff',
		tint: tintColorLight,
		icon: '#687076',
		tabIconDefault: '#687076',
		tabIconSelected: tintColorLight,
	},
	dark: {
		text: '#ECEDEE',
		background: '#151718',
		tint: tintColorDark,
		icon: '#9BA1A6',
		tabIconDefault: '#9BA1A6',
		tabIconSelected: tintColorDark,
	},
};

export const Fonts = Platform.select({
	ios: {
		/** iOS `UIFontDescriptorSystemDesignDefault` */
		sans: 'system-ui',
		/** iOS `UIFontDescriptorSystemDesignSerif` */
		serif: 'ui-serif',
		/** iOS `UIFontDescriptorSystemDesignRounded` */
		rounded: 'ui-rounded',
		/** iOS `UIFontDescriptorSystemDesignMonospaced` */
		mono: 'ui-monospace',
	},
	default: {
		sans: 'normal',
		serif: 'serif',
		rounded: 'normal',
		mono: 'monospace',
	},
	web: {
		sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
		serif: "Georgia, 'Times New Roman', serif",
		rounded:
			"'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
		mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
	},
});

export const CustomColors = {
	bodyColor: '#ffffff',
	cardBgColor: '#ffffff',

	textColor: '#333333',
	subTextColor: '#666666',

	buttonBgColor: '#588157',
	buttonPrevBgColor: '#344E41',
	buttonSubmitBgColor: '#132a13',
	buttonTextColor: '#FFFFFF',
	viewAllButtonBgColor: '#f06449',

	headerColor: '#344E41',
	headerTextColor: '#FFFCF2',

	borderColor: '#344E41',

	listItemTextColor: '#FFFCF2',
	listItemBgColor: '#344E41',

	loaderColor: '#ffffff',

	passedColor: '#4CAF50',
	failedColor: '#FF5252',

	optionBgColor: '#e7e7e7',
	lightBrown: '#ebd7b0ff',
	darkBrown: '#604724',
	lightGreen: '#10B981',
	darkGreen: '#2c451a',
	greySkeleton: '#E5E5E5',
	lightRed: '#FF5252',
	maroon: '#800000',
};
