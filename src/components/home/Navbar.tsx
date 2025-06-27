import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface Props {
	items?: {
		label: string;
		href: string;
		disabled?: boolean;
	}[];
}

function Navbar(props: Props) {
	const { items } = props;
	const navigate = useNavigate();

	return (
		<div className="flex items-center w-full h-[70px] font-roboto fixed z-50">
			<div className="absolute top-[46px] left-1/2 transform -translate-x-1/2 rounded-[36px] border flex justify-between py-3 h-[70px] w-10/12 bg-transparent/40 backdrop-blur-sm gap-2 px-9 shadow-sm z-50">
				<img
					className="w-12 h-12"
					src="\assets\Ryzr_White Logo_v2.png"
					alt="Ryzr Logo"
				/>
				<div className="flex gap-8">
					{items &&
						items.map((item, index) => (
							<Button
								key={index}
								variant="link"
								className={`text-white ${
									item.disabled ? "cursor-not-allowed" : ""
								}`}
								disabled={item.disabled}
								onClick={() => {
									if (!item.disabled) {
										navigate(item.href);
									}
								}}
							>
								{item.label}
							</Button>
						))}
				</div>
				<Button
					variant="default"
					className="text-black font-bold rounded-full"
					onClick={() => navigate("/login")}
				>
					Get Started
				</Button>
			</div>
		</div>
	);
}

export default Navbar;
