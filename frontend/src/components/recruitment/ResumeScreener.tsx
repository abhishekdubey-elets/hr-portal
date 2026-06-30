"use client";
import { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ResumeScreenerProps {
  onProcess: (files: File[]) => void;
  isProcessing: boolean;
}

export function ResumeScreener({ onProcess, isProcessing }: ResumeScreenerProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const pdfs = Array.from(incoming).filter((f) => f.type === "application/pdf" || f.name.endsWith(".pdf") || f.name.endsWith(".docx"));
    setFiles((prev) => [...prev, ...pdfs].slice(0, 50));
  };

  return (
    <div className="space-y-4">
      <div
        className={cn("border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors", dragging ? "border-purple-500 bg-purple-500/5" : "border-[#1E1E24] hover:border-purple-500/50")}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
        <p className="text-white font-medium">Drop resumes here</p>
        <p className="text-gray-400 text-sm mt-1">or click to browse</p>
        <p className="text-gray-500 text-xs mt-2">PDF, DOCX · Up to 50 files</p>
        <input ref={inputRef} type="file" multiple accept=".pdf,.docx" className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </div>
      {files.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-[#111114] rounded-xl px-3 py-2">
              <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="text-sm text-gray-300 flex-1 truncate">{f.name}</span>
              <span className="text-xs text-gray-500">{(f.size / 1024).toFixed(0)}KB</span>
              <button onClick={(e) => { e.stopPropagation(); setFiles(files.filter((_, j) => j !== i)); }} className="text-gray-500 hover:text-red-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      {files.length > 0 && (
        <Button onClick={() => onProcess(files)} loading={isProcessing} className="w-full justify-center">
          {isProcessing ? `Screening ${files.length} resumes...` : `Screen ${files.length} Resume${files.length > 1 ? "s" : ""}`}
        </Button>
      )}
    </div>
  );
}
