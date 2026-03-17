"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { PlusCircle, X, ShieldCheck, Mail, Phone, MapPin, CreditCard, DollarSign, Wallet, History, Search, Ticket, CheckCircle2, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminTravelers() {
  const [travelers, setTravelers] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [form, setForm] = useState({
    tripId: "",
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    loadData();
  }, [searchTerm]);

  const loadData = async () => {
    try {
      const [tvlRes, tripRes] = await Promise.all([
        fetch(`/api/admin/travelers?search=${searchTerm}`, { credentials: "include" }),
        fetch("/api/admin/trips", { credentials: "include" })
      ]);
      if(tvlRes.ok) setTravelers(await tvlRes.json());
      if(tripRes.ok) setTrips(await tripRes.json());
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
  };

  const updateCheckin = async (id: string, status: string) => {
     const res = await fetch(`/api/admin/travelers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ checkin_status: status })
     });
     if(res.ok) loadData();
  };


  const removeTraveler = async (id: string) => {
    if(!confirm("Remove this traveler from the trip?")) return;
    await fetch(`/api/admin/travelers/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    loadData();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/travelers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if(res.ok) {
        if(data.credentials) setCredentials(data.credentials);
        else {
           setShowAdd(false);
           setForm({ tripId: "", name: "", email: "", phone: "" });
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

  const filteredTravelers = travelers;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 font-montserrat">
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 gap-6">
          <div>
            <h1 className="text-3xl font-black text-navy font-heading">Traveler Roster</h1>
            <p className="text-gray mt-1">Monitor participants, manage verification codes, and assignments.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
             {/* Removed status filter */}
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
                <input 
                   type="text" placeholder="Search ID, Name, Phone..." 
                   className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white text-sm outline-none transition"
                   value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
             <button 
                onClick={() => setShowAdd(true)}
                className="bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-primary/20 whitespace-nowrap"
             >
                <PlusCircle className="w-5 h-5" /> Add New
             </button>
          </div>
       </div>

       {/* Add Traveler Modal */}
       {showAdd && (
          <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {credentials ? (
                   <div className="p-8 text-center space-y-6">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                         <ShieldCheck className="w-10 h-10" />
                      </div>
                      <div>
                         <h2 className="text-2xl font-black text-navy font-heading">Credentials Generated</h2>
                         <p className="text-gray mt-1 font-body">A new account has been created for this traveler.</p>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 text-left space-y-3">
                         <div>
                            <p className="text-[10px] font-bold text-gray uppercase tracking-widest font-heading">Portal Email</p>
                            <p className="font-bold text-navy text-lg font-body">{credentials.email}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-gray uppercase tracking-widest font-heading">Temporary Password</p>
                            <p className="font-mono font-bold text-primary text-2xl tracking-wider px-3 py-2 bg-white rounded-lg border border-primary/20 inline-block">{credentials.password}</p>
                         </div>
                      </div>
                      <p className="text-xs text-red-500 font-bold tracking-tighter uppercase mb-4 font-body">⚠️ Copy these now. They will not be shown again.</p>
                      <Button 
                         onClick={() => { setShowAdd(false); setCredentials(null); setForm({ tripId: "", name: "", email: "", phone: "" }); }} 
                         className="w-full bg-navy py-6 text-lg font-bold rounded-2xl shadow-lg shadow-navy/20"
                      >
                         Done & Close
                      </Button>
                   </div>
                ) : (
                   <div className="p-8">
                      <div className="flex justify-between items-center mb-6">
                         <h2 className="text-2xl font-black text-navy font-heading">Add New Traveler</h2>
                         <button onClick={() => setShowAdd(false)} className="text-gray hover:text-navy transition"><X /></button>
                      </div>
                      
                      <form onSubmit={submit} className="space-y-4">
                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray uppercase tracking-widest ml-1 font-heading">Assign to Trip</label>
                            <select 
                               className="w-full border rounded-xl p-3 bg-gray-50 focus:bg-white text-sm font-semibold outline-none transition font-body"
                               value={form.tripId} onChange={e => setForm({...form, tripId: e.target.value})}
                               required
                            >
                               <option value="" disabled>Select Trip</option>
                               {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                            </select>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold text-gray uppercase tracking-widest ml-1 font-heading">Full Name</label>
                               <input required className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white text-sm outline-none transition font-body" placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold text-gray uppercase tracking-widest ml-1 font-heading">Email</label>
                               <input required type="email" className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white text-sm outline-none transition font-body" placeholder="john@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                            </div>
                         </div>

                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray uppercase tracking-widest ml-1 font-heading">Phone</label>
                            <input className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white text-sm outline-none transition font-body" placeholder="+91 00000 00000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                         </div>

                         <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-1 font-heading"><Ticket className="w-3 h-3" /> System Note</p>
                            <p className="text-xs text-blue-700 font-medium font-body">A unique Participant Code will be auto-generated. You will be assigned as the trip coordinator.</p>
                         </div>

                         <Button disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-2xl text-lg font-bold mt-4 shadow-lg shadow-primary/20">
                            {loading ? "Processing..." : "Generate Participant Record"}
                         </Button>
                      </form>
                   </div>
                )}
             </div>
          </div>
       )}


       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden font-body">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-navy text-white font-semibold uppercase tracking-wider text-[10px] font-heading">
                   <tr>
                      <th className="px-6 py-5">Participant Code</th>
                      <th className="px-6 py-5">Traveler Info</th>
                      <th className="px-6 py-5">Check-in Status</th>
                      <th className="px-6 py-5 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium">
                   {filteredTravelers.map(t => (
                      <tr key={t.id} className="hover:bg-blue-50/30 transition group">
                         <td className="px-6 py-4">
                            <span className="bg-blue-50 text-navy font-black px-4 py-2 rounded-xl border border-blue-100 text-[10px] tracking-widest font-mono shadow-sm">
                               {t.participant_code}
                            </span>
                         </td>
                         <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black font-heading">
                                   {t.user.name.charAt(0)}
                                </div>
                                <div>
                                   <p className="font-bold text-navy font-heading">{t.user.name}</p>
                                   <p className="text-[10px] text-gray font-bold uppercase tracking-widest flex items-center gap-1 font-body">
                                      <Phone className="w-2.5 h-2.5" /> {t.user.phone || "No Phone"}
                                   </p>
                                   <p className="text-[9px] text-teal font-black uppercase tracking-widest font-heading">{t.trip.title}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border font-body ${
                                t.checkin_status === 'CHECKED_IN' ? 'bg-teal/10 text-teal border-teal/20' : 
                                'bg-gray-100 text-gray border-gray-200'
                             }`}>
                                {t.checkin_status.replace('_', ' ')}
                             </span>
                          </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                               <button 
                                  onClick={() => updateCheckin(t.id, t.checkin_status === 'CHECKED_IN' ? 'REGISTERED' : 'CHECKED_IN')}
                                  className="bg-white border-2 border-gray-100 hover:border-teal hover:text-teal text-navy p-2 rounded-xl transition shadow-sm"
                                  title="Toggle Check-in"
                                >
                                   <CheckCircle2 className="w-4 h-4" />
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
