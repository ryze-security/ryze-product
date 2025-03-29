
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Question {
  id: string;
  text: string;
  compliant: boolean;
  observation: string;
}

const ControlQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock data for the control
  const controlData = {
    id: id || "5.15",
    title: "Access Control",
    description: "Rules to control physical and logical access to information and other associated assets should be established and implemented based on business and information security requirements.",
    compliance: 75,
    questions: [
      {
        id: '01',
        text: 'Does the company enforce physical access controls to restrict access to physical locations where information or assets are stored?',
        compliant: false,
        observation: 'The policy focuses primarily on logical access controls but does not address physical access controls.'
      },
      {
        id: '02',
        text: 'Are restrictions in place for privileged access to ensure only authorized personnel have elevated permissions?',
        compliant: true,
        observation: 'The policy has strong controls for privileged access, including authorization requirements and monitoring.'
      },
      {
        id: '03',
        text: 'Conflicting duties and conflicting areas of responsibility should be segregated.',
        compliant: true,
        observation: 'The policy defines segregation of duties through clear role definitions and separated responsibilities.'
      },
      {
        id: '04',
        text: 'Does the policy ensure that access to information is granted based on the need-to-know principle?',
        compliant: true,
        observation: 'The policy establishes the need-to-know principle as a fundamental requirement for access control.'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Navbar />
      <div className="container mx-auto">
        <div className="flex items-center my-8">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-4xl font-bold flex items-center">
            <span className="text-gray-500">{controlData.id}</span>
            <span className="ml-4 text-white">{controlData.title}</span>
          </h2>
          <div className="ml-auto">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full">
              <FileText className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <p className="text-gray-300 mb-8">{controlData.description}</p>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl text-gray-400">Evaluations</h3>
          <div className="flex items-center">
            <span className="text-orange mr-2">Compliance:</span>
            <span className="text-orange font-bold text-xl">{controlData.compliance}%</span>
          </div>
        </div>

        <div className="glass-card p-4 mb-8">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow>
                <TableHead className="text-gray-300 w-24">Q. No.</TableHead>
                <TableHead className="text-gray-300">Control check</TableHead>
                <TableHead className="text-gray-300 w-32 text-center">Compliance</TableHead>
                <TableHead className="text-gray-300">Observation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controlData.questions.map((question) => (
                <TableRow 
                  key={question.id} 
                  className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800"
                >
                  <TableCell className="font-medium">{question.id}</TableCell>
                  <TableCell>
                    <Link to={`/control/${controlData.id}/question/${question.id}`} className="hover:text-blue-400">
                      {question.text}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <span 
                        className={`px-4 py-1 rounded-full text-sm ${question.compliant ? 'bg-green-500' : 'bg-red-500'}`}
                      >
                        {question.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{question.observation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-xl mb-4 text-orange">Compliance</h3>
            <h3 className="text-xl mb-4 text-orange">{controlData.compliance}%</h3>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg text-sm">
            The access control policy supports logical access through need-to-know principles, segregation of duties, and privileged access controls. However, it lacks provisions for physical access controls to secure locations housing sensitive information and assets, highlighting a critical gap.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlQuestions;
