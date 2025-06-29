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
		}, 5000);
	};

	return (
		<div className="relative w-[90vw] lg:max-w-[400px] xl:max-w-[600px] h-[24vh] min-h-[155px]
		max-h-[170px] md:min-h-[220px] lg:min-h-[260px] xl:min-h-[250px]">
			{cards.map((card, index) => {
				return (
					<motion.div
						key={card.id}
						className="absolute bg-white h-full w-full rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl border border-neutral-200 shadow-black/[0.1] flex flex-col justify-between font-roboto"
						style={{
							transformOrigin: "top center",
						}}
						animate={{
							top: index * -CARD_OFFSET,
							scale: 1 - index * SCALE_FACTOR,
							zIndex: cards.length - index,
						}}
					>
						<div>
							<p className="text-violet-light-ryzr font-semibold mb-[1vh] md:mb-[2.5vh] xl:mb-[2.8vh] text-xl md:text-3xl lg:text-4xl">
								{card.heading}
							</p>
							<p className="text-black font-normal text-lg md:text-2xl lg:text-3xl xl:text-[32px]">
								{card.subheading}
							</p>
						</div>
						<div className="font-light text-sm md:text-lg lg:text-xl xl:text-2xl text-[#999999] text-justify">
							{card.content}
						</div>
					</motion.div>
				);
			})}
		</div>
	);
};
