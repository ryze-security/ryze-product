export const loadState = (item: string): any => {
	try {
		const serializedState = localStorage.getItem(item);
		if (serializedState === null) {
			return undefined;
		}
		return JSON.parse(serializedState);
	} catch (error) {
		console.error(`Error loading state ${item} from localStorage:`, error);
		return undefined;
	}
};

export const saveState = (item: string, state: any): void => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(item, serializedState);
    }
    catch (error) {
        console.error(`Error saving state ${item} to localStorage:`, error);
    }
}