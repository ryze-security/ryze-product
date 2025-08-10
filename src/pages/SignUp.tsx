import { SignIn, SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function SignupPage() {
	return (
		<div className="min-h-screen bg-black flex items-center justify-center px-auto font-roboto text-white">
			<nav className="fixed top-0 left-0 w-full z-50 transition-transform duration-700 ease-in-out transform -translate-y-full animate-slideInDown bg-opacity-5 bg-black backdrop-blur-sm shadow-lg">
				<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
					{/* Left: Brand */}
					<Link to="/">
						<div className="text-3xl font-bold tracking-wide">
							Ryzr.
						</div>
					</Link>
				</div>
			</nav>
			<div className="w-full max-w-md text-center">
				<SignUp
					signInUrl="/login"
					forceRedirectUrl="/home"
					fallbackRedirectUrl="/home"
				/>
			</div>
		</div>
	);
}
