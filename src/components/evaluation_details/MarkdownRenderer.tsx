import { marked } from "marked";
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../ui/hover-card";

interface Props {
	content: string;
	truncateAt?: number;
	emptyState?: React.ReactNode;
}

function MarkdownRenderer(props: Props) {
	const { content, truncateAt, emptyState = null } = props;

	const [html, setHtml] = useState({ full: "", truncated: "" });
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const processMarkdown = async () => {
			if (!content) {
				setIsLoading(false);
				return;
			}

			setIsLoading(true);

			// Always generate the full HTML
			const dirtyFull = await marked.parse(content);
			let cleanFull = DOMPurify.sanitize(dirtyFull);
			let cleanTruncated = "";

			// Generate truncated HTML only if truncation is enabled
			if (truncateAt) {
				const truncatedText = content
					.split(" ")
					.slice(0, truncateAt)
					.join(" ");
				const dirtyTruncated = await marked.parse(truncatedText);
				cleanTruncated = DOMPurify.sanitize(dirtyTruncated);
			}

			setHtml({ full: cleanFull, truncated: cleanTruncated });
			setIsLoading(false);
		};

		processMarkdown();
	}, [content, truncateAt]);

	if (isLoading) {
		return <span className="text-wrap w-20">Processing...</span>;
	}

	if (!content) {
		return <span className="text-wrap w-20">{emptyState}</span>;
	}

	const needsTruncation =
		truncateAt && content.split(" ").length > truncateAt;

	if (needsTruncation) {
		return (
			<HoverCard>
				<HoverCardTrigger className="text-left [&_strong]:text-extrabold">
					<span
						dangerouslySetInnerHTML={{ __html: html.truncated }}
					/>
					{"..."}
				</HoverCardTrigger>
				<HoverCardContent className="bg-gray-ryzr [&_strong]:font-extrabold">
					<span
						className="w-20"
						dangerouslySetInnerHTML={{ __html: html.full }}
					/>
				</HoverCardContent>
			</HoverCard>
		);
	}

	// Otherwise, render the full content directly
	return (
		<span
			className="w-20 [&_strong]:font-extrabold"
			dangerouslySetInnerHTML={{ __html: html.full }}
		/>
	);
}

export default MarkdownRenderer;
