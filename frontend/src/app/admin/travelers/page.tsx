"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { PlusCircle, X, ShieldCheck, Mail, Phone, MapPin, CreditCard, DollarSign, Wallet, History, Search, Ticket, CheckCircle2, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminTravelers() {
  const [travelers, setTravelers] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showPayment, setShowPayment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [form, setForm] = useState({
    tripId: "",
    name: "",
    email: "",
    phone: "",
    paymentStatus: "PENDING"
  });

  const [payForm, setPayForm] = useState({
    amount: 0,
    payment_method: "Bank Transfer",
    transaction_id: "",
    isBooking: false
  });

  useEffect(() => {
    loadData();
  }, [searchTerm]);

  const loadData = async () => {
    const headers = { "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}` };
    const [tvlRes, tripRes] = await Promise.all([
      fetch(`/api/admin/travelers?search=${searchTerm}`, { headers }),
      fetch("/api/admin/trips", { headers })
    ]);
    if(tvlRes.ok) setTravelers(await tvlRes.json());
    if(tripRes.ok) setTrips(await tripRes.json());
  };

  const updateCheckin = async (id: string, status: string) => {
     const res = await fetch(`/api/admin/travelers/${id}`, {
        method: "PUT",
        headers: { 
           "Content-Type": "application/json",
           "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify({ checkin_status: status })
     });
     if(res.ok) loadData();
  };

  const submitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = payForm.isBooking ? "/api/admin/payment/booking" : "/api/admin/payment/update";
    const body = {
        tripTravelerId: showPayment.id,
        amount: Number(payForm.amount),
        payment_method: payForm.payment_method,
        transaction_id: payForm.transaction_id,
        total_amount: showPayment.total_amount
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify(body)
      });
      if(res.ok) {
        setShowPayment(null);
        setPayForm({ amount: 0, payment_method: "Bank Transfer", transaction_id: "", isBooking: false });
        loadData();
      }
    } catch(err) { alert("Payment recording failed"); }
    finally { setLoading(false); }
  };

  const removeTraveler = async (id: string) => {
    if(!confirm("Remove this traveler from the trip?")) return;
    await fetch(`/api/admin/travelers/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}` }
    });
    loadData();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/travelers", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if(res.ok) {
        if(data.credentials) setCredentials(data.credentials);
        else {
           setShowAdd(false);
           setForm({ tripId: "", name: "", email: "", phone: "", paymentStatus: "PENDING" });
        }
        loadData();
      } else {
        alert(data.error || "Failed to add traveler");
      }
    } catch(err) {
      alert("Error adding traveler");
    } finally {
      setLoading(false);
    }
  };

  const filteredTravelers = statusFilter === "ALL" 
    ? travelers 
    : travelers.filter(t => t.payment_status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 font-montserrat">
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#0f2d54]">Traveler Roster</h1>
            <p className="text-[#64748b] mt-1">Monitor participants, manage payments, and verification codes.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
             <div className="flex bg-gray-100 p-1 rounded-xl">
                {["ALL", "PENDING", "PARTIAL", "PAID"].map(s => (
                   <button 
                      key={s} 
                      onClick={() => setStatusFilter(s)}
                      className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all ${statusFilter === s ? "bg-white text-[#0f2d54] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                   >
                      {s}
                   </button>
                ))}
             </div>
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                   type="text" placeholder="Search ID, Name, Phone..." 
                   className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white text-sm outline-none transition"
                   value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
             <button 
                onClick={() => setShowAdd(true)}
                className="bg-[#f97316] hover:bg-[#ea580c] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-orange-100 whitespace-nowrap"
             >
                <PlusCircle className="w-5 h-5" /> Add New
             </button>
          </div>
       </div>

       {/* Add Traveler Modal */}
       {showAdd && (
          <div className="fixed inset-0 z-50 bg-[#0f2d54]/60 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {credentials ? (
                   <div className="p-8 text-center space-y-6">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                         <ShieldCheck className="w-10 h-10" />
                      </div>
                      <div>
                         <h2 className="text-2xl font-black text-[#0f2d54]">Credentials Generated</h2>
                         <p className="text-gray-500 mt-1">A new account has been created for this traveler.</p>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 text-left space-y-3">
                         <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Portal Email</p>
                            <p className="font-bold text-[#0f2d54] text-lg">{credentials.email}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Temporary Password</p>
                            <p className="font-mono font-bold text-[#f97316] text-2xl tracking-wider px-3 py-2 bg-white rounded-lg border border-orange-100 inline-block">{credentials.password}</p>
                         </div>
                      </div>
                      <p className="text-xs text-red-500 font-bold tracking-tighter uppercase mb-4">⚠️ Copy these now. They will not be shown again.</p>
                      <Button 
                         onClick={() => { setShowAdd(false); setCredentials(null); setForm({ tripId: "", name: "", email: "", phone: "", paymentStatus: "PENDING" }); }} 
                         className="w-full bg-[#0f2d54] py-6 text-lg font-bold rounded-2xl"
                      >
                         Done & Close
                      </Button>
                   </div>
                ) : (
                   <div className="p-8">
                      <div className="flex justify-between items-center mb-6">
                         <h2 className="text-2xl font-black text-[#0f2d54]">Add New Traveler</h2>
                         <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                      </div>
                      
                      <form onSubmit={submit} className="space-y-4">
                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Assign to Trip</label>
                            <select 
                               className="w-full border rounded-xl p-3 bg-gray-50 focus:bg-white text-sm font-semibold outline-none transition"
                               value={form.tripId} onChange={e => setForm({...form, tripId: e.target.value})}
                               required
                            >
                               <option value="" disabled>Select Trip</option>
                               {trips.map(t => <option key={t.id} value={t.id}>{t.title} (₹{t.price?.toLocaleString()})</option>)}
                            </select>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                               <input required className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white text-sm outline-none transition" placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                               <input required type="email" className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white text-sm outline-none transition" placeholder="john@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                            </div>
                         </div>

                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                            <input className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white text-sm outline-none transition" placeholder="+91 00000 00000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                         </div>

                         <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Ticket className="w-3 h-3" /> System Note</p>
                            <p className="text-xs text-blue-700 font-medium">A unique Participant Code will be auto-generated. You will be assigned as the trip coordinator.</p>
                         </div>

                         <Button disabled={loading} className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-6 rounded-2xl text-lg font-bold mt-4 shadow-lg shadow-orange-100">
                            {loading ? "Processing..." : "Generate Participant Record"}
                         </Button>
                      </form>
                   </div>
                )}
             </div>
          </div>
       )}

       {/* Payment Modal */}
       {showPayment && (
          <div className="fixed inset-0 z-50 bg-[#0f2d54]/60 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                 <div className="bg-[#0f2d54] p-6 text-white text-center">
                    <Wallet className="w-12 h-12 mx-auto mb-2 text-[#f97316]" />
                    <h2 className="text-xl font-black uppercase tracking-widest">Update Financials</h2>
                    <p className="text-blue-200 text-xs">Recording payment for {showPayment.user.name}</p>
                 </div>
                 
                 <form onSubmit={submitPayment} className="p-8 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-2xl mb-4 border border-gray-100 flex justify-between items-center">
                       <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Remaining</p>
                          <p className="text-xl font-black text-[#0f2d54]">₹{showPayment.remaining_amount.toLocaleString()}</p>
                       </div>
                       <History className="w-6 h-6 text-gray-300" />
                    </div>

                    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-2">
                       <button type="button" onClick={() => setPayForm({...payForm, isBooking: true})} className={`flex-1 py-3 text-xs font-bold rounded-lg transition ${payForm.isBooking ? 'bg-white text-[#0f2d54] shadow-sm' : 'text-gray-400'}`}>BOOKING</button>
                       <button type="button" onClick={() => setPayForm({...payForm, isBooking: false})} className={`flex-1 py-3 text-xs font-bold rounded-lg transition ${!payForm.isBooking ? 'bg-white text-[#0f2d54] shadow-sm' : 'text-gray-400'}`}>PARTIAL/FULL</button>
                    </div>

                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Payment Amount (₹)</label>
                       <input required type="number" className="w-full px-4 py-4 border rounded-xl bg-gray-50 focus:bg-white text-2xl font-black text-[#0f2d54] outline-none transition" value={payForm.amount} onChange={e => setPayForm({...payForm, amount: Number(e.target.value)})} />
                    </div>

                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Method</label>
                       <select className="w-full border rounded-xl p-3 bg-gray-50 text-sm font-semibold outline-none" value={payForm.payment_method} onChange={e => setPayForm({...payForm, payment_method: e.target.value})}>
                          <option>Bank Transfer</option><option>UPI (PhonePe/GPay)</option><option>Cash</option><option>Credit/Debit Card</option>
                       </select>
                    </div>

                    <div className="space-y-1 pb-4">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Transaction ID / Ref</label>
                       <input className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white text-sm outline-none transition" placeholder="e.g. TXN12345678" value={payForm.transaction_id} onChange={e => setPayForm({...payForm, transaction_id: e.target.value})} />
                    </div>

                    <div className="flex gap-3">
                       <Button type="button" variant="outline" onClick={() => setShowPayment(null)} className="flex-1 py-6 rounded-2xl font-bold">Cancel</Button>
                       <Button type="submit" disabled={loading} className="flex-2 bg-[#f97316] hover:bg-[#ea580c] text-white py-6 rounded-2xl font-black tracking-widest">
                          {loading ? "Syncing..." : "RECORD PAYMENT"}
                       </Button>
                    </div>
                 </form>
             </div>
          </div>
       )}

       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#0f2d54] text-blue-200 font-semibold uppercase tracking-wider text-[10px]">
                   <tr>
                      <th className="px-6 py-5">Participant Code</th>
                      <th className="px-6 py-5">Traveler Info</th>
                      <th className="px-6 py-5">Financial Summary (₹)</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-6 py-5 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium">
                   {filteredTravelers.map(t => (
                      <tr key={t.id} className="hover:bg-blue-50/30 transition group">
                         <td className="px-6 py-4">
                            <span className="bg-blue-50 text-[#0f2d54] font-black px-4 py-2 rounded-xl border border-blue-100 text-[10px] tracking-widest font-mono shadow-sm">
                               {t.participant_code}
                            </span>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-[#f97316]/10 text-[#f97316] rounded-full flex items-center justify-center font-black">
                                  {t.user.name.charAt(0)}
                               </div>
                               <div>
                                  <p className="font-bold text-[#0f172a]">{t.user.name}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                     <Phone className="w-2.5 h-2.5" /> {t.user.phone || "No Phone"}
                                  </p>
                                  <p className="text-[9px] text-[#2d6a4f] font-black uppercase tracking-widest">{t.trip.title}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                               <div>
                                  <p className="text-[8px] text-gray-400 font-black uppercase">Total</p>
                                  <p className="text-xs font-bold text-gray-700">₹{t.total_amount?.toLocaleString()}</p>
                               </div>
                               <div>
                                  <p className="text-[8px] text-gray-400 font-black uppercase">Booking</p>
                                  <p className="text-xs font-bold text-gray-500">₹{t.booking_amount?.toLocaleString()}</p>
                               </div>
                               <div>
                                  <p className="text-[8px] text-gray-400 font-black uppercase">Paid</p>
                                  <p className="text-xs font-black text-green-600">₹{t.amount_paid?.toLocaleString()}</p>
                               </div>
                               <div>
                                  <p className="text-[8px] text-gray-400 font-black uppercase">Remaining</p>
                                  <p className="text-xs font-black text-red-500">₹{t.remaining_amount?.toLocaleString()}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                               t.payment_status === 'PAID' ? 'bg-green-100 text-green-700 border-green-200 shadow-sm shadow-green-50' : 
                               t.payment_status === 'PENDING' ? 'bg-red-50 text-red-600 border-red-100' : 
                               'bg-orange-50 text-orange-600 border-orange-100'
                            }`}>
                               {t.payment_status}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                               <button 
                                  onClick={() => setShowPayment(t)}
                                  className="bg-white border-2 border-gray-100 hover:border-[#f97316] hover:text-[#f97316] text-[#0f2d54] p-2 rounded-xl transition shadow-sm"
                                  title="Add Payment"
                               >
                                  <DollarSign className="w-4 h-4" />
                               </button>
                               <button onClick={() => removeTraveler(t.id)} className="bg-white border-2 border-gray-100 hover:border-red-200 hover:text-red-500 text-gray-400 p-2 rounded-xl transition shadow-sm" title="Remove">
                                  <X className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                   ))}
                   {!filteredTravelers.length && <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No participants found matching your criteria.</td></tr>}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}
