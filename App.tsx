import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ResultsView } from './components/ResultsView';
import { analyzePrescriptionImage } from './services/geminiService';
import { AnalysisState } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    data: null,
    error: null,
    imagePreview: null,
  });

  const handleFileSelect = async (file: File) => {
    // 1. Create Preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Preview = e.target?.result as string;
      
      setState(prev => ({
        ...prev,
        status: 'analyzing',
        error: null,
        imagePreview: base64Preview,
      }));

      try {
        // 2. Prepare for API (strip data:image/xyz;base64,)
        // The Preview string includes the mime type header, which is good for the service too if we parse it there,
        // but the service function expects base64 data specifically.
        
        // Extract base64 data and mime type
        const matches = base64Preview.match(/^data:(.+);base64,(.+)$/);
        
        if (!matches || matches.length !== 3) {
            throw new Error("Could not process image file.");
        }

        const mimeType = matches[1];
        const base64Data = matches[2];

        const analysisResult = await analyzePrescriptionImage(base64Data, mimeType);
        
        setState(prev => ({
          ...prev,
          status: 'success',
          data: analysisResult,
        }));
      } catch (err) {
        console.error(err);
        setState(prev => ({
          ...prev,
          status: 'error',
          error: "Failed to analyze prescription. Please ensure the image is clear and try again.",
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setState({
      status: 'idle',
      data: null,
      error: null,
      imagePreview: null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {state.status === 'idle' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
            <div className="text-center mb-10 max-w-2xl">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Prescription Intelligence
              </h2>
              <p className="text-lg text-slate-600">
                Upload a handwritten prescription to instantly extract medications, 
                detect clarity issues, and identify potential look-alike/sound-alike risks.
              </p>
            </div>
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        )}

        {state.status === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-300">
            <div className="relative">
                <div className="absolute inset-0 bg-teal-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-white p-6 rounded-full shadow-lg border border-teal-50">
                    <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
                </div>
            </div>
            <h3 className="mt-8 text-xl font-semibold text-slate-900">Analyzing Prescription</h3>
            <p className="mt-2 text-slate-500">Deciphering handwriting and checking for drug interactions...</p>
            
            {/* Simulated Progress Steps could go here if we had streaming updates */}
            <div className="mt-6 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        {state.status === 'error' && (
           <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in duration-300">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <Loader2 className="h-6 w-6 text-red-600" /> {/* Reusing icon for simplicity, or could use X */}
                </div>
                <h3 className="text-lg font-medium text-slate-900">Analysis Failed</h3>
                <p className="mt-2 text-sm text-slate-500">{state.error}</p>
                <div className="mt-6">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Try Again
                  </button>
                </div>
             </div>
           </div>
        )}

        {state.status === 'success' && state.data && (
           <div className="animate-in slide-in-from-bottom-4 duration-500">
              <ResultsView 
                data={state.data} 
                imagePreview={state.imagePreview} 
                onReset={handleReset} 
              />
           </div>
        )}

      </main>
    </div>
  );
};

export default App;
