import React, { useCallback, useState } from 'react';
import { Upload, FileImage, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndPassFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size too large. Please upload an image under 10MB.');
      return;
    }
    setError(null);
    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndPassFile(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ease-in-out
          ${isDragging 
            ? 'border-teal-500 bg-teal-50 shadow-inner' 
            : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50 bg-white'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`
            p-4 rounded-full 
            ${isDragging ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500'}
          `}>
            {isDragging ? <FileImage className="h-8 w-8" /> : <Upload className="h-8 w-8" />}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-900">
              {isDragging ? 'Drop prescription here' : 'Upload Prescription'}
            </h3>
            <p className="text-slate-500">
              Drag and drop or <span className="text-teal-600 font-medium">browse</span> to select
            </p>
          </div>

          <p className="text-xs text-slate-400">
            Supported formats: JPEG, PNG, WEBP
          </p>

          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileInput}
            accept="image/*"
            aria-label="File upload"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-start gap-3 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};
