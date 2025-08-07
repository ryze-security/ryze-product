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

const initialNotifications = [
	{
		id: 1,
		user: "Chris Tompson",
		action: "requested review on",
		target: "PR #42: Feature implementation",
		timestamp: "15 minutes ago",
		unread: true,
	},
	{
		id: 2,
		user: "Emma Davis",
		action: "shared",
		target: "New component library",
		timestamp: "45 minutes ago",
		unread: true,
	},
	{
		id: 3,
		user: "James Wilson",
		action: "assigned you to",
		target: "API integration task",
		timestamp: "4 hours ago",
		unread: false,
	},
	{
		id: 4,
		user: "Alex Morgan",
		action: "replied to your comment in",
		target: "Authentication flow",
		timestamp: "12 hours ago",
		unread: false,
	},
	{
		id: 5,
		user: "Sarah Chen",
		action: "commented on",
		target: "Dashboard redesign",
		timestamp: "2 days ago",
		unread: false,
	},
	{
		id: 6,
		user: "Miky Derya",
		action: "mentioned you in",
		target: "Origin UI open graph image",
		timestamp: "2 weeks ago",
		unread: false,
	},
];

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
