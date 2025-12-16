import React from 'react';
import { PrescriptionAnalysis, Medication } from '../types';
import { AlertTriangle, CheckCircle, AlertOctagon, Info, RefreshCw } from 'lucide-react';

interface ResultsViewProps {
  data: PrescriptionAnalysis;
  imagePreview: string | null;
  onReset: () => void;
}

const RiskBadge: React.FC<{ level: string }> = ({ level }) => {
  const colors = {
    Low: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    High: 'bg-red-100 text-red-800 border-red-200',
  };
  const colorClass = colors[level as keyof typeof colors] || colors.Medium;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass} uppercase tracking-wide`}>
      {level} Risk
    </span>
  );
};

const ClarityBadge: React.FC<{ status: 'Clear' | 'Unclear' }> = ({ status }) => {
  return status === 'Clear' ? (
    <span className="inline-flex items-center gap-1 text-green-700 text-xs font-medium bg-green-50 px-2 py-1 rounded">
      <CheckCircle className="h-3 w-3" /> Clear
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-red-700 text-xs font-medium bg-red-50 px-2 py-1 rounded">
      <AlertOctagon className="h-3 w-3" /> Unclear
    </span>
  );
};

export const ResultsView: React.FC<ResultsViewProps> = ({ data, imagePreview, onReset }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Column: Image Preview */}
      <div className="lg:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Original Scan</h3>
          <div className="relative aspect-[3/4] w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-100">
             {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Prescription Scan" 
                  className="w-full h-full object-contain"
                />
             )}
          </div>
        </div>
        
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Scan Another
        </button>
      </div>

      {/* Right Column: Analysis */}
      <div className="lg:w-2/3 space-y-6">
        {/* Summary Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {data.patient_name || "Unknown Patient"}
              </h2>
              <p className="text-slate-500 text-sm mt-1">Prescription Analysis Report</p>
            </div>
            <div className="flex items-center gap-3">
              <RiskBadge level={data.overall_risk_level} />
              {data.clarification_required && (
                <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  <AlertTriangle className="h-3 w-3" />
                  Clarification Needed
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-200">
                  <th className="py-3 pr-4 font-semibold uppercase tracking-wider">Medication</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider">Instructions</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider">Duration</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {data.medications.map((med, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 pr-4 align-top">
                      <div className="font-semibold text-slate-900 text-base">{med.drug_name || "Unknown Drug"}</div>
                      <div className="text-slate-500 mt-0.5">
                        {med.strength} {med.dosage_form && `• ${med.dosage_form}`}
                      </div>
                      {med.safety_warning && (
                        <div className="mt-2 flex items-start gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                          <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                          <span>{med.safety_warning}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 align-top text-slate-700">
                      {med.frequency || "Not specified"}
                    </td>
                    <td className="py-4 px-4 align-top text-slate-700">
                      {med.duration || "Not specified"}
                    </td>
                    <td className="py-4 px-4 align-top">
                      <ClarityBadge status={med.clarity_status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* JSON Inspector (Optional - Good for developers/debugging, kept subtle) */}
        <details className="bg-slate-50 rounded-lg border border-slate-200">
            <summary className="px-4 py-3 text-sm font-medium text-slate-600 cursor-pointer hover:text-slate-900 select-none">
                Raw Data Inspection (JSON)
            </summary>
            <div className="p-4 pt-0 border-t border-slate-200">
                <pre className="text-xs text-slate-600 overflow-x-auto bg-white p-3 rounded border border-slate-200 mt-3 font-mono">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        </details>
      </div>
    </div>
  );
};
