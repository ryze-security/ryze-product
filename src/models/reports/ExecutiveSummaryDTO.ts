export interface ExecutiveSummaryResponseDTO{
    status: "generating" | "ready";
    data:ExecutiveSummaryDTO;
    message:"string" | null;
}

export interface ExecutiveSummaryDTO {
    company: string;
    framework: string;
    overallComplianceScore: number;
    controlCategoryScores: Record<string, number>;
    EvalDomains: Record<string, number>;
    controlsSeverityBreakdown: ControlsSeverityBreakdown;
    nonCompliances: NonCompliance[];
}

export interface ControlsSeverityBreakdown {
    scoreBelow50: SeverityCount;
    scoreAbove50: SeverityCount;
    scoreAbove75: SeverityCount;
}

export interface SeverityCount {
    critical: number;
    high: number;
    medium: number;
    low: number;
}

export interface NonCompliance {
    control_id: string;
    controlTitle: string;
    severity: string;
    observations: string;
}
