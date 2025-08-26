export interface createReportDTO {
	tenant_id: string;
	company_id: string;
	evaluation_id: string;
	report_type: string;
	created_by: string;
}

export interface createStartReportResponseDTO {
	report_id: string;
	message: string;
}

export interface startReportDTO {
	tenant_id: string;
	company_id: string;
}

export interface reportResultDTO {
	report_id: string;
	eval_id: string;
	report_type: string;
	processing_status: string;
	created_at: string;
	created_by: string;
	results: any[];
}

export interface reportResultListDTO {
	evaluation_id: string;
	total_count: number;
	reports: [
		{
			sNo: number;
			report_id: string;
			eval_id: string;
			report_type: string;
			processing_status: string;
			created_at: string;
			created_by: string;
		}
	];
}
