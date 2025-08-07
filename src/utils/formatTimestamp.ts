// src/utils/formatTime.js

export function formatRelativeTime(timestamp: string): string {
	const now = new Date().getTime();
	const secondsPast = (now - parseInt(timestamp, 10)) / 1000;

	if (secondsPast < 10) {
		return "just now";
	}
	if (secondsPast < 60) {
		return `${Math.floor(secondsPast)} seconds ago`;
	}
	if (secondsPast < 3600) {
		return `${Math.floor(secondsPast / 60)} minutes ago`;
	}
	if (secondsPast <= 86400) {
		return `${Math.floor(secondsPast / 3600)} hours ago`;
	}
	if (secondsPast > 86400) {
		const days = Math.floor(secondsPast / 86400);
		if (days < 7) {
			return `${days} days ago`;
		}
		const weeks = Math.floor(days / 7);
		return `${weeks} weeks ago`;
	}
}
