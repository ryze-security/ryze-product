import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

interface Props {
	text: string;
	className?: string;
}

function TruncatedTooltip(props: Props) {
	const { text, className } = props;
	const [isTruncated, setIsTruncated] = useState<boolean>(false);
	const textRef = useRef<HTMLParagraphElement>(null);

	const checkTruncation = useCallback(() => {
		if (textRef.current) {
			setIsTruncated(
				textRef.current.scrollWidth > textRef.current.clientWidth
			);
		}
	}, []);

	useEffect(() => {
		const element = textRef.current;
		if (!element) return;

		const handleResize = () => {
			checkTruncation();
		};

		// Also check truncation initially
		checkTruncation();

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [text, checkTruncation]);

	const textElement = (
		<p ref={textRef} className={`truncate ${className}`}>
			{text}
		</p>
	);

	return (
		<TooltipProvider>
			{isTruncated ? (
				<Tooltip>
					<TooltipTrigger asChild>{textElement}</TooltipTrigger>
					<TooltipContent>
						<p>{text}</p>
					</TooltipContent>
				</Tooltip>
			) : (
				textElement
			)}
		</TooltipProvider>
	);
}

export default TruncatedTooltip;
