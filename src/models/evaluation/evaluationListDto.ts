import { Evaluation } from "./evaluation";

export interface EvaluationListDto {
	evaluationId: string;
	company: string;
	framework: string;
	score: number;
	runBy: string;
	lastUpdated: string;
}

export const mapToEvaluationListDto = (data: Evaluation): EvaluationListDto => (
    {
        evaluationId: data.EvaluationId,
        company: data.TenantId,
        framework: data.frameworkId,
        score: data.EvaluationResponse.Response.Score,
        runBy: data.UserId,
        lastUpdated: data.updateTimestamp
    }
)
