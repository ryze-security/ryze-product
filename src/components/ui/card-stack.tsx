"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

let interval: any;

type Card = {
	id: number;
	heading: string;
	subheading: string;
	content: React.ReactNode;
};

export const CardStack = ({
	items,
	offset,
	scaleFactor,
}: {
	items: Card[];
	offset?: number;
	scaleFactor?: number;
}) => {
	const CARD_OFFSET = offset || 10;
	const SCALE_FACTOR = scaleFactor || 0.06;
	const [cards, setCards] = useState<Card[]>(items);

	useEffect(() => {
		startFlipping();

		return () => clearInterval(interval);
	}, []);
	const startFlipping = () => {
		interval = setInterval(() => {
			setCards((prevCards: Card[]) => {
				const newArray = [...prevCards]; // create a copy of the array
				newArray.unshift(newArray.pop()!); // move the last element to the front
				return newArray;
			});
		}, 6000);
	};

	return (
		<div className="relative h-[240px] w-[600px]">
			{cards.map((card, index) => {
				return (
					<motion.div
						key={card.id}
						className="absolute bg-white h-[240px] w-[600px] rounded-3xl p-6 shadow-xl border border-neutral-200 shadow-black/[0.1] flex flex-col justify-between font-roboto"
						style={{
							transformOrigin: "top center",
						}}
						animate={{
							top: index * -CARD_OFFSET,
							scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
							zIndex: cards.length - index, //  decrease z-index for the cards that are behind
						}}
					>
						{/* {index === 0 && (
							<svg
								key={card.id}
								className="absolute inset-0 z-20 w-full h-full pointer-events-none"
								viewBox="0 0 600 232" // Matches your card width & height
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<motion.rect
									x="1.5"
									y="1.5"
									width="598" // 600 - (1.5 * 2)
									height="229" // 232 - (1.5 * 2)
									rx="22.5" // Reduce slightly if needed
									stroke="#B05BEF"
									strokeWidth="3"
									initial={{ pathLength: 0 }}
									animate={{ pathLength: 1 }}
									transition={{ duration: 10, ease: "linear" }}
								/>
							</svg>
						)} */}
						<div>
							<p className="text-violet-light-ryzr font-semibold text-4xl">
								{card.heading}
							</p>
							<p className="text-black font-normal text-[32px]">
								{card.subheading}
							</p>
						</div>
						<div className="font-light text-2xl text-[#8A8A8A] text-justify">
							{card.content}
						</div>
					</motion.div>
				);
			})}
		</div>
	);
};
