"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ArrowRight } from "lucide-react";

export default function AdminPayments() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to travelers since payments is removed
    const timer = setTimeout(() => {
      router.push("/admin/travelers");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 font-body">
      <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl shadow-navy/5 border border-gray-100 text-center space-y-8">
        <div className="w-24 h-24 bg-navy/5 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-dashed border-navy/10">
          <CreditCard className="w-10 h-10 text-navy/40" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-black text-navy uppercase tracking-tight">System Migration</h1>
          <p className="text-gray mt-4 leading-relaxed font-medium">
            The internal payment tracking system has been decommissioned. YouthCamping now utilizes a <span className="text-primary font-bold">WhatsApp-based Booking Flow</span> for all expeditions.
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 italic text-xs text-gray/60 font-semibold">
          Redirecting you to Traveler Management in 3 seconds...
        </div>
        <button 
          onClick={() => router.push("/admin/travelers")}
          className="w-full bg-navy text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-navy/90 transition"
        >
          Go to Travelers portal <ArrowRight className="w-4 h-4 text-primary" />
        </button>
      </div>
    </div>
  );
}
