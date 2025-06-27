import React from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Props {
	ProductLinks?: {
		name: string;
		href: string;
	}[];
	LegalLinks?: {
		name: string;
		href: string;
	}[];
}

function Footer(props: Props) {
	const { ProductLinks = [], LegalLinks = [] } = props;

	return (
		<div className="relative z-10 w-full font-roboto bg-[#0A0A0A]">
			<Separator />
			<section className="px-24 h-fit w-full pt-20 pb-8">
				<div className="flex w-full justify-between px-3">
					<div className="flex w-[60%]">
						<div className="flex flex-col w-[50%]">
							<h3 className="text-2xl leading-relaxed text-[#DDDDDD] mb-2">
								Product
							</h3>
							{ProductLinks.map((link, index) => (
								<Button
									key={index}
									variant="link"
									className="text-[#8A8A8A] w-fit text-left justify-start text-xl"
								>
									{link.name}
								</Button>
							))}
						</div>
						<div className="flex flex-col w-[50%]">
							<h3 className="text-2xl leading-relaxed text-[#DDDDDD] mb-2">
								Legal
							</h3>
							{LegalLinks.map((link, index) => (
								<Button
									key={index}
									variant="link"
									className="text-[#8A8A8A] w-fit text-left justify-start text-xl"
								>
									{link.name}
								</Button>
							))}
						</div>
					</div>
					<div className="flex w-[40%] flex-col">
						<h3 className="text-3xl leading-none text-[#DDDDDD] mb-2">
							Subscribe to Newsletter
						</h3>
						<p className="text-[#8A8A8A] text-lg">
							Get Monthly insights on latest updates and security
							tips.
						</p>
						<div className="bg-[#1E1E1E66] mt-5 flex justify-between rounded-full w-[453px] h-[55px] p-2">
							<Input
								type="email"
								placeholder="Enter your email"
								className="bg-transparent text-[#DDDDDD] w-[68%] p-0 rounded-full border-0 pl-5"
							/>
							<Button className="bg-[#DDDDDD] font-semibold text-[15px] text-[#0A0A0A] rounded-full w-[30%] h-full">
								Subscribe
							</Button>
						</div>
					</div>
				</div>
				<div className="flex justify-center h-[44px] mt-6 gap-6">
					<img
						src="\assets\Ryzr_White Logo_v2.png"
						alt="Ryzr Logo"
						className="w-[37px] h-[37px]"
					/>
					<h3 className="h-[44px] w-[290px] border-l pl-8 text-center leading-9 border-[#2A2A2A]">
						@2025 Ryzr. All rights reserved
					</h3>
				</div>
			</section>
		</div>
	);
}

export default Footer;
