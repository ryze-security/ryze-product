
import React from 'react';

interface Control {
  id: string;
  title: string;
  type?: string;
  description?: string;
  compliance: number;
  missingElements?: string;
}

interface ControlTableProps {
  controls: Control[];
  showDescription?: boolean;
  showType?: boolean;
  showMissingElements?: boolean;
}

const ControlTable: React.FC<ControlTableProps> = ({ 
  controls, 
  showDescription = false, 
  showType = true,
  showMissingElements = true
}) => {
  return (
    <div className="w-full mt-8">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="p-4 rounded-l-lg">Control Id</th>
            <th className="p-4">Control title</th>
            {showDescription && <th className="p-4">Control description</th>}
            {showType && <th className="p-4">Control type</th>}
            <th className="p-4">Compliance</th>
            {showMissingElements && <th className="p-4 rounded-r-lg">Missing elements</th>}
          </tr>
        </thead>
        <tbody>
          {controls.map((control) => (
            <tr key={control.id} className="bg-gray-900 border-b border-gray-800">
              <td className="p-4">{control.id}</td>
              <td className="p-4">{control.title}</td>
              {showDescription && <td className="p-4 text-sm">{control.description}</td>}
              {showType && <td className="p-4">{control.type || 'Organizational control'}</td>}
              <td className="p-4">
                <div className="progress-bar w-32">
                  <div 
                    className="progress-value bg-purple" 
                    style={{ width: `${control.compliance}%` }} 
                  />
                </div>
                <span className="text-sm ml-2">{control.compliance}%</span>
              </td>
              {showMissingElements && (
                <td className="p-4 text-sm">
                  {control.missingElements || 'None'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ControlTable;
