import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Users, FileText, ShieldCheck, Activity, ArrowUp, ArrowDown, Globe, UserPlus, AlertCircle, ClipboardList, FileText as FileTextIcon, FileBarChart2, BarChart3 } from 'lucide-react';
import { useMemo } from 'react';
import FormSubmissionsTable from './FormSubmissionsTable';
import CreditsRequired from './CreditsRequired';

// Custom label component for the pie chart
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name
}: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
    name: string;
}) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="text-xs font-medium"
        >
            {`${name} ${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
import SmallDisplayCard from "@/components/dashboard/SmallDisplayCard";
import PageHeader from "@/components/PageHeader";

// Type definitions
interface UserStats {
    name: string;
    active: number;
    total: number;
}

interface PieData {
    name: string;
    value: number;
    color: string;
}

// todo:[REPLACE_WITH_API_DATA] Mock data for the dashboard
const userStats: UserStats[] = [
    { name: 'Jan', active: 4000, total: 2400 },
    { name: 'Feb', active: 3000, total: 1398 },
    { name: 'Mar', active: 2000, total: 9800 },
    { name: 'Apr', active: 2780, total: 3908 },
    { name: 'May', active: 1890, total: 4800 },
    { name: 'Jun', active: 2390, total: 3800 },
];

const pieData: PieData[] = [
    { name: 'Compliant', value: 65, color: '#8B5CF6' },
    { name: 'Partial Compliance', value: 20, color: '#A78BFA' },
    { name: 'Non-Compliant', value: 10, color: '#C4B5FD' },
    { name: 'Not Evaluated', value: 5, color: '#4B5563' },
];

// Type definitions for our tables
type FormSubmission = {
    id: string;
    name: string;
    email: string;
    submittedAt: string;
};

type CreditRequest = {
    id: string;
    name: string;
    email: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    requestedAt: string;
};

const AdminDashboard: React.FC = () => {
    // Sample data for form submissions
    const formSubmissions: FormSubmission[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com', submittedAt: '2025-10-01T14:30:22' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', submittedAt: '2025-10-01T13:15:45' },
        { id: '3', name: 'Alex Johnson', email: 'alex@example.com', submittedAt: '2025-10-01T11:45:10' },
        { id: '4', name: 'Maria Garcia', email: 'maria@example.com', submittedAt: '2025-09-30T16:22:33' },
        { id: '5', name: 'David Kim', email: 'david@example.com', submittedAt: '2025-09-30T10:05:18' },
    ];

    // Sample data for credit requests
    const creditRequests: CreditRequest[] = [
        { id: '1', name: 'Sarah Wilson', email: 'sarah@example.com', status: 'Pending', requestedAt: '2025-10-01T15:20:10' },
        { id: '2', name: 'Michael Brown', email: 'michael@example.com', status: 'Approved', requestedAt: '2025-10-01T12:45:30' },
        { id: '3', name: 'Emily Davis', email: 'emily@example.com', status: 'Rejected', requestedAt: '2025-09-30T17:10:45' },
        { id: '4', name: 'Robert Taylor', email: 'robert@example.com', status: 'Pending', requestedAt: '2025-09-30T09:30:15' },
    ];

    return (
        <div className="min-h-screen font-roboto bg-black text-white p-6">
            <section className='flex w-full bg-black text-white pb-0 pt-10 px-3 sm:px-6 md:px-4 lg:px-16'>
                <PageHeader
                    heading="Admin Dashboard"
                    subtitle="Overview of your organization's metrics"
                    isClickable={false}
                />
            </section>

            <section className='flex justify-center items-center w-full bg-black text-white pb-0 py-4 px-3 sm:px-6 md:px-4 lg:px-16'>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
                    <SmallDisplayCard
                        title="Website Visitors"
                        value={12234}
                        icon={<Globe className="text-violet-light-ryzr" />}
                    />
                    <SmallDisplayCard
                        title="Total Sign-ups"
                        value={7000}
                        icon={<UserPlus className="text-violet-light-ryzr" />}
                    />
                    <SmallDisplayCard
                        title="Signup failures"
                        value={12}
                        icon={<AlertCircle className="text-violet-light-ryzr" />}
                    />
                    <SmallDisplayCard
                        title="Total Evaluations"
                        value={573}
                        icon={<ClipboardList className="text-violet-light-ryzr" />}
                    />
                </div>
            </section>

            {/* Additional Metrics Section */}
            <section className='flex justify-center items-center w-full bg-black text-white pb-0 py-4 px-3 sm:px-6 md:px-4 lg:px-16'>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
                    <SmallDisplayCard
                        title="Evaluations Run"
                        value={845}
                        icon={<BarChart3 className="text-violet-light-ryzr" />}
                    />
                    <SmallDisplayCard
                        title="Documents Uploaded"
                        value={1.2}
                        suffix="K"
                        icon={<FileTextIcon className="text-violet-light-ryzr" />}
                    />
                    <SmallDisplayCard
                        title="Reports Generated"
                        value={798}
                        icon={<FileBarChart2 className="text-violet-light-ryzr" />}
                    />
                    <SmallDisplayCard
                        title="Report/Evaluation Ratio"
                        value={94.4}
                        suffix="%"
                        icon={<ClipboardList className="text-violet-light-ryzr" />}
                    />
                </div>
            </section>

            {/* Chart Section */}
            <section className='flex justify-center items-center w-full bg-black text-white pb-0 py-4 px-3 sm:px-6 md:px-4 lg:px-16'>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    <Card className="bg-zinc-900 border-zinc-800 h-full">
                        <CardHeader>
                            <CardTitle>User Activity</CardTitle>
                            <CardDescription>Active vs Total users over time</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] min-h-[250px] sm:min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={userStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                                            </linearGradient>
                                            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={{ stroke: '#4A5568' }}
                                            tickLine={{ stroke: '#4A5568' }}
                                            tick={{ fill: '#A0AEC0', fontSize: 12 }}
                                        />
                                        <YAxis
                                            axisLine={{ stroke: '#4A5568' }}
                                            tickLine={{ stroke: '#4A5568' }}
                                            tick={{ fill: '#A0AEC0', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1A202C',
                                                border: '1px solid #2D3748',
                                                borderRadius: '0.5rem',
                                                color: '#E2E8F0'
                                            }}
                                        />
                                        <Legend
                                            wrapperStyle={{
                                                paddingTop: '1rem',
                                                color: '#E2E8F0'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="active"
                                            stroke="#8B5CF6"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2, fill: '#1A202C' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#A78BFA"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 6, stroke: '#A78BFA', strokeWidth: 2, fill: '#1A202C' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-zinc-800 h-full">
                        <CardHeader>
                            <CardTitle>Security Compliance</CardTitle>
                            <CardDescription>Overall compliance status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] min-h-[250px] sm:min-h-[300px] flex flex-col items-center">
                                <div className="relative w-full h-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={2}
                                                dataKey="value"
                                                label={renderCustomizedLabel}
                                                labelLine={false}
                                                isAnimationActive={false}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                        stroke="#1F2937"
                                                        strokeWidth={2}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#111827',
                                                    border: '1px solid #374151',
                                                    borderRadius: '0.5rem',
                                                    color: '#F3F4F6',
                                                    padding: '0.75rem 1rem',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    fontSize: '0.875rem'
                                                }}
                                                itemStyle={{
                                                    color: '#F3F4F6',
                                                    padding: '0.25rem 0'
                                                }}
                                                formatter={(value: number, name: string) => [
                                                    <span key="value" className="font-medium text-white">
                                                        {value}%
                                                    </span>,
                                                    <span key="name" className="text-gray-300">
                                                        {name}
                                                    </span>
                                                ]}
                                            />
                                            <Legend
                                                layout="horizontal"
                                                verticalAlign="bottom"
                                                align="center"
                                                wrapperStyle={{
                                                    paddingTop: '0.5rem',
                                                    color: '#E2E8F0',
                                                    fontSize: '0.7rem',
                                                    marginTop: '0.5rem'
                                                }}
                                                iconType="circle"
                                                iconSize={8}
                                                formatter={(value) => (
                                                    <span className="text-gray-300 text-sm hover:text-white transition-colors align-middle">
                                                        {value}
                                                    </span>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                        <div className="text-2xl font-bold text-white">65%</div>
                                        <div className="text-sm text-gray-400">Compliant</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Site Metrics Section */}
            <section className='flex flex-col w-full bg-black text-white py-8 px-3 sm:px-6 md:px-4 lg:px-16'>
                <PageHeader
                    heading="Site Metrics"
                    subtitle="Key metrics for tracking user engagement and form interactions"
                    isClickable={false}
                />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full my-6">
                    <SmallDisplayCard
                        title="Getting Started Clicks"
                        value={3456}
                        icon={<Activity className="text-violet-light-ryzr" />}
                    />
                    <SmallDisplayCard
                        title="Form Interactions"
                        value={2890}
                        icon={<FileText className="text-violet-light-ryzr" />}
                    />
                    <SmallDisplayCard
                        title="Incomplete Submissions"
                        value={1234}
                        icon={<FileText className="text-violet-light-ryzr" />}
                    />
                    <SmallDisplayCard
                        title="Completed Submissions"
                        value={890}
                        icon={<ShieldCheck className="text-violet-light-ryzr" />}
                    />
                </div>

                {/* Form Submissions Table */}
                <FormSubmissionsTable data={formSubmissions} />

                {/* Credit Requests Table */}
                <CreditsRequired creditRequests={creditRequests} />
            </section>
        </div>
    );
};

export default AdminDashboard;