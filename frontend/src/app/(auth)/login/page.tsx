"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Brain, UserPlus, BarChart3, Eye, EyeOff } from "lucide-react";

interface LoginForm { email: string; password: string; remember: boolean; }

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    console.log("Login:", data);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-[#0A0A0B]">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[#111114] via-[#1a1030] to-[#0f0820] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <img src="/logo.svg" alt="PeopleAI" className="w-10 h-10" />
          <span className="text-xl font-bold text-white">PeopleAI</span>
        </div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Hire smarter.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Grow faster.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10">The AI-powered HR platform that transforms how modern enterprises attract, develop, and retain talent.</p>
          <div className="space-y-5">
            {[
              { icon: Brain, title: "AI-Powered Screening", desc: "Screen 100+ resumes in seconds with 94% accuracy", color: "text-purple-400", bg: "bg-purple-500/10" },
              { icon: UserPlus, title: "Smart Onboarding", desc: "Personalized 90-day plans that boost retention by 40%", color: "text-blue-400", bg: "bg-blue-500/10" },
              { icon: BarChart3, title: "Real-time Analytics", desc: "Predictive insights to make data-driven HR decisions", color: "text-green-400", bg: "bg-green-500/10" },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-white font-medium">{title}</p>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center gap-4">
          <div className="flex -space-x-2">
            {["SC","MR","EJ","DK"].map((init, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white border-2 border-[#111114]">{init}</div>
            ))}
          </div>
          <p className="text-gray-400 text-sm"><span className="text-white font-semibold">2,000+</span> companies trust PeopleAI</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src="/logo.svg" alt="PeopleAI" className="w-8 h-8" />
            <span className="text-lg font-bold text-white">PeopleAI</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-gray-400 mb-8">Sign in to your account to continue</p>
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-[#1E1E24] bg-[#111114] text-white font-medium hover:bg-[#16161A] transition-colors mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
          <div className="relative flex items-center mb-6">
            <div className="flex-1 h-px bg-[#1E1E24]" />
            <span className="px-4 text-gray-500 text-sm">or continue with email</span>
            <div className="flex-1 h-px bg-[#1E1E24]" />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
              <input type="email" placeholder="you@company.com" {...register("email", { required: "Email is required" })}
                className="w-full px-4 py-3 bg-[#111114] border border-[#1E1E24] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" {...register("password", { required: "Password is required" })}
                  className="w-full px-4 py-3 bg-[#111114] border border-[#1E1E24] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register("remember")} className="w-4 h-4 rounded border-[#1E1E24] bg-[#111114] text-purple-500" />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-purple-400 hover:text-purple-300">Forgot password?</a>
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              {isLoading ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in...</> : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-gray-400 text-sm">Don&apos;t have an account? <a href="/register" className="text-purple-400 hover:text-purple-300 font-medium">Create one free</a></p>
        </div>
      </div>
    </div>
  );
}
