export interface collectionDataDTO {
    tenant_id: string;
    collections: collection[];
    total_available: number;
    total_initiated: number;
}

export interface frequentDeviationsDTO {
    deviations: frequentDeviation[];
    total_count: number;
}

interface collection {
    collection_id: string;
    collection_display_name: string;
    is_initiated: boolean;
    initiated_at: string;
    created_by: string;
}

export interface frequentDeviation {
    id: string;
    control_id: string;
    control_display_name: string;
    num_evals_failed: number;
}

// ---------------- Interfaces for creating custom framework ----------------

export interface controlArray {
    control_display_index: string;
    control_display_name: string;
}

export interface DomainLevelDTO {
    [categoryName: string]: Array<controlArray>;
}

export interface customFrameworkResponse {
    summary: DomainLevelDTO;
    version: number;
}

export interface createCustomFrameworkRequest {
    category_control_selection: DomainLevelDTO;
    collection_display_name: string;
    global_framework_version: number;
    overwrite: boolean;
    tenant_id: string;
}

export interface createCustomFrameworkResponse {
    collection_display_name: string;
    collection_id: string;
    global_framework_version: number;
    initiated_for_tenant: boolean;
    message: string;
    stats: {
        controls_created: number;
        domains_created: number;
        mappings_created: number;
        questions_created: number;
    };
    tenant_id: string;
}
