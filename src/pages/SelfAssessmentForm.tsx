import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	loadQuestions,
	loadProgress,
	setAnswer,
	autoSaveAnswers,
	completeAssessment,
} from "@/store/slices/selfAssessmentSlice";
import { AssessmentSidebar } from "@/components/self_assessment/SelfAssessmentSidebar";
import { MaturityRubric } from "@/components/self_assessment/MaturityRubric";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronRight, ChevronLeft, Save, ShieldCheck } from "lucide-react";

const SelfAssessmentForm = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
	const { toast } = useToast();

	// Redux State
	const { domains, answers, status, isSaving } = useAppSelector(
		(state) => state.selfAssessment
	);

	// Local UI State
	const [currentStep, setCurrentStep] = useState(0);
	const [initializing, setInitializing] = useState(true);

	// 1. Initialize Data
	useEffect(() => {
		const init = async () => {
			// Load static questions if missing
			if (domains.length === 0) {
				await dispatch(loadQuestions());
			}
			// Load user answers
			await dispatch(loadProgress());
			setInitializing(false);
		};
		init();
	}, [dispatch]);

	// Derived State
	const activeDomain = domains[currentStep];
	const currentAnswer = activeDomain ? answers[activeDomain.id] : undefined;
	const isLastStep = currentStep === domains.length - 1;

	// Handlers
	const handleOptionSelect = (level: number) => {
		if (!activeDomain) return;
		dispatch(setAnswer({ domainId: activeDomain.id, level }));
	};

    const handleSidebarNavigate = (targetIndex: number) => {
		// 1. Auto-save the CURRENT domain before jumping away
		// We check if there is an active domain and if the user has selected an answer for it
		if (activeDomain && currentAnswer) {
			dispatch(
				autoSaveAnswers({
					answers: [
						{ domain_id: activeDomain.id, selected_level: currentAnswer },
					],
				})
			);
		}

		// 2. Jump to the new domain
		setCurrentStep(targetIndex);
		window.scrollTo(0, 0);
	};

	const navigateWithToken = (path: string) => {
        navigate({
            pathname: path,
            search: searchParams.toString() // Keep the ?token=xyz
        });
    };

	const handleNext = () => {
		// 1. Auto-save current answer before moving
		if (activeDomain && currentAnswer) {
			dispatch(
				autoSaveAnswers({
					answers: [
						{
							domain_id: activeDomain.id,
							selected_level: currentAnswer,
						},
					],
				})
			);
		}

		// 2. Move Step
		if (!isLastStep) {
			setCurrentStep((prev) => prev + 1);
			window.scrollTo(0, 0);
		} else {
			handleComplete();
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const handleComplete = async () => {
		try {
			// Ensure the very last answer is saved before completing
			if (activeDomain && currentAnswer) {
				await dispatch(
					autoSaveAnswers({
						answers: [
							{ domain_id: activeDomain.id, selected_level: currentAnswer },
						],
					})
				).unwrap();
			}

			await dispatch(completeAssessment()).unwrap();

			toast({
				title: "Assessment Complete!",
				description: "Generating your report...",
			});

			// Redirect to Results, preserving token
            navigateWithToken("/nis2/assessment/results");
		} catch (err: any) {
			toast({
				variant: "destructive",
				title: "Submission Failed",
				description: err,
			});
		}
	};

	if (initializing || status === "loading") {
		return (
			<div className="h-screen flex items-center justify-center">
				<Loader2 className="w-10 h-10 animate-spin text-primary" />
			</div>
		);
	}

	if (!token) {
        return <div className="p-10">Invalid Session. <Button onClick={() => navigate("/nis2/assessment")}>Go to Start</Button></div>;
    }

	if (!activeDomain) return <div>Error loading assessment.</div>;

	return (
		<div className="flex h-screen overflow-hidden bg-black text-white relative">
			{/* --- 1. SPOTLIGHT & BRANDING (Left Side) --- */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-violet-900/20 blur-[150px] rounded-full pointer-events-none z-0" />
            
            <div className="absolute top-6 left-8 z-50">
                <a href="/" className="flex items-center gap-3 group opacity-80 hover:opacity-100 transition-opacity">
					<img className="w-12 h-12" src="../../assets/Ryzr_White Logo_v2.png" alt="RYZR Logo" />
                </a>
            </div>

			{/* Main Content */}
			<main className="flex-1 h-full overflow-y-auto scrollbar-none">
				<div className="max-w-3xl mx-auto p-8">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm font-medium text-primary uppercase tracking-wider">
								{activeDomain.initials} - Domain{" "}
								{currentStep + 1} of {domains.length}
							</span>
							{isSaving && (
								<span className="text-xs text-green-ryzr flex items-center">
									<Save className="w-3 h-3 mr-1" /> Saving...
								</span>
							)}
						</div>
						<h1 className="text-3xl font-bold text-primary mb-2">
							{activeDomain.name}
						</h1>
						<div className="flex items-center space-x-2">
							<span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-black">
								Criticality: {activeDomain.criticality}
							</span>
						</div>
					</div>

					{/* The Rubric */}
					<div className="mb-10">
						<MaturityRubric
							definitions={activeDomain.definitions}
							selectedValue={currentAnswer}
							onChange={handleOptionSelect}
						/>
					</div>

					{/* Navigation Footer */}
					<div className="flex items-center justify-between pt-6 border-t">
						<Button
							variant="outline"
							onClick={handlePrevious}
							disabled={currentStep === 0}
                            className="bg-transparent"
						>
							<ChevronLeft className="w-4 h-4 mr-2" /> Previous
						</Button>

						<Button
							onClick={handleNext}
							disabled={!currentAnswer} // Force answer before proceeding? Optional.
						>
							{isLastStep ? "Complete Assessment" : "Next Domain"}
							{!isLastStep && (
								<ChevronRight className="w-4 h-4 ml-2" />
							)}
						</Button>
					</div>
				</div>
			</main>

			{/* Sidebar (Desktop only or Drawer on Mobile) */}
			<aside className="w-80 hidden md:block h-full z-20 transition-all duration-500 ease-in-out opacity-50 hover:opacity-100 border-l border-white/5 bg-black/40 backdrop-blur-md">
				<AssessmentSidebar
					domains={domains}
					answers={answers}
					currentIndex={currentStep}
					onNavigate={handleSidebarNavigate}
				/>
			</aside>
		</div>
	);
};

export default SelfAssessmentForm;
