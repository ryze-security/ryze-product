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
	overall_score: number;
	num_reports: number;
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
	metadata: evaluationMetadata;
}

export interface evaluationDetailDataResponse {
	DomainResponseList: domainResponse[];
	Response: {
		Score: number;
	}
}

export interface domainResponse {
	Order: number;
	domainId: string;
	Description: string;
	ControlResponseList: controlResponse[];
	Response: {
		Score: number;
	}
}

export interface controlResponse {
	Order: number;
	controlId: string;
	serial: string;
	Description: string;
	control_description: string;
	missing_elements: string;
	QuestionResponseList: questionResponse[];
	Response: {
		Score: number;
	}
}

export interface questionResponse {
	SNo: string;
	Order: number;
	q_id: string;
	controlId: string;
	question: string;
	question_hint: string;
	Response:{
		Score: string | boolean;
		Observation: string;
		evidence: string;
		audit_comments: string;
		page_numbers: string;
	}
}

export interface evaluationMetadata {
	file_names: string[];
	collection_display_name: string;
	company_display_name: string;
}

export interface updateQuestionResponseDTO {
	success: boolean;
	message: string;
	updated_fields: string[];
	question_id: string;
	eval_id: string;
}

export interface deleteEvaluationResponseDTO {
	status: string;
	data: deleteEvaluationData;
}

interface deleteEvaluationData {
	message: string;
	eval_id: string;
	questions_deleted: number;
	previous_status: string;
}