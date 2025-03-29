
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const FrameworkSelection = () => {
  const [selectedFramework, setSelectedFramework] = useState('');

  const frameworks = [
    { 
      id: 'iso27001', 
      name: 'ISO 27001', 
      description: 'Information security standard with requirements for establishing, implementing, maintaining, and continually improving an information security management system (ISMS)'
    },
    { 
      id: 'nist', 
      name: 'NIST Cybersecurity Framework', 
      description: 'Framework of standards, guidelines, and best practices to manage cybersecurity-related risk'
    },
    { 
      id: 'hipaa', 
      name: 'HIPAA', 
      description: 'Regulations for the use and disclosure of Protected Health Information (PHI)'
    },
    { 
      id: 'soc2', 
      name: 'SOC 2', 
      description: 'Auditing procedure that ensures service providers securely manage data to protect client interests and privacy'
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Navbar />
      <div className="container mx-auto max-w-2xl mt-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Select a Framework</h1>
          <p className="text-gray-400">Choose the security framework to evaluate against</p>
        </div>

        <div className="glass-card p-6">
          <RadioGroup value={selectedFramework} onValueChange={setSelectedFramework}>
            <div className="space-y-4">
              {frameworks.map(framework => (
                <div
                  key={framework.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg border ${
                    selectedFramework === framework.id 
                      ? 'border-blue-500 bg-blue-900/20' 
                      : 'border-gray-800 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <RadioGroupItem value={framework.id} id={framework.id} />
                  <div className="flex-1 space-y-1">
                    <Label 
                      htmlFor={framework.id}
                      className="text-lg font-medium cursor-pointer flex items-center"
                    >
                      <Shield className="mr-2 h-5 w-5 text-blue-400" />
                      {framework.name}
                    </Label>
                    <p className="text-sm text-gray-400">{framework.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-end mt-8">
          <Link to="/evaluation/document">
            <Button 
              className="bg-white hover:bg-gray-200 text-black" 
              disabled={!selectedFramework}
            >
              Continue
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FrameworkSelection;
