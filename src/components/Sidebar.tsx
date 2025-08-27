import {
	Building2Icon,
	ChevronDown,
	Dot,
	FileTextIcon,
	Home,
	List,
	LogOut,
	LucideSearch,
	Menu,
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
import { Link, useNavigate } from "react-router-dom";
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
import { useClerk } from "@clerk/clerk-react";
import { fetchUserAppData, logout } from "@/store/slices/appUserSlice";
import ComingSoonBorder from "./ComingSoonBorder";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";

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
		icon: FileTextIcon,
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

function DesktopSidebar() {
	const { setOpen, open, isMobile } = useSidebar();
	const dispatch = useDispatch();
	const notifications = useSelector(
		(state: RootState) => state.notifications
	) as NotificationDTO[];
	const unreadCount = notifications.filter((n) => n.unread).length;
	const { signOut } = useClerk();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await signOut();
		dispatch(logout());
		navigate("/");
	};

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
			className={`z-50 ${isMobile ? "hidden" : ""}`}
		>
			<SidebarContent className="overflow-x-hidden">
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
											<div className="text-gray-light-ryzr cursor-not-allowed">
												<item.icon />
												<ComingSoonBorder variant="inline">
													<span>{item.title}</span>
												</ComingSoonBorder>
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
			<SidebarFooter>
				<SidebarMenu className="gap-3">
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
					<SidebarMenuItem>
						<SidebarMenuButton className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold">
							<LogOut className="w-4 h-4" />
							<span>Logout</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}

function MobileNavbar() {
	const dispatch = useDispatch();
	const notifications = useSelector(
		(state: RootState) => state.notifications
	) as NotificationDTO[];
	const unreadCount = notifications.filter((n) => n.unread).length;
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [notificationsVisible, setNotificationsVisible] = useState(false);

	const handleLinkClick = () => {
		setIsSheetOpen(false);
	};

	const handleDismiss = (e: any, id: number) => {
		e.stopPropagation();
		dispatch(dismissNotification(id));
	};

	return (
		<div className="lg:hidden fixed top-0 left-0 right-0 h-[80px] z-40 flex items-center justify-center overflow-x-hidden">
			<div className="absolute top-[20px] rounded-full flex justify-between items-center h-[60px] w-[95%] bg-black/30 backdrop-blur-md gap-4 px-4 shadow-lg z-50">
				<Link to="/home" className="flex items-center gap-2">
					<img
						className="w-10 h-10"
						src="/assets/Ryzr_White Logo_v2.png"
						alt="Ryzr Logo"
					/>
				</Link>

				<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
					<SheetTrigger asChild>
						<div className="relative">
							<Button
								size="icon"
								variant="ghost"
								className="text-white hover:bg-white/10"
							>
								<Menu className="w-6 h-6" />
								<span className="sr-only">Open main menu</span>
							</Button>
							{unreadCount > 0 && (
								<span className="absolute top-1 right-1 flex h-2.5 w-2.5">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-light-ryzr opacity-75"></span>
									<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet-ryzr"></span>
								</span>
							)}
						</div>
					</SheetTrigger>
					<SheetContent
						side="left"
						className="w-[300px] sm:w-[340px] bg-background p-0"
					>
						<div className="flex h-full flex-col">
							<div className="flex-1 overflow-auto p-4">
								<SidebarHeader className="flex flex-row items-center gap-3 px-4 py-3 border-b">
									<img
										src="/assets/Ryzr_White Logo_v2.png"
										alt="Ryzr Logo"
										className="w-6 h-6"
									/>
									<div className="border-r-2 h-full border-l-gray-ryzr rounded-2xl" />
									<span className="font-bold text-lg">
										Ryzr.
									</span>
								</SidebarHeader>
								<SidebarMenu className="mt-4">
									{items.map((item) => (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton asChild>
												{item.url === "#" ? (
													<div className="text-gray-light-ryzr cursor-pointer flex items-center gap-2">
														<item.icon />
														<span>
															{item.title}
														</span>{" "}
													</div>
												) : (
													<Link
														to={item.url}
														className="flex items-center gap-2"
														onClick={
															handleLinkClick
														}
													>
														<item.icon />
														<span>
															{item.title}
														</span>
													</Link>
												)}
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</div>
							<SidebarFooter className="p-4 border-t overflow-y-auto">
								<Button
									variant="outline"
									className="w-full justify-between gap-2"
									onClick={() =>
										setNotificationsVisible(
											!notificationsVisible
										)
									}
								>
									<span className="flex items-center gap-2">
										<NotificationBell />
										<span>Notifications</span>
									</span>
									<ChevronDown
										className={`w-4 h-4 transition-transform ${
											notificationsVisible
												? "rotate-180"
												: ""
										}`}
									/>
								</Button>

								{notificationsVisible && (
									<div className="border rounded-md mt-2">
										<div className="flex items-baseline justify-between gap-4 px-3 py-2">
											<div className="text-sm font-semibold">
												Notifications
											</div>
											{unreadCount > 0 && (
												<button
													className="text-xs font-medium hover:underline"
													onClick={() =>
														dispatch(
															markAllAsRead()
														)
													}
												>
													Mark all as read
												</button>
											)}
										</div>
										<div className="border-t my-1" />
										<div className="max-h-48 overflow-y-auto">
											{notifications.map(
												(notification) => (
													<div
														key={notification.id}
														className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent group"
													>
														<div className="relative flex items-start pe-3">
															<div
																className="flex-1 space-y-1"
																onClick={() =>
																	dispatch(
																		markAsRead(
																			notification.id
																		)
																	)
																}
															>
																<p>
																	<span className="font-medium">
																		{
																			notification.user
																		}
																	</span>{" "}
																	{
																		notification.action
																	}{" "}
																	<span className="font-medium">
																		{
																			notification.target
																		}
																	</span>
																	.
																</p>
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
																className="absolute right-0 top-0 p-0 text-muted-foreground opacity-0 group-hover:opacity-100"
															>
																<X size={14} />
															</button>
															{notification.unread && (
																<div className="absolute end-0 self-center">
																	<Dot />
																</div>
															)}
														</div>
													</div>
												)
											)}
										</div>
									</div>
								)}

								<Button
									variant="destructive"
									className="w-full justify-start gap-2 mt-2"
								>
									<LogOut className="w-4 h-4" />
									<span>Logout</span>
								</Button>
							</SidebarFooter>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
}

export function AppSidebar() {
	return (
		<>
			<DesktopSidebar />
			<MobileNavbar />
		</>
	);
}
