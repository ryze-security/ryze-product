import NavHeader from "@/components/nav-header";
import { RoundSpinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { domainResponse } from "@/models/evaluation/EvaluationDTOs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadEvaluationData } from "@/store/slices/evaluationSlice";
import { stat } from "fs";
import {
	BuildingIcon,
	DatabaseIcon,
	FileUserIcon,
	HomeIcon,
	icons,
	IdCardIcon,
} from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const steps = [
	{ id: 0, label: "Home", icon: <HomeIcon /> },
	{ id: 1, label: "Organizational", icon: <BuildingIcon /> },
	{ id: 2, label: "People", icon: <FileUserIcon /> },
	{ id: 3, label: "Physical", icon: <IdCardIcon /> },
	{ id: 4, label: "Technological", icon: <DatabaseIcon /> },
];

const Home = React.lazy(
	() => import("@/components/evaluation_details/DetailHome")
);

const DomainDetail = React.lazy(
	() => import("@/components/evaluation_details/DomainDetail")
);

function EvaluationDetails() {
	const { companyId, evaluationId } = useParams();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { toast } = useToast();

	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [domainDataMap, setDomainDataMap] = useState<
		Record<string, domainResponse>
	>({});

	const { data, status, error } = useAppSelector((state) => state.evaluation);

	const goToStep = (stepId: number) => {
		setCurrentStep(stepId);
	};

	// This effect is used to set the domain data map when the data is loaded
	useEffect(() => {
		setIsLoading(true);
		if (!data.data.EvaluationResponse.DomainResponseList?.length) {
			setIsLoading(false);
			return;
		}

		const map: Record<string, domainResponse> = {};

		for (const domain of data.data.EvaluationResponse.DomainResponseList) {
			map[domain.domainId] = domain;
		}

		setDomainDataMap(map);
		setIsLoading(false);
	}, [data]);

	// This effect is used to set the loading state based on the status of the evaluation data
	useEffect(() => {
		if (status === "loading") {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [status]);

	// This effect is used to fetch the evaluation data when the component mounts
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				if (
					!companyId ||
					!evaluationId ||
					companyId === "" ||
					evaluationId === ""
				) {
					navigate("/evaluation");
					return;
				}
				if (
					data === null ||
					data === undefined ||
					data.data.CompanyId !== companyId ||
					data.data.EvaluationId !== evaluationId
				) {
					dispatch(
						loadEvaluationData({
							tenant_id: "7077beec-a9ef-44ef-a21b-83aab58872c9",
							companyId: companyId ?? "",
							evaluationId: evaluationId ?? "",
						})
					)
						.unwrap()
						.catch((error) => {
							// This block runs for rejected/failed async thunks
							toast({
								title: `Error fetching evaluation data`,
								description: `The evaluation you are trying to access doesn't exist. Please contact support!`,
								variant: "destructive",
							});
							navigate("/evaluation");
						});
				}
			} catch (error) {
				toast({
					title: `Error fetching evaluation data`,
					description: `A fatal error occured while fetching evaluation data. Please try again later!`,
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="min-h-screen font-roboto bg-black text-white p-6">
			<section className="flex justify-center items-center max-w-fit w-full bg-black text-white pt-10 px-6 sm:px-12 lg:px-16">
				<NavHeader
					data={steps}
					stepChangefn={goToStep}
					currentStep={currentStep}
				/>
			</section>

			<section className="flex items-center w-full bg-black text-white mt-8 pt-10 px-6 sm:px-12 lg:px-16">
				{isLoading ? (
					<RoundSpinner />
				) : (
					<>
						<Suspense fallback={<RoundSpinner />}>
							{currentStep === 0 && (
								<Home
									overallScore={Math.round(
										data.data.EvaluationResponse.Response
											.Score * 100
									).toString()}
									domainDataMap={domainDataMap}
									stepChangefn={goToStep}
								/>
							)}

							{/* rute force Fallback if mapping doesnt work in the future */}
							{/* {currentStep > 0 && currentStep <=4 && (
                                <DomainDetail domainData={domainDataMap[`d_${currentStep}`]} currentPage={currentStep} />
                            )} */}

							{Object.entries(domainDataMap).map(
								([domainId, domain], index) =>
									currentStep === index + 1 && (
										<DomainDetail
											domainData={domain}
											currentPage={index + 1}
										/>
									)
							)}
						</Suspense>
					</>
				)}
			</section>
		</div>
	);
}

export default EvaluationDetails;
