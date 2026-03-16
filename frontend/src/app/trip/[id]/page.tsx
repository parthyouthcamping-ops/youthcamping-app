"use client";

import { useEffect, useState, use } from "react";
import { Calendar, MapPin, CreditCard, DollarSign, ArrowRight, ShieldCheck, Clock, Ticket, QrCode, CheckCircle2, MessageSquare, PhoneCall, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";

export default function TripOverview({ params }: { params: Promise<{ id: string }> }) {
  const { id: tripId } = use(params);
  const [trip, setTrip] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showCoordinator, setShowCoordinator] = useState(false);

  useEffect(() => {
    const fetchOverview = async () => {
      const headers = { "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}` };
      
      const [tripRes, notifRes, payRes] = await Promise.all([
        fetch(`/api/traveler/trip/${tripId}`, { headers }),
        fetch(`/api/traveler/trip/${tripId}/notifications`, { headers }),
        fetch(`/api/traveler/trip/${tripId}/payment`, { headers })
      ]);
      
      if(tripRes.ok) setTrip(await tripRes.json());
      if(notifRes.ok) setNotifications(await notifRes.json());
      if(payRes.ok) setPayment(await payRes.json());
    };
    fetchOverview();
  }, [tripId]);

  if (!trip) return <div className="text-center py-20 text-[#64748b]">Loading trip details...</div>;

  const paymentPercentage = payment ? Math.min(100, Math.round((payment.amount_paid / payment.total_amount) * 100)) : 0;

  return (
    <div className="space-y-6 pb-20 font-montserrat">
      {/* Hero Card */npm 
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-[#2d6a4f]/10 rounded-bl-full -z-10"></div>
         
         <div className="flex justify-between items-start">
            <div>
               <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                  {trip.status}
               </div>
               <h1 className="text-3xl font-black text-[#0f2d54]">{trip.title}</h1>
               <p className="text-[#64748b] flex items-center gap-1 mt-1 text-sm font-medium">
                  <MapPin className="w-4 h-4" /> {trip.destination}
               </p>
            </div>
            {payment && (
               <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl text-center shadow-sm">
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Trip ID</p>
                  <p className="text-sm font-black text-[#0f2d54] font-mono">{payment.participant_code}</p>
               </div>
            )}
         </div>

         <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-inner">
               <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Expedition Start
               </p>
               <p className="font-bold text-[#0f172a]">{format(new Date(trip.departureDate), "dd MMM yyyy")}</p>
               <p className="text-[10px] text-gray-500 mt-1 font-semibold">{trip.departureTime} • {trip.departureCity}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-inner">
               <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Return
               </p>
               <p className="font-bold text-[#0f172a]">{format(new Date(trip.returnDate), "dd MMM yyyy")}</p>
            </div>
         </div>
      </div>

      {/* Participant Verification Card */}
      {payment && (
         <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-dashed border-gray-200 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-[#0f2d54]">
               <QrCode className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-lg font-black text-[#0f2d54] uppercase tracking-wider flex items-center justify-center gap-2">
                  <Ticket className="w-5 h-5 text-[#f97316]" /> Participant Pass
               </h3>
               <p className="text-gray-500 text-xs font-medium mt-1">Show this at the assembly point for boarding.</p>
            </div>
            <div className="bg-[#0f2d54] text-white px-6 py-4 rounded-2xl w-full shadow-lg">
               <p className="text-[10px] text-blue-200 font-bold uppercase tracking-[0.2em] mb-1">Unique Identification Code</p>
               <p className="text-2xl font-black tracking-[0.3em] font-mono">{payment.participant_code}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2d6a4f] bg-green-50 px-4 py-2 rounded-full border border-green-100">
               <CheckCircle2 className="w-4 h-4" /> {payment.checkin_status.replace('_', ' ')}
            </div>
         </div>
      )}

      {/* Payment Summary Card */}
      {payment && (
        <div className="bg-[#0f2d54] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
           <div className="absolute top-[-20px] left-[-20px] w-40 h-40 bg-white/5 rounded-full -z-0"></div>
           <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#f97316]" /> Financial Status
           </h3>
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              <div className="space-y-1">
                 <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">Total Price</p>
                 <p className="text-xl font-black">₹{payment.total_amount?.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">Booking Paid</p>
                 <p className="text-xl font-black text-gray-300">₹{payment.booking_amount?.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">Total Paid</p>
                 <p className="text-xl font-black text-green-400">₹{payment.amount_paid?.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">Remaining</p>
                 <p className="text-xl font-black text-red-500 font-montserrat">₹{payment.remaining_amount?.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">Payment</p>
                 <p className={`text-xl font-black ${payment.payment_status === 'PAID' ? 'text-green-400' : 'text-[#f97316]'}`}>
                    {payment.payment_status}
                 </p>
              </div>
           </div>

           <div className="mt-8 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                 <span>Funding Progress</span>
                 <span>{paymentPercentage}%</span>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                 <div 
                   className="h-full bg-gradient-to-r from-[#f97316] to-green-500 transition-all duration-1000 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                   style={{ width: `${paymentPercentage}%` }}
                 ></div>
              </div>
           </div>

           {payment.payment_status !== 'PAID' && (
              <button 
                onClick={() => setShowCoordinator(true)}
                className="w-full mt-6 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition text-left"
              >
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#f97316] rounded-full flex items-center justify-center shadow-lg">
                       <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                       <p className="text-xs font-bold">Secure your spot</p>
                       <p className="text-[10px] text-blue-200 uppercase tracking-tighter">Pay remaining ₹{payment.remaining_amount?.toLocaleString()}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Pay Now</span>
                    <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
                 </div>
              </button>
           )}
        </div>
      )}

      {/* Coordinator Modal */}
      {showCoordinator && payment?.coordinator && (
         <div className="fixed inset-0 z-50 bg-[#0a2342]/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
               <div className="bg-[#0a2342] p-8 text-white relative">
                  <button onClick={() => setShowCoordinator(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition">
                     <X className="w-6 h-6" />
                  </button>
                  <div className="w-20 h-20 bg-[#f97316] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                     <ShieldCheck className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-center uppercase tracking-tight">Complete Payment</h2>
                  <p className="text-blue-100 text-center text-xs mt-2 font-medium opacity-80 leading-relaxed">
                     To complete your remaining payment, please contact your assigned trip coordinator.
                  </p>
               </div>
               
               <div className="p-8 space-y-6">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 text-center">Your Coordinator</p>
                     <p className="text-xl font-black text-[#0a2342] text-center">{payment.coordinator.name}</p>
                     <p className="text-sm font-bold text-[#2d6a4f] text-center mt-1">{payment.coordinator.phone}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                     <a 
                        href={`tel:${payment.coordinator.phone}`}
                        className="flex items-center justify-center gap-3 bg-[#0a2342] text-white py-4 rounded-xl font-bold hover:bg-[#0f2d54] transition shadow-lg shadow-blue-100"
                     >
                        <PhoneCall className="w-5 h-5" /> Call Coordinator
                     </a>
                     <a 
                        href={`https://wa.me/${payment.coordinator.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 border-2 border-[#2d6a4f] text-[#2d6a4f] py-4 rounded-xl font-bold hover:bg-green-50 transition"
                     >
                        <MessageSquare className="w-5 h-5" /> WhatsApp Coordinator
                     </a>
                  </div>
                  
                  <p className="text-[9px] text-gray-400 text-center italic font-medium px-4">
                     Please share your Participant Code <span className="text-[#f97316] font-bold">{payment.participant_code}</span> for faster verification.
                  </p>
               </div>
            </div>
         </div>
      )}

      {/* Announcements */}
      {notifications.length > 0 && (
        <div className="space-y-3">
           <h3 className="font-bold text-[#0f2d54] uppercase tracking-wider text-sm px-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#f97316]" /> Recent Announcements
           </h3>
           <div className="space-y-3">
              {notifications.map(n => (
                 <div key={n.id} className="bg-white border-2 border-orange-50 rounded-2xl p-5 shadow-sm hover:border-orange-100 transition relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1 h-full bg-[#f97316]"></div>
                    <h4 className="font-bold text-[#f97316] text-sm mb-1">{n.title}</h4>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest">{format(new Date(n.createdAt), "dd MMM • HH:mm")}</p>
                 </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
