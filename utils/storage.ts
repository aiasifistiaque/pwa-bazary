import { Platform } from 'react-native';

// Simple in-memory storage for React Native
class AsyncStorage {
	private storage: Map<string, string> = new Map();

	async getItem(key: string): Promise<string | null> {
		return this.storage.get(key) || null;
	}

	async setItem(key: string, value: string): Promise<void> {
		this.storage.set(key, value);
	}

	async removeItem(key: string): Promise<void> {
		this.storage.delete(key);
	}

	async clear(): Promise<void> {
		this.storage.clear();
	}
}

// Create a unified storage interface that works on both web and mobile
class Storage {
	private asyncStorage: AsyncStorage | null = null;

	constructor() {
		if (Platform.OS !== 'web') {
			this.asyncStorage = new AsyncStorage();
		}
	}

	async getItem(key: string): Promise<string | null> {
		try {
			if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
				return window.localStorage.getItem(key);
			} else if (this.asyncStorage) {
				return await this.asyncStorage.getItem(key);
			}
			return null;
		} catch (error) {
			console.error('Error getting item from storage:', error);
			return null;
		}
	}

	async setItem(key: string, value: string): Promise<void> {
		try {
			if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
				window.localStorage.setItem(key, value);
			} else if (this.asyncStorage) {
				await this.asyncStorage.setItem(key, value);
			}
		} catch (error) {
			console.error('Error setting item in storage:', error);
		}
	}

	async removeItem(key: string): Promise<void> {
		try {
			if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
				window.localStorage.removeItem(key);
			} else if (this.asyncStorage) {
				await this.asyncStorage.removeItem(key);
			}
		} catch (error) {
			console.error('Error removing item from storage:', error);
		}
	}

	async clear(): Promise<void> {
		try {
			if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
				window.localStorage.clear();
			} else if (this.asyncStorage) {
				await this.asyncStorage.clear();
			}
		} catch (error) {
			console.error('Error clearing storage:', error);
		}
	}

	// Synchronous methods for Redux compatibility (only works on web)
	getItemSync(key: string): string | null {
		if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
			return window.localStorage.getItem(key);
		}
		return null;
	}

	setItemSync(key: string, value: string): void {
		if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
			window.localStorage.setItem(key, value);
		}
	}

	removeItemSync(key: string): void {
		if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
			window.localStorage.removeItem(key);
		}
	}
}

export const storage = new Storage();
