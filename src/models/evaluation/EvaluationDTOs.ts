export interface createEvaluationDTO {
	tenant_id: string;
	company_id: string;
	collection_id: string;
	created_by: string;
	model_used: string;
	document_list: string[];
}

export interface createEvaluationResponseDTO {
	eval_id: string;
}

export interface startEvaluationResponseDTO {
	message: string;
}
