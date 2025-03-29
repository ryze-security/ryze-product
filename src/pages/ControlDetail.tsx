
import React from 'react';
import Navbar from '@/components/Navbar';
import DetailedControl from '@/components/DetailedControl';

const ControlDetail = () => {
  const checkItems = [
    {
      id: '01',
      question: 'Does the company enforce physical access controls to restrict access to physical locations where information or assets are stored?',
      compliant: false,
      observation: 'The policy focuses primarily on logical access controls but does not address physical access controls.'
    },
    {
      id: '02',
      question: 'Are restrictions in place for privileged access to ensure only authorized personnel have elevated permissions?',
      compliant: true,
      observation: 'The policy has strong controls for privileged access, including authorization requirements and monitoring.'
    },
    {
      id: '03',
      question: 'Conflicting duties and conflicting areas of responsibility should be segregated.',
      compliant: true,
      observation: 'The policy defines segregation of duties through clear role definitions and separated responsibilities.'
    },
    {
      id: '04',
      question: 'Does the policy ensure that access to information is granted based on the need-to-know principle?',
      compliant: true,
      observation: 'The policy establishes the need-to-know principle as a fundamental requirement for access control.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Navbar />
      <div className="container mx-auto">
        <DetailedControl 
          controlId="5.15"
          controlTitle="Access Control"
          description="Rules to control physical and logical access to information and other associated assets should be established and implemented based on business and information security requirements."
          compliance={75}
          checkItems={checkItems}
          onPrevious={() => console.log('Previous')}
          onNext={() => console.log('Next')}
        />
      </div>
    </div>
  );
};

export default ControlDetail;
