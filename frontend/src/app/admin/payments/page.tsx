"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CreditCard, PlusCircle, History, Filter, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminPayments() {
  const [history, setHistory] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const headers = { "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}` };
    const [histRes, tripRes] = await Promise.all([
      fetch("/api/admin/payment/history", { headers }),
      fetch("/api/admin/trips", { headers })
    ]);
    if(histRes.ok) setHistory(await histRes.json());
    if(tripRes.ok) setTrips(await tripRes.json());
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "PAID": return "text-green-600 bg-green-50 border-green-100";
      case "PARTIAL": return "text-orange-600 bg-orange-50 border-orange-100";
      case "BOOKED": return "text-blue-600 bg-blue-50 border-blue-100";
      default: return "text-red-600 bg-red-50 border-red-100";
    }
  };

  const filteredHistory = filter === "ALL" ? history : history.filter(h => h.tripTraveler.payment_status === filter);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0f2d54] flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-[#f97316]" /> Payment Management
          </h1>
          <p className="text-[#64748b] mt-1">Track collections, booking amounts, and pending balances.</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
           {["ALL", "PAID", "PARTIAL", "BOOKED", "PENDING"].map(f => (
              <button 
                key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter === f ? "bg-white text-[#0f2d54] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
              >
                {f}
              </button>
           ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-[#0f2d54] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <PlusCircle className="absolute right-[-20px] top-[-20px] w-32 h-32 opacity-10" />
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Total Collected</p>
            <h2 className="text-4xl font-black tracking-tighter">₹{history.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</h2>
            <div className="mt-4 flex items-center gap-2 text-green-400 text-sm font-bold">
               <CheckCircle2 className="w-4 h-4" /> Verified Transactions
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Bookings Pending</p>
            <h2 className="text-3xl font-black text-[#0f2d54]">{history.filter(h => h.payment_type === 'BOOKING').length}</h2>
            <p className="text-sm text-gray-500 mt-2 font-medium">New expedition members</p>
         </div>
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Recent Payments (24h)</p>
            <h2 className="text-3xl font-black text-[#f97316]">₹{history.filter(h => new Date(h.payment_date) > new Date(Date.now() - 86400000)).reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</h2>
            <p className="text-sm text-gray-500 mt-2 font-medium">Flash collections</p>
         </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
           <h3 className="font-bold text-[#0f2d54] flex items-center gap-2">
              <History className="w-5 h-5" /> Transaction Logs
           </h3>
           <Button variant="outline" size="sm" onClick={loadData} className="text-xs">Refresh Logs</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Traveler / User</th>
                <th className="px-6 py-4">Trip Expedition</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {filteredHistory.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono text-gray-400 text-xs">#{h.transaction_id || h.id.slice(0,8)}</td>
                  <td className="px-6 py-4">
                     <p className="text-[#0f172a] font-bold">{h.tripTraveler.user.name}</p>
                     <p className="text-[9px] text-blue-500 font-mono font-bold tracking-tighter mb-1">{h.tripTraveler.participant_code}</p>
                     <p className="text-[10px] text-gray-400 uppercase tracking-tight">{h.tripTraveler.user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                     <p className="text-[#2d6a4f] font-black text-[10px] uppercase tracking-wider">{h.tripTraveler.trip.title}</p>
                  </td>
                  <td className="px-6 py-4">
                     <span className="bg-gray-100 px-3 py-1 rounded-lg text-[10px] font-black text-gray-600 uppercase tracking-wider">
                        {h.payment_method}
                     </span>
                  </td>
                  <td className="px-6 py-4 font-black text-[#0f2d54]">₹{h.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-500">
                     {format(new Date(h.payment_date), "dd MMM, HH:mm")}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(h.tripTraveler.payment_status)}`}>
                        {h.tripTraveler.payment_status}
                     </span>
                  </td>
                </tr>
              ))}
              {!filteredHistory.length && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-gray-400 italic">
                     {loading ? "Decrypting financial ledgers..." : "No matching transactions found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
