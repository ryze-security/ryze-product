export interface NotificationDTO {
    id: number;
    user: string;
    action: string;
    target: string;
    timestamp: string;
    unread: boolean;
}