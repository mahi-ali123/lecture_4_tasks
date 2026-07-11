import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { UploadCloud, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export const UploadPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit");
      return;
    }
    if (!selectedFile.type.startsWith("image/")) {
      setError("Only image files are supported");
      return;
    }
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      // Call our Express backend API to run Gemini Vision
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let serverError = "Failed to analyze image";
        try {
          const errorText = await response.text();
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.error) serverError = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
          } catch (e) {
            serverError = `Error ${response.status}: ${errorText.substring(0, 100)}`;
          }
        } catch (e) {
          // ignore
        }
        throw new Error(serverError);
      }

      const analysisResult = await response.json();

      const analysisRecord = {
        id: crypto.randomUUID(),
        user_id: user?.id,
        filename: file.name,
        created_at: new Date().toISOString(),
        score: analysisResult.overall_score,
        data: analysisResult,
        image_data: preview // In a real app, upload to Supabase Storage and store URL
      };

      // Try saving to Supabase if configured
      try {
        const { error: dbError } = await supabase.from('analyses').insert([{
          id: analysisRecord.id,
          user_id: user?.id,
          filename: file.name,
          score: analysisRecord.score,
          analysis_data: analysisResult
        }]);
        if (dbError) throw dbError;
      } catch (e) {
        console.warn("Could not save to Supabase, falling back to local storage", e);
        // Fallback to local storage
        const history = JSON.parse(localStorage.getItem('thumblytics_history') || '[]');
        localStorage.setItem('thumblytics_history', JSON.stringify([analysisRecord, ...history]));
      }
      
      // Store current analysis in session storage to pass to report page
      sessionStorage.setItem('current_analysis', JSON.stringify(analysisRecord));
      navigate(`/report/${analysisRecord.id}`);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Analyze Thumbnail</h1>
        <p className="text-muted-foreground">Upload your thumbnail to get instant AI feedback on click potential.</p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
        {!preview ? (
          <div 
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input 
              ref={inputRef}
              type="file" 
              accept="image/jpeg, image/png, image/webp" 
              onChange={handleChange} 
              className="hidden" 
            />
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <UploadCloud className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Drag & Drop your thumbnail</h3>
            <p className="text-muted-foreground text-sm mb-6">or click to browse (PNG, JPG, WEBP up to 10MB)</p>
            <button className="px-6 py-2 rounded-full bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors">
              Browse Files
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="relative rounded-2xl overflow-hidden border border-border bg-black/5 aspect-video flex items-center justify-center">
              <img src={preview} alt="Thumbnail preview" className="max-w-full max-h-full object-contain" />
              <button 
                onClick={() => { setPreview(null); setFile(null); }}
                className="absolute top-4 right-4 bg-background/80 backdrop-blur text-foreground px-3 py-1.5 rounded-full text-xs font-medium hover:bg-background transition-colors shadow-sm"
              >
                Change Image
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                <div className="text-sm font-medium truncate max-w-[200px] sm:max-w-xs">{file?.name}</div>
                <div className="text-xs text-muted-foreground">({Math.round((file?.size || 0) / 1024)} KB)</div>
              </div>
              
              <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full sm:w-auto px-8 h-12 rounded-full bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Analyze Thumbnail
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="text-sm">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};

function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
