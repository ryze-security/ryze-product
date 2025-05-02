import React from "react";
import { Button } from "./ui/button";
import { PlusCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { RoundSpinner } from "./ui/spinner";

interface Props {
	heading: string;
	subtitle: string;
    buttonText: string;
    variant?: string;
    buttonUrl: string;
	isLoading?: boolean;
}

function PageHeader(props: Props) {
	const { heading, subtitle, buttonText, variant, buttonUrl, isLoading } = props;

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
            <Link to={buttonUrl}>
                <Button
                    variant="default"
					disabled={isLoading}
                    className={` ${variant === "add" ? "bg-sky-500 hover:bg-sky-600" : "bg-zinc-700 hover:bg-zinc-800"} rounded-2xl transition-colors text-white font-bold text-md`}
                >
                    {variant === "add" ? <PlusCircleIcon /> : ""}
                    {isLoading? <RoundSpinner /> : buttonText}
                </Button>
            </Link>
		</div>
	);
}

export default PageHeader;
