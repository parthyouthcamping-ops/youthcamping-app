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
        headers: { "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}` }
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
         headers: {
           "Content-Type": "application/json",
           "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
         },
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

  if (fetching) return <div className="p-10 text-center font-bold">Loading Trip Details...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
       <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-[#0f2d54]">Edit Trip</h1>
            <p className="text-[#64748b]">Update itinerary details for {form.title}.</p>
          </div>
          <select 
            value={form.status} 
            onChange={e => setForm({...form, status: e.target.value})}
            className="border rounded-xl p-2 bg-white font-bold text-sm uppercase text-[#f97316]"
          >
             <option value="planning">Planning</option>
             <option value="upcoming">Upcoming</option>
             <option value="ongoing">Ongoing</option>
             <option value="completed">Completed</option>
          </select>
       </div>

       <form onSubmit={submit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-8">
          
          <div className="space-y-4">
             <h2 className="text-lg font-bold text-[#f97316] border-b pb-2 uppercase tracking-widest text-xs">Core Information</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-semibold">
                <input required placeholder="Trip Title" className="border rounded-xl p-3 bg-gray-50 focus:bg-white" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                <input required placeholder="Destination" className="border rounded-xl p-3 bg-gray-50 focus:bg-white" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} />
                <input required type="date" title="Departure Date" className="border rounded-xl p-3 bg-gray-50" value={form.departureDate} onChange={e => setForm({...form, departureDate: e.target.value})} />
                <input required type="date" title="Return Date" className="border rounded-xl p-3 bg-gray-50" value={form.returnDate} onChange={e => setForm({...form, returnDate: e.target.value})} />
                <input placeholder="Departure City" className="border rounded-xl p-3 bg-gray-50" value={form.departureCity} onChange={e => setForm({...form, departureCity: e.target.value})} />
                <input placeholder="Departure Point" className="border rounded-xl p-3 bg-gray-50" value={form.departurePoint} onChange={e => setForm({...form, departurePoint: e.target.value})} />
                <input placeholder="Departure Time" className="border rounded-xl p-3 bg-gray-50" value={form.departureTime} onChange={e => setForm({...form, departureTime: e.target.value})} />
                <input placeholder="Group Size" type="number" className="border rounded-xl p-3 bg-gray-50" value={form.groupSize} onChange={e => setForm({...form, groupSize: Number(e.target.value)})} />
                <input placeholder="Max Altitude (m)" type="number" className="border rounded-xl p-3 bg-gray-50" value={form.maxAltitude} onChange={e => setForm({...form, maxAltitude: Number(e.target.value)})} />
                <input placeholder="Difficulty (e.g. Moderate)" className="border rounded-xl p-3 bg-gray-50" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} />
                <input placeholder="Vehicle Type" className="border rounded-xl p-3 bg-gray-50" value={form.vehicleType} onChange={e => setForm({...form, vehicleType: e.target.value})} />
                <input placeholder="Vehicle Number" className="border rounded-xl p-3 bg-gray-50" value={form.vehicleNumber} onChange={e => setForm({...form, vehicleNumber: e.target.value})} />
                <input placeholder="Price" type="number" className="border rounded-xl p-3 bg-gray-50" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
             </div>
          </div>

          <div className="space-y-4">
             <h2 className="text-lg font-bold text-[#f97316] border-b pb-2 uppercase tracking-widest text-xs flex justify-between">
                Itinerary
                <button type="button" onClick={() => setItinerary([...itinerary, { dayNumber: itinerary.length+1, date: "", title: "", activities: "" }])} className="text-blue-500 hover:text-blue-700 text-sm font-bold lowercase">+ Add Day</button>
             </h2>
             {itinerary.map((day, ix) => (
                <div key={ix} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-xl text-sm font-medium border border-gray-100 relative group">
                   <button 
                     type="button" 
                     onClick={() => setItinerary(itinerary.filter((_, i) => i !== ix))}
                     className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs"
                   >
                     ×
                   </button>
                   <input required type="number" placeholder="Day #" className="border rounded-lg p-2" value={day.dayNumber} onChange={e => { const updated = [...itinerary]; updated[ix].dayNumber = Number(e.target.value); setItinerary(updated); }} />
                   <input required type="date" className="border rounded-lg p-2" value={day.date} onChange={e => { const updated = [...itinerary]; updated[ix].date = e.target.value; setItinerary(updated); }} />
                   <input required placeholder="Brief Title" className="border rounded-lg p-2 md:col-span-1" value={day.title} onChange={e => { const updated = [...itinerary]; updated[ix].title = e.target.value; setItinerary(updated); }} />
                   <input required placeholder="Activities (comma separated)" className="border rounded-lg p-2 md:col-span-3" value={day.activities} onChange={e => { const updated = [...itinerary]; updated[ix].activities = e.target.value; setItinerary(updated); }} />
                </div>
             ))}
          </div>

          <div className="space-y-4">
             <h2 className="text-lg font-bold text-[#f97316] border-b pb-2 uppercase tracking-widest text-xs flex justify-between">
                Packing List
                <button type="button" onClick={() => setPacking([...packing, { category: "Clothing", itemName: "", mandatory: true }])} className="text-blue-500 hover:text-blue-700 text-sm font-bold lowercase">+ Add Item</button>
             </h2>
             {packing.map((item, ix) => (
                <div key={ix} className="flex gap-3 bg-gray-50 p-4 rounded-xl text-sm font-medium border border-gray-100 relative group">
                    <button 
                     type="button" 
                     onClick={() => setPacking(packing.filter((_, i) => i !== ix))}
                     className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs"
                   >
                     ×
                   </button>
                   <select className="border rounded-lg p-2 w-1/3" value={item.category} onChange={e => { const updated = [...packing]; updated[ix].category = e.target.value; setPacking(updated); }}>
                      <option>Clothing</option><option>Gear</option><option>Health</option><option>Documents</option><option>Electronics</option>
                   </select>
                   <input required placeholder="Item Name" className="border rounded-lg p-2 flex-1" value={item.itemName} onChange={e => { const updated = [...packing]; updated[ix].itemName = e.target.value; setPacking(updated); }} />
                </div>
             ))}
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-[#0f2d54] hover:bg-[#0b213f] text-white py-6 rounded-2xl text-lg font-bold shadow-lg shadow-[#0f2d5433]">
             {loading ? "Updating..." : "Save Changes"}
          </Button>
       </form>
    </div>
  );
}
