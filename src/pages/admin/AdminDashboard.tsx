import PageHeader from "@/components/PageHeader";
import NavHeader from "@/components/evaluation_details/nav-header";
import UsersDashboard from "./UsersDashboard";
import TenantsDashboard from "./TenantsDashboard";

import { DynamicIcons } from "@/components/DynamicIcons";
import { useState } from "react";
import CreditsRequested from "./CreditsOrFrameWorkRequested";

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    const adminTabs = [
        { id: 0, label: "Users", iconName: "Users" },
        { id: 1, label: "Tenants", iconName: "Tenants" },
        { id: 2, label: "Credits Required", iconName: "Credits" },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 0:
                return (
                    <UsersDashboard />
                );
            case 1:
                return (
                    <TenantsDashboard />
                );
            case 2:
                return (
                    <CreditsRequested />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen font-roboto bg-black text-white p-6">
            <section className="flex flex-col w-full bg-black text-white pb-0 pt-16 lg:pt-10 px-3 sm:px-6 md:px-4 lg:px-16">
                <div className="max-w-7xl flex flex-col sm:flex-row justify-between rounded-2xl bg-gradient-to-b from-[#B05BEF] to-[black] w-full p-0 sm:p-6 pb-10">
                    <div className="flex flex-col space-y-4 p-6">
                        <h1 className="text-6xl font-bold">Admin Dashboard</h1>
                        <h3>Overview of your organization's metrics and user management</h3>
                    </div>
                </div>

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