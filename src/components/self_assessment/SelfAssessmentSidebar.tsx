import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";
import { DomainQuestion } from "@/models/selfAssessment/selfAssessmentDTOs";

interface AssessmentSidebarProps {
	domains: DomainQuestion[];
	answers: Record<number, number>;
	currentIndex: number;
	onNavigate: (index: number) => void;
}

export function AssessmentSidebar({
	domains,
	answers,
	currentIndex,
	onNavigate,
}: AssessmentSidebarProps) {
	// Calculate completion percentage
	const answeredCount = Object.keys(answers).length;
	const totalCount = domains.length;
	const progress = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

	return (
		<div className="w-full h-full flex flex-col bg-transparent">
			{/* Header & Progress */}
			<div className="p-6 border-b border-white/5 bg-transparent">
				<h2 className="text-lg font-semibold mb-2">Your Progress</h2>
				<div className="flex items-center justify-between text-sm text-gray-300 mb-2">
					<span>
						{answeredCount} of {totalCount} answered
					</span>
					<span>{Math.round(progress)}%</span>
				</div>
				<Progress value={progress} className="h-2" indicatorColor="bg-violet-ryzr" />
			</div>

			{/* Scrollable Domain List */}
			<ScrollArea className="flex-1">
				<div className="p-4 space-y-1">
					{domains.map((domain, index) => {
						const isAnswered = answers[domain.id] !== undefined;
						const isActive = index === currentIndex;

						return (
							<button
								key={domain.id}
								onClick={() => onNavigate(index)}
								className={cn(
									"w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors text-left",
									isActive
										? "bg-primary/10 text-primary border border-primary/20"
										: "hover:bg-gray-100 text-gray-400 hover:text-black",
									!isActive && isAnswered && "text-gray-200"
								)}
							>
								{/* Icon Status */}
								<div className="shrink-0">
									{isAnswered ? (
										<CheckCircle2 className="w-5 h-5 text-green-500" />
									) : isActive ? (
										<div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
											<div className="w-2 h-2 rounded-full bg-primary" />
										</div>
									) : (
										<Circle className="w-5 h-5 text-gray-300" />
									)}
								</div>

								{/* Domain Name */}
								<span className="line-clamp-1">
									{domain.name}
								</span>
							</button>
						);
					})}
				</div>
			</ScrollArea>
		</div>
	);
}
