
import React from 'react';
import Navbar from '@/components/Navbar';
import { FileExport } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ControlTable from '@/components/ControlTable';

const OrganizationalControls = () => {
  const score = 78;
  
  const controls = [
    {
      id: '5.1',
      title: 'Policies for information security',
      description: 'Information security policy and topic-specific policies should be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties, and reviewed at planned intervals and if significant changes occur.',
      compliance: 75,
    },
    {
      id: '5.2',
      title: 'Information security roles and responsibilities',
      description: 'Information security roles and responsibilities should be defined and allocated according to organization needs.',
      compliance: 85,
    },
    {
      id: '5.3',
      title: 'Segregation of duties',
      description: 'Conflicting duties and conflicting areas of responsibility should be segregated.',
      compliance: 80,
    },
    {
      id: '5.4',
      title: 'Management responsibilities',
      description: 'Management should require all personnel to apply information security in accordance with the information security policy, topic-specific policies and procedures of the organization.',
      compliance: 80,
    },
    {
      id: '5.5',
      title: 'Contact with authorities',
      description: 'The organization should establish and maintain contact with relevant authorities.',
      compliance: 100,
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Navbar />
      <div className="container mx-auto">
        <div className="flex items-center justify-between my-8">
          <h2 className="text-4xl font-bold">
            <span className="text-orange">{score}%.</span> 
            <span className="text-white"> Alignment with organizational controls.</span>
          </h2>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full">
            <FileExport className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <ControlTable 
          controls={controls}
          showType={false}
          showMissingElements={false}
          showDescription={true}
        />
      </div>
    </div>
  );
};

export default OrganizationalControls;
