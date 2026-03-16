"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Map, MapPin, Calendar, Compass, ArrowRight, BellRing } from "lucide-react";
import SOSButton from "@/components/traveler/SOSButton";
import AIAssistant from "@/components/traveler/AIAssistant";

export default function Dashboard() {
  const [trips, setTrips] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const headers = { "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}` };
      
      const userRes = await fetch("/api/auth/me", { headers });
      if(userRes.ok) setUser(await userRes.json());
      else window.location.href = "/login"; // Force boot

      const tripsRes = await fetch("/api/traveler/trips", { headers });
      if(tripsRes.ok) setTrips(await tripsRes.json());
    };
    load();
  }, []);

  if(!user) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-gray-500">Loading your profile...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-montserrat pb-24">
       {/* Greeting Header */}
       <div className="bg-[#0f2d54] text-white pt-12 pb-20 px-6 rounded-b-[3rem] relative overflow-hidden">
          <Compass className="absolute right-[-40px] top-[-20px] w-64 h-64 text-white opacity-5" />
          <div className="max-w-4xl mx-auto relative z-10">
             <h1 className="text-4xl font-black mb-2">Hello, {user.name.split(" ")[0]}!</h1>
             <p className="text-blue-200 text-lg">Your next adventure awaits.</p>
          </div>
       </div>

       <div className="max-w-4xl mx-auto px-4 -mt-10 space-y-6">
          <div className="flex justify-between items-end mb-4 px-2">
             <h2 className="text-xl font-black tracking-wider uppercase">My Expeditions</h2>
             <span className="text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{trips.length} Active</span>
          </div>

          {trips.length === 0 ? (
             <div className="bg-white rounded-3xl p-10 text-center shadow-md border border-gray-100">
                <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800">No active trips yet.</h3>
                <p className="text-gray-500 mt-2">Book your next journey with our office and it will appear here instantly.</p>
             </div>
          ) : trips.map(t => (
             <Link key={t.id} href={`/trip/${t.id}`} className="block group">
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
                   <div className="absolute top-4 right-4 bg-[#f97316] text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg z-10">
                      View Portal
                   </div>
                   
                   <div className="p-6">
                      <div className="flex items-center gap-2 text-[#2d6a4f] text-sm font-bold uppercase tracking-wider mb-2">
                         <span className="w-2 h-2 bg-[#2d6a4f] rounded-full animate-pulse"></span>
                         {t.status}
                      </div>

                      <h3 className="text-3xl font-black text-[#0f2d54] mb-2">{t.title}</h3>
                      <p className="flex items-center gap-1 text-gray-500 font-medium mb-6">
                         <MapPin className="w-4 h-4" /> {t.destination}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><Calendar className="w-5 h-5" /></div>
                            <div>
                               <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Departure</p>
                               <p className="font-bold text-gray-800">{format(new Date(t.departureDate), "MMM dd")}</p>
                            </div>
                         </div>
                         <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-xl text-[#f97316]"><Compass className="w-5 h-5" /></div>
                            <div>
                               <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Seat</p>
                               <p className="font-bold text-gray-800">{t.seatNumber || "TBD"}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex justify-between items-center group-hover:from-blue-50 group-hover:to-blue-100 transition-colors">
                      <span className="text-xs font-bold text-gray-500 group-hover:text-[#0f2d54]">PAYMENT: <span className={`uppercase ${t.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>{t.paymentStatus}</span></span>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#f97316] group-hover:translate-x-1 transition-all" />
                   </div>
                </div>
             </Link>
          ))}
          
          <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 flex gap-4 mt-8">
             <BellRing className="w-6 h-6 text-orange-600 shrink-0 mt-1" />
             <div>
                <h4 className="font-bold text-[#f97316] uppercase tracking-wider text-sm mb-1">System Notice</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                   Make sure to complete your packing checklist at least 2 days before departure. For emergency issues, use the SOS button.
                </p>
             </div>
          </div>
       </div>

       {/* Sticky Bottom Bar */}
       <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none p-4 pb-6 flex justify-between items-end max-w-4xl mx-auto right-0">
          <div className="pointer-events-auto">
             <SOSButton tripId={trips[0]?.id || ""} />
          </div>
          <div className="pointer-events-auto">
             <AIAssistant tripId={trips[0]?.id || ""} />
          </div>
       </div>
    </div>
  );
}
