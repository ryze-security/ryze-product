import React from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Props {
	ProductLinks?: {
		name: string;
		href?: string;
		target?: string;
	}[];
	LegalLinks?: {
		name: string;
		href: string;
	}[];
}

function Footer(props: Props) {
	const { ProductLinks = [], LegalLinks = [] } = props;

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
		<div className="relative z-10 w-full font-roboto bg-[#0A0A0A]">
			<Separator />
			<section className="px-4 md:px-12 xl:px-24 pt-20 pb-8 w-full">
				<div className="flex flex-col lg:flex-row w-full justify-between gap-10">
					{/* Product + Legal Links */}
					<div className="flex flex-row w-full lg:w-[60%] gap-8">
						{/* Product */}
						<div className="flex flex-col w-full sm:w-[50%]">
							<h3 className="text-xl md:text-2xl leading-relaxed text-[#DDDDDD] mb-2">
								Product
							</h3>
							{ProductLinks.map((link, index) => (
								<Button
									key={index}
									variant="link"
									className="text-[#8A8A8A] w-fit text-left justify-start text-base md:text-xl"
									onClick={() => {
										if (link.href) {
											null;
										} else {
											handleScrollTo(link.target);
										}
									}}
								>
									{link.name}
								</Button>
							))}
						</div>

						{/* Legal */}
						<div className="flex flex-col w-full sm:w-[50%]">
							<h3 className="text-xl md:text-2xl leading-relaxed text-[#DDDDDD] mb-2">
								Legal
							</h3>
							{LegalLinks.map((link, index) => (
								<Button
									key={index}
									variant="link"
									className="text-[#8A8A8A] w-fit text-left justify-start text-base md:text-xl"
								>
									{link.name}
								</Button>
							))}
						</div>
					</div>

					{/* Newsletter */}
					<div className="w-full lg:w-fit xl:w-[40%] flex flex-col">
						<h3 className="text-2xl md:text-3xl leading-none text-[#DDDDDD] mb-2">
							Subscribe to Newsletter
						</h3>
						<p className="text-[#8A8A8A] text-base md:text-lg">
							Get Monthly insights on latest updates and security
							tips.
						</p>
						<div className="bg-[#1E1E1E66] mt-5 flex flex-row justify-between rounded-full w-full md:w-full lg:w-[453px] md:h-fit min-h-[55px] h-fit p-2 gap-2 sm:gap-0">
							<Input
								type="email"
								placeholder="Enter your email"
								className="bg-transparent text-[#DDDDDD] w-full sm:w-[68%] p-0 rounded-full border-0 pl-5 h-12"
							/>
							<Button className="bg-[#DDDDDD] font-semibold text-sm sm:text-[15px] text-[#0A0A0A] rounded-full w-[30%] h-12 ">
								Subscribe
							</Button>
						</div>
					</div>
				</div>

				{/* Footer Bottom */}
				<div className="flex flex-col sm:flex-row justify-center items-center h-fit mt-6 gap-4 sm:gap-6">
					<img
						src="/assets/Ryzr_White Logo_v2.png"
						alt="Ryzr Logo"
						className="w-8 h-8"
					/>
					<h3 className="sm:border-l pl-0 sm:pl-8 sm:border-[#2A2A2A] text-center text-sm sm:text-base text-[#AAAAAA]">
						@2025 Ryzr. All rights reserved
					</h3>
				</div>
			</section>
		</div>
	);
}

export default Footer;
