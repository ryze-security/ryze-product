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
