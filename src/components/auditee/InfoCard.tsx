import { Card, CardContent } from "@/components/ui/card";
import { RoundSpinner } from "../ui/spinner";

type InfoCardProps = {
	heading: string;
	data: string | number;
	info?: string;
	loading?: boolean;
};

const InfoCard = ({ heading, data, info, loading = false }: InfoCardProps) => {
	return (
		<Card className="bg-gray-ryzr rounded-2xl shadow-lg">
			<CardContent className="p-6 flex flex-col gap-2">
				<div className="text-md text-violet-ryzr font-medium tracking-wide">
					{heading}
				</div>
				{loading ? (
					<div className="flex justify-start h-9">
						<RoundSpinner />
					</div>
				) : (
					<div className="text-4xl text-white font-semibold">
						{data}
					</div>
				)}
				{info && (
					<div className="text-md text-white opacity-60">{info}</div>
				)}
			</CardContent>
		</Card>
	);
};

export default InfoCard;
