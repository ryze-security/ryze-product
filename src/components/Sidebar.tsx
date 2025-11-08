import {
	Bell,
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
import { useClerk } from "@clerk/clerk-react";
import { fetchUserAppData, logout } from "@/store/slices/appUserSlice";
import ComingSoonBorder from "./ComingSoonBorder";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";
import {
	NotificationProvider,
	useNotification,
} from "./notification/NotificationContext";
import { Separator } from "./ui/separator";
import { RoundSpinner } from "./ui/spinner";
import { cn } from "@/lib/utils";

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
	const { signOut } = useClerk();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await signOut();
		dispatch(logout());
		navigate("/");
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
					<SidebarMenuItem>
						<NotificationBell />
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
							onClick={handleLogout}
						>
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
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [notificationsVisible, setNotificationsVisible] = useState(false);
	const { signOut } = useClerk();
	const navigate = useNavigate();

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

	const handleLinkClick = () => {
		setIsSheetOpen(false);
	};

	const handleLogout = async () => {
		await signOut();
		dispatch(logout());
		navigate("/");
	};

	const handleScroll = (e) => {
		const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
		if (scrollHeight - scrollTop <= clientHeight + 50) {
			loadMoreNotifications();
		}
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
										className="w-10 h-10"
									/>
									<div className="border-l-2 h-full border-l-gray-light-ryzr rounded-2xl" />
									<span className="font-bold text-xl">
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
										<div className="relative">
											<Bell
												size={16}
												strokeWidth={2}
												aria-hidden="true"
											/>
											{unreadCount > 0 && (
												<span className="absolute top-0.5 right-0 transform translate-x-1/2 -translate-y-1/2 flex h-2.5 w-2.5 z-10">
													<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-light-ryzr opacity-75"></span>
													<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet-ryzr"></span>
												</span>
											)}
										</div>
										<span>Notifications</span>
									</span>
									<ChevronDown
										className={`w-4 h-4 transition-transform ${notificationsVisible
											? "rotate-180"
											: ""
											}`}
									/>
								</Button>

								{notificationsVisible && (
									<div className="border rounded-md mt-2">
										<div className="flex justify-between items-center p-3">
											<h3 className="font-semibold text-white">
												Notifications
											</h3>
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
												className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
												onScroll={handleScroll}
											>
												{notifications.map((n) => (
													<div
														key={n.notification_id}
														className={cn(
															"p-2 rounded-md transition-colors cursor-pointer",
															!n.read
																? "bg-neutral-800/30 hover:bg-neutral-800/50"
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
														}
														}
													>
														<div className="flex items-start">
															<div className="flex flex-1 flex-col space-y-1">
																<div className="flex justify-between items-center gap-2">
																	<p className="font-bold flex-1 text-white text-sm">
																		{
																			n.title
																		}
																	</p>
																	<Button
																		variant="ghost"
																		className="h-fit text-zinc-500 hover:text-white flex-shrink-0 hover:bg-transparent justify-end w-fit"
																		size="icon"
																		onClick={(
																			e
																		) => {
																			e.stopPropagation();
																			deleteNotification(
																				n.notification_id
																			);
																		}}
																	>
																		<X
																			size={
																				14
																			}
																		/>
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
												{!hasMore &&
													notifications.length >
													0 && (
														<p className="text-zinc-400 text-sm text-center py-4">
															You're all caught
															up!
														</p>
													)}
											</div>
										)}
									</div>
								)}

								<Button
									variant="destructive"
									className="w-full justify-start gap-2 mt-2"
									onClick={handleLogout}
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
