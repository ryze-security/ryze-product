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
					<div className="text-md text-white/70 opacity-60">{info}</div>
				)}
			</CardContent>
		</Card>
	);
};

export default InfoCard;
