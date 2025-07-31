import {
	Building2Icon,
	Dot,
	Home,
	List,
	LogOut,
	LucideSearch,
	Rocket,
	User2,
	X,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { NotificationBell } from "./NotificationBell";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { formatRelativeTime } from "@/utils/formatTimestamp";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/storeIndex";
import { NotificationDTO } from "@/models/notification/NotificationDTO";
import {
	dismissNotification,
	markAllAsRead,
	markAsRead,
} from "@/store/slices/notificationSlice";

// Menu items.
const items = [
	{
		title: "Home",
		url: "/home",
		icon: Home,
	},
	{
		title: "Past Reviews",
		url: "/evaluation",
		icon: LucideSearch,
	},
	{
		title: "Auditees",
		url: "/auditee/dashboard",
		icon: Building2Icon,
	},
	{
		title: "Frameworks",
		url: "#",
		icon: List,
	},
	{
		title: "Profile",
		url: "#",
		icon: User2,
	},
];

export function AppSidebar() {
	const { setOpen, open } = useSidebar();
	const dispatch = useDispatch();
	const notifications = useSelector(
		(state: RootState) => state.notifications
	) as NotificationDTO[];
	const unreadCount = notifications.filter((n) => n.unread).length;

	const handleDismiss = (e: any, id: number) => {
		e.stopPropagation();
		dispatch(dismissNotification(id));
	};

	return (
		<Sidebar
			collapsible="icon"
			onMouseEnter={() => {
				setOpen(true);
			}}
			onMouseLeave={() => {
				setOpen(false);
			}}
			className="z-50"
		>
			<SidebarContent>
				<Link to={"/home"}>
					<SidebarHeader className="flex items-center gap-3 px-4 py-3 border-b">
						<span className="flex gap-1">
							<img
								src="/assets/Ryzr_White Logo_v2.png"
								alt="Ryzr Logo"
								className="w-6 h-full min-w-6 min-h-6 mt-1"
							/>
							{open && (
								<span className="tracking-wide text-primary text-xl font-semibold">
									Ryzr
									<span className="text-muted-foreground">
										.
									</span>
								</span>
							)}
						</span>
					</SidebarHeader>
				</Link>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										{item.url === "#" ? (
											<div className="text-gray-light-ryzr cursor-pointer">
												<item.icon />
												<span>{item.title}</span>
											</div>
										) : (
											<Link to={item.url}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										)}
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			{/* <SidebarFooter className="flex items-center gap-3 px-4 py-3 border-t"> */}
			<SidebarFooter>
				<SidebarMenu>
					<Popover>
						<PopoverTrigger asChild>
							<SidebarMenuButton>
								<NotificationBell />
								<span>Notifications</span>
							</SidebarMenuButton>
						</PopoverTrigger>
						<PopoverContent className="w-80 p-1">
							<div className="flex items-baseline justify-between gap-4 px-3 py-2">
								<div className="text-sm font-semibold">
									Notifications
								</div>
								{unreadCount > 0 && (
									<button
										className="text-xs font-medium hover:underline"
										onClick={() =>
											dispatch(markAllAsRead())
										}
									>
										Mark all as read
									</button>
								)}
							</div>
							<div
								role="separator"
								aria-orientation="horizontal"
								className="-mx-1 my-1 h-px bg-border"
							></div>
							{notifications.map((notification) => (
								<div
									key={notification.id}
									className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent group"
								>
									<div className="relative flex items-start pe-3">
										<div className="flex-1 space-y-1">
											<button
												className="text-left text-foreground/80 after:absolute after:inset-0"
												onClick={() =>
													dispatch(markAsRead(notification.id))
												}
											>
												<span className="font-medium text-foreground hover:underline">
													{notification.user}
												</span>{" "}
												{notification.action}{" "}
												<span className="font-medium text-foreground hover:underline">
													{notification.target}
												</span>
												.
											</button>
											<div className="text-xs text-muted-foreground">
												{formatRelativeTime(
													notification.timestamp
												)}
											</div>
										</div>
										<button
											onClick={(e) =>
												handleDismiss(
													e,
													notification.id
												)
											}
											className="absolute right-0 top-0 p-0 text-white opacity-0
												group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200"
											aria-label="Dismiss notification"
										>
											<X size={14} />
										</button>
										{notification.unread && (
											<div className="absolute end-0 self-center">
												<span className="sr-only">
													Unread
												</span>
												<Dot />
											</div>
										)}
									</div>
								</div>
							))}
						</PopoverContent>
					</Popover>
				</SidebarMenu>
				<Button
					variant="outline"
					className="w-full gap-2 bg-transparent border-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500"
				>
					<span className="flex items-left gap-2">
						<LogOut className="w-4 h-4" />
						{open && <span>Logout</span>}
					</span>
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
