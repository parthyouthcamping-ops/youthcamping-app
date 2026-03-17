"use client";

import { useEffect, useState, use } from "react";
import { CheckCircle2, Circle } from "lucide-react";

export default function TripPacking({ params }: { params: Promise<{ id: string }> }) {
  const { id: tripId } = use(params);
  const [items, setItems] = useState<any[]>([]);
  const [packed, setPacked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/traveler/trip/${tripId}/packing`, {
         credentials: "include"
      });
      if(res.ok) setItems(await res.json());

      const saved = localStorage.getItem(`packing_${tripId}`);
      if(saved) setPacked(JSON.parse(saved));
    };
    load();
  }, [tripId]);

  const toggle = (id: string) => {
    const updated = { ...packed, [id]: !packed[id] };
    setPacked(updated);
    localStorage.setItem(`packing_${tripId}`, JSON.stringify(updated));
  };

  if(!items.length) return <div className="text-center py-20 text-gray font-body italic">Syncing packing list...</div>;

  const categories = Array.from(new Set(items.map(i => i.category)));
  const progress = Math.round((Object.values(packed).filter(Boolean).length / items.length) * 100) || 0;

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pt-6 pb-20 font-body">
       <div className="bg-navy p-6 sm:p-8 rounded-3xl shadow-xl shadow-navy/20 sticky top-20 z-30">
          <div className="flex justify-between text-xs font-black text-white/60 mb-3 font-heading tracking-[0.2em] uppercase">
             <span>Packing Progress</span>
             <span className="text-primary">{progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
             <div className="bg-primary h-full rounded-full transition-all duration-700 ease-out relative" style={{ width: `${progress}%` }}>
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
             </div>
          </div>
       </div>

        {categories.map(cat => (
           <div key={cat as string} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md group">
              <h3 className="font-black text-navy p-5 border-b border-gray-50 bg-gray-50/30 uppercase tracking-[0.15em] text-[10px] font-heading">{cat}</h3>
              <ul className="divide-y divide-gray-50">
                {items.filter(i => i.category === cat).map(item => (
                   <li 
                      key={item.id} 
                      onClick={() => toggle(item.id)}
                      className="flex items-center gap-4 p-5 hover:bg-gray-50/50 cursor-pointer transition select-none"
                   >
                       <div className={`${packed[item.id] ? "text-teal" : "text-gray-300 group-hover:text-gray-400"} transition-colors`}>
                          {packed[item.id] ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                       </div>
                       <span className={`${packed[item.id] ? "text-gray/50 line-through" : "text-navy"} text-sm sm:text-base font-semibold transition-all`}>
                         {item.itemName}
                         {item.mandatory && !packed[item.id] && <span className="text-red-500 ml-1.5 text-xs font-black uppercase tracking-tighter">* Required</span>}
                      </span>
                   </li>
                ))}
              </ul>
           </div>
        ))}
    </div>
  );
}
