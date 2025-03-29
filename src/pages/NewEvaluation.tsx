
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileSearch } from 'lucide-react';
import Navbar from '@/components/Navbar';

const NewEvaluation = () => {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Navbar />
      <div className="container mx-auto flex flex-col items-center justify-center max-w-2xl mt-20">
        <div className="glass-card p-8 text-center">
          <div className="bg-blue-500/20 p-4 rounded-full inline-flex items-center justify-center mb-6">
            <FileSearch className="h-12 w-12 text-blue-400" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Start a New Evaluation</h1>
          <p className="text-gray-300 mb-8">
            Create a new gap analysis to evaluate your security policies against industry standards and frameworks.
          </p>

          <div className="flex flex-col gap-4">
            <Link to="/evaluation/company">
              <Button className="bg-white text-black hover:bg-gray-200 w-full py-6 text-lg">
                Start New Evaluation
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="w-full py-6 text-lg">
                View Existing Evaluations
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEvaluation;
