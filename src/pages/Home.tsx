import { FadeInSection } from "@/components/FadeInSection";
import Footer from "@/components/Footer";
import CashIcon from "@/components/home/CashIcon";
import CertificateIcon from "@/components/home/CertificateIcon";
import MeetingIcon from "@/components/home/MeetingIcon";
import MeterIcon from "@/components/home/MeterIcon";
import Navbar from "@/components/home/Navbar";
import ReportIcon from "@/components/home/ReportIcon";
import SandglassIcon from "@/components/home/SandglassIcon";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CardStack } from "@/components/ui/card-stack";
import { Input } from "@/components/ui/input";
import { FileText, Heading, icons, MoveRightIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function Home() {
	const items = [
		{ label: "Home", href: "/", disabled: false },
		{ label: "About", href: "/about", disabled: false },
		{ label: "Contact", href: "/contact", disabled: false },
		{ label: "Disabled", href: "#", disabled: true },
	];

	const FeatureCARDS = [
		{
			id: 0,
			heading: "Define.",
			subheading: "Control Framework",
			content: (
				<p>
					Review documentation against leading standards and
					frameworks like ISO 27001, NIST CSF and more - or define
					your own custom framework.
				</p>
			),
		},
		{
			id: 1,
			heading: "Identify.",
			subheading: "Gaps precisely",
			content: (
				<p>
					Use AI to analyze security policies, SOC Type 2 reports, SIG
					questionnaires, etc. for compliance gaps - speeding up
					audits, and saving time.
				</p>
			),
		},
		{
			id: 2,
			heading: "Generate.",
			subheading: "Actionable reports",
			content: (
				<p>
					Generate risk reports with MITRE ATT&CK-aligned insights and
					tailored remediation plans and roadmaps for management’s
					decision making.
				</p>
			),
		},
	];

	const IconCards = [
		{
			icon: <MeetingIcon />,
			heading: "Client advisory & strategic consulting",
			content:
				"Conduct gap analysis of client practices vs industry standards & create remediation plans.",
		},
		{
			icon: <MeterIcon width="287" />,
			heading: "Third-party risk management",
			content:
				"Conduct comprehensive vendor due diligence, manage contact renewals & perform vendor edits.",
		},
		{
			icon: <ReportIcon width="251" />,
			heading: "Internal audit, policy review & enhancement",
			content:
				"Review internal policies for compliance with industry standards & framework.",
		},
		{
			icon: <CertificateIcon width="293" />,
			heading: "IOS certifications audit & assurance",
			content:
				"Conduct automated Stage 1 documentation reviews for IOS 27001 audits & policy alignment",
		},
	];

	const FAQs = [
		{
			trigger: "Is my data protected?",
			content:
				"We place a strong emphasis on safeguarding your data. By default, we do not utilize your data for training our models. All data is securely stored in ISO 27001-certified data centers located in Europe. Our models are private and trained using proprietary data exclusively developed by our in-house team.",
		},
		{
			trigger:
				"How reliable are your AI agents, and how do you manage errors or incorrect results?",
			content:
				"Our AI agents are designed to understand regulatory frameworks, auditor terminology, and technical cybersecurity knowledge, achieving an accuracy rate of over 90%. In case of any errors or incorrect results, we swiftly address them through iterative improvements and updates to ensure the system continuously learns and refines its performance.",
		},
		{
			trigger: "Can we replace humans with Ryzr?",
			content:
				"Our AI agent is designed to enhance human productivity, not replace humans. It automates operational tasks, providing intelligent recommendations that save time, allowing professionals to focus on high-priority tasks like closing security gaps and exploring technical issues. This approach combines the efficiency of AI with human expertise, driving more effective and precise results.",
		},
		{
			trigger:
				"Can you help customize my AI agent to suit my organization’s needs?",
			content:
				"Absolutely! We can help you define specific risk and control frameworks to align with your unique compliance requirements, that too for free!",
		},
		{
			trigger: "Do you provide a free trial?",
			content:
				"Yes, we offer a free trial that allows you to experience how our AI agent automates the tedious, manual tasks of auditing—such as performing compliance checks, writing risk reports, and more—giving you a firsthand look at its capabilities before making any commitment.",
		},
	];

	const ProductLinks = [
		{ name: "Features", href: "/#" },
		{ name: "Pricing", href: "/#" },
		{ name: "Product", href: "/#" },
	];

	const LegalLinks = [
		{ name: "Privacy Policy", href: "/#" },
		{ name: "Terms of Service", href: "/#" },
	];

	return (
		<div className="min-h-screen h-auto font-roboto w-full overflow-x-hidden overflow-y-hidden relative">
			<Navbar items={items} />
			<FadeInSection>
				<div className="h-fit w-full flex flex-col items-center justify-center bg-[linear-gradient(to_bottom,#000000,#0B0B0B80,#B05BEF,#B05BEF)] text-white -z-0">
					{/* Video And title section */}
					<section className="relative w-auto h-auto flex items-start pt-32 justify-center text-center bg-transparent overflow-hidden">
						{/* Centered content container */}
						<div className="relative z-10 max-w-72 h-72">
							{/* Video behind text */}
							<video
								autoPlay
								muted
								loop
								playsInline
								controls={false}
								className="block w-full h-full bg-transparent"
							>
								<source
									src="/assets/200w-ezgif.com-gif-to-mp4-converter.mp4"
									type="video/mp4"
								/>
								Your browser does not support the video tag.
							</video>

							{/* Dark overlay over video */}
							<div className="absolute inset-0 bg-black opacity-50 z-20" />

							{/* Brand text over video */}
							<div className="absolute inset-0 flex items-center justify-center z-30">
								<h1 className="text-6xl md:text-8xl sm:text-7xl font-bold text-white bg-transparent px-6 py-4 rounded-lg tracking-wide">
									Ryzr.
								</h1>
							</div>
						</div>
					</section>

					{/* CTA Button and text */}
					<section className="w-full text-center px-4">
						<p className="text-lg md:text-5xl font-bold max-w-4xl mx-auto mb-6 leading-loose tracking-wide">
							Transforming security reviews
							<br />
							<span className="bg-[linear-gradient(to_right,#7030A0,#DA3D49,#EB7135,#1AC7F7,#EB7135,#DA3D49,#7030A0)] bg-clip-text text-transparent animate-gradient leading-relaxed">
								with speed and precision
							</span>
						</p>

						<Link to="/login">
							<Button className="font-roboto font-semibold text-base rounded-full px-9 py-5 min-h-12 tracking-wide">
								Get Started <MoveRightIcon />
							</Button>
						</Link>
					</section>

					{/* Product Image */}
					<section className="w-full h-fit flex justify-center text-center mt-12 px-4">
						<div className="relative w-[1200px] h-[700px] rounded-3xl bg-gradient-to-b from-[#5F5F5F] to-transparent z-10">
							<div
								className="absolute w-[2000px] h-[1000px] -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 pointer-events-none 
			bg-[radial-gradient(ellipse_at_center,#000000_60%,#B05BEF_100%)] rounded-full"
							/>
							<img
								src="\assets\Product image.png"
								alt="Product image"
								className="w-full h-full object-cover rounded-3xl shadow-lg p-1"
							/>
							<div className="absolute inset-0 bg-gradient-to-b rounded-3xl from-transparent to-black opacity-100 z-20" />
						</div>
					</section>
				</div>
			</FadeInSection>

			{/* Advantages */}
			<section className="relative w-full flex items-center justify-evenly px-4 z-10">
				<FadeInSection>
					<div className="flex gap-10 max-w-80">
						<CashIcon className="min-w-11" />
						<p className="text-white text-wrap text-xl">
							<span className="text-violet-light-ryzr">
								Cut costs
							</span>{" "}
							tied to low value documentation reviews
						</p>
					</div>
				</FadeInSection>
				<FadeInSection delay={0.4}>
					<div className="flex gap-10 max-w-80">
						<SandglassIcon className="min-w-11" />
						<p className="text-white text-wrap text-xl">
							Cut compliance time from{" "}
							<span className="text-violet-light-ryzr">
								months to hours
							</span>
						</p>
					</div>
				</FadeInSection>
				<FadeInSection delay={0.8}>
					<div className="flex gap-10 max-w-80">
						<FileText className="min-w-11 min-h-[50px] text-[#666666]" />
						<p className="text-white text-wrap text-xl">
							Review hundreds of pages,{" "}
							<span className="text-violet-light-ryzr">
								in minutes
							</span>
						</p>
					</div>
				</FadeInSection>
			</section>

			{/* Features and cards section */}
			<section className="relative z-10 w-full mt-12 bg-white min-h-[512px] flex">
				<div className="w-[49%]">
					<div className="py-20 px-24 text-black h-fit">
						<h2 className="font-semibold text-[56px] leading-[56px] tracking-tight text-wrap">
							<FadeInSection>
								AI agent that{" "}
								<span className="text-violet-light-ryzr">
									understands security{" "}
								</span>
								and detects what humans miss.
							</FadeInSection>
						</h2>
						<FadeInSection delay={0.4}>
							<h2 className="font-normal text-2xl text-[#7B7B7B] mt-4">
								Save up to 80% of time with AI-driven automation
							</h2>
							<Button
								className="text-black font-medium text-lg rounded-full border-2 py-6 px-10 mt-8"
								variant="ghost"
							>
								Book a demo
							</Button>
						</FadeInSection>
					</div>
				</div>
				<div className="w-[51%] bg-gradient-to-b from-violet-light-ryzr to-transparent flex flex-col justify-center">
					<FadeInSection delay={0.4}>
						<div className="mx-auto w-fit">
							<CardStack items={FeatureCARDS} />
						</div>
					</FadeInSection>
				</div>
			</section>

			{/* More Features with Icon Cards */}
			<FadeInSection>
				<section className="relative z-10 w-full mt-20 flex px-24 h-fit flex-col">
					<h2 className="font-medium text-6xl tracking-tighter">
						<span className="text-violet-light-ryzr">
							Empower your team
						</span>
						<br />
						without replacing their judgement
					</h2>
					<p className="mt-6 text-[#9A9A9A] text-2xl tracking-tight">
						Explore use cases that harness precise insights, saving
						time, cutting costs, and boosting efficiency.
					</p>
				</section>
			</FadeInSection>
			<div className="flex justify-evenly mt-14 w-full">
				{IconCards.map((card, index) => (
					<FadeInSection delay={(index+1) * 0.4} key={index}>
						<div
							className="h-[470px] max-w-[360px] bg-white rounded-3xl px-6 py-8 flex flex-col"
						>
							<h2 className="font-semibold text-black text-3xl tracking-tight leading-7">
								{card.heading}
							</h2>
							<p className="text-sm mt-[29px] min-h-[49px] h-[49px] text-[#5A5A5A]">
								{card.content}
							</p>
							<div className="mx-auto my-auto">{card.icon}</div>
						</div>
					</FadeInSection>
				))}
			</div>
			
			{/* Contact Us */}
			<FadeInSection>
				<section className="relative z-10 w-full mt-20 px-24 h-[435px] min-h-[435px]">
					<div className="bg-white rounded-3xl h-full w-full flex">
						<div className="w-[48%]">
							<div className="py-20 px-16 text-black h-full">
								<h2 className="text-6xl font-medium tracking-tighter">
									<span className="text-violet-light-ryzr font-semibold">
										Shape a solution
									</span>
									<br />
									that suits you.
								</h2>
								<p className="text-[21px] mt-8 text-[#9A9A9A] tracking-tight text-justify">
									We’d love to help customize your AI agent to
									fit your unique risk and compliance
									needs—completely free. Speak with us today!
								</p>
							</div>
						</div>
						<div className="w-[52%]">
							<div className="py-[60px] px-12 flex flex-col gap-8 text-black h-full">
								<div className="flex justify-between">
									<div className="flex flex-col gap-2">
										<p className="text-lg text-black font-medium">
											Your Name{" "}
											<span className="text-rose-600">
												*
											</span>
										</p>
										<Input
											className="bg-[#EBEBEB] md:text-base h-14 w-[268px] rounded-3xl border-0"
											placeholder="Your Name"
										/>
									</div>
									<div className="flex flex-col gap-2">
										<p className="text-lg text-black font-medium">
											Email{" "}
											<span className="text-rose-600">
												*
											</span>
										</p>
										<Input
											className="bg-[#EBEBEB] md:text-base h-14 w-[268px] rounded-3xl border-0"
											placeholder="Email"
										/>
									</div>
								</div>
								<div className="w-full">
									<div className="flex flex-col gap-2">
										<p className="text-lg text-black font-medium">
											Company Name{" "}
											<span className="text-[#5A5A5A]">
												(optional)
											</span>
										</p>
										<Input
											className="bg-[#EBEBEB] md:text-base h-14 w-full rounded-3xl border-0"
											placeholder="Company Name"
										/>
									</div>
								</div>
								<div className="w-full">
									<Button className="w-full bg-violet-light-ryzr h-14 rounded-full py-5 px-9 text-white font-semibold text-xl hover:bg-violet-ryzr">
										Submit
									</Button>
								</div>
							</div>
						</div>
					</div>
				</section>
			</FadeInSection>

			{/* FAQs Section */}
			<FadeInSection>
				<section className="relative z-10 w-full mt-20 mb-32 px-24 h-fit">
					<div className="w-full h-full flex">
						<div className="w-[49%]">
							<div className="text-white h-full">
								<h2 className="text-[64px] font-semibold tracking-tighter leading-tight">
									Frequently <br />
									Asked Questions
								</h2>
								<p className="text-[21px] mt-6 text-[#9A9A9A] tracking-tight text-justify">
									Don't see the answers you're looking for?
								</p>
							</div>
						</div>
						<div className="w-[51%]">
							{FAQs.map((faq, index) => (
								<Accordion key={index} type="multiple">
									<AccordionItem value={`item-${index + 1}`}>
										<AccordionTrigger className="text-left text-xl text-[#D7D7D7]">
											{faq.trigger}
										</AccordionTrigger>
										<AccordionContent className="text-lg text-[#D7D7D7]">
											{faq.content}
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							))}
						</div>
					</div>
				</section>
			</FadeInSection>

			<Footer ProductLinks={ProductLinks} LegalLinks={LegalLinks} />
		</div>
	);
}

export default Home;
