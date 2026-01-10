import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { MaturityLevel } from "@/models/selfAssessment/selfAssessmentDTOs";

interface MaturityRubricProps {
	definitions: MaturityLevel[];
	selectedValue?: number; // Level (1-5)
	onChange: (level: number) => void;
	disabled?: boolean;
}

export function MaturityRubric({
	definitions,
	selectedValue,
	onChange,
	disabled,
}: MaturityRubricProps) {
	return (
		<RadioGroup
			value={selectedValue?.toString()}
			onValueChange={(val) => onChange(parseInt(val))}
			className="space-y-3"
			disabled={disabled}
		>
			{definitions.map((def) => {
				const isSelected = selectedValue === def.level;

				return (
					<div key={def.level}>
						<RadioGroupItem
							value={def.level.toString()}
							id={`level-${def.level}`}
							className="peer sr-only" // Hide default circle
						/>
						<Label
							htmlFor={`level-${def.level}`}
							className={cn(
								"flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-violet-ryzr/40",
								isSelected
									? "border-violet-ryzr bg-violet-ryzr/70 ring-1 ring-violet-ryzr"
									: "bg-transparent border-violet-ryzr"
							)}
						>
							{/* Level Badge */}
							<div
								className={cn(
									"flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border",
									isSelected
										? "bg-violet-ryzr text-white border-violet-ryzr"
										: "bg-violet-ryzr/20 text-primary border-violet-ryzr"
								)}
							>
								{def.level}
							</div>

							{/* Content */}
							<div className="flex-1 space-y-1">
								<p className="text-sm text-primary font-normal leading-relaxed">
									{def.description}
								</p>
							</div>
						</Label>
					</div>
				);
			})}
		</RadioGroup>
	);
}
