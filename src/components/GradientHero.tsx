
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileUploader from '@/components/FileUploader';
import { Link } from 'react-router-dom';

const GradientHero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Security Policy Gap Analysis
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
            Upload your security policies and instantly check compliance against major frameworks like ISO 27001, NIST, and SOC2.
          </p>
          
          <div className="max-w-3xl mx-auto grid gap-6">
            <Link to="/new-evaluation">
              <Button className="bg-white hover:bg-gray-200 text-black text-lg py-6 px-8 rounded-full w-full">
                Start New Evaluation
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
            
            <div className="relative">
              <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 border-t border-gray-700"></div>
              <div className="relative flex justify-center">
                <span className="bg-black px-4 text-gray-400">or upload directly</span>
              </div>
            </div>
            
            <FileUploader />
          </div>
        </div>
        
        <div className="glass-card p-6 md:p-10 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Upload</h3>
              <p className="text-gray-400">Upload your security policies and documentation</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Analyze</h3>
              <p className="text-gray-400">AI analyzes compliance against selected frameworks</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Results</h3>
              <p className="text-gray-400">Get detailed gap analysis and compliance scores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientHero;
