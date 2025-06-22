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
	trigger: React.ReactNode;
	title?: string;
	subheading: string;
	actionLabel: string;
	onAction?: () => void;
	actionHref?: string;
}

export const AlertDialogBox: React.FC<AlertDialogBoxProps> = ({
	trigger,
	title = "Heads up!",
	subheading,
	actionLabel,
	onAction,
	actionHref,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleAction = () => {
		if (onAction) {
			onAction();
		}
		setIsOpen(false);
	}

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{`${title}`}</AlertDialogTitle>
					<AlertDialogDescription>
						{subheading}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>

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
