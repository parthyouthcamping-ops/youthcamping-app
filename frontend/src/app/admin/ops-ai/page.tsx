"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function OpsAiPage() {
  const [query, setQuery] = useState("");
  const [tripId, setTripId] = useState("");
  const [reply, setReply] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
     if(!query.trim() || !tripId.trim()) return;
     setLoading(true);
     setReply(null);
     
     try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/ops/query`, {
           method: "POST",
           headers: { 
             "Authorization": `Bearer ${localStorage.getItem("token")}`,
             "Content-Type": "application/json"
           },
           body: JSON.stringify({ query, tripId: parseInt(tripId) })
        });
        const data = await res.json();
        setReply(data.data || data.result || data.error);
     } catch(e) {
        setReply("Error executing query.");
     } finally {
        setLoading(false);
     }
  };

  return (
    <div className="space-y-6 max-w-4xl">
       <div>
         <h1 className="text-3xl font-black text-gray-900 tracking-tight">WhatsApp Operations Assistant</h1>
         <p className="text-gray-500 mt-1 font-medium">Internal tool for YouthCamping staff. Execute natural language queries to retrieve trip data quickly.</p>
       </div>

       <Card className="shadow-lg border-0 border-t-4 border-accent">
          <CardHeader>
            <CardTitle>Execute Query</CardTitle>
            <CardDescription>e.g. "show travelers" or "show departure time"</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <input 
                 type="number"
                 placeholder="Trip ID"
                 value={tripId}
                 onChange={e => setTripId(e.target.value)}
                 className="w-24 rounded border px-3 py-2 text-sm"
              />
              <input 
                 type="text"
                 placeholder="What do you want to know about this trip?"
                 value={query}
                 onChange={e => setQuery(e.target.value)}
                 onKeyPress={e => e.key === 'Enter' && handleQuery()}
                 className="flex-1 rounded border px-3 py-2 text-sm"
              />
              <Button onClick={handleQuery} disabled={loading} className="font-bold">
                 {loading ? "Searching..." : "Execute"}
              </Button>
            </div>

            {reply && (
               <div className="mt-8 p-4 bg-gray-50 rounded border border-gray-100">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-4">Results</h3>
                  {typeof reply === 'string' ? (
                     <p className="text-gray-800 font-medium">{reply}</p>
                  ) : (
                     <pre className="text-sm text-gray-800 overflow-x-auto p-4 bg-white rounded shadow-inner whitespace-pre-wrap">
                        {JSON.stringify(reply, null, 2)}
                     </pre>
                  )}
               </div>
            )}
          </CardContent>
       </Card>
    </div>
  )
}
