import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	CheckSquare,
	List,
	ListCheckIcon,
	LucideScatterChart,
	MoveRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import AbstractCheckList from "./AbstractCheckList";
import AiEngine from "./AiEngine";
import ReportFlow from "./ReportFlow";

function FeaturesSection() {
	const steps = [
		{
			icon: <List className="text-sky-400 w-12 h-12" />,
			title: "Specify controls.",
			desc: "Define your own custom framework or choose from leading standards and frameworks like ISO 27001, NIST CSF and more.",
            link: "/features/specify-controls",
            svg: <AbstractCheckList />
		},
		{
			icon: <CheckSquare className="text-sky-400 w-12 h-12" />,
			title: "Identify gaps.",
			desc: "Use AI to analyze security policies, SOC Type 2 reports, SIG questionnaires, etc. for compliance gaps - speeding up audits, and saving time.",
            link: "/features/identify-gaps",
            svg: <AiEngine />
		},
		{
			icon: <LucideScatterChart className="text-sky-400 w-12 h-12" />,
			title: "Generate reports.",
			desc: "Generate risk reports with MITRE ATT&CK-aligned insights and tailored remediation plans and roadmaps for management’s decision making.",
            link: "/features/generate-reports",
            svg: <ReportFlow />
		},
	];

	return (
		<section className="w-auto py-20 bg-zinc-900 text-white px-6 md:px-12 font-roboto rounded-lg">
			<div className="max-w-7xl mx-auto">
				<h3 className="text-3xl font-bold text-left mb-6">
					Review compliance
				</h3>
				<h2 className="text-6xl font-bold text-left mb-12">
					faster. smarter.
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{steps.map((step, index) => (
						<Card
							key={index}
							className="bg-black border border-zinc-700 shadow-xl hover:scale-[1.02] transition-transform hover:shadow-sm hover:shadow-violet-400 duration-150 group"
						>
							<CardHeader className="flex flex-col space-y-3">
								{step.icon}
								<CardTitle className="text-2xl text-left">
									<span className="text-zinc-400">
										{step.title.split(" ")[0]}{" "}
									</span>
									<br />
									<span className="text-white">
										{step.title
											.split(" ")
											.slice(1)
											.join(" ")}
									</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="text-md text-zinc-300 text-left space-y-2">
								<p>{step.desc}</p>
								<Link
									to={step.link}
									className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-600 transition-colors duration-150 group hover:underline"
								>
									Learn more <MoveRight className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" />
								</Link>
							</CardContent>
                            {step.svg}
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

export default FeaturesSection;
