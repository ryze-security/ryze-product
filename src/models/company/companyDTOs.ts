export interface CompanyListDto {
    tenant_id: string;
    tg_company_id: string;
    tg_company_display_name: string;
    created_on: string;
    created_by: string;
    document_path: string;
    data_type: string[];
    service_type: string[];
}

export interface CompanyCreateDto {
    tenant_id: string;
    company_name: string;
    company_type: string;
    created_by: string;
    data_type: string[];
    service_type: string[];
}

export interface CompanyUpdateDto {
    company_name: string;
    data_type: string[];
    service_type: string[];
}