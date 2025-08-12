import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoute() {
	const { isSignedIn, isLoaded } = useAuth();

	if (!isLoaded) {
		return null;
	}

	if (isSignedIn) {
		return <Navigate to={"/home"} />;
	}

	return <Outlet />;
}

export default PublicRoute;
