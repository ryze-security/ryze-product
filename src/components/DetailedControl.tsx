
import React from 'react';
import { ChevronLeft, ChevronRight, FileExport, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckItem {
  id: string;
  question: string;
  compliant: boolean;
  observation: string;
}

interface DetailedControlProps {
  controlId: string;
  controlTitle: string;
  description: string;
  compliance: number;
  checkItems: CheckItem[];
  onPrevious?: () => void;
  onNext?: () => void;
}

const DetailedControl: React.FC<DetailedControlProps> = ({
  controlId,
  controlTitle,
  description,
  compliance,
  checkItems,
  onPrevious,
  onNext,
}) => {
  const [activeItem, setActiveItem] = React.useState<CheckItem>(checkItems[0]);

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-bold flex items-center">
          <span className="text-gray-500">{controlId}</span>
          <span className="ml-4 text-white">{controlTitle}</span>
        </h2>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full">
          <FileExport className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <p className="text-gray-300 mb-8">{description}</p>

      <h3 className="text-xl mb-4 text-gray-400">Evaluations</h3>

      <div className="glass-card p-4 mb-8">
        <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
          <div className="font-medium">Question</div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={onPrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 bg-gray-900 text-white rounded-b-lg">
          {activeItem.id}. {activeItem.question}
        </div>

        <div className="mt-6 flex items-center">
          <div className="text-gray-400 mr-2">Found</div>
          <span 
            className={`px-4 py-1 rounded-full mr-2 text-sm ${activeItem.compliant ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            YES
          </span>
          <span 
            className={`px-4 py-1 rounded-full mr-2 text-sm ${!activeItem.compliant ? 'bg-red-500' : 'bg-gray-600'}`}
          >
            NO
          </span>
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6">
          <div className="text-gray-400 mb-2 flex items-center justify-between">
            <div>Reference</div>
            <div className="flex space-x-2">
              <span className="bg-gray-800 px-3 py-1 rounded-full text-xs">(Section 2.3, page 3)</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full text-xs">Other(s)</span>
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg text-sm">
            "{activeItem.compliant ? 'All administrator and privileged user accounts must be based upon job function and authorized by the SRO" (Policy Statements section). Further, all changes to privileged accounts must be logged and regularly reviewed' : 'No specific policy found regarding this control'}"
          </div>
        </div>

        <div className="mt-6">
          <div className="text-gray-400 mb-2 flex items-center">
            <div>Observation</div>
            <Button variant="ghost" size="icon" className="ml-2">
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg text-sm">
            {activeItem.observation}
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-xl mb-4 text-orange">Compliance</h3>
          <h3 className="text-xl mb-4 text-orange">{compliance}%</h3>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg text-sm">
          The access control policy supports logical access through need-to-know principles, segregation of duties, and privileged access controls. However, it lacks provisions for physical access controls to secure locations housing sensitive information and assets, highlighting a critical gap.
        </div>
      </div>
    </div>
  );
};

export default DetailedControl;
