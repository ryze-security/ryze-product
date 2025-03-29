
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useToast } from "@/hooks/use-toast";

const EvaluationStart = () => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const startEvaluation = () => {
    setIsEvaluating(true);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          setTimeout(() => {
            toast({
              title: "Evaluation complete!",
              description: "Your security policy has been analyzed successfully.",
            });
            navigate('/dashboard/1'); // Navigate to the first evaluation dashboard
          }, 500);
          
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Navbar />
      <div className="container mx-auto max-w-2xl mt-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Start Evaluation</h1>
          <p className="text-gray-400">Review your selections and start the analysis</p>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Evaluation Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Company</span>
                <span>TechSolutions Inc.</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Framework</span>
                <span>ISO 27001</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Documents</span>
                <span>2 files uploaded</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Questions to evaluate</span>
                <span>114 questions</span>
              </div>
            </div>
          </div>
          
          {isEvaluating ? (
            <div className="glass-card p-6 text-center">
              <h3 className="text-lg font-medium mb-4">
                {progress < 100 ? "Analyzing Documents..." : "Analysis Complete!"}
              </h3>
              
              <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <p className="text-gray-400 mb-4">
                {progress < 100 
                  ? `Analyzing and matching policies with framework requirements (${progress}%)`
                  : "All policies have been analyzed successfully!"
                }
              </p>
              
              {progress === 100 && (
                <div className="flex justify-center">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Ready to Start</h3>
              <p className="text-gray-400 mb-6">
                Our AI will analyze your documents against the selected framework.
                This may take several minutes depending on the document size.
              </p>
              
              <Button 
                className="bg-white hover:bg-gray-200 text-black px-6"
                onClick={startEvaluation}
              >
                Start Analysis
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationStart;
