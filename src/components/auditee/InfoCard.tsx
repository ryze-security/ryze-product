import { Card, CardContent } from "@/components/ui/card";
import { RoundSpinner } from "../ui/spinner";
import { Link } from "react-router-dom";

type InfoCardProps = {
	heading: string;
	data: string | number;
	info?: string;
	loading?: boolean;
	link?: string;
};

const InfoCard = ({
	heading,
	data,
	info,
	loading = false,
	link,
}: InfoCardProps) => {
	return (
		<Link
			to={link && link}
			className="no-underline hover:opacity-80 duration-200 transition-opacity"
		>
			<Card className="bg-gray-ryzr rounded-2xl shadow-lg">
				<CardContent className="p-6 flex flex-col gap-2">
					<div className="text-sm text-violet-light-ryzr font-semibold uppercase tracking-wider">
						{heading}
					</div>
					{loading ? (
						<div className="flex justify-start h-9">
							<RoundSpinner />
						</div>
					) : (
						<div className="text-5xl text-white font-extrabold">
							{data}
						</div>
					)}
					{info && (
						<div className="text-md text-white/70 opacity-60">
							{info}
						</div>
					)}
				</CardContent>
			</Card>
		</Link>
	);
};

export default InfoCard;
