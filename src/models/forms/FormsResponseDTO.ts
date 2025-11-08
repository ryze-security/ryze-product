export interface CustomFormSubmissionDTO {
    submission_id: string;
    user_id: string;
    tenant_id: string;
    form_type: "request_framework" | "request_credits";
    blob: string;
    created_at: string;
    first_name:string;
    last_name:string;
}

export interface CustomFormListResponseDTO {
    submissions: CustomFormSubmissionDTO[];
    total_count: number;
    skip: number;
    limit: number;
}
