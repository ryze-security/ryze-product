import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FileText } from "lucide-react";

export const SummaryStep = ({
	goToStep,
}: {
	goToStep: (step: number) => void;
}) => {
	const { watch, setValue } = useFormContext();

	const auditee = watch("auditee");
	const selectedFrameworks: { name: string; value: string }[] =
		watch("selectedFrameworks") || [];
	const uploadedFiles: File[] = watch("documents") || [];

	const removeFramework = (frameworkValue: string) => {
		setValue(
			"selectedFrameworks",
			selectedFrameworks.filter((f) => f.value !== frameworkValue),
			{ shouldValidate: true }
		);
	};

	const removeFile = (index: number) => {
		const newFiles = [...uploadedFiles];
		newFiles.splice(index, 1);
		setValue("documents", newFiles, { shouldValidate: true });
	};

	return (
		<div className="space-y-6">
			<p className="text-lg font-semibold text-white">
				Review your selections:
			</p>

			<Card className="p-4 bg-black text-white">
				<div className="flex justify-start gap-4 mb-6">
					<h3 className="text-md font-semibold my-auto">Auditee.</h3>
					<Button
						size="sm"
						className="bg-zinc-700 px-5 rounded-lg hover:bg-zinc-800 text-white"
						onClick={() => goToStep(0)}
					>
						{auditee.label}
					</Button>
				</div>

				{/* Frameworks Summary */}
				<div className="flex justify-between items-center mb-2">
					<h3 className="text-md font-semibold">
						Selected Control References
					</h3>
				</div>
				{selectedFrameworks.length === 0 ? (
					<p className="text-white">No frameworks selected.</p>
				) : (
					<div className="flex flex-wrap gap-2 mb-6">
						{selectedFrameworks.map((framework) => (
							<div
								key={framework.value}
								className="flex items-center gap-2 bg-zinc-700 px-3 py-1 rounded-full"
							>
								<span>{framework.name}</span>
								<Trash2
									className="w-4 h-4 cursor-pointer text-red-400"
									onClick={() =>
										removeFramework(framework.value)
									}
								/>
							</div>
						))}
						<Button
							size="sm"
							className=" bg-zinc-700 px-3 py-1 rounded-full text-white hover:bg-zinc-800"
							onClick={() => goToStep(0)}
						>
							Edit
						</Button>
					</div>
				)}

				{/* Uploaded Files Summary */}
				<div className="flex justify-between items-center mb-2">
					<h3 className="text-md font-semibold">Uploaded Files</h3>
					<Button size="sm" type="button" onClick={() => goToStep(1)}>
						Edit
					</Button>
				</div>
				{uploadedFiles.length === 0 ? (
					<p className="text-slate-400">No files uploaded.</p>
				) : (
					<div className="space-y-2">
						{uploadedFiles.map((file, index) => (
							<div
								key={file.name}
								className="flex justify-between items-center bg-zinc-700 px-4 py-2 rounded-md"
							>
								<div className="flex items-center gap-2">
									<FileText className="w-5 h-5 text-slate-300" />
									<div>
										<p className="text-sm">{file.name}</p>
										<p className="text-xs text-slate-400">
											{(file.size / 1024 / 1024).toFixed(
												2
											)}{" "}
											MB
										</p>
									</div>
								</div>
								<Trash2
									className="w-4 h-4 cursor-pointer text-red-400"
									onClick={() => removeFile(index)}
								/>
							</div>
						))}
					</div>
				)}
			</Card>
		</div>
	);
};
