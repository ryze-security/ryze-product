import React from "react";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui or Tailwind
import { Link } from "react-router-dom";

type NavbarProps = {
	loggedIn: boolean;
};

const LandingNavbar: React.FC<NavbarProps> = ({ loggedIn }) => {
	return (
		<nav className="fixed top-0 left-0 w-full z-50 transition-transform duration-700 ease-in-out transform -translate-y-full animate-slideInDown bg-opacity-5 bg-black backdrop-blur-sm shadow-lg">
			<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
				{/* Left: Brand */}
				<div className="text-3xl font-bold tracking-wide">Ryzr.</div>

				{/* Right: Login or Dashboard */}
				<div className="font-roboto">
					{loggedIn ? (
						<Link to="/dashboard">
							<Button
								variant="ghost"
								className="hover:text-sky-400 hover:font-bold hover:scale-110 font-roboto duration-300 text-white"
							>
								Dashboard
							</Button>
						</Link>
					) : (
						<Link to="/login">
							<Button variant="ghost" className=" hover:text-sky-400 hover:font-bold hover:scale-110 font-roboto duration-300 text-white">
								Login
							</Button>
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};

export default LandingNavbar;
