import React, { useEffect, useState } from "react";

const quips = [
	"Loading...",
	"Preparing your data...",
	"Fetching latest information...",
	"Processing your request...",
	"Setting things up...",
	"Initializing environment...",
	"Applying configurations...",
	"One moment while we get things ready...",
	"Finalizing details...",
	"Connecting to the server...",
];

export const LoadingOverlay = () => {
	const [quip, setQuip] = useState(quips[0]);
	const [colorToggle, setColorToggle] = useState(false);

	useEffect(() => {
		// Color toggle every 1–2 seconds
		const colorInterval = setInterval(() => {
			setColorToggle((prev) => !prev);
		}, Math.floor(Math.random() * 1000) + 1000); // 1000–2000ms

		// Quip update every 5–10 seconds
		const quipInterval = setInterval(() => {
			const random = Math.floor(Math.random() * quips.length);
			setQuip(quips[random]);
		}, Math.floor(Math.random() * 5000) + 5000); // 5000–10000ms

		return () => {
			clearInterval(colorInterval);
			clearInterval(quipInterval);
		};
	}, []);

	return (
		<div className="font-roboto fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
			<div className="relative flex items-center justify-center w-80 h-80">
				<video
					className="absolute inset-0 w-full h-full object-cover opacity-70 rounded-xl"
					autoPlay
					muted
					loop
					playsInline
				>
					<source
						src="/assets/200w-ezgif.com-gif-to-mp4-converter.mp4"
						type="video/mp4"
					/>
					Your browser does not support the video tag.
				</video>

				<div
					className={`absolute z-10 text-2xl sm:text-3xl font-semibold text-center px-6 transition text-nowrap duration-1000 ${
						colorToggle ? "text-white" : "text-zinc-400 opacity-80"
					}`}
				>
					{quip}
				</div>
			</div>
		</div>
	);
};
