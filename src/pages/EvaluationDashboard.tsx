import { GenericDataTable } from "@/components/GenericDataTable";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { Evaluation, listEvaluationsDTO } from "@/models/evaluation/EvaluationDTOs";
import evaluationService from "@/services/evaluationServices";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect } from "react";

const columns: ColumnDef<Evaluation>[] = [
    {
        accessorKey: "tg_company_display_name",
        header: "Auditee Title",
    },
    {
        accessorKey: "collection_display_name",
        header: "Controls",
    },
    {
        accessorKey: "overall_score",
        header: "Evaluation Score",
    },
    {
        accessorKey: "created_at",
        header: "Conducted On",
    },
    {
        accessorKey: "created_by",
        header: "Created By",
    },
];

function EvaluationDashboard() {
    const {toast} = useToast();

    const [evaluations, setEvaluations] = React.useState<listEvaluationsDTO | null>({
        evaluations: [],
        total_count: 0,
    });
    const [isEvalLoading, setIsEvalLoading] = React.useState<boolean>(false);

    useEffect(()=>{
        async function fetchEvaluations() {
            setIsEvalLoading(true);
            try {
                const response = await evaluationService.getEvaluations("7077beec-a9ef-44ef-a21b-83aab58872c9");
                if (response.total_count !== 0){
                    response.evaluations = response.evaluations.map((evaluation: Evaluation) => {
                        return {
                            ...evaluation,
                            overall_score: Number.parseFloat(evaluation.overall_score.toFixed(2)),
                            created_at: new Date(evaluation.created_at).toLocaleDateString(),
                            collection_created_at: new Date(evaluation.collection_created_at).toLocaleDateString(),
                            collection_edited_on: new Date(evaluation.collection_edited_on).toLocaleDateString(),
                        }
                    })
                }
                setEvaluations(response);
            } catch (error) {
                toast({
                    title: "Error",
                    description: `Failed to fetch your data. Exiting with error: ${error}`,
                    variant: "destructive",
                })
            } finally {
                setIsEvalLoading(false);
            }
        }

        fetchEvaluations();
    },[])


	return (
		<div className="min-h-screen font-roboto bg-black text-white p-6">
			<section className="flex justify-center items-center w-full bg-black text-white pb-0 pt-10 px-6 sm:px-12 lg:px-16">
				<PageHeader
					heading="Past reviews"
					subtitle="Browse through previously completed reviews to track progress and revisit findings."
					buttonText="Add"
					variant="add"
					buttonUrl="/new-evaluation"
				/>
			</section>

			<section className="flex items-center w-full bg-black text-white mt-8 pt-10 px-6 sm:px-12 lg:px-16">
				<GenericDataTable
					columns={columns}
					data={evaluations.evaluations}
					filterKey="tg_company_display_name"
					rowIdKey={["tg_company_id", "eval_id"]}
					rowLinkPrefix="#"
					isLoading={isEvalLoading}
				/>
			</section>
		</div>
	);
}

export default EvaluationDashboard;
