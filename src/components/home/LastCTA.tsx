import { Cta10 } from "@/components/shadcnblocks-com-cta10";

const demoData = {
	heading: "Ready to transform your compliance workflow?",
	description:
		"Automate the tedious. Accelerate the audit. Make risk management a strategic advantage.",
	buttons: {
		primary: {
			text: "Get Started",
			url: "",
		},
		secondary: {
			text: "Request a Demo",
			url: "",
		},
	},
};

function LastCTA() {
	return <Cta10 {...demoData} />;
}

export { LastCTA };
