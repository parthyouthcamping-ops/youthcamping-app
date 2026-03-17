"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Map, MapPin, Calendar, Compass, ArrowRight, BellRing } from "lucide-react";
import SOSButton from "@/components/traveler/SOSButton";
import AIAssistant from "@/components/traveler/AIAssistant";
import { apiFetch } from "@/lib/api";

export default function Dashboard() {
  const [trips, setTrips] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const userRes = await apiFetch("/api/auth/me");
        if(userRes.ok) {
          setUser(await userRes.json());
        } else {
          window.location.href = "/login";
          return;
        }

        const tripsRes = await apiFetch("/api/traveler/trips");
        if(tripsRes.ok) setTrips(await tripsRes.json());
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };
    load();
  }, []);

  if(!user) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-gray font-body italic">Syncing your profile...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-montserrat pb-24">
       {/* Greeting Header */}
       <div className="bg-navy text-white pt-16 pb-24 px-6 rounded-b-[4rem] relative overflow-hidden">
          <Compass className="absolute right-[-60px] top-[-30px] w-80 h-80 text-white opacity-5 rotate-12" />
          <div className="max-w-4xl mx-auto relative z-10">
             <h1 className="text-5xl font-black mb-3 font-heading uppercase tracking-tight">Hello, {user.name.split(" ")[0]}!</h1>
             <p className="text-secondary opacity-80 text-xl font-body">Your next adventure awaits.</p>
          </div>
       </div>

       <div className="max-w-4xl mx-auto px-4 -mt-12 space-y-8">
          <div className="flex justify-between items-end mb-4 px-4">
             <h2 className="text-xs font-black tracking-[0.2em] uppercase text-navy font-heading">My Expeditions</h2>
             <span className="text-[10px] font-black text-white bg-primary px-3 py-1 rounded-full uppercase tracking-widest font-heading shadow-lg shadow-primary/20">{trips.length} Active</span>
          </div>

          {trips.length === 0 ? (
             <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 font-body">
                <Map className="w-16 h-16 text-gray/20 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-navy font-heading">No active trips yet.</h3>
                <p className="text-gray mt-3 max-w-sm mx-auto">Book your next journey with our office and it will appear here instantly.</p>
             </div>
          ) : trips.map(t => (
             <Link key={t.id} href={`/trip/${t.id}`} className="block group font-body">
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 relative">
                   <div className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg z-10 font-heading">
                      View Portal
                   </div>
                   
                   <div className="p-8">
                      <div className="flex items-center gap-3 text-teal text-[10px] font-black uppercase tracking-widest mb-4 font-heading">
                         <span className="w-2 h-2 bg-teal rounded-full animate-pulse shadow-[0_0_8px_rgba(13,115,119,0.5)]"></span>
                         {t.status}
                      </div>

                      <h3 className="text-3xl font-black text-navy mb-3 font-heading tracking-tight uppercase group-hover:text-primary transition-colors">{t.title}</h3>
                      <p className="flex items-center gap-2 text-gray font-bold mb-8">
                         <MapPin className="w-4 h-4 text-primary" /> {t.destination}
                      </p>

                      <div className="grid grid-cols-2 gap-6">
                         <div className="bg-gray-50 p-5 rounded-2xl flex items-center gap-4 border border-gray-100">
                            <div className="bg-navy/5 p-3 rounded-xl text-navy transition-transform group-hover:scale-110"><Calendar className="w-6 h-6" /></div>
                            <div>
                               <p className="text-[10px] text-gray font-black tracking-widest uppercase mb-1 font-heading">Departure</p>
                               <p className="font-bold text-navy">{format(new Date(t.departureDate), "MMM dd")}</p>
                            </div>
                         </div>
                         <div className="bg-gray-50 p-5 rounded-2xl flex items-center gap-4 border border-gray-100">
                            <div className="bg-primary/5 p-3 rounded-xl text-primary transition-transform group-hover:scale-110"><Compass className="w-6 h-6" /></div>
                            <div>
                               <p className="text-[10px] text-gray font-black tracking-widest uppercase mb-1 font-heading">Seat</p>
                               <p className="font-bold text-navy">{t.seatNumber || "TBD"}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="bg-gray-50/50 px-8 py-5 flex justify-between items-center group-hover:bg-primary/5 transition-colors border-t border-gray-50">
                      <span className="text-[10px] font-black text-gray/40 uppercase tracking-[0.2em] font-heading group-hover:text-navy transition-colors">Digital Trip Coordinator • Active Expedition</span>
                      <ArrowRight className="w-5 h-5 text-gray/40 group-hover:text-primary group-hover:translate-x-2 transition-all" />
                   </div>
                </div>
             </Link>
          ))}
          
          <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-8 flex gap-6 mt-12 font-body shadow-sm">
             <div className="bg-primary/10 p-4 rounded-2xl h-fit">
                <BellRing className="w-6 h-6 text-primary shrink-0" />
             </div>
             <div>
                <h4 className="font-black text-navy uppercase tracking-widest text-[10px] mb-2 font-heading">System Notice</h4>
                <p className="text-sm text-gray font-medium leading-[1.6]">
                   Make sure to complete your packing checklist at least 2 days before departure. For emergency issues, use the SOS button below.
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
