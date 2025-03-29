
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, ClipboardList } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">SecurityGap</h1>
        <p className="text-xl text-gray-300 max-w-2xl">
          Evaluate security policies against industry standards through automated gap analysis
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <Link to="/evaluation/company" className="w-full">
          <div className="glass-card p-8 text-center h-full flex flex-col items-center justify-center hover:border hover:border-blue-500 transition-all">
            <div className="bg-blue-500/20 p-4 rounded-full inline-flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Start New Evaluation</h2>
            <p className="text-gray-400 mb-6">
              Upload security policies and evaluate them against industry frameworks
            </p>
            <Button className="bg-white text-black hover:bg-gray-200 w-full py-6 text-lg">
              Start New Evaluation
            </Button>
          </div>
        </Link>
        
        <Link to="/evaluations" className="w-full">
          <div className="glass-card p-8 text-center h-full flex flex-col items-center justify-center hover:border hover:border-purple-500 transition-all">
            <div className="bg-purple-500/20 p-4 rounded-full inline-flex items-center justify-center mb-6">
              <ClipboardList className="h-12 w-12 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Review Evaluations</h2>
            <p className="text-gray-400 mb-6">
              View and analyze your previous security policy evaluations
            </p>
            <Button variant="outline" className="w-full py-6 text-lg">
              View Evaluations
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Index;
