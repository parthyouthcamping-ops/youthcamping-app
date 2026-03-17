"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function EditTrip({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: "", destination: "", departureDate: "", returnDate: "",
    departureCity: "", departurePoint: "", departureTime: "",
    vehicleNumber: "", vehicleType: "", groupSize: 0,
    maxAltitude: 0, difficulty: "Moderate", price: 0, status: "planning"
  });

  const [itinerary, setItinerary] = useState([{ dayNumber: 1, date: "", title: "", activities: "" }]);
  const [packing, setPacking] = useState([{ category: "Clothing", itemName: "", mandatory: true }]);

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      const res = await fetch(`/api/admin/trips/${id}`, {
        credentials: "include"
      });
      if(res.ok) {
        const data = await res.json();
        setForm({
          title: data.title,
          destination: data.destination,
          departureDate: data.departureDate.split("T")[0],
          returnDate: data.returnDate.split("T")[0],
          departureCity: data.departureCity || "",
          departurePoint: data.departurePoint || "",
          departureTime: data.departureTime || "",
          vehicleNumber: data.vehicleNumber || "",
          vehicleType: data.vehicleType || "",
          groupSize: data.groupSize || 0,
          maxAltitude: data.maxAltitude || 0,
          difficulty: data.difficulty || "Moderate",
          price: data.price || 0,
          status: data.status || "planning"
        });
        
        if (data.itinerary && data.itinerary.length > 0) {
            setItinerary(data.itinerary.map((i: any) => ({
                ...i,
                activities: Array.isArray(JSON.parse(i.activities)) ? JSON.parse(i.activities).join(", ") : i.activities
            })));
        }

        if (data.packingItems && data.packingItems.length > 0) {
            setPacking(data.packingItems);
        }
      } else {
        alert("Failed to load trip details.");
        router.push("/admin/trips");
      }
    } catch(e) {
      alert("Error loading trip.");
    } finally {
      setFetching(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);

     const formattedItinerary = itinerary.map((i: any) => ({
         dayNumber: i.dayNumber,
         date: i.date,
         title: i.title,
         activities: JSON.stringify(i.activities.split(",").map((a: string) => a.trim()))
     }));

     const formattedPacking = packing.map((p: any) => ({
         category: p.category,
         itemName: p.itemName,
         mandatory: p.mandatory
     }));

     try {
       const res = await fetch(`/api/admin/trips/${id}`, {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         credentials: "include",
         body: JSON.stringify({
            ...form,
            groupSize: Number(form.groupSize),
            maxAltitude: Number(form.maxAltitude),
            price: Number(form.price),
            itinerary: formattedItinerary,
            packingItems: formattedPacking
         })
       });

       if(res.ok) router.push("/admin/trips");
       else alert("Failed to update trip.");
     } catch(e) {
       alert("Error updating trip.");
     } finally {
       setLoading(false);
     }
  };

  if (fetching) return <div className="p-20 text-center font-black text-navy uppercase tracking-widest animate-pulse font-heading">Syncing Trip Data...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 font-body">
        <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
           <div>
             <h1 className="text-4xl font-heading font-black text-navy uppercase tracking-tight">Modify Expedition</h1>
             <p className="text-gray mt-1 font-medium">Updating itinerary & protocols for <span className="text-primary font-bold">{form.title}</span></p>
           </div>
           <select 
             value={form.status} 
             onChange={e => setForm({...form, status: e.target.value})}
             className="border-2 border-primary/20 rounded-2xl px-6 py-3 bg-white font-black text-xs uppercase text-primary tracking-widest outline-none transition-all focus:ring-4 focus:ring-primary/5 shadow-lg shadow-primary/5"
           >
              <option value="planning">Planning</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
           </select>
        </div>

        <form onSubmit={submit} className="bg-white rounded-[3rem] p-10 sm:p-14 shadow-sm border border-gray-100 space-y-12">
           
           <div className="space-y-6">
              <h2 className="text-xs font-black text-primary border-b border-primary/10 pb-4 uppercase tracking-[0.2em] font-heading">Core Fleet & Route Metadata</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1 font-heading">Expedition Title</label>
                    <input required className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-primary/20 transition-all font-bold text-navy outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1 font-heading">Primary Destination</label>
                    <input required className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-primary/20 transition-all font-bold text-navy outline-none" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} />
                 </div>
                 <input required type="date" title="Departure Date" className="border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 font-bold" value={form.departureDate} onChange={e => setForm({...form, departureDate: e.target.value})} />
                 <input required type="date" title="Return Date" className="border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 font-bold" value={form.returnDate} onChange={e => setForm({...form, returnDate: e.target.value})} />
                 <input placeholder="Departure City" className="border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 font-bold" value={form.departureCity} onChange={e => setForm({...form, departureCity: e.target.value})} />
                 <input placeholder="Departure Point" className="border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 font-bold" value={form.departurePoint} onChange={e => setForm({...form, departurePoint: e.target.value})} />
                 <input placeholder="Departure Time" className="border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 font-bold" value={form.departureTime} onChange={e => setForm({...form, departureTime: e.target.value})} />
                 <input placeholder="Expedition Capacity" type="number" className="border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 font-bold" value={form.groupSize} onChange={e => setForm({...form, groupSize: Number(e.target.value)})} />
                 <input placeholder="Max Altitude (m)" type="number" className="border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 font-bold" value={form.maxAltitude} onChange={e => setForm({...form, maxAltitude: Number(e.target.value)})} />
                 <input placeholder="Difficulty Level" className="border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 font-bold" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} />
                 <input placeholder="Vehicle Model/Type" className="border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 font-bold" value={form.vehicleType} onChange={e => setForm({...form, vehicleType: e.target.value})} />
                 <input placeholder="Registration Number" className="border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 font-bold" value={form.vehicleNumber} onChange={e => setForm({...form, vehicleNumber: e.target.value})} />
                 <input placeholder="Base Pricing (Quote)" type="number" className="border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 font-bold" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
              </div>
           </div>

           <div className="space-y-6">
              <h2 className="text-xs font-black text-primary border-b border-primary/10 pb-4 uppercase tracking-[0.2em] font-heading flex justify-between items-center">
                 Expedition Itinerary
                 <button type="button" onClick={() => setItinerary([...itinerary, { dayNumber: itinerary.length+1, date: "", title: "", activities: "" }])} className="text-navy bg-navy/5 px-4 py-2 rounded-xl hover:bg-navy hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">+ Add Day</button>
              </h2>
              <div className="space-y-4">
                 {itinerary.map((day, ix) => (
                    <div key={ix} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 p-6 rounded-3xl text-sm font-bold border border-gray-50 relative group transition-all hover:bg-white hover:border-primary/10 hover:shadow-xl hover:shadow-primary/5">
                       <button 
                         type="button" 
                         onClick={() => setItinerary(itinerary.filter((_, i) => i !== ix))}
                         className="absolute -top-3 -right-3 bg-red-600 text-white w-8 h-8 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-xl font-black"
                       >
                         ×
                       </button>
                       <input required type="number" placeholder="Day #" className="border-2 border-white rounded-xl p-3 bg-white" value={day.dayNumber} onChange={e => { const updated = [...itinerary]; updated[ix].dayNumber = Number(e.target.value); setItinerary(updated); }} />
                       <input required type="date" className="border-2 border-white rounded-xl p-3 bg-white" value={day.date} onChange={e => { const updated = [...itinerary]; updated[ix].date = e.target.value; setItinerary(updated); }} />
                       <input required placeholder="Day Highlight" className="border-2 border-white rounded-xl p-3 bg-white md:col-span-1" value={day.title} onChange={e => { const updated = [...itinerary]; updated[ix].title = e.target.value; setItinerary(updated); }} />
                       <input required placeholder="Activities (comma separated)" className="border-2 border-white rounded-xl p-3 bg-white md:col-span-3 font-medium" value={day.activities} onChange={e => { const updated = [...itinerary]; updated[ix].activities = e.target.value; setItinerary(updated); }} />
                    </div>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <h2 className="text-xs font-black text-primary border-b border-primary/10 pb-4 uppercase tracking-[0.2em] font-heading flex justify-between items-center">
                 Essential Packing Checklist
                 <button type="button" onClick={() => setPacking([...packing, { category: "Clothing", itemName: "", mandatory: true }])} className="text-navy bg-navy/5 px-4 py-2 rounded-xl hover:bg-navy hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">+ Add Item</button>
              </h2>
              <div className="space-y-3">
                 {packing.map((item, ix) => (
                    <div key={ix} className="flex gap-4 bg-gray-50/50 p-4 rounded-2xl text-sm font-bold border border-gray-50 relative group hover:bg-white hover:border-primary/10 transition-all">
                        <button 
                         type="button" 
                         onClick={() => setPacking(packing.filter((_, i) => i !== ix))}
                         className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-lg font-black"
                       >
                         ×
                       </button>
                       <select className="border-2 border-white rounded-xl px-4 py-3 bg-white w-1/3 outline-none focus:border-primary/20 transition-all" value={item.category} onChange={e => { const updated = [...packing]; updated[ix].category = e.target.value; setPacking(updated); }}>
                          <option>Clothing</option><option>Gear</option><option>Health</option><option>Documents</option><option>Electronics</option>
                       </select>
                       <input required placeholder="Item Detail Name" className="border-2 border-white rounded-xl px-4 py-3 bg-white flex-1 outline-none focus:border-primary/20 transition-all" value={item.itemName} onChange={e => { const updated = [...packing]; updated[ix].itemName = e.target.value; setPacking(updated); }} />
                    </div>
                 ))}
              </div>
           </div>

           <Button type="submit" disabled={loading} className="w-full bg-navy hover:bg-navy/90 text-white py-6 rounded-3xl text-xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-navy/20 transition-all active:scale-[0.98] font-heading">
              {loading ? "Synching Update..." : "Confirm & Save Changes"}
           </Button>
        </form>
     </div>
   );
 }
