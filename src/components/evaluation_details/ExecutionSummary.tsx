import React, { useCallback, useEffect, useRef } from "react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import html2pdf from "html2pdf.js"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


// Type definitions for html2pdf options
interface Html2PdfOptions {
    margin?: number | [number, number] | [number, number, number, number];
    filename?: string;
    image?: {
        type: 'jpeg' | 'png' | 'webp';
        quality: number;
    };
    html2canvas?: {
        scale: number;
        logging?: boolean;
        useCORS?: boolean;
        allowTaint?: boolean;
    };
    jsPDF?: {
        unit: 'mm' | 'cm' | 'in' | 'px' | 'pt' | 'em' | 'ex';
        format: string;
        orientation: 'portrait' | 'landscape';
        compress?: boolean;
    };
    pagebreak?: {
        avoid?: string[];
        mode?: string[];
    };
}

// Interfaces
interface NonCompliance {
    control_id: string;
    controlTitle: string;
    severity: string;
    observations: string;
}

interface Severity {
    critical: number;
    high: number,
    medium: number,
    low: number,
}

interface EvalDomains {
    "Information Security Domain": number;
    "Organization of Information Security": number;
    "Threat Intelligence": number;
    "Asset Management": number;
    "Access Control": number;
    "Supplier Relationships": number;
    "Information security in use of cloud": number;
    "Information Security Incident Management": number;
    "Information Security Aspects of Business Continuity Management": number;
    "Compliance": number;
    "Human Resource Security": number;
    "Physical and Environmental Security": number;
    "Operations Security": number;
    "Network Security": number;
    "Cryptography": number;
    "System Acquisition, Development and Maintenance": number;
}

interface ExecutionSummaryData {
    company: string;
    framework: string;
    overallComplianceScore: number;
    controlCategoryScores: {
        [controlName: string]: number;
    },
    controlsSeverityBreakdown: {
        scoreBelow50: Severity
        scoreAbove50: Severity,
        scoreAbove75: Severity,
    }
    EvalDomains: EvalDomains;
    nonCompliances: NonCompliance[];
}


interface ExecutionSummaryProps {
    data: ExecutionSummaryData;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const ControlCard = ({ controlName, percentage }: { controlName: string, percentage: number }) => {
    return (
        <div className={`flex flex-col max-w-32 w-fit p-3 justify-center gap-2  rounded-xl
            ${percentage >= 75
                ? 'bg-[#d5e7cd]'
                : percentage >= 50
                    ? 'bg-[#ffe9d3]'
                    : 'bg-[#ffd3d2]'
            }`}>
            <span className="text-sm">{controlName}</span>
            <span className="font-extrabold text-2xl">{percentage}%</span>
        </div>
    )
}

// CSS for page break handling
const pageBreakStyles = `
    .avoid-break {
        page-break-inside: avoid;
        break-inside: avoid;
    }
    
    .table-row-container {
        display: flex;
        page-break-inside: avoid;
        break-inside: avoid;
    }
`;

// Compliance Chart Component
interface ComplianceChartProps {
    data: Array<{ name: string; score: number; fullName: string }>;
}

const ComplianceChart: React.FC<ComplianceChartProps> = ({ data }) => {
    return (
        <div className="flex-[35] bg-gradient-to-br from-[#f8f5ff] to-[#f2f2f2] flex flex-col items-center justify-center p-6 pb-0 rounded-lg">
            <ResponsiveContainer width="100%">
                <AreaChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#B05BEF" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#B05BEF" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        tick={{ fontSize: 11, fill: '#555', fontWeight: 500 }}
                        axisLine={{ stroke: '#ccc' }}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 12, fill: '#333' }}
                        axisLine={{ stroke: '#ccc' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#B05BEF"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};





const ExecutionSummary: React.FC<ExecutionSummaryProps> = ({
    data,
    isOpen,
    setIsOpen,
}) => {

    const documentRef = useRef<HTMLDivElement | null>(null);

    const radarData = Object.entries(data.EvalDomains).map(([domain, score]) => ({
        name: domain.length > 20 ? domain.substring(0, 17) + '...' : domain,
        score: Number(score),
        fullName: domain
    }));

    // Generates A1, A2, A3, ...
    // const radarData = Object.entries(data.EvalDomains).map(([domain, score], index) => ({
    //     name: `A${index + 1}`,
    //     score: Number(score),
    //     fullName: domain                // Keep the original full name
    // }));


    const exportPDF = useCallback((): void => {
        const elem = documentRef.current;

        if (!elem) {
            console.error("Document reference not found");
            return;
        }

        const opt: Html2PdfOptions = {
            margin: [8, 4, 4, 4] as [number, number, number, number], // top, left, bottom, right in mm
            filename: `${data.company}-execution-summary.pdf`,
            image: {
                type: 'png', // Better quality than jpeg
                quality: 0.98 // High quality (0-1)
            },
            html2canvas: {
                scale: 2, // Higher scale for better resolution
                logging: false,
                useCORS: true, // Allow cross-origin images
                allowTaint: true // Allow tainted canvas
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true // Compress PDF for smaller file size
            },
            pagebreak: {
                avoid: ['tr', '.avoid-break'],
                mode: ['css', 'legacy']
            }
        };

        // Create instance and generate PDF
        html2pdf()
            .set(opt)
            .from(elem)
            .save()
            .catch((error: Error) => {
                console.error('PDF export failed:', error);
            });
    }, [data.company]);

    // Trigger PDF export when dialog closes
    useEffect(() => {
        if (!isOpen) {
            exportPDF();
        }
    }, [isOpen, exportPDF])


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="flex  justify-center items-start p-4 bg-gray-200  text-black  max-w-screen min-h-[34vh]">
                <style>{pageBreakStyles}</style>
                <ScrollArea className="w-full max-w-7xls max-w-[210mm] h-[100vh]">
                    <div ref={documentRef} className="flex flex-col gap-8 text-black font-roboto" style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}> {/** Using these fonts because they are pretty accurate to SF Pro Display*/}

                        {/* PAGE 1 */}
                        <section className="bg-white w-full shadow-lg p-10 flex gap-y-2 flex-col">

                            <h1 className="font-extrabold text-5xl tracking-wide">{data.company}</h1>
                            <h2 className="rounded-full bg-black px-8 pt-1 py-1 tracking-wide text-white w-fit text-xs font-bold">{data.framework}</h2>

                            <h2 className="text-2xl mt-6">
                                <span className="font-semibold text-violet-light-ryzr">{data.overallComplianceScore}%.</span>
                                Overall compliance.
                            </h2>

                            {/* Cards */}
                            <div className="flex flex-wrap gap-2 ">
                                {Object.entries(data.controlCategoryScores).map(([controlName, percentage]) => {
                                    return <ControlCard controlName={controlName} percentage={percentage} />
                                })}
                            </div>

                            {/* Main Container for  chart and table */}
                            <div className="flex flex-col gap-y-3 mt-6">
                                <h2 className="text-2xl font-extrabold tracking-wide">Security Posture.</h2>

                                <div className="flex gap-x-4">
                                    <ComplianceChart data={radarData} />

                                    {/* Table */}
                                    <div className="flex flex-col gap-y-1 flex-[65]">
                                        {/* column */}
                                        <div className="flex gap-1">
                                            <p className="flex-[75] pl-1 pt-0.5 text-center font-medium text-xs bg-black text-white rounded">Information Security Domain</p>
                                            <p className="flex-[25] text-center font-medium pt-0.5 text-xs bg-black text-white rounded">Compliance</p>
                                        </div>

                                        {/* rows */}
                                        {Object.entries(data.EvalDomains).map(([domain, percentage]) => {
                                            return (
                                                <div className="flex gap-1">
                                                    <p className={`flex-[75] pl-1 font-medium text-xs pt-0.5 rounded
                                                    ${percentage >= 75
                                                            ? 'bg-[#d5e7cd]'
                                                            : percentage >= 50
                                                                ? 'bg-[#ffe9d3]'
                                                                : 'bg-[#ffd3d2]'
                                                        }`
                                                    }>{domain}</p>
                                                    <p className={`flex-[25] text-center flex justify-center items-center font-medium text-xs pt-0.5 rounded
                                                    ${percentage >= 75
                                                            ? 'bg-[#d5e7cd]'
                                                            : percentage >= 50
                                                                ? 'bg-[#ffe9d3]'
                                                                : 'bg-[#ffd3d2]'
                                                        }    
                                                        `}>{percentage}%</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Severity Breakdown */}
                            <div className="flex flex-col mt-6">
                                <h2 className="text-2xl font-extrabold tracking-wide text-[#a6a6a6]">Breakdown as per control severity</h2>

                                {/* cards */}
                                <div className="flex gap-x-1 w-full flex-1 mt-3">
                                    {Object.entries(data.controlsSeverityBreakdown)
                                        .sort(([keyA], [keyB]) => {
                                            const order = ['scoreBelow50', 'scoreAbove50', 'scoreAbove75'];
                                            return order.indexOf(keyA) - order.indexOf(keyB);
                                        })
                                        .map(([key, value]) => {
                                            return (
                                                <div className={`flex flex-col p-6 rounded w-full h-full text-sm 
                                            ${key === "scoreBelow50" ? 'flex-[50]  bg-[#ffd3d2]' :
                                                        key === "scoreAbove50" ? 'flex-[25] bg-[#ffe9d3]' :
                                                            'flex-[25] bg-[#d5e7cd]'
                                                    } `}>
                                                    {Object.entries(value).map(([severity, severityNumber]) => {
                                                        return (
                                                            <div className="flex justify-between items-center">
                                                                {/* for first div only */}
                                                                {key === 'scoreBelow50' && <span>{severity.charAt(0).toUpperCase() + severity.slice(1)}.</span>}

                                                                {severity.charAt(0).toUpperCase()}. {severityNumber} controls.

                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )
                                        })}
                                </div>

                                <div className="mt-1 flex text-xs text-[#a6a6a6]  gap-2">
                                    <div className="flex-[50] flex justify-between">
                                        <span>Compliance</span>
                                        <span>50%</span>
                                    </div>
                                    <div className="flex-[25] text-end">75%</div>
                                    <div className="flex-[25] text-end">100%</div>
                                </div>
                            </div>
                        </section>

                        {/* PAGE  2 and more... */}
                        <section className="bg-white w-full shadow-lg p-10 flex gap-y-4 flex-col">
                            <h1 className="font-extrabold text-4xl break-before-avoid-page">Key non-compliances.</h1>

                            <div className="flex flex-col gap-y-1 flex-[65]">
                                {/* column */}
                                <div className="flex gap-1">
                                    <p className="flex-[5] p-1 px-2 text-center font-medium text-sm bg-black text-white rounded-md">#</p>
                                    <p className="flex-[25] p-1 px-2 text-center font-medium text-sm bg-black text-white rounded-md">Control Title</p>
                                    <p className="flex-[10] p-1 px-2 text-center font-medium text-sm bg-black text-white rounded-md">Severity</p>
                                    <p className="flex-[60] p-1 px-2 text-center font-medium text-sm bg-black text-white rounded-md">Observations</p>
                                </div>

                                {/* rows */}
                                {data.nonCompliances.map((control) => {
                                    return (
                                        <div className="flex gap-1 table-row-container">
                                            <p className="flex-[5] flex p-1 px-2  font-medium justify-center items-center text-sm bg-gray-200 text-black rounded-md">{control.control_id.replace("c_", "")}</p>
                                            <p className="flex-[25] flex p-1 px-2  font-medium text-sm bg-gray-200 text-black rounded-md">{control.controlTitle}</p>
                                            <p className="flex-[10] flex p-1 px-2  font-medium justify-center items-center text-sm bg-gray-200 text-black rounded-md">{control.severity}</p>
                                            <p className="flex-[60] flex p-1 px-2  font-medium  text-sm bg-gray-200 text-black rounded-md">{control.observations}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>

                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ExecutionSummary;
