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
            "Content-Type": "application/json",
             "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
          },
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
           className={`w-14 h-14 bg-[#0f2d54] text-white rounded-full flex items-center justify-center shadow-2xl transition hover:scale-105 ${open ? "rotate-90" : ""}`}
        >
           {open ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
        </button>

        {open && (
           <div className="absolute bottom-20 right-0 w-[90vw] max-w-sm h-[500px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
              <div className="bg-[#0f2d54] p-4 text-white flex items-center gap-3">
                 <div className="bg-white/20 p-2 rounded-full">
                    <Bot className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg leading-tight">YC Assistant</h3>
                    <p className="text-xs text-blue-200">Powered by Claude 3.5</p>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 hide-scrollbar" ref={scrollRef}>
                 {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                       <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? "bg-[#0f2d54] text-white rounded-br-sm" : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-sm"}`}>
                          {m.content}
                       </div>
                    </div>
                 ))}
                 {loading && (
                    <div className="flex justify-start">
                       <div className="bg-white border border-gray-100 shadow-sm text-gray-500 rounded-2xl rounded-bl-sm p-3 w-16 flex justify-center gap-1">
                          <span className="w-2 h-2 bg-[#f97316] rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-[#f97316] rounded-full animate-bounce delay-100"></span>
                          <span className="w-2 h-2 bg-[#f97316] rounded-full animate-bounce delay-200"></span>
                       </div>
                    </div>
                 )}
                 {messages.length === 1 && (
                    <div className="mt-4 space-y-2">
                       <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold ml-1">Suggestions</p>
                       <div className="flex flex-wrap gap-2">
                          {suggestions.map(s => (
                             <button key={s} onClick={() => handleSend(s)} className="text-xs bg-white border border-blue-100 text-[#0f2d54] px-3 py-1.5 rounded-full hover:bg-blue-50 transition">
                                {s}
                             </button>
                          ))}
                       </div>
                    </div>
                 )}
              </div>

              <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                 <input 
                    type="text" 
                    value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend(input)}
                    placeholder="Ask about your trip..."
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d54]/30"
                 />
                 <button 
                    onClick={() => handleSend(input)}
                    disabled={!input.trim() || loading}
                    className="w-10 h-10 bg-[#f97316] text-white rounded-full flex items-center justify-center disabled:opacity-50"
                 >
                    <Send className="w-4 h-4 ml-1" />
                 </button>
              </div>
           </div>
        )}
     </div>
  );
}
