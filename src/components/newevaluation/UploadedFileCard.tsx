import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

interface UploadedFileCardProps {
	file: File;
	onRemove: () => void;
}

const UploadedFileCard: React.FC<UploadedFileCardProps> = ({
	file,
	onRemove,
}) => {
	return (
		<Card className="mb-4 p-4 flex justify-between items-center bg-slate-800 text-white rounded-md">
			<div>
				<p>{file.name}</p>
				<p className="text-sm text-slate-400">
					{((file.size / 1024)/1024).toFixed(2)} MB
				</p>
			</div>
			<Button variant="outline" size="sm" onClick={onRemove} className="bg-rose-600 text-white hover:bg-rose-700">
				Remove
			</Button>
		</Card>
	);
};

export default UploadedFileCard;
