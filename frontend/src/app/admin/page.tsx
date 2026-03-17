"use client";

import { useEffect, useState } from "react";
import { Tent, Users, UserCog, CheckCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ trips: 0, travelers: 0, staff: 0 });
  const [activeTrips, setActiveTrips] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [tripsRes, tvlRes, stfRes] = await Promise.all([
           fetch("/api/admin/trips", { credentials: "include" }),
           fetch("/api/admin/travelers", { credentials: "include" }),
           fetch("/api/admin/staff", { credentials: "include" })
        ]);
        
        const tripsData = tripsRes.ok ? await tripsRes.json() : [];
        setStats({
           trips: tripsData.length,
           travelers: tvlRes.ok ? (await tvlRes.json()).length : 0,
           staff: stfRes.ok ? (await stfRes.json()).length : 0
        });
        setActiveTrips(tripsData.slice(0, 5));
      } catch (error) {
        console.error("Dashboard load failed:", error);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
           <div>
              <h1 className="text-4xl font-black text-navy mb-2 font-heading uppercase tracking-tight">Overview</h1>
              <p className="text-gray font-body font-medium">Real-time metrics for YouthCamping activities.</p>
           </div>
           <div className="flex gap-3">
              <Link href="/admin/trips/new" className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold font-heading shadow-lg shadow-primary/20">NEW TRIP</Link>
              <Link href="/admin/travelers" className="px-4 py-2 bg-navy text-white rounded-xl text-xs font-bold font-heading shadow-lg shadow-navy/20">ADD TRAVELER</Link>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
           <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition">
              <div className="bg-primary/10 p-5 rounded-2xl text-primary transition-transform group-hover:scale-110"><Tent className="w-10 h-10" /></div>
              <div>
                 <p className="text-[10px] text-gray font-black uppercase tracking-widest mb-1 font-heading">Total Trips</p>
                 <p className="text-4xl font-black text-navy font-heading">{stats.trips}</p>
              </div>
           </div>
           <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition">
              <div className="bg-teal/10 p-5 rounded-2xl text-teal transition-transform group-hover:scale-110"><Users className="w-10 h-10" /></div>
              <div>
                 <p className="text-[10px] text-gray font-black uppercase tracking-widest mb-1 font-heading">Travelers</p>
                 <p className="text-4xl font-black text-navy font-heading">{stats.travelers}</p>
              </div>
           </div>
           <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition">
              <div className="bg-navy/10 p-5 rounded-2xl text-navy transition-transform group-hover:scale-110"><UserCog className="w-10 h-10" /></div>
              <div>
                 <p className="text-[10px] text-gray font-black uppercase tracking-widest mb-1 font-heading">Active Staff</p>
                 <p className="text-4xl font-black text-navy font-heading">{stats.staff}</p>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden font-body">
           <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-black text-navy uppercase tracking-[0.2em] text-[10px] font-heading">Recent Trips</h2>
              <Link href="/admin/trips" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest font-heading">View All</Link>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                 <thead className="text-[10px] uppercase bg-navy text-white font-black tracking-widest font-heading">
                    <tr>
                       <th className="px-6 py-5">Trip Title</th>
                       <th className="px-6 py-5 hidden md:table-cell">Destination</th>
                       <th className="px-6 py-5">Dates</th>
                       <th className="px-6 py-5">Status</th>
                    </tr>
                 </thead>
                <tbody className="divide-y divide-gray-50">
                    {activeTrips.map(t => (
                       <tr key={t.id} className="hover:bg-blue-50/30 transition">
                          <td className="px-6 py-4 font-bold text-navy font-heading">{t.title}</td>
                          <td className="px-6 py-4 hidden md:table-cell text-gray">{t.destination}</td>
                          <td className="px-6 py-4 font-medium text-gray">
                             {format(new Date(t.departureDate), "MMM dd")} - {format(new Date(t.returnDate), "MMM dd")}
                          </td>
                          <td className="px-6 py-4">
                             <span className="bg-teal/10 text-teal px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal/20 shadow-sm">
                                {t.status}
                             </span>
                          </td>
                       </tr>
                    ))}
                   {!activeTrips.length && <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No trips found.</td></tr>}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}
