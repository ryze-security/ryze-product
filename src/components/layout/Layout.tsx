import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "../Sidebar";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/storeIndex";
import { fetchUserAppData, logout } from "@/store/slices/appUserSlice";
import axiosInstance from "@/services/axiosInstance";

function Layout() {
	const { isSignedIn, isLoaded } = useAuth();
	const { signOut } = useClerk();
	const dispatch = useAppDispatch();
	const userStatus = useAppSelector(
		(state: RootState) => state.appUser.status
	);
	const axios = axiosInstance;
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoaded && isSignedIn && userStatus === "idle") {
			const fetchDataAndHandleLogout = async () => {
				try {
					await dispatch(fetchUserAppData(axios)).unwrap();
				} catch (error) {
					await signOut();
					dispatch(logout());
					navigate("/login");
				}
			};

			fetchDataAndHandleLogout();
		}
	}, [isLoaded, isSignedIn, userStatus, dispatch]);

	return (
		<SidebarProvider defaultOpen={false}>
			<AppSidebar />
			<main className="w-full h-screen">
				<Outlet />
			</main>
		</SidebarProvider>
	);
}

export default Layout;
