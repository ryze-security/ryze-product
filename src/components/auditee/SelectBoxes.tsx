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
			{label && <label className="text-lg font-roboto">{label}</label>}
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
							? "bg-violet-ryzr text-white border-violet-ryzr/70 ring-2 ring-violet-ryzr/90"
							: "bg-gray-ryzr text-zinc-200 border-gray-ryzr/70 hover:bg-gray-ryzr/90"
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

type MultiSelectBoxProps = {
	name: string;
	control: Control<any>;
	options: Option[];
	label?: string;
	defaultValue?: string[];
};

const MultiSelectBox: React.FC<MultiSelectBoxProps> = ({
	name,
	control,
	options,
	label,
	defaultValue = [],
}) => {
	const {
		formState: { errors, touchedFields, isSubmitted, isValid },
		setValue,
		clearErrors,
		getValues,
	} = useFormContext();

	useEffect(() => {
		if (defaultValue.length > 0) {
			setValue(name, defaultValue, { shouldValidate: true });
		}
	}, [defaultValue, setValue, name]);

	return (
		<div className="space-y-4">
			{label && <label className="text-lg font-roboto">{label}</label>}
			<Controller
				name={name}
				control={control}
				rules={{ required: "Please select at least one option." }}
				render={({ field }) => (
					<div className="flex gap-3 flex-wrap">
						{options.map((option) => {
							const selectedValues = field.value || [];
							const isSelected = selectedValues.includes(
								option.value
							);

							return (
								<button
									type="button"
									key={option.value}
									className={`rounded-full min-w-32 px-4 py-2 text-sm border transition 
                    ${
						isSelected
							? "bg-violet-ryzr text-white border-violet-ryzr/70 ring-2 ring-violet-ryzr/90"
							: "bg-gray-ryzr text-zinc-200 border-gray-ryzr/70 hover:bg-gray-ryzr/90"
					}`}
									onClick={() => {
										const currentValues =
											getValues(name) || [];
										let updatedValues: string[];

										if (option.value === "none") {
											// If 'none' is clicked, it's either the only selection or it's removed.
											updatedValues = isSelected
												? []
												: ["none"];
										} else {
											// For any other option, first remove 'none' if it's present.
											const valuesWithoutNone =
												currentValues.filter(
													(value) => value !== "none"
												);
											const isCurrentlySelected =
												valuesWithoutNone.includes(
													option.value
												);

											if (isCurrentlySelected) {
												// If the option is already selected, remove it.
												updatedValues =
													valuesWithoutNone.filter(
														(value) =>
															value !==
															option.value
													);
											} else {
												// Otherwise, add it.
												updatedValues = [
													...valuesWithoutNone,
													option.value,
												];
											}
										}

										field.onChange(updatedValues);
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
			{errors[name] && (touchedFields[name] || isSubmitted || !isValid) && (
				<p className="text-sm text-rose-500">
					Please select at least one option.
				</p>
			)}
		</div>
	);
};

export { SingleSelectBox, MultiSelectBox };
