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
         credentials: "include"
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

  if(!itinerary.length) return <div className="text-center py-20 text-gray font-body italic">Syncing itinerary...</div>;

  return (
    <div className="space-y-4">
       {itinerary.map(day => (
          <div key={day.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden font-body">
             <button 
                onClick={() => toggleDay(day.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50 transition"
             >
                <div className="flex items-center gap-5">
                   <div className="bg-navy/5 text-navy font-black w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-heading border border-navy/5 shadow-inner">
                      <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Day</span>
                      <span className="text-2xl mt-[-4px]">{day.dayNumber}</span>
                   </div>
                   <div>
                      <h3 className="font-black text-navy text-lg font-heading">{day.title}</h3>
                      <p className="text-xs font-bold text-gray uppercase tracking-widest">{format(new Date(day.date), "EEE, dd MMM yyyy")}</p>
                   </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray transition-transform duration-300 ${openDays[day.id] ? "rotate-180" : ""}`} />
             </button>
             
             <div className={`transition-all duration-300 ease-in-out ${openDays[day.id] ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="p-5 pt-0 pl-24 border-t border-gray-50">
                   <ul className="space-y-3 mt-4 relative before:absolute before:inset-0 before:ml-1 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                       {JSON.parse(day.activities).map((act: string, i: number) => (
                          <li key={i} className="relative flex items-start gap-4">
                             <span className="absolute left-[-22px] mt-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white shadow-md ring-4 ring-primary/5 z-10"></span>
                             <span className="text-navy/80 text-sm leading-relaxed font-medium">{act}</span>
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
