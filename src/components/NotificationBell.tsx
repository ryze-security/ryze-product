import { Bell, X } from "lucide-react";
import { useNotification } from "./notification/NotificationContext";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "./ui/popover";
import { RoundSpinner } from "./ui/spinner";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { SidebarMenuButton } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { useNavigate } from "react-router-dom";

function NotificationBell() {
	const {
		notifications,
		unreadCount,
		loading,
		markAsRead,
		deleteNotification,
		loadMoreNotifications,
		loadingMore,
		hasMore,
		markAllAsRead,
	} = useNotification();

	const navigate = useNavigate();

	const handleScroll = (e) => {
		const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
		if (scrollHeight - scrollTop <= clientHeight + 50) {
			loadMoreNotifications();
		}
	};

	return (
		<Popover>
			<PopoverTrigger className="w-full">
				<SidebarMenuButton className="w-full">
					<div className="relative">
						<Bell size={16} strokeWidth={2} aria-hidden="true" />
						{unreadCount > 0 && (
							<span className="absolute top-0.5 right-0 transform translate-x-1/2 -translate-y-1/2 flex h-2.5 w-2.5 z-10">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-75"></span>
								<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red"></span>
							</span>
						)}
					</div>
					<span>Notifications</span>
				</SidebarMenuButton>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="flex justify-between items-center mb-2">
					<h3 className="font-semibold text-white">Notifications</h3>
					{unreadCount > 0 && (
						<Button
							variant="secondary"
							size="sm"
							onClick={markAllAsRead}
						>
							Mark all as read
						</Button>
					)}
				</div>
				<Separator className="mb-1" />
				{loading ? (
					<div className="flex w-full justify-center">
						<RoundSpinner />
					</div>
				) : notifications.length === 0 ? (
					<p className="text-zinc-400 text-sm text-center py-4">
						You're all caught up!
					</p>
				) : (
					<div
						className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
						onScroll={handleScroll}
					>
						{notifications.map((n) => (
							<div
								key={n.notification_id}
								className={cn(
									"p-2 rounded-md transition-colors cursor-pointer",
									!n.read
										? "bg-sky-900/30 hover:bg-sky-900/50"
										: "hover:bg-zinc-700/50"
								)}
								onClick={() => {
									if (!n.read) {
										markAsRead(n.notification_id);
									}
									switch (n.type) {
										case "evaluation_completed":
											navigate(
												`/evaluation/${n.data.company_id}/${n.data.eval_id}`
											);
											break;
										case "report_generation_completed":
											navigate(
												`/evaluation/${n.data.company_id}/${n.data.eval_id}?tab=reports`
											);
											break;
										default:
											break;
									}
								}}
							>
								<div className="flex items-start">
									<div className="flex flex-1 flex-col space-y-1">
										<div className="flex justify-between items-center gap-2">
											<p className="font-bold flex-1 text-white text-sm">
												{n.title}
											</p>
											<Button
												variant="ghost"
												className="h-fit text-zinc-500 hover:text-white flex-shrink-0 hover:bg-transparent justify-end w-fit"
												size="icon"
												onClick={(e) => {
													e.stopPropagation();
													deleteNotification(
														n.notification_id
													);
												}}
											>
												<X size={14} />
											</Button>
										</div>
										<p className="text-zinc-300 text-xs mt-1">
											{n.message}
										</p>
										{n.data?.completed_at && (
											<p className="text-zinc-500 text-[10px] mt-1">
												{(() => {
													const date = new Date(n.data.completed_at + 'Z');
													const day = String(date.getDate()).padStart(2, "0");
													const month = date.toLocaleString("en-GB", { month: "short" });
													const year = date.getFullYear();
													const hours = String(date.getHours()).padStart(2, "0");
													const minutes = String(date.getMinutes()).padStart(2, "0");
													return `${day}-${month}-${year} ${hours}:${minutes}`;
												})()}
											</p>
										)}
									</div>
								</div>
							</div>
						))}
						{loadingMore && (
							<div className="flex w-full justify-center">
								<RoundSpinner />
							</div>
						)}
						{!hasMore && notifications.length > 0 && (
							<p className="text-zinc-400 text-sm text-center py-4">
								You're all caught up!
							</p>
						)}
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}

export { NotificationBell };
