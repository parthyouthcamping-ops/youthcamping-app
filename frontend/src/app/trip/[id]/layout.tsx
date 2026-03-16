"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SOSButton from "@/components/traveler/SOSButton";
import AIAssistant from "@/components/traveler/AIAssistant";
import { ArrowLeft, Map } from "lucide-react";
import { ReactNode, use } from "react";

export default function TripLayout({ children, params }: { children: ReactNode, params: Promise<{ id: string }> }) {
  const pathname = usePathname();
  const { id: tripId } = use(params);

  const tabs = [
    { name: "Overview", path: `/trip/${tripId}` },
    { name: "Itinerary", path: `/trip/${tripId}/itinerary` },
    { name: "Packing", path: `/trip/${tripId}/packing` },
    { name: "Contacts", path: `/trip/${tripId}/contacts` },
    { name: "Info", path: `/trip/${tripId}/info` },
  ];

  return (
    <div className="min-h-screen pb-24 bg-[#f8fafc] text-[#0f172a] font-montserrat">
      {/* Sticky Top Navbar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
           <Link href="/dashboard" className="text-[#0f2d54] hover:bg-gray-100 p-2 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
           </Link>
           <div className="flex items-center gap-2 px-3 py-1 bg-[#0f2d54]/10 text-[#0f2d54] rounded-full font-semibold text-sm">
             <Map className="w-4 h-4" /> Trip details
           </div>
           <div className="w-10"></div>{/* Spacer for centering */}
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto hide-scrollbar border-t border-gray-100 px-2 lg:justify-center">
            {tabs.map((tab) => {
               const isActive = pathname === tab.path;
               return (
                 <Link 
                   key={tab.name}
                   href={tab.path}
                   className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                     isActive ? "border-[#f97316] text-[#0f2d54] font-bold" : "border-transparent text-[#64748b] hover:text-[#0f2d54]"
                   }`}
                 >
                   {tab.name}
                 </Link>
               );
            })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full px-4 py-6">
        {children}
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none p-4 pb-6 flex justify-between items-end max-w-4xl mx-auto right-0">
          <div className="pointer-events-auto">
             <SOSButton tripId={tripId} />
          </div>
          <div className="pointer-events-auto">
             <AIAssistant tripId={tripId} />
          </div>
      </div>
    </div>
  );
}
