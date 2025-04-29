import { useController } from "react-hook-form";
import { cn } from "@/lib/utils"; // Assuming `cn` is your utility for combining classNames.

interface FrameworkCardProps {
	name: string;
	value: string;
	control: any;
	fieldName: string;
	error: boolean;
	setFocus: (field: string) => void;
}

export const FrameworkCard = ({
	name,
	value,
	control,
	fieldName,
	error,
	setFocus,
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
		toggleSelect();
		if (error) {
			setFocus(fieldName); // Focus on the field if there's an error
		}
	};

	return (
		<div
			onClick={handleCardClick}
			className={cn(
				"cursor-pointer rounded-sm border p-4 text-white align-middle font-roboto text-center sm:w-24 bg-zinc-800 transition-all duration-100 hover:scale-110",
				isSelected
					? "border-violet-700 text-violet-400 scale-110"
					: "border-zinc-900 text-zinc-400 text-opacity-80",
				error && "border-red-500" // Highlight the card if there's an error
			)}
		>
			{name}
		</div>
	);
};
