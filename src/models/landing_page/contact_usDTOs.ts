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
