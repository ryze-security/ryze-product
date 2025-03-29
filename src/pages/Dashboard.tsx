
import React from 'react';
import Navbar from '@/components/Navbar';
import ComplianceScore from '@/components/ComplianceScore';
import ControlTable from '@/components/ControlTable';

const Dashboard = () => {
  const overallScore = 73;
  const scores = {
    organizational: 78,
    people: 85,
    physical: 60,
    technological: 72
  };

  const controls = [
    {
      id: '5.1',
      title: 'Policies for information security',
      type: 'Organizational control',
      compliance: 75,
      missingElements: 'Lack of periodic reviews of policies.'
    },
    {
      id: '5.2',
      title: 'Information security roles and responsibilities',
      type: 'Organizational control',
      compliance: 85,
      missingElements: 'Roles and responsibilities for information security are not communicated consistently.'
    },
    {
      id: '5.3',
      title: 'Segregation of duties',
      type: 'Organizational control',
      compliance: 80,
      missingElements: 'Inconsistent application of the principles of least privilege and need-to-know.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Navbar />
      <div className="container mx-auto">
        <ComplianceScore overallScore={overallScore} scores={scores} />
        <ControlTable controls={controls} />
      </div>
    </div>
  );
};

export default Dashboard;
