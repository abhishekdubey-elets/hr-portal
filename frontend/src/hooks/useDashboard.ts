"use client";
import { useQuery } from "@tanstack/react-query";
import {
  getDashboardMetrics,
  getHiringTrends,
  getRecentActivities,
  getInterviews,
} from "@/lib/api";

export function useDashboard() {
  const metrics = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: getDashboardMetrics,
    staleTime: 5 * 60 * 1000,
  });

  const funnelData = useQuery({
    queryKey: ["hiring-funnel"],
    queryFn: getHiringTrends,
    staleTime: 5 * 60 * 1000,
  });

  const recentActivities = useQuery({
    queryKey: ["recent-activities"],
    queryFn: getRecentActivities,
    staleTime: 60 * 1000,
  });

  const upcomingInterviews = useQuery({
    queryKey: ["upcoming-interviews"],
    queryFn: async () => {
      const mockInterviews = [
        {
          id: "i1",
          candidateName: "Sarah Chen",
          jobTitle: "Senior Frontend Engineer",
          scheduledAt: new Date(Date.now() + 2 * 3600000).toISOString(),
          type: "video",
          status: "scheduled",
          meetingUrl: "https://meet.google.com/abc-defg-hij",
          interviewerNames: ["Alex Kim"],
          candidateId: "c1", jobId: "j1", interviewerIds: ["u1"], duration: 60,
        },
        {
          id: "i2",
          candidateName: "Marcus Rodriguez",
          jobTitle: "Product Designer",
          scheduledAt: new Date(Date.now() + 4 * 3600000).toISOString(),
          type: "video",
          status: "scheduled",
          meetingUrl: "https://zoom.us/j/123456789",
          interviewerNames: ["Jamie Lee", "Chris Park"],
          candidateId: "c2", jobId: "j2", interviewerIds: ["u2", "u3"], duration: 45,
        },
        {
          id: "i3",
          candidateName: "Priya Patel",
          jobTitle: "Data Scientist",
          scheduledAt: new Date(Date.now() + 24 * 3600000).toISOString(),
          type: "technical",
          status: "scheduled",
          meetingUrl: "https://meet.google.com/xyz-123",
          interviewerNames: ["Sam Torres"],
          candidateId: "c5", jobId: "j3", interviewerIds: ["u4"], duration: 90,
        },
      ];
      return mockInterviews;
    },
    staleTime: 60 * 1000,
  });

  return { metrics, funnelData, recentActivities, upcomingInterviews };
}
