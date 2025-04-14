export interface Evaluation {
	Status: string;
	UserId: string;
	TenantId: string;
	ClientId: string;
	PolicyId: string;
	EvaluationId: string;
	updateTimestamp: string; // epoch
	frameworkId: string;
	EvaluationResponse: EvaluationResponse;
}

export interface EvaluationResponse {
	DomainResponseList: DomainResponse[];
	Response: Response;
}

export interface DomainResponse {
	Order: number;
	domainId: string;
	Description: string;
	ControlResponseList: ControlResponse[];
	Response: Response;
}

export interface ControlResponse {
	Order: number;
	controlId: string;
	Description: string;
	QuestionResponseList: QuestionResponse[];
	Response: Response;
}

export interface QuestionResponse {
	Order: number;
	controlId: string;
	Description: string;
	Response: Response;
}

export interface Response {
	Score: number;
	Observation: string;
	Reference: string;
}
