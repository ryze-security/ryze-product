
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScoreCardProps {
  title: string;
  score: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score }) => {
  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center">
      <h3 className="text-lg text-gray-300 mb-2">{title}</h3>
      <p className="text-5xl font-bold text-white">{score}%</p>
    </div>
  );
};

interface ComplianceScoreProps {
  overallScore: number;
  scores: {
    organizational: number;
    people: number;
    physical: number;
    technological: number;
  };
}

const ComplianceScore: React.FC<ComplianceScoreProps> = ({ overallScore, scores }) => {
  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-bold">
          <span className="text-orange">{overallScore}%.</span> 
          <span className="text-white"> Overall compliance score.</span>
        </h2>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full">
          <FileText className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard title="Organizational controls" score={scores.organizational} />
        <ScoreCard title="People controls" score={scores.people} />
        <ScoreCard title="Physical controls" score={scores.physical} />
        <ScoreCard title="Technological controls" score={scores.technological} />
      </div>
    </div>
  );
};

export default ComplianceScore;
