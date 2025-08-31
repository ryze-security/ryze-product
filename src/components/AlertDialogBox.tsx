import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface AlertDialogBoxProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	trigger?: React.ReactNode;
	title?: string;
	subheading: string;
	actionLabel: string;
	onAction?: () => void;
	actionHref?: string;
	onCancel?: () => void;
}

export const AlertDialogBox: React.FC<AlertDialogBoxProps> = ({
	trigger,
	title = "Heads up!",
	subheading,
	actionLabel,
	onAction,
	actionHref,
	open,
	onOpenChange,
	onCancel,
}) => {
	const [isInternalOpen, setIsInternalOpen] = useState(false);

	const isControlled = open !== undefined && onOpenChange !== undefined;

	const currentOpen = isControlled ? open : isInternalOpen;
	const handleOpenChange = isControlled ? onOpenChange : setIsInternalOpen;
	const [isLoading, setIsLoading] = useState(false);

	const handleAction = () => {
		setIsLoading(true);
		if (onAction) {
			onAction();
		}
		handleOpenChange(false);
		setIsLoading(false);
	};

	const handleCancel = () => {
		setIsLoading(true);
		if (onCancel) {
			onCancel();
		}
		handleOpenChange(false);
		setIsLoading(false);
	};

	return (
		<AlertDialog open={currentOpen} onOpenChange={handleOpenChange}>
			{trigger && (
				<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
			)}

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{`${title}`}</AlertDialogTitle>
					<AlertDialogDescription>
						{subheading}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
						Cancel
					</AlertDialogCancel>

					{actionHref ? (
						<AlertDialogAction asChild>
							<Link className="bg-sky-500 hover:bg-sky-600 transition-colors 
							duration-200 text-white" to={actionHref}>{actionLabel}</Link>
						</AlertDialogAction>
					) : (
						<AlertDialogAction className="bg-sky-500 hover:bg-sky-600 transition-colors 
							duration-200 text-white" onClick={handleAction} disabled={isLoading}>
							{actionLabel}
						</AlertDialogAction>
					)}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
