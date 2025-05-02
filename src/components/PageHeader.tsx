import React from "react";
import { Button } from "./ui/button";
import { PlusCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { RoundSpinner } from "./ui/spinner";
import { AlertDialogBox } from "./AlertDialogBox";

interface Props {
	heading: string;
	subtitle: string;
	buttonText: string;
	variant?: string;
	buttonUrl: string;
	isLoading?: boolean;
}

function PageHeader(props: Props) {
	const { heading, subtitle, buttonText, variant, buttonUrl, isLoading } =
		props;

	return (
		<div className="max-w-7xl w-full flex justify-between px-4">
			<div className="flex flex-col gap-2">
				{/* Left: Welcome message */}
				<h1 className="text-4xl font-semibold text-white tracking-wide">
					{heading}
				</h1>

				{/* Subtitle */}
				<p className="text-base text-slate-500">{subtitle}</p>
			</div>
			{variant === "add" ? (<Link to={buttonUrl}>
				<Button
					variant="default"
					disabled={isLoading}
					className={` ${
						variant === "add"
							? "bg-sky-500 hover:bg-sky-600"
							: "bg-zinc-700 hover:bg-zinc-800"
					} rounded-2xl transition-colors text-white font-bold text-md`}
				>
					{variant === "add" ? <PlusCircleIcon /> : ""}
					{isLoading ? <RoundSpinner /> : buttonText}
				</Button>
			</Link>) : (<AlertDialogBox
				trigger={
					<Button
						variant="default"
						disabled={isLoading}
						className={`bg-zinc-700 hover:bg-zinc-800 rounded-2xl transition-colors text-white font-bold text-md`}
					>
						{isLoading ? <RoundSpinner /> : buttonText}
					</Button>
				}
				title="Are You Sure?"
				subheading="Are you sure you want to cancel this operation? Clicking confirm will cause all your unsaved data to be lost."
				actionLabel="Confirm"
				actionHref={buttonUrl}
			/>)}
		</div>
	);
}

export default PageHeader;
