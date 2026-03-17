"use client";

import { useEffect, useState, use } from "react";
import { Mountain, CloudSun, AlertTriangle, Route } from "lucide-react";

export default function TripInfo({ params }: { params: Promise<{ id: string }> }) {
  const { id: tripId } = use(params);
  const [trip, setTrip] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/traveler/trip/${tripId}`, { credentials: "include" });
        if(res.ok) setTrip(await res.json());
      } catch (error) {
        console.error("Trip metrics load failed:", error);
      }
    };
    load();
  }, [tripId]);

  if(!trip) return <div className="text-center py-20 text-gray font-body italic">Syncing metrics...</div>;

  return (
     <div className="space-y-6 font-body">
        <h2 className="text-[10px] font-black tracking-[0.2em] text-navy uppercase px-1 font-heading">Trip Metrics</h2>
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition">
              <div className="bg-navy/5 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                 <Mountain className="w-8 h-8 text-teal" />
              </div>
              <p className="text-[10px] text-gray font-black uppercase tracking-widest mb-1 font-heading">Max Altitude</p>
              <p className="text-2xl font-black text-navy font-heading">{trip.maxAltitude}m</p>
           </div>
           <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition">
              <div className="bg-primary/5 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                 <Route className="w-8 h-8 text-primary" />
              </div>
              <p className="text-[10px] text-gray font-black uppercase tracking-widest mb-1 font-heading">Difficulty</p>
              <p className="text-2xl font-black text-navy font-heading uppercase tracking-tight">{trip.difficulty}</p>
           </div>
        </div>

        <div className="bg-navy text-white p-8 rounded-3xl shadow-xl shadow-navy/20 mt-6 relative overflow-hidden">
           <AlertTriangle className="absolute right-[-30px] bottom-[-30px] w-48 h-48 opacity-[0.03] rotate-12" />
           <h3 className="font-black text-xl mb-6 flex items-center gap-3 font-heading uppercase tracking-tight">
              <ShieldCheck className="w-6 h-6 text-primary" /> Safety Protocols
           </h3>
           <ul className="space-y-4 text-xs font-medium text-white/70 leading-relaxed uppercase tracking-widest">
              <li className="flex gap-4 items-start"><span className="text-primary font-black mt-[-2px]">•</span> Hydrate continuously (3L per day minimum)</li>
              <li className="flex gap-4 items-start"><span className="text-primary font-black mt-[-2px]">•</span> Strictly follow the Guide&apos;s instructions</li>
              <li className="flex gap-4 items-start"><span className="text-primary font-black mt-[-2px]">•</span> Report any dizziness immediately</li>
              <li className="flex gap-4 items-start"><span className="text-primary font-black mt-[-2px]">•</span> Always layer clothing to regulate temperature</li>
           </ul>
        </div>
    </div>
  );
}

// Dummy icon to avoid nested imports above just for the small layout.
function ShieldCheck({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
}
