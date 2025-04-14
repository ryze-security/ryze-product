import React from "react";

const AiEngine: React.FC = () => {
	return (
		<div className="w-full max-w-sm mx-auto group p-4">
			<svg
				viewBox="0 0 300 120"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="w-full h-auto"
			>
				{/* Row 1 */}
				<rect
					x="10"
					y="10"
					width="80"
					height="10"
					rx="2"
					className="fill-zinc-500 transition-colors duration-300 group-hover:fill-rose-500 delay-100"
				/>
				<rect
					x="95"
					y="10"
					width="120"
					height="10"
					rx="2"
					className="fill-zinc-500 transition-colors duration-300"
				/>
				<rect
					x="220"
					y="10"
					width="50"
					height="10"
					rx="2"
					className="fill-zinc-500 transition-colors duration-300 group-hover:fill-rose-500 delay-200"
				/>

				{/* Row 2 */}
				<rect
					x="10"
					y="50"
					width="60"
					height="10"
					rx="2"
					className="fill-zinc-500 transition-colors duration-300"
				/>
				<rect
					x="75"
					y="50"
					width="100"
					height="10"
					rx="2"
					className="fill-zinc-500 transition-colors duration-300 group-hover:fill-rose-500 delay-150"
				/>
				<rect
					x="180"
					y="50"
					width="90"
					height="10"
					rx="2"
					className="fill-zinc-500 transition-colors duration-300"
				/>

				{/* Row 3 */}
				<rect
					x="10"
					y="90"
					width="70"
					height="10"
					rx="2"
					className="fill-zinc-500 transition-colors duration-300 group-hover:fill-rose-500 delay-100"
				/>
				<rect
					x="85"
					y="90"
					width="120"
					height="10"
					rx="2"
					className="fill-zinc-500 transition-colors duration-300"
				/>
				<rect
					x="210"
					y="90"
					width="60"
					height="10"
					rx="2"
					className="fill-zinc-500 transition-colors duration-300 group-hover:fill-rose-500 delay-200"
				/>
			</svg>
		</div>
	);
};

export default AiEngine;
