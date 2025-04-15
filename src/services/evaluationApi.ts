import { Evaluation } from "../models/evaluation/evaluation";
import { mockEvaluationData, mockEvaluations } from "../mock_data/evaluation-data"
import axios from "axios";

export class EvaluationService{
    async getEvaluationByID(evaluationId: string): Promise<Evaluation | null> {
        try {
            // const response = await axios.get<Evaluation>(`https://api.example.com/evaluations/${evaluationId}`);
            // if (response.status !== 200) {
            //     throw new Error(`Error fetching evaluation: ${response.statusText}`);
            // }
            // return response.data;
            return mockEvaluationData; // Replace with response.data when using real API
        } catch (error) {
            console.error("Error fetching evaluation:", error);
            return null;
        }
    }

    async getEvaluations() : Promise<Evaluation[] | null> {
        try {
            // const response = await axios.get<Evaluation[]>(`https://api.example.com/evaluations`);
            // if (response.status !== 200) {
            //     throw new Error(`Error fetching evaluations: ${response.statusText}`);
            // }
            // return response.data;
            return mockEvaluations; // Replace with response.data when using real API
        }
        catch (error) {
            console.error("Error fetching evaluations:", error);
            return null;
        }
    }
}