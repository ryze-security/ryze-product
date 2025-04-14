import { Faq3 } from "@/components/faq3";

const demoData = {
	heading: "Frequently asked questions",
	description:
		"Everything you need to know about Ryzr. Can't find the answer you're looking for? Feel free to contact our support team.",
	items: [
		{
			id: "faq-1",
			question: "Is my data safe?",
			answer: "shadcnblocks is a collection of ready-to-use block components built on top of shadcn/ui, designed to help you build beautiful websites faster.",
		},
		{
			id: "faq-2",
			question: "How accurate are your AI agents, and how do you handle inaccuracies or false positives?",
			answer: "shadcnblocks components are designed to be copied and pasted into your project. Simply browse the components, click on the one you want to use, and copy the code directly into your project. This gives you full control over the code and allows for easy customization.",
		},
		{
			id: "faq-3",
			question: "How long does enterprise onboarding take?",
			answer: "Yes, shadcnblocks is open-source and free to use in both personal and commercial projects. You can customize and modify the blocks to suit your needs.",
		},
	],
	supportHeading: "Still have questions?",
	supportDescription:
		"Can't find the answer you're looking for? Our support team is here to help with any technical questions or concerns.",
	supportButtonText: "Contact Support",
	supportButtonUrl: "/contact",
};

function FAQ() {
	return <Faq3 {...demoData} />;
}

export { FAQ };
