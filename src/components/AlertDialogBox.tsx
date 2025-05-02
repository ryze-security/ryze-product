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
	return (
		<AlertDialog>
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
							<a href={actionHref}>{actionLabel}</a>
						</AlertDialogAction>
					) : (
						<AlertDialogAction onClick={onAction}>
							{actionLabel}
						</AlertDialogAction>
					)}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
