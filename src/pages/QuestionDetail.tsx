
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Save, Check, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const QuestionDetail = () => {
  const { controlId, questionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data for the question
  const questionData = {
    id: questionId || '01',
    controlId: controlId || '5.15',
    text: 'Does the company enforce physical access controls to restrict access to physical locations where information or assets are stored?',
    compliant: false,
    reference: '(Section 2.3, page 3)',
    evidence: 'The policy focuses primarily on logical access controls but does not address physical access controls for securing locations with sensitive information assets.',
    observation: 'The security policy lacks specific physical access control requirements. It should be updated to include provisions for securing physical locations where sensitive information and assets are stored.'
  };
  
  const [isEditing, setIsEditing] = useState(false);
  const [compliant, setCompliant] = useState(questionData.compliant);
  const [evidence, setEvidence] = useState(questionData.evidence);
  const [observation, setObservation] = useState(questionData.observation);

  const handleSave = () => {
    // In a real app, this would save data to backend
    setIsEditing(false);
    toast({
      title: "Changes saved",
      description: "Your question evaluation has been updated",
    });
  };
  
  const handleCancel = () => {
    // Reset to original values
    setCompliant(questionData.compliant);
    setEvidence(questionData.evidence);
    setObservation(questionData.observation);
    setIsEditing(false);
  };

  // Navigate back to control questions page
  const handleBackClick = () => {
    navigate(`/control/${controlId}/questions`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Navbar />
      <div className="container mx-auto">
        <div className="flex items-center my-8">
          <Button variant="ghost" size="icon" className="mr-2" onClick={handleBackClick}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-3xl font-bold">
            <span className="text-gray-500">{controlId}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-500">Question {questionId}</span>
          </h2>
          <div className="ml-auto">
            {!isEditing ? (
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
                <Button 
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-6 mb-8">
          <h3 className="text-xl font-medium mb-4 pb-4 border-b border-gray-700">Question</h3>
          <p className="text-lg mb-8">{questionData.text}</p>
          
          <div className="mb-6">
            <h4 className="text-gray-400 mb-2 flex items-center justify-between">
              <div>Compliance</div>
            </h4>
            <div className="flex items-center space-x-4">
              <Button
                variant={compliant ? "default" : "outline"}
                className={`rounded-full ${compliant && !isEditing ? 'bg-green-600' : ''}`}
                onClick={() => isEditing && setCompliant(true)}
                disabled={!isEditing}
              >
                {compliant && <Check className="h-4 w-4 mr-2" />}
                Compliant
              </Button>
              <Button
                variant={!compliant ? "default" : "outline"}
                className={`rounded-full ${!compliant && !isEditing ? 'bg-red-600' : ''}`}
                onClick={() => isEditing && setCompliant(false)}
                disabled={!isEditing}
              >
                {!compliant && <X className="h-4 w-4 mr-2" />}
                Non-Compliant
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-gray-400 mb-2 flex items-center justify-between">
              <div>Reference</div>
              <div className="flex space-x-2">
                <span className="bg-gray-800 px-3 py-1 rounded-full text-xs">{questionData.reference}</span>
              </div>
            </h4>
          </div>
          
          <div className="mb-6">
            <h4 className="text-gray-400 mb-2">Evidence</h4>
            {isEditing ? (
              <Textarea 
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
                rows={4}
              />
            ) : (
              <div className="bg-gray-900 p-4 rounded-lg">{evidence}</div>
            )}
          </div>
          
          <div className="mb-6">
            <h4 className="text-gray-400 mb-2">Observation</h4>
            {isEditing ? (
              <Textarea 
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
                rows={4}
              />
            ) : (
              <div className="bg-gray-900 p-4 rounded-lg">{observation}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
