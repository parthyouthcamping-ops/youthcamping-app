"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { PlusCircle, Trash2, Edit } from "lucide-react";

export default function AdminTrips() {
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    const res = await fetch("/api/admin/trips", {
      headers: { "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}` }
    });
    if(res.ok) setTrips(await res.json());
  };

  const deleteTrip = async (id: string) => {
    if(!confirm("Delete this trip permanently?")) return;
    await fetch(`/api/admin/trips/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}` }
    });
    loadTrips();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
       <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-[#0f2d54]">Manage Trips</h1>
            <p className="text-[#64748b]">View, edit, and organize all active itineraries.</p>
          </div>
          <Link href="/admin/trips/new" className="bg-[#f97316] hover:bg-[#ea580c] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition">
             <PlusCircle className="w-5 h-5" /> Create Trip
          </Link>
       </div>

       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-xs">
                   <tr>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Destination</th>
                      <th className="px-6 py-4">Departure</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {trips.map(t => (
                      <tr key={t.id} className="hover:bg-gray-50 transition">
                         <td className="px-6 py-4 font-bold text-[#0f172a]">{t.title}</td>
                         <td className="px-6 py-4 text-gray-600">{t.destination}</td>
                         <td className="px-6 py-4 text-gray-600">{format(new Date(t.departureDate), "dd MMM yyyy")}</td>
                         <td className="px-6 py-4">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{t.status}</span>
                         </td>
                         <td className="px-6 py-4 text-right flex justify-end gap-2">
                            <Link href={`/admin/trips/${t.id}/edit`} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition">
                               <Edit className="w-5 h-5" />
                            </Link>
                            <button onClick={() => deleteTrip(t.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                               <Trash2 className="w-5 h-5" />
                            </button>
                         </td>
                      </tr>
                   ))}
                   {!trips.length && <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">No trips available. Create one to begin.</td></tr>}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}
