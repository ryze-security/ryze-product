import React, { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import UploadedFileCard from "./UploadedFileCard";
import { Upload } from "lucide-react";
import fileService from "@/services/fileServices";
import { useToast } from "@/hooks/use-toast";
import { FilesUploadResponseDTO } from "@/models/files/FilesUploadResponseDTO";
import { RoundSpinner } from "../ui/spinner";
import { FilesDataTable } from "./ExistingFilesDataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { useAppSelector } from "@/store/hooks";

interface FileUploadAreaProps {
	control: any;
	name: string;
	columns: ColumnDef<FilesUploadResponseDTO>[];
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
	control,
	name,
	columns,
}) => {
	const { field } = useController({ name, control });
	const [isLoading, setIsLoading] = useState(false);
	const [isFilesLoading, setIsFilesLoading] = useState(false);
	const [existingCompanyFiles, setExistingCompanyFiles] = useState<
		FilesUploadResponseDTO[]
	>([]);
	const [open, setOpen] = useState(false);
	const { toast } = useToast();
	const userData = useAppSelector((state) => state.appUser);

	const fetchCompanyFile = async () => {
		setIsFilesLoading(true);
		try {
			const response = await fileService.getAllCompanyFiles(
				userData.tenant_id,
				control._formValues.auditee.value
			);
			setExistingCompanyFiles(response);
		} catch (error) {
			console.error("Failed to fetch files:", error);
			toast({
				title: "Error fetching files",
				description: "Could not load the files from the server.",
				variant: "destructive",
			});
		} finally {
			setIsFilesLoading(false);
		}
	};

	useEffect(() => {
		fetchCompanyFile();
	}, []);

	// Handle file drops
	const onDrop = async (acceptedFiles: File[]) => {
		setIsLoading(true);

		const uploadedFiles: FilesUploadResponseDTO[] = [];

		for (const file of acceptedFiles) {
			try {
				const response = await fileService.uploadFile(
					userData.tenant_id,
					control._formValues.auditee.value,
					file,
					"SYSTEM"
				);
				uploadedFiles.push(response);
			} catch (error) {
				toast({
					title: "Error uploading file",
					description: `Failed to upload ${file.name}. Please try again.`,
					variant: "destructive",
				});
			}
		}
		await fetchCompanyFile();
		const newFiles = [...existingCompanyFiles, ...uploadedFiles];
		setExistingCompanyFiles(newFiles);
		field.onChange(uploadedFiles); // Update the form value
		closeDialog();

		setIsLoading(false);
	};

	// Handle file remove
	// const handleRemove = async (index: number) => {
	// 	setIsLoading(true);
	// 	const fileToRemove = files[index];

	// 	try {
	// 		await fileService.deleteFile(
	// 			userData.tenant_id,
	// 			"beta321",
	// 			fileToRemove.file_id,
	// 			"SYSTEM"
	// 		);
	// 		const updatedFiles = files.filter((_, i) => i !== index);
	// 		setFiles(updatedFiles);
	// 		field.onChange(updatedFiles); // Update the form value
	// 	} catch (error) {
	// 		console.error("Failed to delete the file:", error);
	// 		toast({
	// 			title: "Deletion failed",
	// 			description: `${fileToRemove.file_name} could not be deleted.`,
	// 			variant: "destructive",
	// 		});
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: {
			"application/pdf": [".pdf"],
			"application/msword": [".doc"],
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
				[".docx"],
			"text/plain": [".txt"],
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
				[".xlsx"],
			"application/vnd.ms-excel": [".xls"],
			"text/csv": [".csv"],
			"application/vnd.openxmlformats-officedocument.presentationml.presentation":
				[".pptx"],
		},
	});

	const showDialog = () => {
		setOpen(true);
	};

	const closeDialog = () => {
		setOpen(false);
	};

	return (
		<div className="flex gap-8 justify-evenly font-roboto">
			{/* Existing Files Datatable */}
			<div className="w-full max-h-fit p-4 rounded-lg scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
				<div className="w-full flex justify-center items-center gap-2">
					<p className="text-lg font-semibold text-center">
						Choose your files for evaluation
					</p>
				</div>
				<FilesDataTable
					columns={columns}
					data={existingCompanyFiles}
					filterKey="file_name"
					control={control}
					name={`${name}`}
					selectId="file_id"
					isLoading={isFilesLoading}
					openDialog={showDialog}
				/>
			</div>

			{/* File Upload area */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Upload a new file</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<div
							{...getRootProps()}
							className={`border-dashed flex flex-col gap-10 justify-center border-2 p-6 text-center rounded-lg mb-4 w-full min-h-fit ${
								isLoading
									? "pointer-events-none opacity-50"
									: ""
							}`}
						>
							<input {...getInputProps()} disabled={isLoading} />
							<div className="mx-auto bg-gray-500 rounded-full p-2 opacity-80">
								<Upload className="w-16 h-16 mx-auto text-white" />
							</div>
							<div>
								<p className="text-xl font-semibold mb-4">
									Drag and drop files here, or click to browse
								</p>
								<p className="text-md opacity-45">
									Support for PDF, DOCX, DOC and TXT files
								</p>
							</div>
							<Button
								variant="outline"
								type="button"
								disabled={isLoading}
							>
								{isLoading ? <RoundSpinner /> : "Browse Files"}
							</Button>
						</div>
					</DialogDescription>
				</DialogContent>
			</Dialog>
			{/* <div
				{...getRootProps()}
				className={`border-dashed flex flex-col gap-10 justify-center border-2 p-6 text-center rounded-lg mb-4 w-[30%] min-h-[calc(100vh-410px)] ${
					isLoading ? "pointer-events-none opacity-50" : ""
				}`}
			>
				<input {...getInputProps()} disabled={isLoading} />
				<div className="mx-auto bg-gray-500 rounded-full p-2 opacity-80">
					<Upload className="w-16 h-16 mx-auto text-white" />
				</div>
				<div>
					<p className="text-xl font-semibold mb-4">
						Drag and drop files here, or click to browse
					</p>
					<p className="text-md opacity-45">
						Support for PDF, DOCX, DOC and TXT files
					</p>
				</div>
				<Button variant="outline" type="button" disabled={isLoading}>
					{isLoading ? <RoundSpinner /> : "Browse Files"}
				</Button>
			</div> */}

			{/* Uploaded files management area */}
			{/* <div className="w-[30%] min-h-[calc(100vh-410px)]">
				{files && files.length > 0 ? (
					<div className="border-2 p-6 rounded-lg min-h-[calc(100vh-410px)] overflow-y-auto">
						{files.map((file, index) => (
							<UploadedFileCard
								key={file.file_id}
								file={file}
								isLoading={isLoading}
								onRemove={() => handleRemove(index)}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-col justify-center border-2 p-6 text-center rounded-lg mb-4 min-h-[calc(100vh-410px)]">
						<p className="text-xl font-semibold mb-4">
							Your uploaded files will appear here...
						</p>
					</div>
				)}
			</div> */}
		</div>
	);
};
