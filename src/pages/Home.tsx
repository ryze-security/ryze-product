import { FooterNav } from "@/components/Footer";
import { FAQ } from "@/components/home/FAQ";
import FeaturesSection from "@/components/home/FeaturesSection";
import LandingNavbar from "@/components/home/LandingNavbar";
import { LastCTA } from "@/components/home/LastCTA";
import { GlowEffect } from "@/components/ui/glow-effect";
import { GradientButton } from "@/components/ui/gradient-button";
import { ArrowDownCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

function Home() {
	const [showScrollCue, setShowScrollCue] = useState(true);

	useEffect(() => {
		const handleScroll = () => {
			setShowScrollCue(window.scrollY < 200); // Hide when user scrolls
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="font-roboto text-white w-full min-h-screen overflow-x-hidden">
			{/* Navbar */}
			{!showScrollCue && <LandingNavbar loggedIn={false} />}

			{/* Hero Section */}
			<section className="relative w-full h-auto flex items-start pt-32 justify-center text-center bg-black overflow-hidden">
				{/* Centered content container */}
				<div className="relative z-10 max-w-80 h-80">
					{/* Video behind text */}
					<video
						autoPlay
						muted
						loop
						playsInline
						controls={false}
						className="block w-full h-full"
					>
						<source
							src="/assets/200w-ezgif.com-gif-to-mp4-converter.mp4"
							type="video/mp4"
						/>
						Your browser does not support the video tag.
					</video>

					{/* Dark overlay over video */}
					<div className="absolute inset-0 bg-black opacity-70 z-20" />

					{/* Brand text over video */}
					<div className="absolute inset-0 flex items-center justify-center z-30">
						<h1 className="text-6xl md:text-9xl sm:text-7xl font-bold text-white bg-transparent px-6 py-4 rounded-lg">
							Ryzr.
						</h1>
					</div>
				</div>
			</section>

			{/* Subtext + Button */}
			<section className="w-full text-center mt-28 px-4">
				<p className="text-lg md:text-4xl font-bold max-w-4xl mx-auto mb-6 leading-snug">
					Transforming security reviews
					<br />
					<span className="bg-[linear-gradient(to_right,theme(colors.violet.500),theme(colors.rose.600),theme(colors.sky.400),theme(colors.rose.600),theme(colors.violet.500))] bg-clip-text text-transparent animate-gradient">
						with speed and precision
					</span>
				</p>

				<GradientButton className="font-roboto font-semibold text-md">
					Get Started
				</GradientButton>
			</section>

			{/* Arrow Down Button */}
			{false && (<div className="w-full flex justify-center mt-16 animate-bounce relative">
				{/* GlowEffect should sit behind */}
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-12 h-12">
					<GlowEffect
						colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
						mode="colorShift"
						blur="soft"
						duration={3}
						scale={0.7}
						className="rounded-full opacity-75"
					/>
				</div>

				{/* The actual button */}
				<a
					className="relative z-10 inline-flex items-center gap-1 rounded-full bg-transparent text-sm text-zinc-50 scroll-smooth"
					href="#about"
				>
					<ArrowDownCircle className="h-12 w-12" />
				</a>
			</div>)}

			{/* About Section */}
			<section
				id="about"
				className="w-full bg-black text-white py-24 px-6 sm:px-12 lg:px-24 text-center"
			>
				<div className="max-w-5xl mx-auto">
					<h2 className="text-4xl sm:text-5xl font-bold mb-6">
						About Ryzr
					</h2>
					<p className="text-lg sm:text-xl leading-relaxed text-zinc-300">
						Ryzr is redefining the security review process with a
						focus on speed, accuracy, and developer experience. Our
						platform streamlines assessments, cuts down delays, and
						helps teams ship secure code faster than ever.
					</p>
					<p className="text-md sm:text-lg mt-6 text-zinc-400">
						Backed by cutting-edge AI and built for modern security
						teams, Ryzr is designed to adapt to your workflows, not
						the other way around.
					</p>
				</div>
			</section>

			{/* Features Section */}
			<div className="flex justify-center items-center w-full bg-black text-white py-24 pt-0 px-6 sm:px-12 lg:px-24">
				<FeaturesSection />
			</div>

			{/* FAQ Section */}
			<section className="flex justify-center items-center w-full bg-black text-white px-6 sm:px-12 lg:px-24">
				<FAQ />
			</section>

			{/* Last CTA Section */}
			<section className="flex justify-center items-center w-full bg-black text-white px-6 sm:px-12 lg:px-24">
				<LastCTA />
			</section>

			{/* Footer */}
			<FooterNav />
		</div>
	);
}

export default Home;
