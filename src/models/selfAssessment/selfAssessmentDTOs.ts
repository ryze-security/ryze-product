// --- STEP 1: AUTH & SESSION ---

export interface GuestStartRequest {
	email: string;
	captcha_token: string;
	marketing_consent?: boolean;
	// Tracking params
	gclid?: string | null;
	utm_source?: string | null;
	utm_medium?: string | null;
	utm_campaign?: string | null;
}

export interface GuestSessionResponse {
	submission_id: number;
	access_token: string;
	message: string;
}

// --- STEP 2: QUESTIONS (READ) ---

export interface MaturityLevel {
	level: number;
	description: string;
}

export interface DomainQuestion {
	id: number;
	initials: string;
	name: string;
	target_level: number;
	criticality: string;
	definitions: MaturityLevel[];
}

export interface QuestionListResponse {
	domains: DomainQuestion[];
}

// --- STEP 3: SUBMISSION (WRITE) ---

export interface AssessmentAnswer {
	domain_id: number;
	selected_level: number;
}

export interface AssessmentBulkSubmission {
	answers: AssessmentAnswer[];
}

export interface SavedAnswerItem {
	domain_id: number;
	selected_level: number;
}

export interface SavedProgressResponse {
	submission_id: number;
	status: string;
	answers: SavedAnswerItem[];
}

// --- STEP 4: RESULTS (COMPLETION) ---

export interface DomainResult {
	domain_id: number;
	domain_name: string;
	domain_initials: string;
	user_level: number;
    criticality: string;
	target_level: number;
	status: string; // e.g. "Compliant", "Action Required"
	gap: number;
}

export interface Recommendation {
	domain_name: string;
	advice: string;
	achieves_level: number;
}

export interface AssessmentResultResponse {
	submission_id: number;
	overall_status: string;
	total_possible_score: number;
	user_total_score: number;
	average_maturity_level: number;
	domain_results: DomainResult[];
	recommendations: Recommendation[];
}
