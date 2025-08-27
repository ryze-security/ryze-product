import React from "react";

interface Props {
	children: React.ReactNode;
	variant?: "border" | "inline";
	className?: string;
}

function ComingSoonBorder(props: Props) {
	const { children, className, variant = "border" } = props;

	if (variant === "inline") {
		return (
			<div className={`flex items-center gap-2 ${className}`}>
				{/* The content passed to the component */}
				<div>{children}</div>

				{/* The "Soon" label */}
				<span className="inline-block rounded-full bg-violet-light-ryzr px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
					Soon
				</span>
			</div>
		);
	}

	return (
		<div
			className={`relative rounded-xl border border-violet-ryzr p-1 ${className}`}
		>
			{/* The "Soon" label */}
			<span className="absolute -top-3 right-4 inline-block rounded-full bg-violet-light-ryzr px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white z-50">
				Soon
			</span>

			{/* The content passed to the component */}
			<div className="">{children}</div>
		</div>
	);
}

export default ComingSoonBorder;
