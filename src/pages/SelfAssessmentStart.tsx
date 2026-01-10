import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	startAssessmentSession,
	loadProgress,
} from "@/store/slices/selfAssessmentSlice";
import selfAssessmentService from "@/services/selfAssessmentServices";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const SelfAssessmentStart = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { toast } = useToast();
	const [searchParams] = useSearchParams();

	// Local State
	const [email, setEmail] = useState("");
	const [marketingConsent, setMarketingConsent] = useState(false);
	const [captchaToken, setCaptchaToken] = useState<string | null>(null);
	const [termsAccepted, setTermsAccepted] = useState(false);

	// Redux State
	const { status, error } = useAppSelector((state) => state.selfAssessment);
	const isLoading = status === "loading";

	const recaptchaRef = useRef<ReCAPTCHA>(null);

	// 1. Auto-Resume Logic
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const urlToken = params.get("token");

		if (urlToken) {
			// If a token exists in URL, assume valid and jump to form
			// (The form will validate it when it tries to fetch questions)
			navigate(`/nis2/assessment/form?token=${urlToken}`);
		}
	}, [navigate]);

	// 2. Handle Form Submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!captchaToken) {
			toast({
				variant: "destructive",
				title: "Verification Failed",
				description: "Please complete the CAPTCHA.",
			});
			return;
		}

		if (!termsAccepted) {
			// Double safety, though button is disabled
			toast({
				variant: "destructive",
				title: "Required",
				description: "Please accept the Terms & Conditions.",
			});
			return;
		}

		try {
			// Capture UTM params from URL for marketing tracking
			const result = await dispatch(
				startAssessmentSession({
					email,
					captcha_token: captchaToken,
					marketing_consent: marketingConsent,
					utm_source: searchParams.get("utm_source"),
					utm_medium: searchParams.get("utm_medium"),
					utm_campaign: searchParams.get("utm_campaign"),
				})
			).unwrap();

			toast({ title: "Session Started", description: result.message });
			navigate(`/nis2/assessment/form?token=${result.access_token}`);
		} catch (err: any) {
			toast({
				variant: "destructive",
				title: "Error",
				description: err || "Failed to start session.",
			});
			recaptchaRef.current?.reset();
			setCaptchaToken(null);
		}
	};

	return (
		<div className="min-h-screen relative flex flex-col items-center justify-center bg-black p-4 overflow-hidden text-white font-roboto">
			
            {/* Background Gradient Glow (Matches the purple haze in your image) */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-ryzr/70 blur-[120px] rounded-full pointer-events-none" />

			<div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
				
                {/* HEADINGS */}
				<div className="text-center mb-12 space-y-6">
					<h1 className="text-5xl md:text-6xl font-bold tracking-wider text-white drop-shadow-lg">
						NIS2 Self Assessment
					</h1>
					<p className="text-lg md:text-xl text-gray-400 w-full mx-auto leading-relaxed">
						Assess your cybersecurity maturity against NIS2 requirements across 23 security domains
					</p>
				</div>

                {/* FORM (Removed Card wrapper) */}
				<form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
					
                    {/* Email Field */}
					<div className="space-y-2">
						<Label htmlFor="email" className="text-gray-300">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="name@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={isLoading}
                            className="bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-violet-ryzr h-12"
						/>
					</div>

					{/* Terms & Conditions */}
					<div className="flex items-start space-x-3 pt-2">
						<Checkbox
							id="terms"
							checked={termsAccepted}
							onCheckedChange={(checked) =>
								setTermsAccepted(checked as boolean)
							}
							disabled={isLoading}
                            className="border-neutral-600 data-[state=checked]:bg-white data-[state=checked]:border-white mt-1"
						/>
						<Label
							htmlFor="terms"
							className="text-sm leading-normal text-gray-400 peer-disabled:opacity-70"
						>
							I accept the{" "}
							<a
								href="/terms"
								target="_blank"
								className="text-violet-400 hover:text-violet-300 transition-colors"
							>
								Terms of Service
							</a>{" "}
							and{" "}
							<a
								href="/privacy"
								target="_blank"
								className="text-violet-400 hover:text-violet-300 transition-colors"
							>
								Privacy Policy
							</a>
							. <span className="text-rose-600">*</span>
						</Label>
					</div>

					{/* Marketing Consent */}
					<div className="flex items-start space-x-3">
						<Checkbox
							id="marketing"
							checked={marketingConsent}
							onCheckedChange={(checked) =>
								setMarketingConsent(checked as boolean)
							}
							disabled={isLoading}
                            className="border-neutral-600 data-[state=checked]:bg-white data-[state=checked]:border-white mt-1"
						/>
						<Label
							htmlFor="marketing"
							className="text-sm leading-normal text-gray-400 peer-disabled:opacity-70"
						>
							I agree to receive security insights and updates (Optional)
						</Label>
					</div>

					{/* CAPTCHA */}
					<div className="flex justify-center py-2">
						<ReCAPTCHA
							ref={recaptchaRef}
                            theme="dark" // Matches the dark background
							sitekey={
								import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
								"YOUR_TEST_SITE_KEY_HERE"
							}
							onChange={(token) => setCaptchaToken(token)}
						/>
					</div>

					{/* Submit Button */}
					<Button
						type="submit"
						className="w-full h-12 text-lg font-semibold bg-violet-ryzr hover:bg-violet-600 text-white transition-all shadow-lg shadow-violet-900/20"
						disabled={
							isLoading || !captchaToken || !termsAccepted
						}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-5 w-5 animate-spin" />
								Starting Session...
							</>
						) : (
							"Start Assessment"
						)}
					</Button>
				</form>
			</div>
		</div>
	);
};

export default SelfAssessmentStart;
