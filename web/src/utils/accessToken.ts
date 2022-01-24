export function createTokenStorage<StoredValueType>(key: string) {
	function setToken(value: StoredValueType) {
		return localStorage.setItem(key, JSON.stringify(value));
	}

	function getToken(): StoredValueType | null {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : null;
	}

	function removeToken() {
		return localStorage.removeItem(key);
	}

	return {
		setToken,
		getToken,
		removeToken,
	};
}
