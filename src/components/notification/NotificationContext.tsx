import {
	Notification,
	NotificationListResponseDTO,
} from "@/models/notification/NotificationDTO";
import { NotificationService } from "@/services/notificationService";
import { useAppSelector } from "@/store/hooks";
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const isOptimisticUpdateRef = useRef<boolean>(false);

	const { user_id, tenant_id } = useAppSelector((state) => state.appUser);

	const notificationService = useMemo(() => new NotificationService(), []);

	const handleNotificationUpdate = useCallback(
		(resposne: NotificationListResponseDTO, isAppending = false) => {
			const newNotifications = isAppending
				? [...notifications, ...resposne.notifications]
				: resposne.notifications;
			setNotifications(newNotifications);
			setUnreadCount(resposne.unread_count);
			setTotalCount(resposne.total_count);
			// --- TEMPORARY WORKAROUND ---
			// This assumes there are more notifications until the API returns an empty array.
			// Once the backend `total_count` is fixed, this should be reverted to:
			// setHasMore(newNotifications.length < response.total_count);
			setHasMore(resposne.notifications.length > 0);
			if (loading) setLoading(false);
		},
		[loading, notifications]
	);

	//Effect to poll new notifications every 30 seconds
	useEffect(() => {

		if (!user_id || !tenant_id) return;

		const poll = async () => {
			try {
				const response = await notificationService.fetchNotifications(
					user_id,
					tenant_id,
					10,
					0
				);

				if (
					notifications.length === 0 ||
					(response.notifications.length > 0 &&
						response.notifications[0].notification_id !==
							notifications[0]?.notification_id)
				) {
					handleNotificationUpdate(response, false);
				} else {
					setUnreadCount(response.unread_count);
					setTotalCount(response.total_count);
				}
			} catch (error) {
				console.error(
					"Failed to fetch notifications during poll:",
					error
				);
			}
		};

		if (isOptimisticUpdateRef.current) {
			isOptimisticUpdateRef.current = false;
		} else {
			poll();
		}
		const intervalId = setInterval(poll, 30000); // Poll every 30 seconds

		return () => {
			clearInterval(intervalId);
		};
	}, [
		user_id,
		tenant_id,
		notificationService,
		handleNotificationUpdate,
		notifications,
	]);

	const loadMoreNotifications = useCallback(async () => {
		if (loadingMore || !hasMore) return;
		setLoadingMore(true);

		try {
			const response = await notificationService.fetchNotifications(
				user_id,
				tenant_id,
				10,
				notifications.length
			);
			handleNotificationUpdate(response, true);
		} catch (error) {
			console.error("Failed to load more notifications:", error);
		} finally {
			setLoadingMore(false);
		}
	}, [
		loadingMore,
		hasMore,
		user_id,
		tenant_id,
		notifications.length,
		notificationService,
		handleNotificationUpdate,
	]);

	const markAsRead = useCallback(
		async (notificationId: string) => {
			const originalNotifications = [...notifications];
			const notification = notifications.find(
				(n) => n.notification_id === notificationId
			);

			if (notification && !notification.read) {
				isOptimisticUpdateRef.current = true;
				setNotifications((prev) =>
					prev.map((n) =>
						n.notification_id === notificationId
							? { ...n, read: true }
							: n
					)
				);
				setUnreadCount((prev) => Math.max(0, prev - 1));
			}

			try {
				await notificationService.markAsRead(notificationId, user_id);
			} catch (error) {
				console.error("Failed to mark as read:", error);
				setNotifications(originalNotifications);
				setUnreadCount((prev) => prev + 1);
			}
		},
		[notificationService, notifications, user_id]
	);

	const markAllAsRead = useCallback(async () => {
		const originalNotifications = [...notifications];
		const unreadNotifications = unreadCount;

		if (unreadNotifications === 0) return;

		isOptimisticUpdateRef.current = true;
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
		setUnreadCount(0);

		try {
			await notificationService.markAllAsRead(user_id, tenant_id);
		} catch (error) {
			console.error("Failed to mark all as read:", error);
			setNotifications(originalNotifications);
			setUnreadCount(unreadNotifications);
		}
	}, [notificationService, notifications, user_id, tenant_id, unreadCount]);

	const deleteNotification = useCallback(
		async (notificationId: string) => {
			const originalNotifications = [...notifications];
			const notification = notifications.find(
				(n) => n.notification_id === notificationId
			);

			isOptimisticUpdateRef.current = true;
			setNotifications((prev) =>
				prev.filter((n) => n.notification_id !== notificationId)
			);
			setTotalCount((prev) => Math.max(0, prev - 1));

			if (notification && !notification.read) {
				setUnreadCount((prev) => Math.max(0, prev - 1));
			}

			try {
				await notificationService.deleteNotification(
					notificationId,
					user_id
				);
			} catch (error) {
				console.error("Failed to delete notification:", error);
				setNotifications(originalNotifications);
				setTotalCount((prev) => prev + 1);
				if (notification && !notification.read)
					setUnreadCount((prev) => prev + 1);
			}
		},
		[notificationService, notifications, user_id]
	);

	const value = {
		notifications,
		unreadCount,
		totalCount,
		loading,
		loadingMore,
		hasMore,
		loadMoreNotifications,
		markAsRead,
		markAllAsRead,
		deleteNotification,
	};

	return (
		<NotificationContext.Provider value={value}>
			{children}
		</NotificationContext.Provider>
	);
}

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			"useNotification must be used within a NotificationProvider"
		);
	}
	return context;
};
