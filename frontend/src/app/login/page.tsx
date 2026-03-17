"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mountain, Lock, User, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState<"TRAVELER" | "ADMIN">("TRAVELER");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if(res.ok) {
        if (data.user.role === "ADMIN") {
           router.push("/admin");
        } else {
           router.push("/dashboard");
        }
      } else {
        setError(data.error || "Login Failed");
      }
    } catch(err) {
      setError("Network error. Server might be down.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-montserrat">
      {/* Left Branding Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-navy flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="z-10">
           <div className="flex items-center gap-3 mb-10">
              <Mountain className="w-10 h-10 text-primary" />
              <span className="text-2xl font-heading font-black tracking-widest uppercase">YouthCamping</span>
           </div>
           <h1 className="text-5xl font-heading font-black leading-tight mb-6 max-w-lg">
              Unlock Your Next Great <span className="text-primary">Adventure.</span>
           </h1>
           <p className="text-lg text-white/80 max-w-md leading-relaxed font-body">
              Log in to review your meticulously planned itineraries, organize your packing, and connect with your expert guides.
           </p>
        </div>
        <div className="z-10">
           <p className="text-sm font-bold text-white/50 tracking-wider">PREMIUM EXPEDITIONS • AHMEDABAD, INDIA</p>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
           <div className="text-center lg:text-left">
              <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
                 <Mountain className="w-8 h-8 text-primary" />
                 <span className="text-xl font-heading font-black tracking-widest text-navy uppercase">YouthCamping</span>
              </div>
              <h2 className="text-3xl font-heading font-black text-navy">Welcome Back</h2>
              <p className="text-gray mt-2">Sign in to access your portal.</p>
           </div>

           <div className="flex p-1 bg-gray-100 rounded-xl">
               <button 
                  onClick={() => setRole("TRAVELER")}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${role === "TRAVELER" ? "bg-white text-navy shadow-sm" : "text-gray hover:text-navy"}`}
               >
                  Traveler
               </button>
               <button 
                  onClick={() => setRole("ADMIN")}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${role === "ADMIN" ? "bg-white text-navy shadow-sm" : "text-gray hover:text-navy"}`}
               >
                  Admin
               </button>
           </div>

           <form onSubmit={handleLogin} className="space-y-5">
              {/* {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100">{error}</div>} */}
                            <div className="space-y-1">
                  <label className="text-xs font-bold text-gray uppercase tracking-widest ml-1 font-heading">Email Address</label>
                  <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray" />
                     <input 
                        type="email" required
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-navy focus:ring-2 focus:ring-navy/20 transition outline-none font-medium font-body"
                        placeholder="Enter your email"
                        value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                     />
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-xs font-bold text-gray uppercase tracking-widest ml-1 font-heading">Password</label>
                  <div className="relative">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray" />
                     <input 
                        type="password" required
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-navy focus:ring-2 focus:ring-navy/20 transition outline-none font-medium font-body"
                        placeholder="Enter your password"
                        value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                     />
                  </div>
               </div>

               <button 
                  type="submit" disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition disabled:opacity-70 group shadow-lg shadow-primary/20"
               >
                  {loading ? "Authenticating..." : <>Secure Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
               </button>

              <p className="text-center text-sm text-gray-500 font-medium">
                 {role === "TRAVELER" ? "Need an account? Contact our office." : "Authorized personnel only."}
              </p>
           </form>
           
           {/* Dummy credentials notice for testing */}
           <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 text-xs text-blue-700 text-center space-y-1">
               <p className="font-bold">Test Credentials:</p>
               <p>Admin: admin@youthcamping.in / Admin@123</p>
               <p>Traveler: rahul@example.com / Traveler@123</p>
           </div>
        </div>
      </div>
    </div>
  );
}
