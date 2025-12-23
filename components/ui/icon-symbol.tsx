import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
	'house.fill': 'home',
	'paperplane.fill': 'send',
	'chevron.left.forwardslash.chevron.right': 'code',
	'chevron.right': 'chevron-right',
	'chevron.left': 'chevron-left',
	heart: 'favorite-border',
	'heart.fill': 'favorite',
	plus: 'add',
	minus: 'remove',
	'plus.circle': 'add-circle-outline',
	'plus.circle.fill': 'add-circle',
	xmark: 'close',
	'xmark.circle.fill': 'cancel',
	'cart.fill': 'shopping-cart',
	magnifyingglass: 'search',
	'storefront.fill': 'store',
	'line.3.horizontal': 'menu',
	'checkmark.circle.fill': 'check-circle',
	gearshape: 'settings',
	'location.fill': 'location-on',
	'mappin.circle.fill': 'place',
	'mappin.circle': 'place',
	'clock.fill': 'schedule',
	'creditcard.fill': 'credit-card',
	creditcard: 'credit-card',
	'tag.fill': 'local-offer',
	sparkles: 'auto-awesome',
	'crown.fill': 'workspace-premium',
	'arrow.right.square': 'exit-to-app',
	checkmark: 'check',
	tray: 'inbox',
	'arrow.clockwise': 'refresh',
	'doc.text': 'description',
	ticket: 'confirmation-number',
	trophy: 'emoji-events',
	gift: 'card-giftcard',
	'gift.fill': 'card-giftcard',
	'questionmark.circle': 'help-outline',
	'shield.checkmark': 'verified-user',
	'info.circle': 'info-outline',
	'building.2.fill': 'business',
	pencil: 'edit',
	trash: 'delete',
	'person.fill': 'person',
	'arrow.up.circle.fill': 'arrow-circle-up',
	'exclamationmark.triangle.fill': 'warning',
	'phone.fill': 'phone',
	'note.text': 'notes',
	'chevron.up': 'keyboard-arrow-up',
	'chevron.down': 'keyboard-arrow-down',
	'message.fill': 'message',
	'bubble.left.and.bubble.right.fill': 'chat',
} as const;

type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
	name,
	size = 24,
	color,
	style,
}: {
	name: IconSymbolName;
	size?: number;
	color: string | OpaqueColorValue;
	style?: StyleProp<TextStyle>;
	weight?: SymbolWeight;
}) {
	return (
		<MaterialIcons
			color={color}
			size={size}
			name={MAPPING[name]}
			style={style}
		/>
	);
}
