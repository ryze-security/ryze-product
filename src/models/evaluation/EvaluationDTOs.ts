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

export interface listEvaluationsDTO {
	evaluations: Evaluation[];
	total_count: number;
}

export interface Evaluation {
	eval_id: string;
	tg_company_id: string;
	tg_company_display_name: string;
	collection_id: string;
	collection_display_name: string;
	collection_created_at: string;
	collection_edited_on: string;
	created_at: string;
	created_by: string;
	model_used: string;
	processing_status: string;
	document_list: string[];
	overall_score: Number;
}

export interface evalutaionDetailDTO {
	status: string;
	data: evaluationDetailData;
}

export interface evaluationDetailData {
	Status: string
	UserId: string;
	TenantId: string;
	CompanyId: string;
	PolicyId: string[];
	EvaluationId: string;
	updateTimestamp: number;
	frameworkId: string;
	EvaluationResponse: evaluationDetailDataResponse;
}

export interface evaluationDetailDataResponse {
	DomainResponseList: domainResponseList[];
	Response: {
		Score: number;
	}
}

export interface domainResponseList {
	Order: number;
	domainId: string;
	Description: string;
	ControlResponseList: controlResponseList[];
	Response: {
		Score: number;
	}
}

export interface controlResponseList {
	Order: number;
	controlId: string;
	Description: string;
	QuestionResponseList: questionResponseList[];
	Response: {
		Score: number;
	}
}

export interface questionResponseList {
	Order: number;
	controlId: string;
	question: string;
	question_hint: string;
	Response:{
		Score: string;
		Observation: string;
		evidence: string;
		audit_comments: string;
	}
}
