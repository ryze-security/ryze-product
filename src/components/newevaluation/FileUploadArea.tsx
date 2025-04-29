import React, { useState } from "react";
import { useController } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import UploadedFileCard from "./UploadedFileCard";
import { Card } from "../ui/card";
import { Upload } from "lucide-react";

interface FileUploadAreaProps {
	control: any;
	name: string;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
	control,
	name,
}) => {
	const { field } = useController({ name, control });
	const [files, setFiles] = useState<File[]>(field.value || []);

	// Handle file drops
	const onDrop = (acceptedFiles: File[]) => {
		const newFiles = [...files, ...acceptedFiles];
		setFiles(newFiles);
		field.onChange(newFiles); // Update the form value
	};

	// Handle file remove
	const handleRemove = (index: number) => {
		const updatedFiles = files.filter((_, i) => i !== index);
		setFiles(updatedFiles);
		field.onChange(updatedFiles); // Update the form value
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: {
			"application/pdf": [".pdf"],
			"application/msword": [".doc"],
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
				[".docx"],
			"text/plain": [".txt"],
		},
	});

	return (
		<div className="flex gap-8 justify-evenly">
			<div
				{...getRootProps()}
				className="border-dashed flex flex-col gap-10 justify-center border-2 p-6 text-center rounded-lg mb-4 w-[45%] min-h-[calc(100vh-410px)]"
			>
				<input {...getInputProps()} />
				<div className="mx-auto bg-gray-500 rounded-full p-2 opacity-80">
					<Upload className="w-20 h-20 mx-auto text-white" />
				</div>
				<div>
					<p className="text-xl font-semibold mb-4">Drag and drop files here, or click to browse</p>
					<p className="text-md opacity-45">Support for PDF, DOCX, DOC and TXT files</p>
				</div>
				<Button variant="outline" type="button">Browse Files</Button>
			</div>

			<div className="w-[45%] min-h-[calc(100vh-410px)]">
				{files && files.length > 0 ? (
					<div className="border-2 p-6 rounded-lg min-h-[calc(100vh-410px)] overflow-y-auto">
						{files.map((file, index) => (
							<UploadedFileCard
								key={file.name}
								file={file}
								onRemove={() => handleRemove(index)}
							/>
						))}
					</div>
				) : (
					<div
						className="flex flex-col justify-center border-2 p-6 text-center rounded-lg mb-4 min-h-[calc(100vh-410px)]"
					>
						<p className="text-xl font-semibold mb-4">Your uploaded files will appear here...</p>
					</div>
				)}
			</div>
		</div>
	);
};
