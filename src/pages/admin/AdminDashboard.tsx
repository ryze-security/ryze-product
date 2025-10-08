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
        { id: 3, label: "Contact Us Forms", iconName: "reports" },
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
            case 3:
                return (
                    <div>Contact us form</div>
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