import {
	Building2Icon,
	Home,
	List,
	LogOut,
	LucideSearch,
	Rocket,
	User2,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

// Menu items.
const items = [
	{
		title: "Home",
		url: "#",
		icon: Home,
	},
	{
		title: "Past Reviews",
		url: "#",
		icon: LucideSearch,
	},
	{
		title: "Auditees",
		url: "#",
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

	return (
		<Sidebar
			collapsible="icon"
			onMouseEnter={() => {
				setOpen(true);
			}}
			onMouseLeave={() => {
				setOpen(false);
			}}
		>
			<SidebarContent>
				<Link to={"/home"}>
					<SidebarHeader className="flex items-center gap-3 px-4 py-3 border-b">
						<span className="flex items-center gap-2">
							{/* placeholder icon */}
							<Rocket className="w-6 h-6 text-violet-500" />
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
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="flex items-center gap-3 px-4 py-3 border-t">
				<Button
					variant="outline"
					className="w-full gap-2 border-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500"
				>
					<span className="flex items-center gap-2">
						<LogOut className="w-4 h-4" />
						{open && <span>Logout</span>}
					</span>
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
