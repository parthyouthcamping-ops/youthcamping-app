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
         headers: { "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}` }
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

  if(!items.length) return <div className="text-center py-20 text-gray-500">Loading packing list...</div>;

  const categories = Array.from(new Set(items.map(i => i.category)));
  const progress = Math.round((Object.values(packed).filter(Boolean).length / items.length) * 100) || 0;

  return (
    <div className="space-y-6">
       <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-20 z-30">
          <div className="flex justify-between text-sm font-bold text-[#0f2d54] mb-2">
             <span>Packing Progress</span>
             <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
             <div className="bg-[#2d6a4f] h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
       </div>

       {categories.map(cat => (
          <div key={cat as string} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <h3 className="font-bold text-gray-800 p-4 border-b border-gray-50 bg-gray-50/50 uppercase tracking-wider text-xs">{cat}</h3>
             <ul className="divide-y divide-gray-50">
               {items.filter(i => i.category === cat).map(item => (
                  <li 
                     key={item.id} 
                     onClick={() => toggle(item.id)}
                     className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition"
                  >
                     <button className={`${packed[item.id] ? "text-[#2d6a4f]" : "text-gray-300 hover:text-gray-400"}`}>
                        {packed[item.id] ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                     </button>
                     <span className={`${packed[item.id] ? "text-gray-400 line-through" : "text-gray-700"} text-sm font-medium`}>
                        {item.itemName}
                        {item.mandatory && !packed[item.id] && <span className="text-red-500 ml-1 text-xs">*</span>}
                     </span>
                  </li>
               ))}
             </ul>
          </div>
       ))}
    </div>
  );
}
