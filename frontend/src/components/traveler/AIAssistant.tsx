"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

export default function AIAssistant({ tripId }: { tripId: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{role: "user" | "assistant", content: string}[]>([
      { role: "assistant", content: "Hi! I'm your YC Assistant. How can I help you with your trip today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async (text: string) => {
     if(!text.trim()) return;
     const newMsgs = [...messages, {role: "user" as const, content: text}];
     setMessages(newMsgs);
     setInput("");
     setLoading(true);

     try {
       const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ messages: newMsgs, tripId })
       });
       const data = await res.json();
       setMessages(prev => [...prev, {role: "assistant", content: data.answer || "Error."}]);
     } catch(e) {
       setMessages(prev => [...prev, {role: "assistant", content: "Connection failed. Please try again."}]);
     } finally {
       setLoading(false);
     }
  };

  const suggestions = ["What should I pack?", "What time does the bus depart?", "Who is our guide?"];

  return (
     <div className="relative">
        <button 
           onClick={() => setOpen(!open)}
           className={`w-14 h-14 bg-navy text-white rounded-full flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95 border-2 border-primary/20 ${open ? "rotate-90" : ""}`}
        >
           {open ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
        </button>

        {open && (
           <div className="absolute bottom-20 right-0 w-[90vw] max-w-sm h-[500px] max-h-[70vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 font-body">
              <div className="bg-navy p-6 text-white flex items-center gap-4 relative overflow-hidden">
                 <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                 <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/10 relative z-10">
                    <Bot className="w-6 h-6 text-primary" />
                 </div>
                 <div className="relative z-10">
                    <h3 className="font-heading font-black text-lg leading-tight uppercase tracking-tight">YC Assistant</h3>
                    <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em] mt-0.5">Expedition Support AI</p>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 hide-scrollbar" ref={scrollRef}>
                 {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                       <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium ${m.role === 'user' ? "bg-navy text-white rounded-br-none shadow-lg shadow-navy/10" : "bg-white border border-gray-100 shadow-sm text-navy rounded-bl-none"}`}>
                          {m.content}
                       </div>
                    </div>
                 ))}
                 {loading && (
                    <div className="flex justify-start">
                       <div className="bg-white border border-gray-100 shadow-sm text-primary rounded-2xl rounded-bl-none p-4 w-20 flex justify-center gap-1.5">
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></span>
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></span>
                       </div>
                    </div>
                 )}
                 {messages.length === 1 && (
                    <div className="mt-6 space-y-3">
                       <p className="text-[10px] text-gray uppercase tracking-[0.2em] font-black ml-1 font-heading">Suggestions</p>
                       <div className="flex flex-wrap gap-2">
                          {suggestions.map(s => (
                             <button key={s} onClick={() => handleSend(s)} className="text-xs bg-white border border-gray-100 text-navy px-4 py-2 rounded-xl hover:bg-navy hover:text-white transition-all shadow-sm font-semibold">
                                {s}
                             </button>
                          ))}
                       </div>
                    </div>
                 )}
              </div>

              <div className="p-4 bg-white border-t border-gray-50 flex gap-2">
                 <input 
                    type="text" 
                    value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend(input)}
                    placeholder="Type your question..."
                    className="flex-1 bg-gray-50 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray/40 font-medium"
                 />
                 <button 
                    onClick={() => handleSend(input)}
                    disabled={!input.trim() || loading}
                    className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center disabled:opacity-50 shadow-lg shadow-primary/20 transition hover:scale-105 active:scale-95"
                 >
                    <Send className="w-5 h-5 ml-1" />
                 </button>
              </div>
           </div>
        )}
     </div>
  );
}
