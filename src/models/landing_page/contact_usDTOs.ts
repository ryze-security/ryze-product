export interface contactUsBodyDTO {
	email: string;
	details: string;
}

export interface contactUsResponseDTO {
	id: number;
	email: string;
	details: string;
	created_at: string;
}

export interface customFormResponseDTO {
	submission_id: string;
	message: string;
}

export interface requestFrameworkBodyDTO {
	email: string;
	framework_name: string;
	additional_details: string;
}

export interface requestCreditsBodyDTO {
	email: string;
}
