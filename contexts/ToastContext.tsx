import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
} from 'react';
import { Toast } from '@/components/ui/Toast';

type ToastContextType = {
	showToast: (message: string, duration?: number) => void;
	hideToast: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
	const [visible, setVisible] = useState(false);
	const [message, setMessage] = useState('');
	const [duration, setDuration] = useState(2000);

	const showToast = useCallback((msg: string, dur: number = 2000) => {
		setMessage(msg);
		setDuration(dur);
		setVisible(true);
	}, []);

	const hideToast = useCallback(() => {
		setVisible(false);
	}, []);

	return (
		<ToastContext.Provider value={{ showToast, hideToast }}>
			{children}
			<Toast
				message={message}
				visible={visible}
				onDismiss={hideToast}
				duration={duration}
			/>
		</ToastContext.Provider>
	);
};
