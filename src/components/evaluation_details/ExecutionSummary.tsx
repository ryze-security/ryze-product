import React, { useCallback, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { ExecutiveSummaryDTO } from "@/models/reports/ExecutiveSummaryDTO";


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
        <div className="flex-[35] bg-gradient-to-br from-[#f8f5ff] to-[#f2f2f2] flex flex-col items-center justify-center px-1 pb-0 rounded-lg">
            <ResponsiveContainer width="100%">
                <RadarChart data={data}>
                    <PolarGrid stroke="#000000" />
                    <PolarAngleAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#555', fontWeight: 500 }}
                    />
                    <PolarRadiusAxis
                        angle={60}
                        domain={[0, 100]}
                        tick={{ fontSize: 10, fill: '#333' }}
                    />
                    <Radar
                        name="Compliance Score"
                        dataKey="score"
                        stroke="#B05BEF"
                        fill="#B05BEF"
                        fillOpacity={0.3}
                        isAnimationActive={false}
                        animationDuration={0}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

const escapeHtml = (text: string): string => {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

const renderBoldMarkdownHtml = (text: string): { __html: string } => {
    const escaped = escapeHtml(text);
    const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return { __html: withBold };
};

const formatToOneDecimal = (num: number): number => {
    if (Number.isInteger(num)) {
        return num;
    }
    return parseFloat(num.toFixed(1));
};





const ExecutionSummary: React.FC<{ data: ExecutiveSummaryDTO | null; }> = ({ data }) => {

    const documentRef = useRef<HTMLDivElement | null>(null);


    const exportPDF = useCallback((): void => {
        if (!data) return;

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
                compress: true // Compress PDF for smaller file size (false - 20MB / true - 800KB )
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
    }, [data]);

    useEffect(() => {
        if (!data) return;


        const timeoutId = window.setTimeout(() => {
            exportPDF();
        }, 350);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [data, exportPDF]);

    if (!data) return null;

    // Generates A1, A2, A3, ...
    const radarData = Object.entries(data.controlCategoryScores).map(([domain, score], index) => ({
        name: `A${index + 1}`,
        score: Number(score),
        fullName: domain // Keep the original full name
    }));


    return (
        <div
            // className="absolute inset-0 z-50"
            style={{
                position: "fixed",
                left: "-10000px",
                top: 0,
                width: "210mm",
                background: "white",
            }}
        >
            <style>{pageBreakStyles}</style>
            <div ref={documentRef} className="flex flex-col gap-8 text-black font-roboto" style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}> {/** Using these fonts because they are pretty accurate to SF Pro Display*/}

                {/* PAGE 1 */}
                <section className="bg-white w-full shadow-lg p-10 flex gap-y-2 flex-col">

                    <h1 className="font-extrabold text-5xl tracking-wide">{data.company}</h1>
                    <h2 className="rounded-full bg-black px-8 pt-1 py-1 tracking-wide text-white w-fit text-xs font-bold">{data.framework}</h2>

                    <h2 className="text-2xl mt-6">
                        <span className="font-semibold text-violet-light-ryzr">{formatToOneDecimal(data.overallComplianceScore)}%.</span>
                        Overall compliance.
                    </h2>

                    {/* Cards */}
                    <div className="flex flex-wrap gap-2 ">
                        {Object.entries(data.EvalDomains).map(([domainName, percentage]) => {
                            return <ControlCard controlName={domainName} percentage={formatToOneDecimal(percentage)} />
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
                                    <p className="flex-[10] px-1 pt-0.5 text-center font-medium text-xs bg-black text-white rounded">S.No.</p>
                                    <p className="flex-[70] pl-1 pt-0.5 text-center font-medium text-xs bg-black text-white rounded">Information Security Domain</p>
                                    <p className="flex-[20] text-center font-medium pt-0.5 text-xs bg-black text-white rounded">Compliance</p>
                                </div>

                                {/* rows */}
                                {Object.entries(data.controlCategoryScores).map(([controlName, percentage], index) => {
                                    return (
                                        <div className="flex gap-1">
                                            <p className={`flex-[10] flex justify-center items-center px-1 font-medium text-xs pt-0.5 rounded
                                                    ${percentage >= 75
                                                    ? 'bg-[#d5e7cd]'
                                                    : percentage >= 50
                                                        ? 'bg-[#ffe9d3]'
                                                        : 'bg-[#ffd3d2]'
                                                }`
                                            }>A{index + 1}</p>
                                            <p className={`flex-[70] pl-1 font-medium text-xs pt-0.5 rounded
                                                    ${percentage >= 75
                                                    ? 'bg-[#d5e7cd]'
                                                    : percentage >= 50
                                                        ? 'bg-[#ffe9d3]'
                                                        : 'bg-[#ffd3d2]'
                                                }`
                                            }>{controlName}</p>
                                            <p className={`flex-[20] text-center flex justify-center items-center font-medium text-xs pt-0.5 rounded
                                                    ${percentage >= 75
                                                    ? 'bg-[#d5e7cd]'
                                                    : percentage >= 50
                                                        ? 'bg-[#ffe9d3]'
                                                        : 'bg-[#ffd3d2]'
                                                }    
                                                        `}>{formatToOneDecimal(percentage)}%</p>
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

                                                        <span>{`${severity.charAt(0).toUpperCase()}. ${severityNumber} controls.`}</span>

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
                            <p className="flex-[10] p-1 px-2 text-center font-medium text-sm bg-black text-white rounded-md">#</p>
                            <p className="flex-[20] p-1 px-2 text-center font-medium text-sm bg-black text-white rounded-md">Control Title</p>
                            <p className="flex-[10] p-1 px-2 text-center font-medium text-sm bg-black text-white rounded-md">Severity</p>
                            <p className="flex-[60] p-1 px-2 text-center font-medium text-sm bg-black text-white rounded-md">Observations</p>
                        </div>

                        {/* rows */}
                        {data.nonCompliances
                            .sort((a, b) => {
                                const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                                const aSeverity = severityOrder[a.severity.toLowerCase()] ?? 999;
                                const bSeverity = severityOrder[b.severity.toLowerCase()] ?? 999;
                                return aSeverity - bSeverity;
                            })
                            .map((control) => {
                                return (
                                    <div className="flex gap-1 table-row-container">
                                        <p className="flex-[10] flex p-1 px-2 font-medium text-sm bg-gray-200 text-black rounded-md">{control.control_id.split('_').slice(1).join('_')}</p>
                                        <p className="flex-[20] flex p-1 px-2 font-medium text-sm bg-gray-200 text-black rounded-md">{control.controlTitle}</p>
                                        <p className="flex-[10] flex p-1 px-2 font-medium text-sm bg-gray-200 text-black rounded-md">{control.severity}</p>
                                        <p className="flex-[60] flex p-1 px-2 font-medium text-sm bg-gray-200 text-black rounded-md">
                                            <span dangerouslySetInnerHTML={renderBoldMarkdownHtml(control.observations)} />
                                        </p>
                                    </div>
                                )
                            })}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default ExecutionSummary;
