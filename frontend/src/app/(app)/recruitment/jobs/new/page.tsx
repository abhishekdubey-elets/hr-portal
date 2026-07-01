"use client";
import { useState } from "react";
import { Copy, Download, Send, CheckCheck } from "lucide-react";
import { JDGenerator } from "@/components/recruitment/JDGenerator";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { generateJD, type GeneratedJDVersions } from "@/lib/api";

const formats = ["Professional", "LinkedIn", "Indeed", "Short", "Internal"];
const formatKeys: Record<string, keyof GeneratedJDVersions> = {
  Professional: "professional",
  LinkedIn: "linkedin",
  Indeed: "indeed",
  Short: "short",
  Internal: "internal",
};

export default function NewJobPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedJDs, setGeneratedJDs] = useState<GeneratedJDVersions | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeFormat, setActiveFormat] = useState("Professional");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: Parameters<typeof generateJD>[0]) => {
    setIsGenerating(true);
    setError(null);
    try {
      const versions = await generateJD({ ...data, format: activeFormat });
      setGeneratedJDs(versions);
      setCopied(false);
    } catch (err) {
      setGeneratedJDs(null);
      setError(err instanceof Error ? err.message : "Failed to generate job description");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const currentJD = generatedJDs?.[formatKeys[activeFormat]];
    if (currentJD) { navigator.clipboard.writeText(currentJD); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">New Job Posting</h1>
        <p className="text-gray-400 mt-0.5">AI generates optimized JDs tailored to attract top talent</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-[#16161A] border border-[#1E1E24] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Job Details</h2>
          <JDGenerator onGenerate={handleGenerate} isGenerating={isGenerating} />
        </div>
        <div className="bg-[#16161A] border border-[#1E1E24] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Generated JD</h2>
            {generatedJDs?.[formatKeys[activeFormat]] && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" leftIcon={copied ? <CheckCheck className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />} onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</Button>
                <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>Export</Button>
                <Button size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>Publish</Button>
              </div>
            )}
          </div>
          <Tabs defaultValue="Professional" value={activeFormat} onValueChange={setActiveFormat}>
            <TabsList className="mb-4">{formats.map((f) => <TabsTrigger key={f} value={f}>{f}</TabsTrigger>)}</TabsList>
            {formats.map((f) => (
              <TabsContent key={f} value={f} className="flex-1">
                {isGenerating ? (
                  <div className="space-y-3 mt-2">
                    <Skeleton className="h-6 w-64" /><Skeleton className="h-4 w-48" />
                    <div className="space-y-2 mt-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className={`h-3.5 ${i%3===2?"w-3/4":"w-full"}`} />)}</div>
                  </div>
                ) : generatedJDs?.[formatKeys[f]] ? (
                  <div className="bg-[#111114] rounded-xl p-5 overflow-y-auto max-h-[600px] text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">{generatedJDs[formatKeys[f]]}</div>
                ) : error ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-white font-semibold mb-1">Generation failed</p>
                    <p className="text-gray-400 text-sm max-w-md">{error}</p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold mb-1">Ready to generate</p>
                    <p className="text-gray-400 text-sm">Fill out the job details and click Generate with AI</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
