import { Badge } from "@/components/ui/badge";
import { NotificationDTO } from "@/models/notification/NotificationDTO";
import { RootState } from "@/store/storeIndex";
import { Bell} from "lucide-react";
import { useSelector } from "react-redux";

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
