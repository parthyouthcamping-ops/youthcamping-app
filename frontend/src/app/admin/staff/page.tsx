"use client";

import { useEffect, useState } from "react";
import { PlusCircle, X, ShieldCheck, Mail, Phone, UserCog, Car, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminStaff() {
  const [staff, setStaff] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<any>(null);

  const [form, setForm] = useState({
    tripId: "",
    name: "",
    email: "",
    phone: "",
    role: "GUIDE"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stfRes, tripRes] = await Promise.all([
        fetch("/api/admin/staff", { credentials: "include" }),
        fetch("/api/admin/trips", { credentials: "include" })
      ]);
      if(stfRes.ok) setStaff(await stfRes.json());
      if(tripRes.ok) setTrips(await tripRes.json());
    } catch (error) {
      console.error("Staff load failed:", error);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if(res.ok) {
        if(data.credentials) setCredentials(data.credentials);
        else {
           setShowAdd(false);
           setForm({ tripId: "", name: "", email: "", phone: "", role: "GUIDE" });
        }
        loadData();
      } else {
        alert(data.error || "Failed to assign staff");
      }
    } catch(err) {
      alert("Error adding staff");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (role: string) => {
     switch(role) {
        case "DRIVER": return <Car className="w-5 h-5" />;
        case "GUIDE": return <ShieldCheck className="w-5 h-5" />;
        default: return <UserCog className="w-5 h-5" />;
     }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 font-montserrat">
       <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-navy font-heading uppercase tracking-tight">Staff Management</h1>
            <p className="text-gray mt-1 font-body">Assign and authorize field operations team.</p>
          </div>
          <button 
             onClick={() => setShowAdd(true)}
             className="bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-primary/20 font-heading"
          >
             <PlusCircle className="w-5 h-5" /> Onboard Staff
          </button>
       </div>

        {showAdd && (
          <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 font-body">
                {credentials ? (
                   <div className="p-8 text-center space-y-6">
                      <div className="w-20 h-20 bg-blue-100 text-navy rounded-full flex items-center justify-center mx-auto shadow-inner">
                         <ShieldCheck className="w-10 h-10" />
                      </div>
                      <div>
                         <h2 className="text-2xl font-black text-navy font-heading">Staff Account Ready</h2>
                         <p className="text-gray mt-1">A secure account has been created for the team member.</p>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 text-left space-y-3">
                         <div>
                            <p className="text-[10px] font-bold text-gray uppercase tracking-widest font-heading">Login ID (Email)</p>
                            <p className="font-bold text-navy text-lg">{credentials.email}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-gray uppercase tracking-widest font-heading">Access Key (Password)</p>
                            <p className="font-mono font-bold text-teal text-2xl tracking-wider px-3 py-2 bg-white rounded-lg border border-teal/10 inline-block">{credentials.password}</p>
                         </div>
                      </div>
                      <p className="text-xs text-red-500 font-bold uppercase tracking-tighter">Copy these now. They will not be shown again.</p>
                      <Button 
                         onClick={() => { setShowAdd(false); setCredentials(null); setForm({ tripId: "", name: "", email: "", phone: "", role: "GUIDE" }); }} 
                         className="w-full bg-navy py-6 text-lg font-bold rounded-2xl shadow-lg shadow-navy/20 font-heading"
                      >
                         Continue to Dashboard
                      </Button>
                   </div>
                ) : (
                    <div className="p-8">
                       <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-black text-navy font-heading">Add Team Member</h2>
                          <button onClick={() => setShowAdd(false)} className="text-gray hover:text-navy transition"><X /></button>
                       </div>
                       
                       <form onSubmit={submit} className="space-y-4">
                          <div className="space-y-1">
                             <label className="text-[10px] font-bold text-gray uppercase tracking-widest ml-1 font-heading">Allocate to Trip</label>
                             <select 
                                className="w-full border rounded-xl p-3 bg-gray-50 focus:bg-white text-sm font-semibold outline-none"
                                value={form.tripId} onChange={e => setForm({...form, tripId: e.target.value})}
                                required
                             >
                                <option value="" disabled>Select Alive Expedition</option>
                                {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                             </select>
                          </div>
 
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray uppercase tracking-widest ml-1 font-heading">Staff Name</label>
                                <input required className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white text-sm outline-none" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                             </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold text-gray uppercase tracking-widest ml-1 font-heading">Role</label>
                               <select 
                                  className="w-full border rounded-xl p-3 bg-gray-50 focus:bg-white text-sm font-semibold outline-none"
                                  value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                                  required
                               >
                                  {['GUIDE', 'DRIVER', 'COORDINATOR', 'MEDIC'].map(r => <option key={r} value={r}>{r}</option>)}
                               </select>
                            </div>
                         </div>

                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray uppercase tracking-widest ml-1 font-heading">Email (Login ID)</label>
                            <div className="relative">
                               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                               <input required type="email" className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white text-sm outline-none" placeholder="staff@youthcamping.in" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                            </div>
                         </div>

                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray uppercase tracking-widest ml-1 font-heading">Phone (Field Contact)</label>
                            <div className="relative">
                               <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                               <input required className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white text-sm outline-none" placeholder="+91 00000 00000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                            </div>
                         </div>

                          <Button disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-2xl text-lg font-black mt-4 shadow-lg shadow-primary/20 uppercase tracking-widest font-heading">
                             {loading ? "Onboarding..." : "Authorize Access"}
                          </Button>
                      </form>
                   </div>
                )}
             </div>
          </div>
       )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-body">
           {staff.map((s: any) => (
              <div key={s.id} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition group">
                 <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-teal group-hover:scale-110 transition">
                       {getIcon(s.role)}
                    </div>
                    <span className="text-[10px] font-black text-gray uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100 font-heading">
                       {s.role}
                    </span>
                 </div>
                 
                 <h3 className="text-xl font-bold text-navy font-heading">{s.user.name}</h3>
                 <p className="text-xs text-gray font-medium mb-6 flex items-center gap-2">
                    <Mail className="w-3" /> {s.user.email}
                 </p>
 
                 <div className="space-y-4 pt-6 border-t border-gray-50">
                    <div>
                       <p className="text-[10px] font-black text-gray uppercase tracking-widest font-heading mb-1">Active Assignment</p>
                       <p className="text-sm font-bold text-teal">{s.trip.title}</p>
                    </div>
                    <div className="flex justify-between items-center">
                       <p className="text-xs font-medium text-navy flex items-center gap-2">
                          <Phone className="w-3" /> {s.user.phone}
                       </p>
                       <Button variant="ghost" size="sm" className="text-red-500 text-[10px] font-black hover:bg-red-50 tracking-widest font-heading uppercase">REVOKE</Button>
                    </div>
                 </div>
              </div>
           ))}
          {!staff.length && <div className="col-span-full py-12 text-center text-gray-400 italic">No staff members currently deployed.</div>}
       </div>
    </div>
  );
}
