import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, EditIcon } from "lucide-react";
import { FilesUploadResponseDTO } from "@/models/files/FilesUploadResponseDTO";

export const SummaryStep = ({
	goToStep,
}: {
	goToStep: (step: number) => void;
}) => {
	const { watch, setValue } = useFormContext();

	const auditee = watch("auditee");
	const selectedFrameworks: { name: string; value: string }[] =
		watch("selectedFrameworks") || [];
	const uploadedFiles: FilesUploadResponseDTO[] = watch("documents") || [];

	return (
		<div className="space-y-6">
			<p className="text-lg font-semibold text-white">
				Review your selections:
			</p>

			<Card className="p-4 bg-black text-white border-none">
				<div className="flex justify-start gap-4 mb-6">
					<h3 className="text-lg font-semibold my-auto text-zinc-600">
						Auditee.
					</h3>
					<Button
						size="sm"
						type="button"
						className="bg-zinc-800 px-5 rounded-sm hover:bg-zinc-900 text-white"
						onClick={() => goToStep(0)}
					>
						{auditee.label}
					</Button>
				</div>

				{/* Frameworks Summary */}
				<div className="flex justify-start items-center mb-6 gap-4">
					<h3 className="text-lg font-semibold text-zinc-600 my-auto">
						Control References.
					</h3>
					{selectedFrameworks.length === 0 ? (
						<p className="text-white">No frameworks selected.</p>
					) : (
						<div className="flex flex-wrap gap-2">
							{selectedFrameworks.map((framework) => (
								<div
									key={framework.value}
									className="flex items-center gap-2 bg-zinc-800 px-3 py-1 rounded-sm"
								>
									<span>{framework.name}</span>
								</div>
							))}
							<Button
								size="sm"
								type="button"
								className=" bg-zinc-800 px-3 py-1 rounded-sm text-white hover:bg-zinc-900"
								onClick={() => goToStep(0)}
							>
								<EditIcon />
								Edit
							</Button>
						</div>
					)}
				</div>

				{/* Uploaded Files Summary */}
				<div className="flex justify-start items-center mb-2 gap-4">
					<h3 className="text-lg font-semibold text-zinc-600 my-auto">
						Documents Uploaded.
					</h3>
					{uploadedFiles.length === 0 ? (
						<p className="text-slate-400">No files selected.</p>
					) : (
						<div className="flex flex-wrap gap-2">
							{uploadedFiles.map((file, index) => (
								<div
									key={file.file_id}
									className="flex items-center gap-2 bg-zinc-800 px-3 py-1 rounded-sm"
								>
									<span>{file.file_name}</span>
								</div>
							))}
							<Button
								size="sm"
								type="button"
								className=" bg-zinc-800 px-3 py-1 rounded-sm text-white hover:bg-zinc-900"
								onClick={() => goToStep(1)}
							>
								<EditIcon />
								Edit
							</Button>
						</div>
					)}
				</div>
			</Card>
		</div>
	);
};
