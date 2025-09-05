export interface Notification {
	notification_id: string;
	user_id: string;
	tenant_id: string;
	type: string;
	title: string;
	message: string;
	data?: Record<string, any>;
	read: boolean;
	created_at: string;
	read_at?: string;
}

export interface NotificationListResponseDTO {
	notifications: Notification[];
	total_count: number;
	unread_count: number;
}
