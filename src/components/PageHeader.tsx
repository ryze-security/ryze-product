import React from "react";
import { Button } from "./ui/button";
import { PlusCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
	heading: string;
	subtitle: string;
    buttonText: string;
    variant?: string;
    buttonUrl: string;
}

function PageHeader(props: Props) {
	const { heading, subtitle, buttonText, variant, buttonUrl } = props;

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
                    className="bg-sky-500 rounded-2xl hover:bg-sky-600 text-white font-bold text-md"
                >
                    {variant === "add" ? <PlusCircleIcon /> : ""}
                    {buttonText}
                </Button>
            </Link>
		</div>
	);
}

export default PageHeader;
