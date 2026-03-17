"use client";

import { useEffect, useState, use } from "react";
import { Phone, MessageCircle, UserCircle, Car, Stethoscope, ShieldCheck } from "lucide-react";

export default function TripContacts({ params }: { params: Promise<{ id: string }> }) {
  const { id: tripId } = use(params);
  const [contacts, setContacts] = useState<any[]>([]);
  const [trip, setTrip] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [conRes, tripRes] = await Promise.all([
           fetch(`/api/traveler/trip/${tripId}/contacts`, { credentials: "include" }),
           fetch(`/api/traveler/trip/${tripId}`, { credentials: "include" })
        ]);
        if(conRes.ok) setContacts(await conRes.json());
        if(tripRes.ok) setTrip(await tripRes.json());
      } catch (error) {
        console.error("Contacts load failed:", error);
      }
    };
    load();
  }, [tripId]);

  if(!contacts.length || !trip) return <div className="text-center py-20 text-gray font-body italic">Syncing field team...</div>;

  const getIcon = (role: string) => {
     switch(role) {
        case "DRIVER": return <Car className="w-6 h-6 text-navy" />;
        case "MEDIC": return <Stethoscope className="w-6 h-6 text-red-500" />;
        case "GUIDE": return <ShieldCheck className="w-6 h-6 text-teal" />;
        default: return <UserCircle className="w-6 h-6 text-gray" />;
     }
  };

  return (
    <div className="space-y-4 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pt-6 pb-20 font-body">
       <div className="bg-navy rounded-3xl p-8 shadow-xl shadow-navy/20 flex items-center justify-between font-body">
          <div>
             <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-2 font-heading">Vehicle Details</p>
             <p className="font-black text-white text-2xl tracking-[0.15em] font-heading">{trip.vehicleNumber}</p>
             <p className="text-xs text-primary font-black uppercase tracking-widest mt-1">{trip.vehicleType}</p>
          </div>
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex justify-center items-center border border-white/10 shadow-inner">
             <Car className="w-8 h-8 text-white/80" />
          </div>
       </div>

        {contacts.map(c => (
           <div key={c.id} className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center gap-5 mb-6">
                 <div className="bg-navy/5 p-4 rounded-2xl border border-navy/5 group-hover:scale-110 transition-transform">
                    {getIcon(c.role)}
                 </div>
                 <div>
                    <h3 className="font-black text-navy text-xl leading-tight font-heading uppercase tracking-tight">{c.user.name}</h3>
                    <p className="text-[10px] text-teal font-black tracking-[0.2em] uppercase font-heading">{c.role}</p>
                 </div>
              </div>
 
              <div className="grid grid-cols-2 gap-4">
                 <a href={`tel:${c.user.phone}`} className="flex items-center justify-center gap-3 bg-navy hover:bg-navy/90 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-navy/10 text-[10px] font-heading">
                    <Phone className="w-4 h-4 text-primary" /> Call Team
                 </a>
                 <a href={`https://wa.me/${c.user.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 bg-teal hover:bg-teal/90 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-teal/10 text-[10px] font-heading">
                    <MessageCircle className="w-4 h-4 text-white" /> Message
                 </a>
              </div>
           </div>
        ))}
    </div>
  );
}
