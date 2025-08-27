import { useController } from "react-hook-form";
import { cn } from "@/lib/utils"; // Assuming `cn` is your utility for combining classNames.

interface FrameworkCardProps {
	name: string;
	value: string;
	control: any;
	fieldName: string;
	error: boolean;
	setFocus: (field: string) => void;
	disabed?: boolean;
}

export const FrameworkCard = ({
	name,
	value,
	control,
	fieldName,
	error,
	setFocus,
	disabed = false,
}: FrameworkCardProps) => {
	const { field } = useController({ name: fieldName, control, rules: {validate: v => v.length > 0 || "Please select atleast one control framework!"} });

	const isSelected = field.value?.some((v: { name: string; value: string }) => v.value === value);

	const toggleSelect = () => {
		const newValue = isSelected
			? field.value.filter((v: { name: string; value: string }) => v.value !== value)
			: [...(field.value || []), { name, value }];
		field.onChange(newValue);
	};

	const handleCardClick = () => {
		if (disabed) return;
		toggleSelect();
		if (error) {
			setFocus(fieldName); // Focus on the field if there's an error
		}
	};

	return (
		<div
			onClick={handleCardClick}
			className={cn(
				"cursor-pointer rounded-sm border p-4 text-white align-middle font-roboto text-center sm:w-full bg-zinc-800 transition-all duration-100 hover:scale-110",
				isSelected
					? "border-violet-ryzr text-violet-ryzr scale-105"
					: "border-zinc-900 text-zinc-400 text-opacity-80",
				disabed && "opacity-50 cursor-not-allowed",
			)}
		>
			{name}
		</div>
	);
};
