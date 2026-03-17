"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  
  const [form, setForm] = useState({ tripId: "", title: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [notifRes, tripRes] = await Promise.all([
         fetch("/api/admin/notifications", { credentials: "include" }),
         fetch("/api/admin/trips", { credentials: "include" })
      ]);
      if(notifRes.ok) setNotifications(await notifRes.json());
      if(tripRes.ok) {
         const tData = await tripRes.json();
         setTrips(tData);
         if(tData.length > 0) setForm(prev => ({ ...prev, tripId: tData[0].id }));
      }
    } catch (error) {
      console.error("Failed to load notifications data", error);
    }
  };

  const submit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     await fetch("/api/admin/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
     });
     setForm({ ...form, title: "", message: "" });
     setLoading(false);
     loadData();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 font-body">
        <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[8rem] -z-0"></div>
           <h1 className="text-4xl font-black text-navy mb-3 font-heading uppercase tracking-tight relative z-10">Broadcast Alerts</h1>
           <p className="text-gray mb-10 font-medium relative z-10">Send real-time updates to all travelers on a specific expedition.</p>
           
           <form onSubmit={submit} className="space-y-6 max-w-2xl relative z-10">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1 font-heading">Select Target Expedition</label>
                 <select 
                   className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-primary/20 transition-all text-sm font-bold text-navy outline-none"
                   value={form.tripId} onChange={e => setForm({...form, tripId: e.target.value})}
                   required
                 >
                    <option value="" disabled>Choose an active trip...</option>
                    {trips.map(t => <option key={t.id} value={t.id}>{t.destination} ({format(new Date(t.departureDate), "MMM dd, yyyy")})</option>)}
                 </select>
              </div>
              
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1 font-heading">Alert Title</label>
                 <input required placeholder="e.g. Weather Advisory / Assembly Points" className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-primary/20 transition-all text-sm font-bold text-navy outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
 
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1 font-heading">Message Content</label>
                 <textarea required placeholder="Write your announcement here..." rows={4} className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-primary/20 transition-all text-sm font-bold text-navy outline-none resize-none" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
              </div>
 
              <Button disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                 {loading ? "Transmitting..." : "Send Real-Time Alert"}
              </Button>
           </form>
        </div>

       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
             <h2 className="font-bold text-[#0f2d54] uppercase tracking-wider text-sm">Broadcast History</h2>
          </div>
          <div className="divide-y divide-gray-50">
             {notifications.map(n => (
                <div key={n.id} className="p-6 hover:bg-gray-50 transition">
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-[#0f172a]">{n.title}</h3>
                      <span className="text-xs text-gray-500 font-semibold">{format(new Date(n.createdAt), "dd MMM yyyy, HH:mm")}</span>
                   </div>
                   <p className="text-gray-600 text-sm mb-3 max-w-3xl">{n.message}</p>
                   <div className="inline-block bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-xs uppercase border border-blue-100">
                      Targeted: {n.trip?.title}
                   </div>
                </div>
             ))}
             {!notifications.length && <div className="p-10 text-center text-gray-500">No broadcasts sent.</div>}
          </div>
       </div>
    </div>
  );
}
