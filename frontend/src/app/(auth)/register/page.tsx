"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface RegisterForm { name: string; email: string; company: string; size: string; password: string; confirmPassword: string; terms: boolean; }

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    console.log("Register:", data);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B] p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <img src="/logo.svg" alt="PeopleAI" className="w-10 h-10" />
          <span className="text-xl font-bold text-white">PeopleAI</span>
        </div>
        <div className="bg-[#111114] border border-[#1E1E24] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-1">Create your account</h2>
          <p className="text-gray-400 mb-6 text-sm">Start your 14-day free trial. No credit card required.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full name</label>
                <input type="text" placeholder="Sarah Johnson" {...register("name", { required: "Name is required" })}
                  className="w-full px-4 py-3 bg-[#0A0A0B] border border-[#1E1E24] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm" />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Work email</label>
                <input type="email" placeholder="you@company.com" {...register("email", { required: "Email is required" })}
                  className="w-full px-4 py-3 bg-[#0A0A0B] border border-[#1E1E24] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm" />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Company name</label>
                <input type="text" placeholder="Acme Corp" {...register("company", { required: "Company is required" })}
                  className="w-full px-4 py-3 bg-[#0A0A0B] border border-[#1E1E24] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Company size</label>
                <select {...register("size", { required: true })}
                  className="w-full px-4 py-3 bg-[#0A0A0B] border border-[#1E1E24] rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm">
                  <option value="">Select size...</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="501-1000">501-1,000</option>
                  <option value="1000+">1,000+</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" {...register("password", { required: "Password is required", minLength: { value: 8, message: "Min 8 characters" } })}
                  className="w-full px-4 py-3 bg-[#0A0A0B] border border-[#1E1E24] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm password</label>
              <input type="password" placeholder="Repeat password" {...register("confirmPassword", { required: true, validate: (v) => v === password || "Passwords do not match" })}
                className="w-full px-4 py-3 bg-[#0A0A0B] border border-[#1E1E24] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm" />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" {...register("terms", { required: "You must accept terms" })} className="mt-1 w-4 h-4 rounded border-[#1E1E24] bg-[#0A0A0B] text-purple-500" />
              <label className="text-sm text-gray-400">I agree to the <a href="#" className="text-purple-400">Terms of Service</a> and <a href="#" className="text-purple-400">Privacy Policy</a></label>
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-gray-400 text-sm">Already have an account? <a href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Sign in</a></p>
      </div>
    </div>
  );
}
