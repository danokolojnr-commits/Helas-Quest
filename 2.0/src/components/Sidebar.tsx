import React from "react";
import { Search, Send, GraduationCap, CheckSquare, Sparkles, X, LogOut } from "lucide-react";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  savedCount: number;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, savedCount, isOpen, onClose, onLogout }) => {
  const menuItems = [
    { id: "scholarships", label: "Scholarship Search", icon: Search },
    { id: "universities", label: "Universities Near You", icon: GraduationCap },
    { id: "applications", label: "Eligibility Assessment", icon: CheckSquare },
    { id: "admin", label: "Admin Dashboard", icon: Sparkles },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-68 bg-[#0f172a] md:bg-white/5 md:backdrop-blur-md border-r border-white/10 text-white flex flex-col justify-between h-screen fixed md:sticky top-0 shrink-0 z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6">
          {/* Logo/Branding */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { onViewChange("scholarships"); onClose?.(); }}>
              <div className="bg-gradient-to-tr from-purple-500 to-blue-500 text-white p-2 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <GraduationCap className="h-4 w-4 md:h-6 md:w-6 stroke-[2]" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-lg leading-tight tracking-tight">Hilas Quest</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Scholarship Hub</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button className="md:hidden text-slate-400 hover:text-white" onClick={onClose}>
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Main Portal</p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.id === "scholarships" && currentView === "details");
              return (
                <button
                  key={item.id}
                  onClick={() => { onViewChange(item.id); onClose?.(); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-white/10 text-white shadow-md border border-white/10"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? "stroke-[2.5]" : ""}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === "scholarships" && savedCount > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? "bg-white text-slate-900" : "bg-white/10 text-white"
                      }`}
                    >
                      {savedCount} saved
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Info Box */}
        <div className="mt-auto px-4 pb-4">
          <div className="p-4 mb-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
            <div className="inline-flex p-2 rounded-lg bg-white/10">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-semibold text-white">Interactive AI Assistant</p>
            <p className="text-[10px] text-slate-400 leading-normal">
              Click the Advisor icon on the bottom right to review your Statement of Purpose or get recommendations.
            </p>
          </div>
          <button
            onClick={() => {
              if (onLogout) onLogout();
              if (onClose) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
