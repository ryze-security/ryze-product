import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
	const { isSignedIn, isLoaded } = useAuth();

	if (!isLoaded) {
		return null;
	}

	if (isSignedIn) {
		return <Outlet />;
	}

	return <Navigate to="/login" />;
}

export default ProtectedRoute;
