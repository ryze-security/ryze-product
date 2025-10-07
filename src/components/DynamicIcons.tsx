import {
	Building2,
	BuildingIcon,
	ClipboardListIcon,
	Coins,
	DatabaseIcon,
	FileTextIcon,
	FileUserIcon,
	HomeIcon,
	IdCardIcon,
	Users,
} from "lucide-react";

export const iconMap: Record<string, React.ElementType> = {
	home: HomeIcon,
	organizational: BuildingIcon,
	people: FileUserIcon,
	physical: IdCardIcon,
	technological: DatabaseIcon,
	reports: FileTextIcon,
    pii: IdCardIcon,
	user: Users,
	tenants: Building2,
	credits: Coins,
};

interface DynamicIconsProps {
	name: string;
	className?: string;
}

const getIconsByName = (name: string) : React.ElementType => {
    const lowerCaseName = name.toLowerCase();

    if(lowerCaseName.includes("home")) return iconMap["home"];
    if(lowerCaseName.includes("organizational")) return iconMap["organizational"];
    if(lowerCaseName.includes("people")) return iconMap["people"];
    if(lowerCaseName.includes("physical")) return iconMap["physical"];
    if(lowerCaseName.includes("technological")) return iconMap["technological"];
    if(lowerCaseName.includes("pii")) return iconMap["pii"];
    if(lowerCaseName.includes("reports")) return iconMap["reports"];
    if(lowerCaseName.includes("users")) return iconMap["user"];
    if(lowerCaseName.includes("tenants")) return iconMap["tenants"];
    if(lowerCaseName.includes("credits")) return iconMap["credits"];

    return ClipboardListIcon; // default icon
}

export const DynamicIcons = ({ name, className }: DynamicIconsProps) => {
	const IconComponent = getIconsByName(name);
	return <IconComponent className={className} />;
};
