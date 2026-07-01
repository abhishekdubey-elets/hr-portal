"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
      })
  );
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        <title>PeopleAI — Intelligent HR Platform</title>
        <meta name="description" content="Hire smarter. Grow faster. Retain longer." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className="bg-base text-white antialiased">
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: "rgba(20,20,24,0.85)",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.11)",
                borderRadius: "16px",
                color: "#f5f5f7",
              },
            }}
          />
        </QueryClientProvider>
      </body>
    </html>
  );
}
