"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationDTO } from "@/models/notification/NotificationDTO";
import {
	dismissNotification,
	markAllAsRead,
	markAsRead,
} from "@/store/slices/notificationSlice";
import { RootState } from "@/store/storeIndex";
import { formatRelativeTime } from "@/utils/formatTimestamp";
import { Bell, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

function Dot({ className }: { className?: string }) {
	return (
		<svg
			width="6"
			height="6"
			fill="currentColor"
			viewBox="0 0 6 6"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-hidden="true"
		>
			<circle cx="3" cy="3" r="3" />
		</svg>
	);
}

function NotificationBell() {
	const notifications = useSelector(
		(state: RootState) => state.notifications
	) as NotificationDTO[];
	const unreadCount = notifications.filter((n) => n.unread).length;

	return (
		<div className="relative">
			<Bell size={16} strokeWidth={2} aria-hidden="true" />
			{unreadCount > 0 && (
				<Badge className="absolute -top-2 left-full min-w-4 min-h-4 -translate-x-1/2 px-1">
					{unreadCount > 99 ? "99+" : unreadCount}
				</Badge>
			)}
		</div>
	);
}

export { NotificationBell };
