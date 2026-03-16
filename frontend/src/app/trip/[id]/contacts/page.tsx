"use client";

import { useEffect, useState, use } from "react";
import { Phone, MessageCircle, UserCircle, Car, Stethoscope, ShieldCheck } from "lucide-react";

export default function TripContacts({ params }: { params: Promise<{ id: string }> }) {
  const { id: tripId } = use(params);
  const [contacts, setContacts] = useState<any[]>([]);
  const [trip, setTrip] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const headers = { "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}` };
      const [conRes, tripRes] = await Promise.all([
         fetch(`/api/traveler/trip/${tripId}/contacts`, { headers }),
         fetch(`/api/traveler/trip/${tripId}`, { headers })
      ]);
      if(conRes.ok) setContacts(await conRes.json());
      if(tripRes.ok) setTrip(await tripRes.json());
    };
    load();
  }, [tripId]);

  if(!contacts.length || !trip) return <div className="text-center py-20 text-gray-500">Loading contacts...</div>;

  const getIcon = (role: string) => {
     switch(role) {
        case "DRIVER": return <Car className="w-6 h-6 text-blue-500" />;
        case "MEDIC": return <Stethoscope className="w-6 h-6 text-red-500" />;
        case "GUIDE": return <ShieldCheck className="w-6 h-6 text-green-500" />;
        default: return <UserCircle className="w-6 h-6 text-gray-500" />;
     }
  };

  return (
    <div className="space-y-4">
       <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
             <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Vehicle Details</p>
             <p className="font-black text-[#0f2d54] text-xl tracking-widest">{trip.vehicleNumber}</p>
             <p className="text-sm text-gray-600 font-medium">{trip.vehicleType}</p>
          </div>
          <div className="w-14 h-14 bg-gray-50 rounded-full flex justify-center items-center border-2 border-dashed border-gray-200">
             <Car className="w-6 h-6 text-gray-400" />
          </div>
       </div>

       {contacts.map(c => (
          <div key={c.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                   {getIcon(c.role)}
                </div>
                <div>
                   <h3 className="font-bold text-[#0f172a] text-lg leading-tight">{c.user.name}</h3>
                   <p className="text-xs text-[#64748b] font-bold tracking-widest uppercase">{c.role}</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3 mt-2">
                <a href={`tel:${c.user.phone}`} className="flex items-center justify-center gap-2 bg-[#0f2d54] hover:bg-[#0f2d54]/90 text-white py-3 rounded-xl font-bold transition text-sm">
                   <Phone className="w-4 h-4" /> Call
                </a>
                <a href={`https://wa.me/${c.user.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition text-sm">
                   <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
             </div>
          </div>
       ))}
    </div>
  );
}
