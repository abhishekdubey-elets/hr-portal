"use client";
import { useForm } from "react-hook-form";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface JDForm {
  title: string;
  department: string;
  level: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  requirements: string;
  tone: string;
}

interface JDGeneratorProps {
  onGenerate: (data: JDForm) => void;
  isGenerating: boolean;
}

export function JDGenerator({ onGenerate, isGenerating }: JDGeneratorProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<JDForm>({
    defaultValues: { tone: "professional", level: "Senior" }
  });

  return (
    <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
      <Input label="Job Title" placeholder="e.g. Senior Frontend Engineer" {...register("title", { required: "Title is required" })} error={errors.title?.message} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Department</label>
          <select {...register("department", { required: true })} className="w-full px-4 py-2.5 bg-[#111114] border border-[#1E1E24] rounded-xl text-white text-sm focus:outline-none focus:border-purple-500">
            <option value="">Select...</option>
            {["Engineering","Design","Product","Marketing","Sales","Finance","HR","Operations","Analytics"].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Level</label>
          <select {...register("level")} className="w-full px-4 py-2.5 bg-[#111114] border border-[#1E1E24] rounded-xl text-white text-sm focus:outline-none focus:border-purple-500">
            {["Junior","Mid","Senior","Lead","Staff","Principal","Director","VP","C-Level"].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>
      <Input label="Location" placeholder="Remote / San Francisco, CA" {...register("location")} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Min Salary ($)" placeholder="120,000" {...register("salaryMin")} />
        <Input label="Max Salary ($)" placeholder="160,000" {...register("salaryMax")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Key Requirements</label>
        <textarea
          {...register("requirements", { required: "Please list requirements" })}
          rows={4}
          placeholder="5+ years React experience, TypeScript, team leadership..."
          className="w-full px-4 py-3 bg-[#111114] border border-[#1E1E24] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 resize-none"
        />
        {errors.requirements && <p className="mt-1 text-xs text-red-400">{errors.requirements.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Tone</label>
        <div className="flex gap-2">
          {["Professional","Casual","Startup","Corporate"].map(t => (
            <label key={t} className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" value={t.toLowerCase()} {...register("tone")} className="text-purple-500 border-[#1E1E24] bg-[#111114]" />
              <span className="text-sm text-gray-400">{t}</span>
            </label>
          ))}
        </div>
      </div>
      <Button type="submit" loading={isGenerating} leftIcon={<Sparkles className="w-4 h-4" />} className="w-full justify-center">
        {isGenerating ? "Generating..." : "Generate with AI"}
      </Button>
    </form>
  );
}
