"use client";

import { useState } from "react";
import { Button } from "./ui/Button";

interface ContactProps {
  role: string;
  phone: string;
  user: { name: string };
}

export default function SosButton({ tripId, contacts = [] }: { tripId: number, contacts?: ContactProps[] }) {
  const [open, setOpen] = useState(false);

  const handleSos = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/traveler/${tripId}/sos`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      alert("SOS Alert Sent to Admins and Guides!");
    } catch(e) {
      alert("Error sending SOS.");
    }
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-red-600 text-white shadow-xl flex items-center justify-center text-xl font-bold animate-pulse z-50 hover:bg-red-700 transition"
      >
        SOS
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full relative">
             <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl leading-none">&times;</button>
             <h2 className="text-2xl font-bold text-red-600 mb-2">Emergency SOS</h2>
             <p className="text-sm text-gray-600 border-b pb-4 mb-4">Are you in an emergency? This will immediately alert your guide and our operations team.</p>
             
             <div className="flex flex-col gap-3">
               <Button variant="destructive" size="lg" onClick={handleSos} className="font-bold py-6">
                 TRIGGER EMERGENCY ALERT
               </Button>
               
               <div className="mt-4">
                 <h3 className="font-semibold text-sm mb-2 uppercase text-gray-500 tracking-wider">Direct Contacts</h3>
                 {contacts?.length > 0 ? contacts.map((c, i) => (
                    <a key={i} href={`tel:${c.phone}`} className="flex justify-between items-center py-3 border-b last:border-0 hover:bg-gray-50 px-2 rounded transition group">
                      <span className="font-medium text-gray-800">{c.role}: {c.user?.name}</span>
                      <span className="text-primary font-bold group-hover:text-accent flex items-center gap-1">
                        📞 {c.phone}
                      </span>
                    </a>
                 )) : (
                    <p className="text-sm text-gray-500 py-2">No direct contacts assigned yet.</p>
                 )}
               </div>
               
               <Button variant="outline" className="mt-2 text-gray-500" onClick={() => setOpen(false)}>Cancel</Button>
             </div>
          </div>
        </div>
      )}
    </>
  )
}
