import { Evaluation } from "../models/evaluation/evaluation"; // adjust the import path

export const mockEvaluationData: Evaluation = {
	Status: "COMPLETED",
	UserId: "user_123",
	TenantId: "tenant_001",
    ClientId: "CL001",
	PolicyId: "policy_456",
	EvaluationId: "eval_789",
	updateTimestamp: Date.now().toString(),
	frameworkId: "framework_XYZ",
	EvaluationResponse: {
		DomainResponseList: [
			{
				Order: 1,
				domainId: "domain_A",
				Description: "Data Security",
				ControlResponseList: [
					{
						Order: 1,
						controlId: "control_1",
						Description: "Access Control",
						QuestionResponseList: [
							{
								Order: 1,
								controlId: "question_1",
								Description: "Is multi-factor authentication implemented?",
								Response: {
									Score: 4,
									Observation: "MFA enabled for all admins.",
									Reference: "Policy Sec-001",
								},
							},
							{
								Order: 2,
								controlId: "question_2",
								Description: "Are access logs reviewed periodically?",
								Response: {
									Score: 3,
									Observation: "Logs are reviewed monthly.",
									Reference: "Audit Doc-2024",
								},
							},
						],
						Response: {
							Score: 3.5,
							Observation: "Overall access control measures are strong.",
							Reference: "Access Control Summary",
						},
					},
				],
				Response: {
					Score: 3.5,
					Observation: "Data security domain is mostly compliant.",
					Reference: "DataSec Summary",
				},
			},
		],
		Response: {
			Score: 3.5,
			Observation: "Evaluation complete with minor gaps.",
			Reference: "Eval-Report-001",
		},
	},
};

export const mockEvaluations: Evaluation[] = [
	{
		Status: "COMPLETED",
		UserId: "user_001",
		TenantId: "tenant_A",
        ClientId: "CL001",
		PolicyId: "policy_001",
		EvaluationId: "eval_001",
		updateTimestamp: new Date().toLocaleDateString(),
		frameworkId: "framework_01",
		EvaluationResponse: {
			DomainResponseList: [
				{
					Order: 1,
					domainId: "domain_01",
					Description: "Network Security",
					ControlResponseList: [
						{
							Order: 1,
							controlId: "control_01",
							Description: "Firewall Configuration",
							QuestionResponseList: [
								{
									Order: 1,
									controlId: "question_01",
									Description: "Is a firewall in place?",
									Response: {
										Score: 50,
										Observation: "Firewall configured and monitored",
										Reference: "NetSec-001",
									},
								},
							],
							Response: {
								Score: 50,
								Observation: "Excellent firewall management",
								Reference: "Control-Ref-001",
							},
						},
					],
					Response: {
						Score: 50,
						Observation: "Strong perimeter defense",
						Reference: "Domain-Ref-01",
					},
				},
			],
			Response: {
				Score: 50,
				Observation: "Network security is top-notch",
				Reference: "Eval-Summary-001",
			},
		},
	},
	{
		Status: "IN_PROGRESS",
		UserId: "user_002",
		TenantId: "tenant_B",
        ClientId: "L002",
		PolicyId: "policy_002",
		EvaluationId: "eval_002",
		updateTimestamp: new Date(Date.now() - 86000000).toLocaleDateString(),
		frameworkId: "framework_02",
		EvaluationResponse: {
			DomainResponseList: [
				{
					Order: 1,
					domainId: "domain_02",
					Description: "Data Privacy",
					ControlResponseList: [
						{
							Order: 1,
							controlId: "control_02",
							Description: "Data Encryption",
							QuestionResponseList: [
								{
									Order: 1,
									controlId: "question_02",
									Description: "Is sensitive data encrypted at rest?",
									Response: {
										Score: 40,
										Observation: "Data is encrypted using AES-256",
										Reference: "Data-Policy-001",
									},
								},
							],
							Response: {
								Score: 40,
								Observation: "Mostly compliant with encryption standards",
								Reference: "Control-Ref-002",
							},
						},
					],
					Response: {
						Score: 40,
						Observation: "Strong data privacy measures in place",
						Reference: "Domain-Ref-02",
					},
				},
			],
			Response: {
				Score: 40,
				Observation: "Evaluation progressing well",
				Reference: "Eval-Summary-002",
			},
		},
	},
];
