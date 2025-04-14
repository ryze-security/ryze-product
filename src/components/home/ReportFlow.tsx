import React from "react";

const ReportFlow: React.FC = () => {
	return (
		<div className="w-full max-w-sm mx-auto group">
			<svg
				viewBox="0 0 320 150"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="w-full h-auto"
			>
				{/* Chart bars */}
				<rect
					x="20"
					y="90"
					width="10"
					height="40"
					fill="#444"
					className="group-hover:scale-y-125 origin-bottom transition-transform duration-500"
				/>
				<rect
					x="40"
					y="70"
					width="10"
					height="60"
					fill="#666"
					className="group-hover:scale-y-125 origin-bottom transition-transform duration-500 delay-100"
				/>
				<rect
					x="60"
					y="60"
					width="10"
					height="70"
					fill="#888"
					className="group-hover:scale-y-125 origin-bottom transition-transform duration-500 delay-200"
				/>

				{/* Arrow to document */}
				<path
					d="M75 90 H130"
					stroke="#999"
					strokeWidth="2"
					markerEnd="url(#arrowhead)"
					className="group-hover:stroke-white transition-colors duration-300"
				/>

				{/* Document */}
				<rect
					x="140"
					y="50"
					width="60"
					height="80"
					rx="6"
					fill="#1f1f1f"
					stroke="#555"
					strokeWidth="1"
					className="group-hover:stroke-sky-400 transition-all duration-300"
				/>
				{/* Lines on document */}
				<rect x="150" y="60" width="40" height="6" fill="#444" />
				<rect x="150" y="72" width="30" height="6" fill="#444" />
				<rect x="150" y="84" width="35" height="6" fill="#444" />
				<rect x="150" y="96" width="20" height="6" fill="#444" />

				{/* Arrow to checkmark */}
				<path
					d="M205 90 H260"
					stroke="#999"
					strokeWidth="2"
					markerEnd="url(#arrowhead)"
					className="group-hover:stroke-white transition-colors duration-300 delay-200"
				/>

				<g
					style={{
						transformOrigin: "275px 90px",
						transformBox: "fill-box",
					}}
					className="transition-transform duration-300 delay-300"
				>
					<circle cx="280" cy="90" r="15" className="fill-red group-hover:fill-green-400 duration-300 delay-300" />
					<path
						d="M272 90 l5 5 l10 -10"
						stroke="white"
						strokeWidth="2"
						fill="none"
						className="opacity-70 group-hover:opacity-100 transition-opacity duration-300 delay-400"
					/>
				</g>

				{/* Arrowhead definition */}
				<defs>
					<marker
						id="arrowhead"
						markerWidth="6"
						markerHeight="6"
						refX="5"
						refY="3"
						orient="auto"
					>
						<path d="M0,0 L6,3 L0,6" className="fill-gray-400" />
					</marker>
				</defs>
			</svg>
		</div>
	);
};

export default ReportFlow;
