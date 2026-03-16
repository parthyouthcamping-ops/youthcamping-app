"use client";

import { useEffect, useState, use } from "react";
import { format } from "date-fns";
import { Map, Clock, ChevronDown } from "lucide-react";

export default function TripItinerary({ params }: { params: Promise<{ id: string }> }) {
  const { id: tripId } = use(params);
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/traveler/trip/${tripId}/itinerary`, {
         headers: { "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}` }
      });
      if(res.ok) {
         const data = await res.json();
         setItinerary(data);
         if(data.length > 0) setOpenDays({ [data[0].id]: true }); 
      }
    };
    load();
  }, [tripId]);

  const toggleDay = (id: string) => {
    setOpenDays(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if(!itinerary.length) return <div className="text-center py-20 text-gray-500">Loading itinerary...</div>;

  return (
    <div className="space-y-4">
       {itinerary.map(day => (
          <div key={day.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <button 
                onClick={() => toggleDay(day.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition"
             >
                <div className="flex items-center gap-4">
                   <div className="bg-[#0f2d54]/10 text-[#0f2d54] font-black w-14 h-14 rounded-xl flex flex-col items-center justify-center">
                      <span className="text-xs uppercase tracking-widest opacity-80">Day</span>
                      <span className="text-xl">{day.dayNumber}</span>
                   </div>
                   <div>
                      <h3 className="font-bold text-[#0f172a] text-lg">{day.title}</h3>
                      <p className="text-sm text-[#64748b]">{format(new Date(day.date), "EEE, dd MMM yyyy")}</p>
                   </div>
                </div>
                <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${openDays[day.id] ? "rotate-180" : ""}`} />
             </button>
             
             <div className={`transition-all duration-300 ease-in-out ${openDays[day.id] ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="p-5 pt-0 pl-24 border-t border-gray-50">
                   <ul className="space-y-3 mt-4 relative before:absolute before:inset-0 before:ml-1 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                      {JSON.parse(day.activities).map((act: string, i: number) => (
                         <li key={i} className="relative flex items-start gap-3">
                            <span className="absolute left-[-22px] mt-1 w-3 h-3 rounded-full bg-[#f97316] border-2 border-white shadow-sm ring-2 ring-orange-100 z-10"></span>
                            <span className="text-gray-700 text-sm leading-relaxed">{act}</span>
                         </li>
                      ))}
                   </ul>
                </div>
             </div>
          </div>
       ))}
    </div>
  );
}
