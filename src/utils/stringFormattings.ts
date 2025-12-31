// Returns the last part of the controlId after splitting by underscore
// Example: formatControlID("user_name_field") would return "field"
export function formatControlID(controlId: string): string {
    return controlId.split("_").pop();
}

// Capitalize the first letter and replace underscores with spaces
// Example: capitalizeAndFormat("hello_world") would return "Hello world"
export function capitalizeAndFormat(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).replace("_", " ");
}

// Custom sorting function for control IDs that handles both numeric and alphanumeric parts
export function sortControlIds(a: string, b: string): number {
    const aParts = a.split(/[._]/);
    const bParts = b.split(/[._]/);

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || "";
        const bPart = bParts[i] || "";

        // If both parts are numeric, compare as numbers
        if (/^\d+$/.test(aPart) && /^\d+$/.test(bPart)) {
            const numA = parseInt(aPart, 10);
            const numB = parseInt(bPart, 10);
            if (numA !== numB) return numA - numB;
        }
        // Otherwise compare as strings with natural sort
        else if (aPart !== bPart) {
            return aPart.localeCompare(bPart, undefined, { numeric: true });
        }
    }
    return 0;
}
