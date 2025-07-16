import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export interface Tab {
	label: string;
	labelIcon: React.ReactNode;
	content: React.ReactNode;
}

interface Props {
	tabs: Tab[];
}

function TabbedFeatures(props: Props) {
	const { tabs } = props;

	const [activeTab, setActiveTab] = useState(0);

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const startAutoSwitch = () => {
		// Clear existing timeout
		if (timeoutRef.current) clearTimeout(timeoutRef.current);

		// Set new timeout
		timeoutRef.current = setTimeout(() => {
			setActiveTab((prev) => (prev + 1) % tabs.length);
		}, 5000);
	};

	const handleTabChange = (index: number) => {
		if (index !== activeTab) {
			setActiveTab(index);
		}
		startAutoSwitch(); // reset timer on manual click
	};

	useEffect(() => {
		startAutoSwitch();
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [activeTab]);

	return (
		<div className="w-full h-full mx-auto mt-0 lg:mt-5 my-4 px-4 py-5 rounded-xl">
			{/* Buttons */}
			<div className="flex justify-evenly overflow-x-auto gap-3 mb-6">
				{tabs.map((tab, index) => (
					<motion.button
						key={index}
						className={clsx(
							"px-4 py-2 rounded-full text-sm md:text-base lg:text-xl transition-all duration-300 font-medium text-black flex gap-2 items-center md:scrollbar-thin",
							index === activeTab
								? "bg-[#A356DC]"
								: "bg-transparent md:hover:bg-violet-light-ryzr"
						)}
						onClick={() => handleTabChange(index)}
					>
						{tab.labelIcon} {tab.label}
					</motion.button>
				))}
			</div>

			{/* Animated Content */}
			<div className="px-2 min-h-[120px] lg:mt-16">
				<AnimatePresence mode="wait">
					<motion.div
						key={activeTab}
						initial={{ opacity: 0, x: 10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -10 }}
						transition={{ duration: 0.2 }}
						className="text-base md:text-lg xl:text-xl text-black font-thin"
					>
						{tabs[activeTab].content}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}

export default TabbedFeatures;
