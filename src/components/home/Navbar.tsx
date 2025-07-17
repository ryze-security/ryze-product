import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Menu } from "lucide-react";

interface Props {
	items?: {
		label: string;
		href?: string;
		target?: string;
		disabled: boolean;
	}[];
}

function Navbar(props: Props) {
	const { items } = props;
	const navigate = useNavigate();

	const handleScrollTo = (sectionId: string) => {
		const el = document.getElementById(sectionId);
		if (el) {
			const yOffset = -150; // Scroll 40px *above* the element
			const y =
				el.getBoundingClientRect().top + window.pageYOffset + yOffset;

			window.scrollTo({ top: y, behavior: "smooth" });
		}
	};

	return (
		<div className="flex items-center w-full h-[70px] font-roboto fixed z-50">
			<div className="absolute top-[46px] left-1/2 transform -translate-x-1/2 rounded-[36px] flex justify-between items-center h-[70px] w-11/12 md:w-10/12 bg-transparent/40 backdrop-blur-sm gap-4 px-4 md:px-9 shadow-sm z-50">
				<img
					className="w-10 h-10 md:w-12 md:h-12"
					src="/assets/Ryzr_White Logo_v2.png"
					alt="Ryzr Logo"
				/>
				{/* Desktop nav links */}
				<div className="hidden lg:flex gap-6">
					{items &&
						items.map((item, index) => (
							<Button
								key={index}
								variant="link"
								className={`text-white py-2 md:py-3 ${
									item.disabled ? "cursor-not-allowed" : ""
								}`}
								disabled={item.disabled}
								onClick={() => {
									if (!item.disabled && item.href) {
										navigate(item.href);
									} else if (!item.disabled && item.target) {
										handleScrollTo(item.target);
									}
								}}
							>
								{item.label}
							</Button>
						))}
				</div>
				<Button
					variant="default"
					className="text-black hidden lg:flex font-bold rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base"
					onClick={() => navigate("/login")}
				>
					Get Started
				</Button>

				{/* Mobile nav dropdown */}
				<div className="lg:hidden">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="text-white px-4 bg-transparent backdrop-blur-lg border-none"
							>
								<Menu className="w-6 h-6" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							{items &&
								items.map((item, index) => (
									<DropdownMenuItem
										key={index}
										disabled={item.disabled}
										onClick={() => {
											if (!item.disabled) {
												navigate(item.href);
											}
										}}
										className="cursor-pointer"
									>
										{item.label}
									</DropdownMenuItem>
								))}
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<Button
									variant="default"
									className="text-black font-bold rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base w-full"
									onClick={() => navigate("/login")}
								>
									Get Started
								</Button>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
}

export default Navbar;
