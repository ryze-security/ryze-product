import {
	BuildingIcon,
	ClipboardListIcon,
	DatabaseIcon,
	FileTextIcon,
	FileUserIcon,
	HomeIcon,
	IdCardIcon,
} from "lucide-react";

export const iconMap: Record<string, React.ElementType> = {
	home: HomeIcon,
	organizational: BuildingIcon,
	people: FileUserIcon,
	physical: IdCardIcon,
	technological: DatabaseIcon,
	reports: FileTextIcon,
    pii: IdCardIcon
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

    return ClipboardListIcon; // default icon
}

export const DynamicIcons = ({ name, className }: DynamicIconsProps) => {
	const IconComponent = getIconsByName(name);
	return <IconComponent className={className} />;
};
