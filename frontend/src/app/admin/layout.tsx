"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Tent, Users, UserCog, BellRing, PlusCircle, LogOut, CreditCard } from "lucide-react";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Trips", href: "/admin/trips", icon: Tent },
    { name: "Travelers", href: "/admin/travelers", icon: Users },
    { name: "Staff", href: "/admin/staff", icon: UserCog },
    { name: "Notifications", href: "/admin/notifications", icon: BellRing },
    { name: "New Trip", href: "/admin/trips/new", icon: PlusCircle },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] text-navy font-body overflow-hidden">
       {/* Sidebar */}
       <aside className="w-64 bg-navy text-white flex flex-col shadow-2xl z-20 hidden md:flex">
          <div className="p-6 border-b border-white/10 font-heading">
             <h1 className="text-xl font-black tracking-widest text-primary uppercase">YC Admin</h1>
             <p className="text-xs text-white/50 mt-1 font-semibold">Management Console</p>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto font-heading">
             {links.map(link => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.name} href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                       isActive ? "bg-primary text-white shadow-lg" : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                     <Icon className="w-5 h-5" />
                     {link.name}
                  </Link>
                );
             })}
          </nav>

          <div className="p-4 border-t border-white/10 font-heading">
             <button 
                onClick={async () => {
                   await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                   window.location.href = "/login";
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-400 hover:bg-red-500/20 hover:text-red-200 w-full transition-all"
             >
                <LogOut className="w-5 h-5" /> Logout
             </button>
          </div>
       </aside>

       {/* Main Content */}
       <main className="flex-1 flex flex-col overflow-hidden relative">
          <div className="md:hidden bg-navy text-white p-4 flex justify-between items-center shadow-md font-heading">
             <h1 className="font-black tracking-widest text-primary uppercase">YC Admin</h1>
          </div>
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
             {children}
          </div>
       </main>
    </div>
  );
}
