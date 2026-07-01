"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generateJD, screenResumes, type GeneratedJDVersions } from "@/lib/api";
import type { Candidate } from "@/types";

export function useAI() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScreening, setIsScreening] = useState(false);
  const [generatedJD, setGeneratedJD] = useState<GeneratedJDVersions | null>(null);
  const [screenedCandidates, setScreenedCandidates] = useState<Candidate[]>([]);

  const generateJDMutation = useMutation({
    mutationFn: async (params: Parameters<typeof generateJD>[0]) => {
      setIsGenerating(true);
      try {
        const result = await generateJD(params);
        setGeneratedJD(result);
        return result;
      } finally {
        setIsGenerating(false);
      }
    },
  });

  const screenResumesMutation = useMutation({
    mutationFn: async ({
      files,
      jobDescription,
    }: {
      files: File[];
      jobDescription: string;
    }) => {
      setIsScreening(true);
      try {
        const results = await screenResumes(files, jobDescription);
        setScreenedCandidates(results);
        return results;
      } finally {
        setIsScreening(false);
      }
    },
  });

  return {
    generateJDMutation,
    screenResumesMutation,
    isGenerating,
    isScreening,
    generatedJD,
    setGeneratedJD,
    screenedCandidates,
    setScreenedCandidates,
  };
}
