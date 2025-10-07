import PageHeader from "@/components/PageHeader";
import NavHeader from "@/components/evaluation_details/nav-header";
import { DynamicIcons } from "@/components/DynamicIcons";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UsersDashboard from "./UsersDashboard";

// Mock data for Users
const mockUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive" },
];

// Mock data for Tenants
const mockTenants = [
    { id: 1, name: "Acme Corp", plan: "Enterprise", users: 45, status: "Active" },
    { id: 2, name: "Tech Solutions", plan: "Professional", users: 15, status: "Active" },
    { id: 3, name: "Startup Inc", plan: "Starter", users: 5, status: "Trial" },
];

// Mock data for Credits
const mockCredits = [
    { id: 1, tenant: "Acme Corp", credits: 1000, used: 450, remaining: 550 },
    { id: 2, tenant: "Tech Solutions", credits: 500, used: 150, remaining: 350 },
    { id: 3, tenant: "Startup Inc", credits: 100, used: 20, remaining: 80 },
];

// Mock data for Contact Forms
const mockContactForms = [
    { id: 1, name: "Sarah Miller", email: "sarah@example.com", subject: "Billing Question", status: "New", date: "2023-05-15" },
    { id: 2, name: "Mike Wilson", email: "mike@example.com", subject: "Feature Request", status: "In Progress", date: "2023-05-14" },
    { id: 3, name: "Lisa Brown", email: "lisa@example.com", subject: "Technical Issue", status: "Resolved", date: "2023-05-10" },
];

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    const adminTabs = [
        { id: 0, label: "Users", iconName: "Users" },
        { id: 1, label: "Tenants", iconName: "Tenants" },
        { id: 2, label: "Credits Required", iconName: "Credits" },
        { id: 3, label: "Contact Us Forms", iconName: "Contact" },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 0: // Users
                return (
                    <UsersDashboard/>
                );
            case 1: // Tenants
                return (
                    <Card className="border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Tenant Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-white">Tenant Name</TableHead>
                                        <TableHead className="text-white">Plan</TableHead>
                                        <TableHead className="text-white">Users</TableHead>
                                        <TableHead className="text-right text-white">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockTenants.map((tenant) => (
                                        <TableRow key={tenant.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                            <TableCell className="font-medium text-white">{tenant.name}</TableCell>
                                            <TableCell className="text-zinc-400">{tenant.plan}</TableCell>
                                            <TableCell>{tenant.users}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant={tenant.status === 'Active' ? 'success' : 'default'}>
                                                    {tenant.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                );
            case 2: // Credits Required
                return (
                    <Card className="border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Credits Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-white">Tenant</TableHead>
                                        <TableHead className="text-white">Total Credits</TableHead>
                                        <TableHead className="text-white">Used</TableHead>
                                        <TableHead className="text-right text-white">Remaining</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockCredits.map((credit) => (
                                        <TableRow key={credit.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                            <TableCell className="font-medium text-white">{credit.tenant}</TableCell>
                                            <TableCell>{credit.credits}</TableCell>
                                            <TableCell className="text-amber-400">{credit.used}</TableCell>
                                            <TableCell className="text-right text-green-400">{credit.remaining}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                );
            case 3: // Contact Us Forms
                return (
                    <Card className="border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Contact Forms</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-white">Name</TableHead>
                                        <TableHead className="text-white">Email</TableHead>
                                        <TableHead className="text-white">Subject</TableHead>
                                        <TableHead className="text-white">Date</TableHead>
                                        <TableHead className="text-right text-white">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockContactForms.map((form) => (
                                        <TableRow key={form.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                            <TableCell className="font-medium text-white">{form.name}</TableCell>
                                            <TableCell className="text-zinc-400">{form.email}</TableCell>
                                            <TableCell className="text-zinc-400">{form.subject}</TableCell>
                                            <TableCell className="text-zinc-400">{form.date}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge 
                                                    variant={
                                                        form.status === 'New' ? 'default' : 
                                                        form.status === 'In Progress' ? 'secondary' : 'success'
                                                    }
                                                >
                                                    {form.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen font-roboto bg-black text-white p-6">
            <section className='flex flex-col w-full bg-black text-white pb-0 pt-10 px-3 sm:px-6 md:px-4 lg:px-16 gap-6'>
                <PageHeader
                    heading="Admin Dashboard"
                    subtitle="Overview of your organization's metrics"
                    isClickable={false}
                />

                <div className="w-full">
                    <NavHeader
                        data={adminTabs.map((tab) => ({
                            ...tab,
                            icon: <DynamicIcons name={tab.iconName} />,
                        }))}
                        stepChangefn={setActiveTab}
                        currentStep={activeTab}
                    />
                </div>
            </section>

            <section className="mt-8 px-3 sm:px-6 md:px-4 lg:px-16">
                {renderTabContent()}
            </section>
        </div>
    );
};

export default AdminDashboard;