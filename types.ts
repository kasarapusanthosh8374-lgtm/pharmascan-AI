export interface Medication {
  drug_name: string;
  strength: string;
  dosage_form: string;
  frequency: string;
  duration: string;
  clarity_status: "Clear" | "Unclear";
  safety_warning: string;
}

export interface PrescriptionAnalysis {
  patient_name: string;
  medications: Medication[];
  overall_risk_level: "Low" | "Medium" | "High";
  clarification_required: boolean;
}

export interface AnalysisState {
  status: 'idle' | 'analyzing' | 'success' | 'error';
  data: PrescriptionAnalysis | null;
  error: string | null;
  imagePreview: string | null;
}
