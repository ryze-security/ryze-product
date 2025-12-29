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
