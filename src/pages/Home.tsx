import { FadeInSection } from "@/components/FadeInSection";
import Footer from "@/components/Footer";
import CashIcon from "@/components/home/CashIcon";
import CertificateIcon from "@/components/home/CertificateIcon";
import MeetingIcon from "@/components/home/MeetingIcon";
import MeterIcon from "@/components/home/MeterIcon";
import Navbar from "@/components/home/Navbar";
import ReportIcon from "@/components/home/ReportIcon";
import SandglassIcon from "@/components/home/SandglassIcon";
import Component from "@/components/scroll-card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CardStack } from "@/components/ui/card-stack";
import confetti from "canvas-confetti";
import { Input } from "@/components/ui/input";
import { RoundSpinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { contactUsBodyDTO } from "@/models/landing_page/contact_usDTOs";
import landingPageService from "@/services/landingPageServices";
import { useIsMobile } from "@/utils/useIsMobile";
import {
	ChevronLeft,
	ChevronRight,
	CloudUploadIcon,
	Coins,
	EditIcon,
	FileEditIcon,
	FilesIcon,
	FileText,
	Heading,
	icons,
	MoveRightIcon,
	SearchIcon,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import TabbedFeatures, { Tab } from "@/components/home/TabbedFeatures";

type ContactUsInputs = {
	name: string;
	email: string;
	companyName?: string;
};

function Home() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ContactUsInputs>();

	const { toast } = useToast();

	const items = [
		{ label: "Home", href: "/", disabled: false },
		{ label: "About", href: "#features", disabled: false },
		{ label: "Contact", href: "#contact-us", disabled: false },
	];

	const FeatureCARDS: Tab[] = [
		{
			label: "Upload",
			labelIcon: <CloudUploadIcon />,
			content: (
				<div className="flex flex-col gap-2">
					<CloudUploadIcon className="w-12 h-12 mb-1" />
					<h2 className="font-semibold text-[26px] md:text-3xl mb-1">
						Upload Documents
					</h2>
					<span className="text-white font-light mb-2 bg-violet-ryzr text-sm md:text-base lg:text-lg w-fit rounded-3xl px-2">
						All at once. In any format.
					</span>
					Drag and drop security policies, procedures, ISAE reports,
					SOC Type 2 reports, SIG questionnaires, ISO 27001 SoA, etc.
				</div>
			),
		},
		{
			label: "Define",
			labelIcon: <EditIcon />,
			content: (
				<div className="flex flex-col gap-2">
					<EditIcon className="w-12 h-12 mb-1" />
					<h2 className="font-semibold text-[26px] md:text-3xl mb-1">
						Define control framework
					</h2>
					<span className="text-white font-light mb-2 bg-violet-ryzr text-sm md:text-base lg:text-lg w-fit rounded-3xl px-2">
						Set requirements.
					</span>
					Define your own custom framework or use predefined industry
					standards and frameworks such as ISO 27001, NIST CSF, and
					others.
				</div>
			),
		},
		{
			label: "Extract",
			labelIcon: <SearchIcon />,
			content: (
				<div className="flex flex-col gap-2">
					<SearchIcon className="w-12 h-12 mb-1" />
					<h2 className="font-semibold text-[26px] md:text-3xl mb-1">
						Extract data
					</h2>
					<span className="text-white font-light mb-2 bg-violet-ryzr text-sm md:text-base lg:text-lg w-fit rounded-3xl px-2">
						AI powered document intelligence.
					</span>
					Extract key data in moments with Ryzr’s AI-powered document
					intelligence — saving time and improving accuracy. No more
					digging through documents.
				</div>
			),
		},
		{
			label: "Review",
			labelIcon: <FileEditIcon />,
			content: (
				<div className="flex flex-col gap-2 mb-1">
					<FileEditIcon className="w-12 h-12" />
					<h2 className="font-semibold text-[26px] md:text-3xl mb-1">
						Review gaps
					</h2>
					<span className="text-white font-light mb-2 bg-violet-ryzr text-sm md:text-base lg:text-lg w-fit rounded-3xl px-2">
						Instantly pinpoint gaps.
					</span>
					Identify security gaps with precision — Ryzr’s AI agent
					understands security context and links every insight
					directly to its exact place in your documents.
				</div>
			),
		},
		{
			label: "Report",
			labelIcon: <FilesIcon />,
			content: (
				<div className="flex flex-col gap-2">
					<FilesIcon className="w-12 h-12 mb-1" />
					<h2 className="font-semibold text-[26px] md:text-3xl mb-1">
						Generate actionable reports
					</h2>
					<span className="text-white font-light mb-2 bg-violet-ryzr text-sm md:text-base lg:text-lg w-fit rounded-3xl px-2">
						Effortless report creation.
					</span>
					Effortlessly generate detailed observation reports with
					MITRE ATT&CK-aligned insights, formal risk statements, and
					tailored recommendations.
				</div>
			),
		},
	];

	const IconCards = [
		{
			icon: <MeterIcon width="287" className="w-[60vw] md:w-full" />,
			heading: "Third-party risk management",
			content:
				"Conduct comprehensive vendor due diligence, manage contract renewals & perform vendor audits.",
		},
		{
			icon: <MeetingIcon className="w-[60vw] md:w-full" />,
			heading: "Client advisory & strategic consulting",
			content:
				"Conduct gap analysis of client practices vs industry standards & generate actionable reports.",
		},
		{
			icon: <ReportIcon width="251" className="w-[60vw] md:w-full" />,
			heading: "Internal audit, policy review & enhancement",
			content:
				"Review internal policies for compliance with industry standards & frameworks.",
		},
		{
			icon: (
				<CertificateIcon width="293" className="w-[60vw] md:w-full" />
			),
			heading: "ISO certifications audit & assurance",
			content:
				"Conduct automated Stage 1 documentation reviews for ISO 27001 audits & policy alignment.",
		},
	];

	const FAQs = [
		{
			trigger: "Is my data protected?",
			content: (
				<p>
					We place a strong emphasis on safeguarding your data. By
					default, we do not utilize your data for training our
					models. All data is securely stored in ISO 27001-certified
					data centers located in Europe. Our models are private and
					trained using proprietary data exclusively developed by our
					in-house team.
				</p>
			),
		},
		{
			trigger:
				"How reliable are your AI agents, and how do you manage errors or incorrect results?",
			content: (
				<p>
					Our AI agents are designed to understand regulatory
					frameworks, auditor terminology, and technical cybersecurity
					knowledge, achieving an accuracy rate of over 90%. In case
					of any errors or incorrect results, we swiftly address them
					through iterative improvements and updates to ensure the
					system continuously learns and refines its performance.
				</p>
			),
		},
		{
			trigger: "Can we replace humans with Ryzr?",
			content: (
				<p>
					Our AI agent is designed to enhance human productivity, not
					replace humans. It automates operational tasks, providing
					intelligent recommendations that save time, allowing
					professionals to focus on high-priority tasks like closing
					security gaps and exploring technical issues. This approach
					combines the efficiency of AI with human expertise, driving
					more effective and precise results.
				</p>
			),
		},
		{
			trigger:
				"Can you help customize my AI agent to suit my organization’s needs?",
			content: (
				<p>
					Absolutely! We can help you define specific risk and control
					frameworks to align with your unique compliance
					requirements, that too for free!
				</p>
			),
		},
		{
			trigger: "How much does Ryzr cost?",
			content: (
				<p>
					Our plans start at only 50 EUR per month per user, with
					affordable options for larger teams. We’re dedicated to
					making AI accessible, helping organizations increase
					productivity and improve margins.{" "}
					<Button
						variant="link"
						className="p-0 text-sm md:text-base lg:text-lg h-fit w-fit text-[#d7d7d7dd] underline"
						onClick={() => {
							const el = document.getElementById("contact-us");
							if (el) {
								const yOffset = -150; // Scroll ?px *above* the element
								const y =
									el.getBoundingClientRect().top +
									window.pageYOffset +
									yOffset;

								window.scrollTo({ top: y, behavior: "smooth" });
							}
						}}
					>
						Contact us
					</Button>{" "}
					for customized plans that suit your requirements.
				</p>
			),
		},
		{
			trigger: "Do you provide a free trial?",
			content: (
				<p>
					Yes, we offer a free trial that allows you to experience how
					our AI agent automates the tedious, manual tasks of
					auditing—such as performing compliance checks, writing risk
					reports, and more—giving you a firsthand look at its
					capabilities before making any commitment.
				</p>
			),
		},
	];

	const ProductLinks = [
		{ name: "Features", target: "features" },
		{ name: "Product", target: "product" },
		{ name: "FAQ", target: "faq" },
	];

	const LegalLinks = [
		{ name: "Privacy Policy", href: "/#" },
		{ name: "Terms of Service", href: "/#" },
	];

	const isMobile = useIsMobile();

	const [isContactSubmitting, setIsContactSubmitting] = useState(false);

	const scrollRef = useRef<HTMLDivElement>(null);
	const formBodyRef = useRef<HTMLDivElement>(null);

	const scrollLeft = () => {
		scrollRef.current?.scrollBy({ left: -550, behavior: "smooth" });
	};
	const scrollRight = () => {
		scrollRef.current?.scrollBy({ left: 550, behavior: "smooth" });
	};

	const handleCelebrate = () => {
		const end = Date.now() + 0.5 * 1000; // 3 seconds
		const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

		const frame = () => {
			if (Date.now() > end) return;
			const rect = formBodyRef.current?.getBoundingClientRect();

			const x = (rect.left + rect.width / 2) / window.innerWidth;
			const y = (rect.top + rect.height / 2) / window.innerHeight;

			const origin = { x, y };

			confetti({
				particleCount: 2,
				angle: 90,
				spread: 75,
				startVelocity: 60,
				origin: {
					x: (rect.left + rect.width / 2) / window.innerWidth,
					y: (rect.top + rect.height) / window.innerHeight,
				},
				colors: colors,
			});

			requestAnimationFrame(frame);
		};

		frame();
	};

	const onContactUsSubmit: SubmitHandler<ContactUsInputs> = async (data) => {
		setIsContactSubmitting(true);
		const contactUsBody: contactUsBodyDTO = {
			email: data.email,
			details: `Name: ${data.name}, Company: ${
				data.companyName || "N/A"
			}`,
		};
		try {
			const response = await landingPageService.contactUs(contactUsBody);
			if (response) {
				handleCelebrate();
				toast({
					title: "Thank you for contacting us!",
					description: "We will get back to you soon.",
					className: "bg-green-ryzr text-white",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description:
					"Failed to submit contact form. Please try again later.",
				variant: "destructive",
			});
		} finally {
			setIsContactSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen font-roboto w-full overflow-x-hidden overflow-y-hidden lg:overflow-y-auto relative">
			<Navbar items={items} />

			{/* Main Hero Section */}
			<FadeInSection>
				<div className="h-fit w-full flex flex-col items-center justify-center bg-[linear-gradient(to_bottom,#000000,#000000,#0B0B0B80,#B05BEF,#B05BEF)] lg:bg-[linear-gradient(to_bottom,#000000,#0B0B0B80,#B05BEF,#B05BEF)] text-white">
					{/* Video and Title */}
					<section className="relative w-full flex flex-col items-center pt-32 text-center px-4">
						<div className="relative z-10 w-[40vw] aspect-square lg:w-[18rem]">
							<video
								autoPlay
								muted
								loop
								playsInline
								controls={false}
								className="block w-full h-full bg-transparent opacity-50"
							>
								<source
									src="/assets\200w-ezgif.com-gif-to-mp4-converter.mp4"
									type="video/mp4"
								/>
							</video>
							<div className="absolute inset-0 flex items-center justify-center z-30">
								<h1 className="text-[13vw] md:text-[15vw] lg:text-9xl font-bold text-white bg-transparent px-6 py-4 rounded-lg tracking-wide">
									Ryzr.
								</h1>
							</div>
						</div>
					</section>

					{/* CTA Button and Tagline */}
					<section className="w-full text-center px-4 mt-8">
						<p className="text-[5vw] md:text-5xl font-bold max-w-4xl mx-auto mb-1 md:mb-2 leading-relaxed tracking-wide">
							Transforming security reviews
							<br />
							<span className="bg-[linear-gradient(to_right,#7030A0,#DA3D49,#EB7135,#1AC7F7,#EB7135,#DA3D49,#7030A0)] bg-clip-text text-transparent animate-gradient leading-relaxed">
								with speed and precision
							</span>
						</p>
						<FadeInSection delay={0.2}>
							<p className="text-[2.5vw] md:text-xl font-thin max-w-4xl mx-auto mb-4 md:mb-6 leading-relaxed tracking-wide opacity-80">
								Power of AI. Delivered for Cybersecurity.
							</p>
						</FadeInSection>

						<FadeInSection delay={0.6}>
							<Link to="/login">
								<Button
									className="font-roboto font-semibold 
											text-[clamp(0.75rem,2.3vw,1rem)] 
											rounded-full 
											px-[clamp(0.7rem,5vw,2rem)] 
											py-[clamp(0.5rem,2vh,1rem)] 
											min-h-[2.15rem] 
											min-w-[8rem] 
											w-[20vw]
											tracking-wide 
											transition-transform 
											hover:scale-[1.03] sm:w-fit"
								>
									Get Started <MoveRightIcon />
								</Button>
							</Link>
						</FadeInSection>
					</section>

					{/* Product Image with Glow */}
					<section className="w-full flex justify-center mt-8 lg:mt-12 px-4">
						<div className="relative w-[90vw] lg:w-[80vw] aspect-[12/7] rounded-3xl bg-gradient-to-b from-[#5F5F5F] to-transparent z-10">
							<div className="absolute w-[150vw] h-[175vw] max-h-[800px] lg:max-h-[1000px] md:w-[140vw] lg:h-[80vw] -z-10 top-1.5 lg:top-1/2 left-1/2 -translate-x-1/2 lg:-translate-y-1/4 pointer-events-none bg-[radial-gradient(ellipse_at_center,#000000_60%,#B05BEF_100%)] rounded-full" />
							<img
								src="/assets/Product image.png"
								alt="Product image"
								className="w-full h-full rounded-3xl shadow-lg p-1"
							/>
							<div className="absolute inset-0 bg-gradient-to-b rounded-3xl from-transparent to-black opacity-100 z-20" />
						</div>
					</section>
				</div>
			</FadeInSection>

			{/* Advantages Section */}
			<section className="relative w-full grid md:grid-cols-3 gap-10 px-4 lg:px-20 xl:px-24 mt-12 z-10">
				{[
					{
						icon: (
							<FileText className="min-w-9 md:min-w-11 min-h-[40px] lg:min-h-[50px] text-[#666666]" />
						),
						text: (
							<>
								Review hundreds of pages,{" "}
								<span className="text-violet-light-ryzr">
									in minutes
								</span>
							</>
						),
					},
					{
						icon: (
							<Coins className="min-w-9 md:min-w-11 min-h-[40px] lg:min-h-[50px] text-[#666666]" />
						),
						text: (
							<>
								<span className="text-violet-light-ryzr">
									Save costs
								</span>{" "}
								tied to low value documentation reviews
							</>
						),
					},
					{
						icon: (
							<SandglassIcon className="min-w-9 max-w-9 md:max-w-11 md:min-w-11 max-h-[40px] lg:min-h-[50px]" />
						),
						text: (
							<>
								Cut compliance time from{" "}
								<span className="text-violet-light-ryzr">
									months to hours
								</span>
							</>
						),
					},
				].map((item, idx) => (
					<FadeInSection delay={idx * 0.4} key={idx}>
						<div className="flex gap-6 max-w-[90vw] h-full md:max-w-md items-center">
							{item.icon}
							<p className="text-white align-middle text-wrap text-base lg:text-xl xl:text-2xl">
								{item.text}
							</p>
						</div>
					</FadeInSection>
				))}
			</section>

			{/* Features Section */}
			<section
				id="features"
				className="relative z-10 w-full mt-12 bg-white min-h-[30vh] lg:min-h-[60vh] flex flex-col lg:flex-row max-lg:bg-gradient-to-t from-violet-light-ryzr to-white"
			>
				<div className="w-full lg:w-[49%]">
					<div className="py-12 px-6 md:py-20 lg:px-24 text-black">
						<h2 className="font-semibold text-3xl lg:text-[56px] leading-none tracking-tight">
							<FadeInSection>
								AI agent that{" "}
								<span className="text-violet-light-ryzr">
									understands security
								</span>{" "}
								and detects what humans miss.
							</FadeInSection>
						</h2>
						<FadeInSection delay={0.4}>
							<h2 className="font-normal text-xl lg:text-2xl text-[#7B7B7B] mt-4">
								Save up to 80% of time with AI-driven automation
							</h2>
							<Button
								className="text-black font-medium text-lg rounded-full border-2 py-4 px-8 mt-8"
								variant="ghost"
							>
								Book a demo
							</Button>
						</FadeInSection>
					</div>
				</div>
				<div className="w-full lg:w-[51%] lg:bg-gradient-to-b from-violet-light-ryzr to-transparent flex justify-center items-center">
					<div className="w-full mx-2 h-full lg:mt-0">
						<FadeInSection delay={0.4}>
							{/* <CardStack offset={20} items={FeatureCARDS} /> */}
							<TabbedFeatures tabs={FeatureCARDS} />
						</FadeInSection>
					</div>
				</div>
			</section>

			{/* Use Case Cards */}
			<FadeInSection>
				<section
					id="product"
					className="relative z-10 w-full mt-20 px-4 md:px-24 flex flex-col"
				>
					<h2 className="font-semibold text-[33px] leading-9 lg:leading-tight lg:text-6xl md:text-5xl tracking-tighter">
						<span className="text-violet-light-ryzr">
							Empower your team
						</span>
						<br />
						without replacing their judgement
					</h2>
					<p className="mt-4 md:mt-6 text-[#9A9A9A] text-[17px] leading-6 md:text-xl lg:text-2xl tracking-tight font-normal">
						Explore use cases that harness precise insights, saving
						time, cutting costs, and boosting efficiency.
					</p>
				</section>
			</FadeInSection>

			<div className="relative w-full">
				{/* Arrows - visible only on lg screens but hidden on xl and up */}
				<div className="hidden lg:flex 2xl:hidden absolute left-4 top-1/2 -translate-y-1/2 z-10">
					<button
						onClick={scrollLeft}
						className="text-white bg-black p-2 rounded-full shadow"
					>
						<ChevronLeft />
					</button>
				</div>
				<div className="hidden lg:flex 2xl:hidden absolute right-4 top-1/2 -translate-y-1/2 z-10">
					<button
						onClick={scrollRight}
						className="text-white bg-black p-2 rounded-full shadow"
					>
						<ChevronRight />
					</button>
				</div>

				{/* Scrollable Cards */}
				<div
					ref={scrollRef}
					className="flex flex-col md:flex-row overflow-x-auto overflow-y-hidden md:max-2xl:scrollbar-none justify-evenly items-center gap-8 mt-8 md:mt-14 w-full px-4 md:px-24 scroll-smooth"
				>
					{IconCards.map((card, index) => (
						<FadeInSection
							delay={isMobile ? 0 : (index + 1) * 0.2}
							key={index}
						>
							<div className="md:min-h-[503px] min-w-[80vw] max-md:w-[80vw] md:min-w-[440px] bg-white rounded-3xl px-6 py-8 flex flex-col">
								<h2 className="font-semibold text-black text-2xl md:text-4xl tracking-tight leading-7">
									{card.heading}
								</h2>
								<p className="text-base md:text-xl mt-6 text-[#5A5A5A]">
									{card.content}
								</p>
								<div className="mx-auto my-auto mt-8">
									{card.icon}
								</div>
							</div>
						</FadeInSection>
					))}
				</div>
			</div>

			{/* Contact Us Section */}
			<FadeInSection>
				<section
					id="contact-us"
					className="relative z-10 w-full mt-20 px-4 md:px-8 lg:px-24"
				>
					<div className="bg-white rounded-3xl flex flex-col md:flex-row">
						<div className="w-full md:w-[48%] p-8 md:p-10 lg:p-16">
							<h2 className="text-4xl text-black md:text-[38px] lg:text-[41px] xl:text-6xl font-medium tracking-tighter">
								<span className="text-violet-light-ryzr font-semibold">
									Shape a solution
								</span>
								<br />
								that suits you.
							</h2>
							<p className="text-base md:text-lg lg:text-lg xl:text-[21px] mt-6 text-[#9A9A9A] tracking-tight ">
								We’d love to help customize your AI agent to fit
								your unique risk and compliance needs—
								<span className="text-violet-light-ryzr">
									completely free.
								</span>
							</p>
						</div>
						<div className="w-full md:w-[52%] p-8 pt-0 md:pt-8 lg:pt-12 lg:p-12">
							<form onSubmit={handleSubmit(onContactUsSubmit)}>
								<div
									className="flex flex-col gap-4 md:gap-8 text-black"
									ref={formBodyRef}
								>
									<div className="flex flex-col md:flex-row gap-4 md:justify-between">
										<div className="flex flex-col gap-2 w-full md:w-[48%]">
											<p className="md:text-lg text-base font-medium">
												Name{" "}
												<span className="text-rose-600">
													*
												</span>
											</p>
											<Input
												className={`bg-[#EBEBEB] h-14 w-full rounded-3xl border-0 ${
													errors.name
														? "border-2 border-rose-500"
														: ""
												}`}
												placeholder="Name"
												{...register("name", {
													required: true,
												})}
												type="text"
											/>
										</div>
										<div className="flex flex-col gap-2 w-full md:w-[48%]">
											<p className="md:text-lg text-base font-medium">
												Email{" "}
												<span className="text-rose-600">
													*
												</span>
											</p>
											<Input
												className={`bg-[#EBEBEB] h-14 w-full rounded-3xl border-0 ${
													errors.email
														? "border-2 border-rose-500"
														: ""
												}`}
												placeholder="Email"
												type="email"
												{...register("email", {
													required: true,
												})}
											/>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<p className="md:text-lg text-base font-medium">
											Company Name{" "}
											<span className="text-[#5A5A5A]">
												(optional)
											</span>
										</p>
										<Input
											className="bg-[#EBEBEB] h-14 w-full rounded-3xl border-0"
											placeholder="Company Name"
											type="text"
											{...register("companyName")}
										/>
									</div>
									<Button
										className="w-full bg-violet-light-ryzr h-14 rounded-full py-5 px-9 text-white font-semibold md:text-xl text-lg hover:bg-violet-ryzr"
										type="submit"
										disabled={isContactSubmitting}
									>
										{isContactSubmitting ? (
											<RoundSpinner />
										) : (
											"Submit"
										)}
									</Button>
								</div>
							</form>
						</div>
					</div>
				</section>
			</FadeInSection>

			{/* FAQ Section */}
			<FadeInSection>
				<section
					id="faq"
					className="relative z-10 w-full mt-20 mb-32 px-4 md:px-24"
				>
					<div className="w-full flex flex-col lg:flex-row">
						<div className="w-full lg:w-[49%] mb-8 lg:mb-0">
							<h2 className="text-[42px] md:text-5xl lg:text-[52px] xl:text-[64px] font-semibold tracking-tighter leading-tight text-white">
								Frequently <br />
								Asked Questions
							</h2>
							{/* <p className="text-base md:text-[21px] mt-3 md:mt-6 text-[#9A9A9A] tracking-tight text-justify">
								Don't see the answers you're looking for?
							</p> */}
						</div>
						<div className="w-full lg:w-[51%]">
							{FAQs.map((faq, index) => (
								<Accordion key={index} type="multiple">
									<AccordionItem value={`item-${index + 1}`}>
										<AccordionTrigger className="text-left text-lg md:text-[22px] text-[#D7D7D7]">
											{faq.trigger}
										</AccordionTrigger>
										<AccordionContent className="text-sm md:text-base lg:text-lg text-[#d7d7d7dd]">
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
