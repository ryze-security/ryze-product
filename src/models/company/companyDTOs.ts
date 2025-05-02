export interface CompanyListDto {
    tenant_id: string;
    tg_company_id: string;
    tg_company_display_name: string;
    created_on: string;
    created_by: string;
    type: string;
    document_path: string;
}

export interface CompanyCreateDto {
    tenant_id: string;
    company_name: string;
    company_type: string;
    created_by: string;
}