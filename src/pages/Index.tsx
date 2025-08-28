import ComingSoonBorder from "@/components/ComingSoonBorder";
import SmallDisplayCard from "@/components/dashboard/SmallDisplayCard";
import TableRowWithNumber from "@/components/dashboard/TableRowWithNumber";
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
import { CompanyListDto } from "@/models/company/companyDTOs";
import { CreditsDataDTO } from "@/models/credits/creditsDTOs";
import { tenantDetailsDTO } from "@/models/tenant/TenantDTOs";
import collectionService from "@/services/collectionServices";
import companyService from "@/services/companyServices";
import creditsService from "@/services/creditsServices";
import tenantService from "@/services/tenantServices";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadCompanyData } from "@/store/slices/companySlice";
import {
	Building,
	CircleAlert,
	Coins,
	FileTextIcon,
	icons,
	PlusCircleIcon,
	Search,
	Table,
	TriangleAlert,
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
		},
		{
			title: "Reviews conducted",
			icon: <FileTextIcon className="text-violet-light-ryzr" />,
			value: 358,
		},
		{
			title: "Deviation recorded",
			icon: <CircleAlert className="text-violet-light-ryzr" />,
			value: 2434,
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
			<section className="flex justify-center items-center w-full bg-black text-white pb-0 pt-10 px-6 sm:px-12 lg:px-16">
				<div className="max-w-7xl w-full flex justify-between px-4">
					<div className="flex flex-col gap-2">
						{/* Left: Welcome message */}
						<h1 className="text-4xl font-semibold text-white tracking-wide">
							Welcome, {userData.first_name}!
						</h1>

						{/* Subtitle */}
						{/* <p className="text-base text-zinc-500">{`Last logged in ${getFormattedDateTime()}`}</p> */}
					</div>

					{/* Right: Button */}
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button
								variant="default"
								className="bg-sky-500 rounded-2xl hover:bg-sky-600 text-white font-bold text-md"
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
			<section className="flex flex-col gap-2 justify-start bg-black text-white pt-10 px-6 sm:px-12 lg:px-16 w-[90%]">
				<div className="max-w-7xl w-full pl-4 grid grid-cols-4 gap-2">
					{views.map((view, index) => (
						<SmallDisplayCard
							title={view.title}
							icon={view.icon}
							value={view.value}
							key={index}
							loading={loadingTenantDetails}
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

				<div className="max-w-7xl items-start w-full pl-4 grid grid-cols-2 grid-rows-1 gap-2">
					{/* Card 1 */}
					<div className="flex flex-col bg-[#18181B] rounded-xl p-6 shadow-md w-full h-[330px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-light-ryzr scrollbar-track-transparent">
						<div className="flex items-center justify-between mb-2">
							<h2 className="flex gap-2 text-xl text-gray-light-ryzr font-semibold tracking-wide pl-4">
								<Building className="text-violet-light-ryzr" />
								<span>Vulnerable auditees</span>
							</h2>
							<span className="text-sm text-gray-light-ryzr pr-4">
								Deviation
							</span>
						</div>
						{companies.status !== "succeeded" ? (
							<div className="flex items-center justify-center h-full">
								<RoundSpinner />
							</div>
						) : companies.data.length !== 0 ? (
							[...companies.data]
								.sort(
									(a, b) =>
										b.deviations_count - a.deviations_count
								)
								.slice(0, 3)
								.map((vulnerability, index) => (
									<div className="h-full" key={index}>
										<TableRowWithNumber
											companyName={
												vulnerability.tg_company_display_name
											}
											score={
												vulnerability.deviations_count
											}
											link={vulnerability.tg_company_id}
										/>
									</div>
								))
						) : (
							<div className="flex items-center justify-center h-full">
								<p className="text-gray-light-ryzr">
									No auditees found.
								</p>
							</div>
						)}
						<div className="w-full">
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
					<div className="flex flex-col bg-[#18181B] rounded-xl p-6 shadow-md w-full h-[330px]">
						<div className="flex justify-between mb-2">
							<h2 className="flex gap-2 text-xl text-gray-light-ryzr font-semibold tracking-wide pl-4">
								<CircleAlert className="text-violet-light-ryzr" />
								<span>Frequent deviations</span>
							</h2>
						</div>
						<div className="flex flex-grow flex-col">
							{loadingDeviations ? (
								<div className="flex items-center justify-center h-full">
									<RoundSpinner />
								</div>
							) : deviations.deviations.length > 0 ? (
								[...deviations.deviations]
									.slice(0, 3)
									.map((deviation, index) => (
										<DeviationRows
											key={index}
											deviation={
												deviation?.control_display_name
											}
										/>
									))
							) : (
								<div className="flex items-center justify-center h-full">
									<p className="text-gray-light-ryzr">
										No deviations found.
									</p>
								</div>
							)}
						</div>
						<div className="w-full">
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

const DeviationRows = ({ deviation }: { deviation: string }) => {
	return (
		<div className="flex items-center gap-4 bg-transparent text-white rounded-xl p-3 w-full hover:bg-zinc-700 hover:bg-opacity-50 hover:shadow-md transition duration-150 ease-in-out hover:cursor-pointer">
			<div className="flex items-center justify-center w-1/12">
				<CircleAlert className="text-[#404040]" />
			</div>
			<div className="flex flex-col justify-center w-11/12">
				<p className="text-base">{deviation}</p>
			</div>
		</div>
	);
};

export default Index;
