import React from "react";

interface Props {
	progress: number;
	label?: string;
	size?: number;
	strokeWidth?: number;
	trackColor?: string;
}

const getProgressColor = (progress: number) => {
  if (progress >= 75) return "#71AE57";
  if (progress >= 50) return "#FFB266";
  return "#FF6666";
};

function ProgressCircle(props: Props) {
	const {
		progress = 0,
		label = "Compliance",
		size = 192,
		strokeWidth = 12,
		trackColor = "#404040",
	} = props;

  const progressColor = getProgressColor(progress);

	// Ensure progress is within the 0-100 range
	const clampedProgress = Math.max(0, Math.min(100, progress));

	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (clampedProgress / 100) * circumference;

	return (
		<div
			className="relative flex items-center justify-center my-auto"
			style={{ height: size, width: size }}
		>
			{/* SVG for drawing the circles */}
			<svg
				className="h-full w-full transform -rotate-90"
				viewBox={`0 0 ${size} ${size}`}
			>
				{/* Background circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke={trackColor}
					strokeWidth={strokeWidth}
				/>
				{/* Progress circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke={progressColor}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
				/>
			</svg>

			{/* Text in the center */}
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span className="text-3xl font-bold" style={{ color: progressColor }}>{`${Math.round(
					clampedProgress
				)}%`}</span>
				<span className="text-base text-gray-300">{label}</span>
			</div>
		</div>
	);
}

export default ProgressCircle;
