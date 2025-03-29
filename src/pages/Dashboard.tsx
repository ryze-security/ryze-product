
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ControlTable from '@/components/ControlTable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const Dashboard = () => {
  const { id } = useParams();
  const [selectedDomain, setSelectedDomain] = useState('organizational');
  
  const overallScore = 73;
  const domains = {
    organizational: {
      name: 'Organizational',
      score: 78,
      controls: [
        {
          id: '5.1',
          title: 'Policies for information security',
          compliance: 75,
          missingElements: 'Lack of periodic reviews of policies.'
        },
        {
          id: '5.2',
          title: 'Information security roles and responsibilities',
          compliance: 85,
          missingElements: 'Roles and responsibilities for information security are not communicated consistently.'
        },
        {
          id: '5.3',
          title: 'Segregation of duties',
          compliance: 80,
          missingElements: 'Inconsistent application of the principles of least privilege and need-to-know.'
        }
      ]
    },
    people: {
      name: 'People',
      score: 85,
      controls: [
        {
          id: '6.1',
          title: 'Screening',
          compliance: 90,
          missingElements: 'Minor inconsistencies in background verification processes.'
        },
        {
          id: '6.2',
          title: 'Terms and conditions of employment',
          compliance: 85,
          missingElements: 'Information security responsibilities not clearly stated in some employment contracts.'
        }
      ]
    },
    physical: {
      name: 'Physical',
      score: 60,
      controls: [
        {
          id: '7.1',
          title: 'Physical security perimeter',
          compliance: 65,
          missingElements: 'Inadequate physical barriers and entry controls.'
        },
        {
          id: '7.2',
          title: 'Physical entry controls',
          compliance: 55,
          missingElements: 'Visitor logs not consistently maintained.'
        }
      ]
    },
    technological: {
      name: 'Technological',
      score: 72,
      controls: [
        {
          id: '8.1',
          title: 'User endpoint devices',
          compliance: 70,
          missingElements: 'Inconsistent endpoint protection measures.'
        },
        {
          id: '8.2',
          title: 'Privileged access rights',
          compliance: 75,
          missingElements: 'Some privileged accounts not reviewed regularly.'
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Navbar />
      <div className="container mx-auto">
        <div className="flex items-center my-8">
          <Link to="/evaluations">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">
            Evaluation Dashboard
            <span className="text-gray-400 ml-2 text-2xl">
              {id && `(ID: ${id})`}
            </span>
          </h1>
        </div>

        <div className="mb-8">
          <div className="text-xl mb-4">Overall Compliance Score: <span className="text-orange font-bold">{overallScore}%</span></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(domains).map(([key, domain]) => (
              <Card 
                key={key}
                className={`p-6 cursor-pointer transition-all ${selectedDomain === key ? 'bg-gray-800 border-blue-500' : 'bg-gray-900 hover:bg-gray-800'}`}
                onClick={() => setSelectedDomain(key)}
              >
                <div className="text-lg font-medium">{domain.name}</div>
                <div className="mt-2 flex items-center">
                  <div className="progress-bar w-full">
                    <div 
                      className={`progress-value ${selectedDomain === key ? 'bg-blue-500' : 'bg-purple'}`} 
                      style={{ width: `${domain.score}%` }} 
                    />
                  </div>
                  <span className="ml-2 font-bold">{domain.score}%</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">{domains[selectedDomain].name} Controls</h2>
          <ControlTable controls={domains[selectedDomain].controls} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
