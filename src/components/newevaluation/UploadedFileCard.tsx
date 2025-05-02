import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { FilesUploadResponseDTO } from "@/models/files/FilesUploadResponseDTO";
import { RoundSpinner } from "../ui/spinner";

interface UploadedFileCardProps {
	file: FilesUploadResponseDTO;
	onRemove: () => void;
	isLoading: boolean;
}

const UploadedFileCard: React.FC<UploadedFileCardProps> = ({
	file,
	onRemove,
	isLoading
}) => {
	return (
		<Card className={`mb-4 p-4 flex justify-between items-center bg-zinc-800 text-white rounded-md ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
			<div>
				<p>{file.file_name}</p>
				{/* Request to store file sizes or something to display file sizes can be brute forced but not worth it ATM */}
				{/* <p className="text-sm text-zinc-400">
					{((file.size / 1024)/1024).toFixed(2)} MB
				</p> */}
			</div>
			<Button variant="outline" type="button" size="sm" onClick={onRemove} className={`bg-rose-600 text-white hover:bg-rose-700`} disabled={isLoading}>
				{isLoading ? <RoundSpinner/> : "Remove"}
			</Button>
		</Card>
	);
};

export default UploadedFileCard;
