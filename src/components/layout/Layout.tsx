import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "../Sidebar";

function Layout() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="w-full h-screen">
				<Outlet />
			</main>
		</SidebarProvider>
	);
}

export default Layout;
