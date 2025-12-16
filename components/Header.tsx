import React from 'react';
import { Pill, Activity } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">PharmaScan AI</h1>
              <p className="text-xs text-slate-500 font-medium">Professional Prescription Analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-slate-600">
              <Activity className="h-4 w-4 text-teal-600" />
              <span>System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
