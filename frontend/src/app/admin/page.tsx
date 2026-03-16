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
      const headers = { "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}` };
      const [tripsRes, tvlRes, stfRes] = await Promise.all([
         fetch("/api/admin/trips", { headers }),
         fetch("/api/admin/travelers", { headers }),
         fetch("/api/admin/staff", { headers })
      ]);
      
      const tripsData = tripsRes.ok ? await tripsRes.json() : [];
      setStats({
         trips: tripsData.length,
         travelers: tvlRes.ok ? (await tvlRes.json()).length : 0,
         staff: stfRes.ok ? (await stfRes.json()).length : 0
      });
      setActiveTrips(tripsData.slice(0, 5));
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
       <div>
          <h1 className="text-3xl font-black text-[#0f2d54] mb-2">Overview</h1>
          <p className="text-[#64748b]">Real-time system metrics for YouthCamping activities.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
             <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><Tent className="w-8 h-8" /></div>
             <div>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Trips</p>
                <p className="text-3xl font-black text-[#0f172a]">{stats.trips}</p>
             </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
             <div className="bg-green-50 p-4 rounded-2xl text-green-600"><Users className="w-8 h-8" /></div>
             <div>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Travelers</p>
                <p className="text-3xl font-black text-[#0f172a]">{stats.travelers}</p>
             </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
             <div className="bg-orange-50 p-4 rounded-2xl text-orange-600"><UserCog className="w-8 h-8" /></div>
             <div>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Active Staff</p>
                <p className="text-3xl font-black text-[#0f172a]">{stats.staff}</p>
             </div>
          </div>
       </div>

       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
             <h2 className="font-bold text-[#0f2d54] uppercase tracking-wider text-sm">Recent Trips</h2>
             <Link href="/admin/trips" className="text-sm font-bold text-[#f97316] hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase bg-gray-50 text-gray-500 font-semibold tracking-wider">
                   <tr>
                      <th className="px-6 py-4">Trip</th>
                      <th className="px-6 py-4 hidden md:table-cell">Destination</th>
                      <th className="px-6 py-4">Dates</th>
                      <th className="px-6 py-4">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {activeTrips.map(t => (
                      <tr key={t.id} className="hover:bg-gray-50 transition">
                         <td className="px-6 py-4 font-bold text-[#0f172a]">{t.title}</td>
                         <td className="px-6 py-4 hidden md:table-cell text-gray-600">{t.destination}</td>
                         <td className="px-6 py-4 font-medium text-gray-600">
                            {format(new Date(t.departureDate), "MMM dd")} - {format(new Date(t.returnDate), "MMM dd, yyyy")}
                         </td>
                         <td className="px-6 py-4">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
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
