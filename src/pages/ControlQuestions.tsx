
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';

interface QuestionProps {
  id: string;
  text: string;
  compliant: boolean;
  evidence: string;
}

const ControlQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock data for questions in this control
  const questions: QuestionProps[] = [
    {
      id: '01',
      text: 'Does the organization have a documented information security policy?',
      compliant: true,
      evidence: 'Policy document section 1.2 outlines the information security policy.'
    },
    {
      id: '02',
      text: 'Has the information security policy been approved by management?',
      compliant: true,
      evidence: 'Page 2 of the policy shows approval signatures from the executive team.'
    },
    {
      id: '03',
      text: 'Is the information security policy reviewed at planned intervals?',
      compliant: false,
      evidence: 'No evidence of scheduled reviews was found in the policy documentation.'
    },
    {
      id: '04',
      text: 'Is the policy communicated to all employees and relevant parties?',
      compliant: false,
      evidence: 'The policy mentions distribution but lacks specific communication procedures.'
    }
  ];

  // Navigate back to dashboard instead of previous page
  const handleBackClick = () => {
    navigate(`/dashboard/1`);
  };

  const renderQuestionCard = (question: QuestionProps) => {
    const isCompliant = question.compliant;
    
    return (
      <Link 
        to={`/control/${id}/question/${question.id}`} 
        key={question.id}
        className="block"
      >
        <div className={`glass-card p-6 mb-4 border ${
          isCompliant ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'
        } rounded-lg hover:bg-gray-800 transition-colors`}>
          <div className="flex items-start mb-3">
            <div className={`rounded-full p-1 ${
              isCompliant ? 'bg-green-500/20' : 'bg-red-500/20'
            } mr-3`}>
              {isCompliant ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">{question.text}</h3>
              <p className="text-sm text-gray-400 mt-2">
                {question.evidence}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className={`font-medium ${isCompliant ? 'text-green-400' : 'text-red-400'}`}>
                {isCompliant ? 'Compliant' : 'Non-Compliant'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Navbar />
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center my-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Control {id}: Questions</h1>
        </div>
        
        <div className="glass-card p-6 mb-6">
          <h3 className="text-xl font-bold mb-2">Information Security Policies</h3>
          <p className="text-gray-400 mb-4">
            Management should define, approve, publish and communicate an information security policy to all employees and relevant external parties.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Control Questions</h2>
          <div>
            {questions.map(renderQuestionCard)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlQuestions;
