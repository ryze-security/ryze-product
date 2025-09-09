import ComingSoonBorder from "@/components/ComingSoonBorder";
import SmallDisplayCard from "@/components/dashboard/SmallDisplayCard";
import TableRowWithNumber from "@/components/dashboard/TableRowWithNumber";
import TruncatedTooltip from "@/components/TruncatedTooltip";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoundSpinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { frequentDeviationsDTO } from "@/models/collection/collectionDTOs";
import { tenantDetailsDTO } from "@/models/tenant/TenantDTOs";
import collectionService from "@/services/collectionServices";
import tenantService from "@/services/tenantServices";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadCompanyData } from "@/store/slices/companySlice";
import {
	Building,
	CircleAlert,
	Coins,
	FileTextIcon,
	PlusCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Index() {
	const { toast } = useToast();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const userData = useAppSelector((state) => state.appUser);
	const companies = useAppSelector((state) => state.company);
	const [tenantDetails, setTenantDetails] = useState<tenantDetailsDTO>(
		{} as tenantDetailsDTO
	);
	const [loadingTenantDetails, setLoadingTenantDetails] =
		useState<boolean>(false);

	const [deviations, setDeviations] = useState<frequentDeviationsDTO>(
		{} as frequentDeviationsDTO
	);
	const [loadingDeviations, setLoadingDeviations] = useState<boolean>(true);

	const views = [
		{
			title: "Auditees registered",
			icon: <Building className="text-violet-light-ryzr" />,
			value: tenantDetails?.num_companies || 0,
			link: "/auditee/dashboard",
		},
		{
			title: "Reviews conducted",
			icon: <FileTextIcon className="text-violet-light-ryzr" />,
			value: tenantDetails?.num_evaluations || 0,
			link: "/evaluation",
		},
		{
			title: "Deviation recorded",
			icon: <CircleAlert className="text-violet-light-ryzr" />,
			value: tenantDetails?.num_deviations || 0,
			link: "/framework/deviation",
		},
	];

	//effect for fetching tanant details
	useEffect(() => {
		const fetchTenantDetails = async () => {
			try {
				setLoadingTenantDetails(true);
				const response = (await tenantService.getTenantDetails(
					userData.tenant_id
				)) as tenantDetailsDTO;
				setTenantDetails(response);
			} catch (error) {
				toast({
					title: "Error fetching details",
					description:
						"There was an error fetching your tenant's details. Please try again later.",
					variant: "destructive",
				});
			} finally {
				setLoadingTenantDetails(false);
			}
		};

		if (userData.tenant_id) {
			fetchTenantDetails();
		}
	}, [userData.tenant_id]);

	//effect for fetching companies for vulnerable auditees
	useEffect(() => {
		if (userData.tenant_id) {
			dispatch(loadCompanyData(userData.tenant_id))
				.unwrap()
				.catch((error) => {
					toast({
						title: "Error loading companies",
						description: `Failed to load companies data: ${error}`,
						variant: "destructive",
					});
				});
		}
	}, [userData.tenant_id]);

	//effect for fetching frequent deviations
	useEffect(() => {
		const fetchDeviations = async () => {
			try {
				setLoadingDeviations(true);
				const response = (await collectionService.getFrequentDeviations(
					userData.tenant_id
				)) as frequentDeviationsDTO;
				setDeviations(response);
			} catch (error) {
				toast({
					title: "Error fetching deviations",
					description:
						"There was an error fetching frequent deviations. Please try again later.",
					variant: "destructive",
				});
			} finally {
				setLoadingDeviations(false);
			}
		};

		if (userData.tenant_id) {
			fetchDeviations();
		}
	}, [userData.tenant_id]);

	return (
		<div className="font-roboto text-white w-full min-h-screen p-6">
			{/* Header */}
			<section className="w-full bg-black text-white pb-0 pt-10 px-3 sm:px-6 md:px-4 lg:px-16 mt-5 lg:mt-0">
				<div className="max-w-7xl w-full flex flex-col lg:flex-row lg:items-center md:justify-between gap-4">
					<div className="flex flex-col gap-1">
						{/* Left: Welcome message */}
						<h1 className="text-2xl md:text-4xl font-semibold text-white tracking-wide">
							Welcome, {userData.first_name}!
						</h1>

						{/* Subtitle */}
						{/* <p className="text-base text-zinc-500">{`Last logged in ${getFormattedDateTime()}`}</p> */}
					</div>

					{/* Right: Button */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="default"
								className="bg-sky-500 rounded-2xl hover:bg-sky-600 text-white font-bold text-md px-4 py-2 flex items-center gap-2 w-fit text-sm md:text-base"
							>
								<PlusCircleIcon />
								New
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<Link to={"/new-evaluation"}>
								<DropdownMenuItem className="font-roboto cursor-pointer">
									Evaluation
								</DropdownMenuItem>
							</Link>
							<Link to={"/auditee/new"}>
								<DropdownMenuItem className="font-roboto cursor-pointer">
									Auditee
								</DropdownMenuItem>
							</Link>
							<DropdownMenuItem className="font-roboto text-gray-light-ryzr cursor-not-allowed">
								<ComingSoonBorder variant="inline">
									Framework
								</ComingSoonBorder>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</section>

			{/* Cards */}
			<section className="flex flex-col gap-2 justify-start bg-black text-white pt-10 px-3 sm:px-6 md:px-4 lg:px-16 lg:w-[90%]">
				<div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
					{views.map((view, index) => (
						<SmallDisplayCard
							title={view.title}
							icon={view.icon}
							value={view.value}
							key={index}
							loading={loadingTenantDetails}
							link={view.link}
						/>
					))}
					{
						<SmallDisplayCard
							title="Credits"
							icon={<Coins className="text-violet-light-ryzr" />}
							value={tenantDetails?.remaining_credits}
							warning={true}
							loading={loadingTenantDetails}
						/>
					}
				</div>

				<div className="max-w-7xl items-start w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
					{/* Card 1 */}
					<div className="flex flex-col bg-[#18181B] rounded-3xl px-2 py-4 md:px-2 md:p-5 lg:px-2 lg:p-6 shadow-md w-full h-[330px]">
						<div className="flex items-center gap-4 p-4 pt-0">
							<div className="flex items-center gap-3 flex-grow">
								<div className="flex-shrink-0">
									<Building className="sm:h-6 sm:w-6 text-violet-ryzr" />
								</div>
								<h2 className="text-lg lg:text-xl font-semibold tracking-wide text-gray-light-ryzr">
									Vulnerable Auditees
								</h2>
							</div>
							<div className="text-sm sm:text-base flex-shrink-0 text-gray-light-ryzr">
								Deviations
							</div>
						</div>
						<div className="flex-grow">
							{companies.status !== "succeeded" ? (
								<div className="flex items-center justify-center h-full">
									<RoundSpinner />
								</div>
							) : companies.data.length !== 0 ? (
								[...companies.data]
									.sort(
										(a, b) =>
											b.deviations_count -
											a.deviations_count
									)
									.slice(0, 3)
									.map((vulnerability, index) => (
										<TableRowWithNumber
											companyName={
												vulnerability.tg_company_display_name
											}
											score={
												vulnerability.deviations_count
											}
											link={vulnerability.tg_company_id}
										/>
									))
							) : (
								<div className="flex items-center justify-center h-full">
									<p className="text-gray-light-ryzr">
										No auditees found.
									</p>
								</div>
							)}
						</div>
						<div className="w-full flex-end">
							<div className="flex justify-center mb-2 mt-4 sticky bottom-0 bg-transparent">
								<Button
									variant="outline"
									className="w-2/3 gap-2 border-violet-ryzr hover:bg-violet-ryzr hover:text-white hover:border-violet-ryzr bg-[#18181B] text-violet-ryzr font-bold"
									onClick={() =>
										navigate("/auditee/vulnerable")
									}
								>
									View more
								</Button>
							</div>
						</div>
					</div>

					{/* Card 2 */}
					<div className="flex flex-col bg-[#18181B] rounded-3xl px-2 py-4 md:px-2 md:p-5 lg:px-2 lg:p-6 shadow-md w-full h-[330px]">
						<div className="flex items-center gap-4 p-4 pt-0">
							<div className="flex items-center gap-3 flex-grow">
								<div className="flex-shrink-0">
									<CircleAlert className="h-6 w-6 text-violet-ryzr" />
								</div>
								<h2 className="text-lg lg:text-xl font-semibold tracking-wide text-gray-light-ryzr">
									Frequent Deviations
								</h2>
							</div>
							<div className="text-sm sm:text-base flex-shrink-0 text-gray-light-ryzr">
								Occurences
							</div>
						</div>
						<div className="flex flex-grow flex-col">
							{loadingDeviations ? (
								<div className="flex items-center justify-center h-full">
									<RoundSpinner />
								</div>
							) : deviations.deviations.length > 0 ? (
								<div className="h-full">
									{[...deviations.deviations]
										.slice(0, 3)
										.map((deviation, index) => (
											<DeviationRows
												key={index}
												deviation={
													deviation?.control_display_name
												}
												count={
													deviation?.num_evals_failed
												}
											/>
										))}
								</div>
							) : (
								<div className="flex items-center justify-center h-full">
									<p className="text-gray-light-ryzr">
										No deviations found.
									</p>
								</div>
							)}
						</div>
						<div className="w-full flex-end">
							<div className="flex justify-center mb-2 mt-4">
								<Button
									variant="outline"
									className="w-2/3 gap-2 border-violet-ryzr hover:bg-violet-ryzr hover:text-white hover:border-violet-ryzr bg-[#18181B] text-violet-ryzr font-bold"
									onClick={() =>
										navigate("/framework/deviation")
									}
								>
									View more
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

const DeviationRows = ({
	deviation,
	count,
}: {
	deviation: string;
	count: number;
}) => {
	return (
		<div className="flex items-center gap-4 bg-transparent text-white rounded-xl p-4 w-full hover:bg-zinc-700 hover:bg-opacity-50 hover:shadow-md transition duration-150 ease-in-out hover:cursor-pointer">
			<div className="flex-shrink-0">
				<CircleAlert className="text-[#404040]" />
			</div>
			<div className="flex-1 min-w-0">
				<TruncatedTooltip text={deviation} />
			</div>
			<div className="flex-shrink-0">
				<div className="rounded-full text-center flex items-center justify-center min-w-[62px] h-[26px] w-fit bg-[#404040]">
					{count}
				</div>
			</div>
		</div>
	);
};

export default Index;
