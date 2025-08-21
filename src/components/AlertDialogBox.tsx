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

	const handleAction = () => {
		if (onAction) {
			onAction();
		}
		handleOpenChange(false);
	};

	const handleCancel = () => {
		if (onCancel) {
			onCancel();
		}
		handleOpenChange(false);
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
					<AlertDialogCancel onClick={handleCancel}>
						Cancel
					</AlertDialogCancel>

					{actionHref ? (
						<AlertDialogAction asChild>
							<Link to={actionHref}>{actionLabel}</Link>
						</AlertDialogAction>
					) : (
						<AlertDialogAction onClick={handleAction}>
							{actionLabel}
						</AlertDialogAction>
					)}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
