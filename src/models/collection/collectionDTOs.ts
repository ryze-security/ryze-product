export interface collectionDataDTO {
    tenant_id: string;
    collections: collection[];
    total_available: number,
    total_initiated: number;
}

interface collection {
    collection_id: string;
    collection_display_name: string;
    is_initiated: boolean;
    initiated_at: string;
    created_by: string;
}