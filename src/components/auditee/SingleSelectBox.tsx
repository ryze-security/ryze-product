import { Controller, Control, useFormContext } from "react-hook-form";
import React, { useEffect } from "react";
import { toast } from "@/components/ui/use-toast"; // adjust path based on your setup
import { cn } from "@/lib/utils";

type Option = {
	label: string;
	value: string;
};

type SingleSelectBoxProps = {
	name: string;
	control: Control<any>;
	options: Option[];
	label?: string;
	defaultValue?: string;
};

const SingleSelectBox: React.FC<SingleSelectBoxProps> = ({
	name,
	control,
	options,
	label,
	defaultValue,
}) => {
	const {
		formState: { errors, touchedFields, isSubmitted },
		setValue,
		clearErrors,
	} = useFormContext();

	useEffect(() => {
		if (defaultValue) {
			setValue(name, defaultValue, { shouldValidate: true });
		}
	}, [defaultValue, setValue, name]);

	return (
		<div className="space-y-2">
			{label && (
				<label
					className="text-lg font-roboto"
				>
					{label}
				</label>
			)}
			<Controller
				name={name}
				control={control}
				rules={{ required: "Please select one of the options." }}
				render={({ field }) => (
					<div className="flex gap-3 flex-wrap">
						{options.map((option) => {
							const isSelected = field.value === option.value;
							return (
								<button
									type="button"
									key={option.value}
									className={`rounded-full min-w-32 px-4 py-2 text-sm border transition 
                    ${
						isSelected
							? "bg-violet-600 text-white border-violet-700 ring-2 ring-violet-500"
							: "bg-zinc-800 text-zinc-200 border-zinc-600 hover:bg-zinc-700"
					}`}
									onClick={() => {
										field.onChange(option.value);
										clearErrors(name);
									}}
								>
									{option.label}
								</button>
							);
						})}
					</div>
				)}
			/>
			{errors[name] && (touchedFields[name] || isSubmitted) && (
				<p className="text-sm text-rose-500">
					Please select one of the options.
				</p>
			)}
		</div>
	);
};

export default SingleSelectBox;
