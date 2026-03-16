"use client";

import { useEffect, useState, use } from "react";
import { Mountain, CloudSun, AlertTriangle, Route } from "lucide-react";

export default function TripInfo({ params }: { params: Promise<{ id: string }> }) {
  const { id: tripId } = use(params);
  const [trip, setTrip] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const headers = { "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}` };
      const res = await fetch(`/api/traveler/trip/${tripId}`, { headers });
      if(res.ok) setTrip(await res.json());
    };
    load();
  }, [tripId]);

  if(!trip) return <div className="text-center py-20 text-gray-500">Loading details...</div>;

  return (
    <div className="space-y-4">
       <h2 className="text-sm font-bold tracking-widest text-[#0f2d54] uppercase px-1">Trip Metrics</h2>
       <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
             <div className="bg-[#2d6a4f]/10 p-3 rounded-full mb-3">
                <Mountain className="w-6 h-6 text-[#2d6a4f]" />
             </div>
             <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Max Altitude</p>
             <p className="text-2xl font-black text-[#0f172a]">{trip.maxAltitude} m</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
             <div className="bg-[#f97316]/10 p-3 rounded-full mb-3">
                <Route className="w-6 h-6 text-[#f97316]" />
             </div>
             <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Difficulty</p>
             <p className="text-xl font-black text-[#0f172a]">{trip.difficulty}</p>
          </div>
       </div>

       <div className="bg-[#0f2d54] text-white p-6 rounded-2xl shadow-sm mt-6 relative overflow-hidden">
          <AlertTriangle className="absolute right-[-20px] bottom-[-20px] w-40 h-40 opacity-5" />
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
             <ShieldCheck className="w-5 h-5 text-[#f97316]" /> Safety Protocols
          </h3>
          <ul className="space-y-3 text-sm text-blue-100">
             <li className="flex gap-2"><span className="text-[#f97316]">•</span> Hydrate continuously (3L per day minimum)</li>
             <li className="flex gap-2"><span className="text-[#f97316]">•</span> Strictly follow the Guide's instructions</li>
             <li className="flex gap-2"><span className="text-[#f97316]">•</span> Report any dizziness immediately</li>
             <li className="flex gap-2"><span className="text-[#f97316]">•</span> Always layer clothing to regulate temperature</li>
          </ul>
       </div>
    </div>
  );
}

// Dummy icon to avoid nested imports above just for the small layout.
function ShieldCheck({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
}
