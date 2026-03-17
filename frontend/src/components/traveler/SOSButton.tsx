"use client";

import { useState } from "react";
import { ShieldAlert, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SOSButton({ tripId }: { tripId: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  const handleSos = async () => {
     setStatus("loading");
     try {
       const res = await fetch(`/api/traveler/trip/${tripId}/sos`, {
         method: "POST",
         credentials: "include"
       });
       if(res.ok) {
         setStatus("sent");
       } else {
         setStatus("idle");
         alert("Failed to send SOS. Please call emergency contacts directly.");
       }
     } catch(e) {
       setStatus("idle");
       alert("Network error.");
     }
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="bg-red-600 text-white rounded-full p-4 shadow-2xl flex items-center justify-center animate-pulse hover:bg-red-700 transition relative group"
      >
        <ShieldAlert className="w-8 h-8" />
        <span className="absolute left-16 bg-red-600 text-white px-3 py-1 rounded text-sm font-bold opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
           EMERGENCY SOS
        </span>
      </button>

      {open && (
         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
               <div className="bg-red-600 p-6 text-center text-white">
                  <ShieldAlert className="w-16 h-16 mx-auto mb-3" />
                  <h2 className="text-2xl font-black uppercase tracking-wider">Emergency Alert</h2>
                  <p className="text-red-100 mt-2 text-sm leading-relaxed">
                     Are you in immediate danger? This will instantly alert your Lead Guide, Driver, and our office.
                  </p>
               </div>
               
               <div className="p-6 space-y-4">
                  {status === "sent" ? (
                     <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-center">
                        <strong className="block text-lg mb-1">Alert Sent!</strong>
                        Help is on the way. Stay calm and stay where you are.
                     </div>
                  ) : (
                    <Button 
                       onClick={handleSos}
                       disabled={status === "loading"}
                       className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-xl rounded-xl"
                    >
                       {status === "loading" ? "Broadcasting..." : "SEND SOS ALERT NOW"}
                    </Button>
                  )}

                  <div className="flex items-center gap-4 text-center pb-2">
                     <div className="h-px bg-gray-200 flex-1"></div>
                     <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">or dial</span>
                     <div className="h-px bg-gray-200 flex-1"></div>
                  </div>

                  <a href="tel:112" className="flex items-center justify-center gap-2 w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition">
                     <PhoneCall className="w-5 h-5 text-[#f97316]" />
                     Local Emergency Response (112)
                  </a>
                  
                  <button onClick={() => setOpen(false)} className="w-full text-center py-2 text-sm text-gray-500 hover:text-gray-800 font-medium mt-2">
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      )}
    </>
  );
}
