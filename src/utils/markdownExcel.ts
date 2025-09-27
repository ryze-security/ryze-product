export const createRichTextFromMarkdown = (text) => {
    const baseFont = {
        size: 12,
        name: "SF Pro Display Regular",
        color: { argb: "FF000000" },
    };
    
    if (typeof text !== 'string' || !text.includes('**')) {
        return [{ text: text, font: baseFont }];  // Return as a simple text object if no markdown
    }

    // This regex splits the string by the ** markers, keeping the bolded part.
    const parts = text.split(/\*\*(.*?)\*\*/g);

    // The base font style for all parts of the cell

    return parts.map((part, index) => {
        // The parts captured by the regex (the bolded text) will be at odd indices.
        const isBold = index % 2 === 1;
        return {
            text: part,
            font: { ...baseFont, bold: isBold },
        };
    }).filter(part => part.text); // Remove any empty strings from the split
};