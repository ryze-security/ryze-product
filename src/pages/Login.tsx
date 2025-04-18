import { Button } from "@/components/ui/button";
import { Mail, Eye, EyeOff, Lock, LogIn, MoveRight } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-black flex items-center justify-center px-4 font-roboto text-white">
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
			<div className="bg-zinc-900 p-10 rounded-2xl shadow-2xl w-full max-w-md text-center space-y-6">
				{/* Title and Subtitle */}
				<div>
					<h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
					<p className="text-zinc-400 text-md">Sign in to Ryzr.</p>
				</div>

				{/* Google Auth Button */}
				<Button
					variant="outline"
					className="w-full bg-white text-black font-semibold flex items-center justify-center gap-2"
				>
					<img
						src="https://www.svgrepo.com/show/475656/google-color.svg"
						alt="Google"
						className="w-5 h-5"
					/>
					Continue with Google
				</Button>

				{/* OR Separator */}
				<div className="flex items-center gap-4">
					<hr className="flex-1 border-zinc-700" />
					<span className="text-zinc-500 text-sm">or</span>
					<hr className="flex-1 border-zinc-700" />
				</div>

				{/* Email and Password Fields */}
				<form className="space-y-4" onSubmit={(e) => {
					e.preventDefault();
					navigate("/home");
				}}>
					<div className="relative">
						<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-5 w-5" />
						<input
							type="email"
							placeholder="Email"
							className="w-full pl-10 pr-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
						/>
					</div>
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-5 w-5" />
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Password"
							className="w-full pl-10 pr-10 py-2 rounded-md bg-zinc-800 border border-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
						/>
						<button
							type="button"
							onClick={() => setShowPassword((prev) => !prev)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
						>
							{showPassword ? (
								<EyeOff className="h-5 w-5" />
							) : (
								<Eye className="h-5 w-5" />
							)}
						</button>
					</div>

					<Button className="w-full bg-sky-500 hover:bg-sky-600 font-bold text-white flex items-center justify-center gap-2">
						<LogIn className="w-5 h-5" />
						Sign In
					</Button>
				</form>

				{/* Footer Help Text */}
				<p className="text-xs text-zinc-500 mt-4">
					Facing any trouble?{" "}
					<a href="/support" className="text-sky-400 hover:underline">
						Contact our support team
					</a>
					.
				</p>
			</div>
		</div>
	);
}
