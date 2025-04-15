import React from "react";

const AbstractCheckList: React.FC = () => {
	return (
		<div className="w-full max-w-sm mx-auto group">
			<svg
				viewBox="0 0 300 150"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="w-full h-auto"
			>
				{/* Row 1 */}
				<rect x="20" y="20" width="20" height="20" rx="3" fill="#333" />
				<rect x="50" y="20" width="200" height="20" rx="10" className="fill-zinc-500" />

				{/* Row 2 */}
				<rect x="20" y="60" width="20" height="20" rx="3" fill="#333" className="transition-colors duration-300 group-hover:fill-slate-800" />
				<path
					d="M23 70 l4 4 l9 -9"
					stroke="#10b981"
					strokeWidth="2"
					fill="none"
					className="opacity-0 group-hover:opacity-100 transition-opacity delay-200 duration-300"
				/>
				<rect x="50" y="60" width="200" height="20" rx="10" className="fill-zinc-500" />

				{/* Row 3 */}
				<rect x="20" y="100" width="20" height="20" rx="3" fill="#333" className="transition-colors duration-300 group-hover:fill-slate-800" />
				<path
					d="M23 110 l4 4 l9 -9"
					stroke="#10b981"
					strokeWidth="2"
					fill="none"
					className="opacity-0 group-hover:opacity-100 transition-opacity delay-400 duration-300"
				/>
				<rect x="50" y="100" width="200" height="20" rx="10" className="fill-zinc-500" />
			</svg>
		</div>
	);
};

export default AbstractCheckList;
