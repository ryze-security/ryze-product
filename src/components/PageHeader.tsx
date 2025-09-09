import React from "react";
import { Button } from "./ui/button";
import { Divide, PlusCircleIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { RoundSpinner } from "./ui/spinner";
import { AlertDialogBox } from "./AlertDialogBox";

interface Props {
	heading: string | React.ReactNode;
	subtitle: string;
	isClickable?: boolean;
	buttonText?: string;
	variant?: string;
	buttonUrl?: string;
	isLoading?: boolean;
	actionFn?: () => void;
	children?: React.ReactNode;
}

function PageHeader(props: Props) {
	const {
		heading,
		subtitle,
		buttonText,
		variant,
		buttonUrl,
		actionFn,
		isLoading = false,
		isClickable = true,
		children,
	} = props;

	const navigate = useNavigate();

	return (
		<div className="max-w-7xl w-full flex flex-col lg:flex-row lg:items-center md:justify-between gap-4 lg:px-4 mt-5 lg:mt-0">
			<div className="flex flex-col gap-2 w-full lg:w-8/12">
				{/* Left: Welcome message */}
				<h1 className="text-4xl font-semibold text-white tracking-wide">
					{heading}
				</h1>

				{/* Subtitle */}
				<p className="text-base text-zinc-500">{subtitle}</p>
			</div>
			{isClickable ? (
				variant === "add" ? (
					<div className="flex items-center gap-2">
						<Button
							variant="default"
							disabled={isLoading}
							className={` ${
								variant === "add"
									? "bg-sky-500 hover:bg-sky-600"
									: "bg-zinc-700 hover:bg-zinc-800"
							} rounded-2xl transition-colors text-white font-bold text-md w-fit`}
							onClick={() => {
								if (actionFn) {
									actionFn();
								} else if (buttonUrl) {
									navigate(buttonUrl);
								}
							}}
						>
							{<PlusCircleIcon />}
							{isLoading ? <RoundSpinner /> : buttonText}
						</Button>
						{children && children}
					</div>
				) : (
					<AlertDialogBox
						trigger={
							<Button
								variant="default"
								disabled={isLoading}
								className={`bg-zinc-700 hover:bg-zinc-800 rounded-2xl transition-colors text-white font-bold text-md w-fit`}
							>
								{isLoading ? <RoundSpinner /> : buttonText}
							</Button>
						}
						title="Are You Sure?"
						subheading="Are you sure you want to cancel this operation? Clicking confirm will cause all your unsaved data to be lost."
						actionLabel="Confirm"
						actionHref={buttonUrl}
						confirmButtonClassName="bg-rose-600 hover:bg-rose-700 focus:ring-rose-600"
					/>
				)
			) : (
				<></>
			)}
		</div>
	);
}

export default PageHeader;
