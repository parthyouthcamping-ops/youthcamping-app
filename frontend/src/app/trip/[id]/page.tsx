"use client";

import { useEffect, useState, use } from "react";
import { Calendar, MapPin, CreditCard, DollarSign, ArrowRight, ShieldCheck, Clock, Ticket, QrCode, CheckCircle2, MessageSquare, PhoneCall, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";

export default function TripOverview({ params }: { params: Promise<{ id: string }> }) {
  const { id: tripId } = use(params);
  const [trip, setTrip] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showCoordinator, setShowCoordinator] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [tripRes, notifRes, statusRes] = await Promise.all([
          fetch(`/api/traveler/trip/${tripId}`, { credentials: "include" }),
          fetch(`/api/traveler/trip/${tripId}/notifications`, { credentials: "include" }),
          fetch(`/api/traveler/trip/${tripId}/status`, { credentials: "include" })
        ]);
        
        if(tripRes.ok) setTrip(await tripRes.json());
        if(notifRes.ok) setNotifications(await notifRes.json());
        if(statusRes.ok) setStatus(await statusRes.json());
      } catch (error) {
        console.error("Failed to fetch trip overview:", error);
      }
    };
    fetchOverview();
  }, [tripId]);

  if (!trip) return <div className="text-center py-24 text-gray font-body italic">Syncing expedition data...</div>;

  const handleWhatsAppBooking = () => {
    setIsBooking(true);
    const phoneNumber = status?.coordinator?.phone?.replace(/[^0-9]/g, '') || "919876543210"; // Fallback or dynamic
    const message = `Hi, I want to book this trip:

Trip: ${trip.title}
Date: ${format(new Date(trip.departureDate), "dd MMM yyyy")}
Name: ${status?.user?.name || 'Guest'}
ID: ${status?.participant_code || 'New'}

Please assist with my booking.`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setTimeout(() => setIsBooking(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20 font-body px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pt-6">
      {/* Hero Card */}
      <div className="bg-navy rounded-3xl p-8 shadow-xl shadow-navy/20 flex flex-col gap-6 relative overflow-hidden font-body">
         <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-bl-[4rem] -z-0 opacity-50"></div>
         
         <div className="flex justify-between items-start relative z-10">
            <div>
               <div className="inline-block px-3 py-1 bg-teal/20 text-teal text-[10px] font-black rounded-full mb-4 uppercase tracking-[0.2em] border border-teal/10 font-heading">
                  {trip.status}
               </div>
               <h1 className="text-4xl font-heading font-black text-white leading-tight uppercase tracking-tight">{trip.title}</h1>
               <p className="text-gray-400 flex items-center gap-2 mt-2 text-sm font-bold uppercase tracking-widest">
                  <MapPin className="w-4 h-4 text-primary" /> {trip.destination}
               </p>
            </div>
         {status && (
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center shadow-inner backdrop-blur-md">
               <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] mb-1 font-heading">Pass ID</p>
               <p className="text-sm font-black text-primary font-mono tracking-wider">{status.participant_code}</p>
            </div>
         )}
      </div>
 
         <div className="grid grid-cols-2 gap-4 mt-4 relative z-10">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 shadow-inner">
               <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-black mb-2 flex items-center gap-2 font-heading">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Expedition Start
               </p>
               <p className="font-black text-white text-lg font-heading uppercase tracking-tight">{format(new Date(trip.departureDate), "dd MMM yyyy")}</p>
               <p className="text-[10px] text-primary/60 mt-2 font-black uppercase tracking-widest">{trip.departureTime} • {trip.departureCity}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 shadow-inner">
               <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-black mb-2 flex items-center gap-2 font-heading">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Return Date
               </p>
               <p className="font-black text-white text-lg font-heading uppercase tracking-tight">{format(new Date(trip.returnDate), "dd MMM yyyy")}</p>
            </div>
         </div>
      </div>

      {/* Participant Verification Card */}
      {status && (
         <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-6 font-body">
            <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary shadow-inner rotate-3">
               <QrCode className="w-10 h-10" />
            </div>
            <div>
               <h3 className="text-xl font-heading font-black text-navy uppercase tracking-[0.1em] flex items-center justify-center gap-3">
                  <Ticket className="w-6 h-6 text-primary" /> Digital Expedition Pass
               </h3>
               <p className="text-gray text-[10px] font-black uppercase tracking-widest mt-2">{status.user.name}</p>
            </div>
            <div className="bg-navy text-white px-8 py-6 rounded-[2rem] w-full shadow-2xl shadow-navy/20 border-b-4 border-primary overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-full bg-primary/10 animate-pulse"></div>
               <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.3em] mb-2 font-heading relative z-10">Unique Verification Code</p>
               <p className="text-3xl font-black tracking-[0.4em] font-mono text-primary animate-in slide-in-from-bottom duration-500 relative z-10">{status.participant_code}</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black text-teal bg-teal/5 px-6 py-2.5 rounded-full border border-teal/10 uppercase tracking-widest font-heading">
               <CheckCircle2 className="w-4 h-4 shadow-[0_0_10px_rgba(13,115,119,0.5)]" /> {status.checkin_status.replace('_', ' ')}
            </div>
         </div>
      )}

      {/* WhatsApp Booking Card */}
      <div className="bg-navy text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden font-body border border-white/5">
         <div className="absolute top-[-40px] left-[-60px] w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
         <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3 font-heading text-teal">
            <MessageSquare className="w-5 h-5" /> Booking Concierge
         </h3>
         
         <p className="text-sm text-gray-300 leading-relaxed mb-8 font-medium italic opacity-90">
            &quot;Ready to secure your spot for the {trip.title}? Our team is standing by on WhatsApp to confirm your seat and assist with any preparation steps.&quot;
         </p>
 
         <button 
           onClick={handleWhatsAppBooking}
           disabled={isBooking}
           className="w-full p-5 bg-teal hover:bg-teal/90 rounded-2xl flex items-center justify-between group cursor-pointer transition text-left active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-teal/20"
         >
            <div className="flex items-center gap-5">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-7 h-7 text-white" />
               </div>
               <div>
                  <p className="text-lg font-black font-heading uppercase tracking-tight">CONTINUE ON WHATSAPP</p>
                  <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mt-1">Direct Booking Assistance</p>
               </div>
            </div>
            <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" />
         </button>
      </div>

      {/* Coordinator Modal */}
      {showCoordinator && status?.coordinator && (
         <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border-2 border-primary/20">
               <div className="bg-navy p-8 text-white relative">
                  <button onClick={() => setShowCoordinator(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition">
                     <X className="w-6 h-6" />
                  </button>
                  <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                     <ShieldCheck className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-heading font-black text-center uppercase tracking-tight">Trip Coordinator</h2>
                  <p className="text-white/80 text-center text-xs mt-2 font-medium opacity-80 leading-relaxed font-body">
                     Contact your assigned trip coordinator for any assistance or booking queries.
                  </p>
               </div>
               
               <div className="p-8 space-y-6 bg-light-orange">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/10">
                     <p className="text-[10px] font-black text-gray uppercase tracking-[0.2em] mb-2 text-center">Your Coordinator</p>
                     <p className="text-xl font-heading font-black text-navy text-center">{status.coordinator.name}</p>
                     <p className="text-sm font-bold text-teal text-center mt-1">{status.coordinator.phone}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                     <a 
                        href={`tel:${status.coordinator.phone}`}
                        className="flex items-center justify-center gap-3 bg-navy text-white py-4 rounded-xl font-bold hover:bg-navy/90 transition shadow-lg shadow-navy/20"
                     >
                        <PhoneCall className="w-5 h-5" /> Call Coordinator
                     </a>
                     <a 
                        href={`https://wa.me/${status.coordinator.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-teal text-white py-4 rounded-xl font-bold hover:bg-teal/90 transition shadow-lg shadow-teal/20"
                     >
                        <MessageSquare className="w-5 h-5" /> WhatsApp Coordinator
                     </a>
                  </div>
                  
                  <p className="text-[9px] text-gray text-center italic font-medium px-4">
                     Please share your Participant Code <span className="text-primary font-bold">{status.participant_code}</span> for faster assistance.
                  </p>
               </div>
            </div>
         </div>
      )}

      {/* Announcements */}
      {notifications.length > 0 && (
        <div className="space-y-6 pt-6">
           <h3 className="font-heading font-black text-navy uppercase tracking-[0.2em] text-[10px] px-2 flex items-center gap-3">
              <Clock className="w-4 h-4 text-primary" /> Recent Alerts & Updates
           </h3>
           <div className="space-y-4">
              {notifications.map(n => (
                 <div key={n.id} className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-md transition relative overflow-hidden font-body">
                    <div className="absolute left-0 top-0 w-1.5 h-full bg-primary/20"></div>
                    <div className="flex justify-between items-start mb-3">
                       <h4 className="font-heading font-black text-navy text-sm uppercase tracking-tight">{n.title}</h4>
                       <span className="text-[9px] font-black text-gray/40 uppercase tracking-widest font-heading">{format(new Date(n.createdAt), "HH:mm • dd MMM")}</span>
                    </div>
                    <p className="text-sm text-gray font-medium leading-relaxed">{n.message}</p>
                 </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
