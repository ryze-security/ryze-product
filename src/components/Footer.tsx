import { Github, Twitter } from "lucide-react";
import { Footer } from "@/components/ui/footer";

function FooterNav() {
	return (
		<div className="w-full">
			<Footer
				logo=""
				brandName="Ryzr."
				socialLinks={[
					{
						icon: <Twitter className="h-5 w-5" />,
						href: "https://twitter.com",
						label: "Twitter",
					},
					{
						icon: <Github className="h-5 w-5" />,
						href: "https://github.com",
						label: "GitHub",
					},
				]}
				mainLinks={[
					{ href: "/", label: "About" },
					{ href: "/", label: "Contact" },
				]}
				legalLinks={[
					{ href: "/", label: "Privacy" },
					{ href: "/", label: "Terms" },
				]}
				copyright={{
					text: "© 2025 Ryze.",
					license: "All rights reserved",
				}}
			/>
		</div>
	);
}

export { FooterNav };
