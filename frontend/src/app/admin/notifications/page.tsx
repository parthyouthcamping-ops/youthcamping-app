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
    const headers = { "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}` };
    const [notifRes, tripRes] = await Promise.all([
       fetch("/api/admin/notifications", { headers }),
       fetch("/api/admin/trips", { headers })
    ]);
    if(notifRes.ok) setNotifications(await notifRes.json());
    if(tripRes.ok) {
       const tData = await tripRes.json();
       setTrips(tData);
       if(tData.length > 0) setForm(prev => ({ ...prev, tripId: tData[0].id }));
    }
  };

  const submit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     await fetch("/api/admin/notify", {
        method: "POST",
        headers: {
           "Content-Type": "application/json",
           "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify(form)
     });
     setForm({ ...form, title: "", message: "" });
     setLoading(false);
     loadData();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
       <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black text-[#0f2d54] mb-2">Broadcast Notification</h1>
          <p className="text-[#64748b] mb-6">Send important updates instantly to a specific trip group.</p>
          
          <form onSubmit={submit} className="space-y-4 max-w-xl">
             <select 
               className="w-full border rounded-xl p-3 bg-gray-50 focus:bg-white text-sm font-semibold"
               value={form.tripId} onChange={e => setForm({...form, tripId: e.target.value})}
               required
             >
                <option value="" disabled>Select Trip</option>
                {trips.map(t => <option key={t.id} value={t.id}>{t.title} ({format(new Date(t.departureDate), "MMM dd")})</option>)}
             </select>
             <input required placeholder="Alert Title (e.g., Weather Warning)" className="w-full border rounded-xl p-3 bg-gray-50 focus:bg-white text-sm font-semibold" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
             <textarea required placeholder="Message details..." rows={4} className="w-full border rounded-xl p-3 bg-gray-50 focus:bg-white text-sm font-semibold resize-none" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
             <Button disabled={loading} className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-6 rounded-xl text-lg font-bold">
                {loading ? "Sending..." : "Dispatch Broadcast"}
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
