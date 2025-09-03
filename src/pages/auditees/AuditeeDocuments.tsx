import { AlertDialogBox } from "@/components/AlertDialogBox";
import { GenericDataTable } from "@/components/GenericDataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoundSpinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { CompanyListDto } from "@/models/company/companyDTOs";
import { FilesUploadResponseDTO } from "@/models/files/FilesUploadResponseDTO";
import companyService from "@/services/companyServices";
import fileService from "@/services/fileServices";
import { useAppSelector } from "@/store/hooks";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";

function AuditeeDocuments() {
	const userData = useAppSelector((state) => state.appUser);
	const { toast } = useToast();
	const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
	const { auditeeId } = useParams();
	const [files, setFiles] = useState<FilesUploadResponseDTO[]>([]);
	const [isFilesLoading, setIsFilesLoading] = useState<boolean>(true);
	const [isAuditeeLoading, setIsAuditeeLoading] = useState<boolean>(true);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [uploadOpen, setUploadOpen] = useState<boolean>(false);
	const [auditeeName, setAuditeeName] = useState<string>("");
	const navigate = useNavigate();
	const isLoading = isFilesLoading || isAuditeeLoading || isUploading;

	// Handle file drops
	const onDrop = async (acceptedFiles: File[]) => {
		setIsUploading(true);
		for (const file of acceptedFiles) {
			try {
				const response = await fileService.uploadFile(
					userData.tenant_id,
					auditeeId,
					file,
					userData.user_id || "SYSTEM"
				);
			} catch (error) {
				toast({
					title: "Error uploading file",
					description: `Failed to upload ${file.name}. Please try again.`,
					variant: "destructive",
				});
			}
		}

		setRefreshTrigger((prev) => prev + 1);
		toast({
			title: "Files Uploaded",
			description: "Your files have been uploaded successfully.",
			variant: "default",
			className: "bg-green-ryzr text-white",
		});
		setUploadOpen(false);
		setIsUploading(false);
	};
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

	const columns: ColumnDef<FilesUploadResponseDTO>[] = [
		{
			accessorKey: "sNo",
			header: "SNo.",
		},
		{
			accessorKey: "file_name",
			header: "File Name",
		},
		{
			accessorKey: "created_by",
			header: "Created By",
		},
		{
			accessorKey: "created_on",
			header: "Created On",
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const file = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger
							asChild
							onClick={(e) => e.stopPropagation()}
						>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontalIcon />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							onClick={(e) => e.stopPropagation()}
						>
							<DropdownMenuLabel>Action</DropdownMenuLabel>
							<AlertDialogBox
								trigger={
									<DropdownMenuItem
										onSelect={(e) => e.preventDefault()}
										onClick={(e) => e.stopPropagation()}
										className="text-rose-600 focus:text-white focus:bg-rose-600"
									>
										Delete File
									</DropdownMenuItem>
								}
								title="Are You Sure?"
								subheading={`Are you sure you want to delete this evaluation? This action cannot be undone.`}
								actionLabel="Delete"
								onAction={() => {
									const performDelete = async () => {
										try {
											const response =
												await fileService.deleteFile(
													userData.tenant_id,
													auditeeId,
													file.file_id,
													userData.user_id || "system" //TODO: REMOVE THIS AFTER CHECKING WITH BACKEND TEAM
												);
											if (response.status === "success") {
												setRefreshTrigger(
													(prev) => prev + 1
												);
												toast({
													title: "Report Deleted!",
													description:
														"The report has been deleted successfully",
													variant: "destructive",
												});
											}
										} catch (error) {
											toast({
												title: "Error",
												description: `An error occurred while deleting the evaluation. Please try again later!`,
												variant: "destructive",
											});
										}
									};

									performDelete();
								}}
								confirmButtonClassName="bg-rose-600 hover:bg-rose-700 focus:ring-rose-600"
							/>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	//Effect to fetch file data
	useEffect(() => {
		const fetchFiles = async () => {
			try {
				setIsFilesLoading(true);
				const files: FilesUploadResponseDTO[] =
					await fileService.getAllCompanyFiles(
						userData.tenant_id,
						auditeeId
					);
				if (files && files.length > 0) {
					const updatedFiles = [...files].map((file, index) => {
						return {
							...file,
							sNo: index + 1,
							created_on: new Date(
								file.created_on
							).toLocaleDateString(),
						};
					});
					setFiles(updatedFiles);
				}
			} catch (error) {
				toast({
					title: "Error",
					description: `Failed to fetch files. Please try again later!`,
					variant: "destructive",
				});
			} finally {
				setIsFilesLoading(false);
			}
		};

		fetchFiles();
	}, [refreshTrigger, auditeeId, userData.tenant_id]);

	//Effect to fetch auditee name
	useEffect(() => {
		const fetchAuditeeName = async () => {
			setIsAuditeeLoading(true);
			try {
				const response: CompanyListDto =
					await companyService.getCompanyByCompanyId(
						userData.tenant_id,
						auditeeId
					);
				if (response && response.tg_company_display_name) {
					setAuditeeName(response.tg_company_display_name);
				}
			} catch (error) {
				toast({
					title: "Error",
					description: `Failed to fetch auditee details. Please try again later!`,
					variant: "destructive",
				});
				navigate("/auditee/edit/" + auditeeId);
			} finally {
				setIsAuditeeLoading(false);
			}
		};

		fetchAuditeeName();
	}, [auditeeId, userData.tenant_id]);

	return (
		<div className="min-h-screen font-roboto bg-black text-white p-6">
			<section className="flex justify-center items-center w-full bg-black text-white pb-0 pt-10 px-6 sm:px-12 lg:px-16">
				<PageHeader
					heading={
						<div className="flex items-center gap-2">
							Manage Files:{" "}
							{isAuditeeLoading ? <RoundSpinner /> : auditeeName}
						</div>
					}
					subtitle="Browse through uploaded files related to this auditee. You can add, view, and delete files as needed."
					buttonText="Add"
					variant="add"
					isLoading={isLoading}
					actionFn={() => setUploadOpen(true)}
				>
					<Button
						variant="default"
						disabled={isLoading}
						className={`bg-zinc-700 hover:bg-zinc-800 rounded-2xl transition-colors text-white font-bold text-md`}
						onClick={() => navigate("/auditee/edit/" + auditeeId)}
					>
						{isLoading ? <RoundSpinner /> : "Back"}
					</Button>
				</PageHeader>
			</section>
			<section className="flex items-center w-full bg-black text-white mt-8 pt-10 px-6 sm:px-12 lg:px-16">
				<GenericDataTable
					columns={columns}
					data={files}
					filterKey={"file_name"}
					isLoading={isLoading}
					clickableRow={false}
				/>

				<Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
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
								<input
									{...getInputProps()}
									disabled={isLoading}
								/>
								<div className="mx-auto bg-gray-500 rounded-full p-2 opacity-80">
									<Upload className="w-16 h-16 mx-auto text-white" />
								</div>
								<div>
									<p className="text-xl font-semibold mb-4">
										Drag and drop files here, or click to
										browse
									</p>
									<p className="text-md opacity-45">
										Support for PDF, DOCX, XLSX, XLS, CSV,
										PPTX, DOC and TXT files
									</p>
								</div>
								<Button
									variant="outline"
									type="button"
									disabled={isLoading}
								>
									{isLoading ? (
										<RoundSpinner />
									) : (
										"Browse Files"
									)}
								</Button>
							</div>
						</DialogDescription>
					</DialogContent>
				</Dialog>
			</section>
		</div>
	);
}

export default AuditeeDocuments;
