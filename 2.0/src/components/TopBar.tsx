import React from "react";
import { Search, Bookmark, Calendar, Menu, User, Bell, AlertCircle } from "lucide-react";

interface TopBarProps {
  applications?: any[];
  searchVal: string;
  onSearchChange: (val: string) => void;
  showSavedOnly: boolean;
  onToggleSavedOnly: () => void;
  currentView: string;
  onMenuToggle?: () => void;
  onHeaderClick?: () => void;
  userProfile?: { name: string; avatar: string | null; fieldOfStudy: string; graduationYear?: string } | null;
  onEditProfile?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  applications,

  searchVal,
  onSearchChange,
  showSavedOnly,
  onToggleSavedOnly,
  currentView,
  onMenuToggle,
  userProfile,
  onEditProfile,
  onHeaderClick,
}) => {
  
  // Notification Logic
  const hasUrgentDeadlines = React.useMemo(() => {
    if (!applications) return false;
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    return applications.some(app => {
      if (!app.deadlineDate) return false;
      const deadline = new Date(app.deadlineDate);
      return deadline > now && deadline <= sevenDaysFromNow;
    });
  }, [applications]);

  const getHeaderTitle = () => {
    switch (currentView) {
      case "scholarships":
        return "Academic Opportunities";
      case "details":
        return "Scholarship Details";
      case "discover":
        return "Discover Scholarships";
      case "universities":
        return "University Directory";
      case "applications":
        return "Application Manager";
      case "admin":
        return "Admin Dashboard";
      default:
        return "Hilas Quest Portal";
    }
  };

  const getHeaderSubtitle = () => {
    switch (currentView) {
      case "scholarships":
        return "Find, filter, and apply to top prestigious grants globally.";
      case "details":
        return "Deep dive into funding, requirements, and key deadlines.";
      case "discover":
        return "Hand-curated programs, global spotlights, and elite recommendations.";
      case "universities":
        return "Explore university rankings, admission criteria, and local awards.";
      case "applications":
        return "Monitor your submissions, pending credentials, and checklist items.";
      case "admin":
        return "Manage scholarships and discover new ones using AI.";
      default:
        return userProfile?.name ? `Welcome, ${userProfile.name}` : "Welcome back, scholar.";
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="min-h-[80px] bg-white/5 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10">
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden p-2 -ml-2 text-slate-300 hover:text-white"
            onClick={onMenuToggle}
          >
            <Menu className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <div onClick={onHeaderClick} className="cursor-pointer">
            <h2 className="text-xl font-heading font-bold text-white leading-tight select-none">{getHeaderTitle()}</h2>
            <p className="text-xs text-slate-300 hidden sm:block select-none">{getHeaderSubtitle()}</p>
          </div>
        </div>
        
        {/* Profile on mobile - shown here, hidden on desktop */}
        <div className="md:hidden cursor-pointer" onClick={onEditProfile}>
          {userProfile?.avatar ? (
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              referrerPolicy="no-referrer"
              className="h-6 w-6 md:h-8 md:w-8 rounded-full border-2 border-purple-500/50 object-cover shadow-sm"
            />
          ) : (
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-full border-2 border-purple-500/50 flex items-center justify-center bg-black/20 text-slate-400 shadow-sm">
              <User className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>

      {/* Global Controls */}
      <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
        {currentView === "scholarships" && (
          <div className="flex items-center gap-3 min-w-max">
            {/* Search Input */}
            <form 
              className="relative w-48 md:w-64"
              onSubmit={(e) => {
                e.preventDefault();
                const activeElement = document.activeElement as HTMLElement;
                if (activeElement) {
                  activeElement.blur();
                }

              }}
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchVal}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search grants..."
                className="w-full text-xs text-white pl-10 pr-4 py-2 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all bg-white/5 placeholder-slate-400"
              />
            </form>

            {/* Saved filter button */}
            <button
              onClick={onToggleSavedOnly}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                showSavedOnly
                  ? "bg-purple-500/20 border-purple-500/50 text-white"
                  : "border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${showSavedOnly ? "fill-purple-400 text-purple-400" : ""}`} />
              <span className="hidden sm:inline">Saved</span>
            </button>
          </div>
        )}

        
        {/* Nudge Notification */}
        {hasUrgentDeadlines && (
          <div className="flex items-center gap-2 bg-rose-500/20 text-rose-200 border border-rose-500/30 px-3 py-2 rounded-xl text-xs font-bold animate-pulse cursor-pointer group shrink-0">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Deadline Approaching!</span>
            <div className="absolute top-14 right-4 bg-slate-900 border border-rose-500/50 p-3 rounded-xl shadow-xl w-64 hidden group-hover:block z-50">
              <div className="flex items-start gap-2 text-rose-300">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <p className="text-[10px] leading-relaxed">
                  You have applications with deadlines approaching within 7 days. Make sure to complete any pending tasks!
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Date stamp */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-2 rounded-xl border border-white/10 shrink-0">
          <Calendar className="h-3.5 w-3.5 text-white" />
          <span>{today}</span>
        </div>

        {/* Profile Card - Desktop */}
        <div 
          className="hidden md:flex items-center gap-3 pl-4 border-l border-white/10 shrink-0 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors group"
          onClick={onEditProfile}
        >
          {userProfile?.avatar ? (
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              referrerPolicy="no-referrer"
              className="h-9 w-9 rounded-full border-2 border-purple-500/50 object-cover shadow-sm group-hover:border-purple-400"
            />
          ) : (
            <div className="h-9 w-9 rounded-full border-2 border-purple-500/50 flex items-center justify-center bg-black/20 text-slate-400 shadow-sm group-hover:border-purple-400">
              <User className="h-4 w-4" />
            </div>
          )}
          <div className="text-left">
            <h4 className="text-xs font-bold text-white max-w-[120px] truncate">{userProfile?.name ? `Welcome, ${userProfile.name.split(' ')[0]}` : "Scholar"}</h4>
            <p className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
              {userProfile?.fieldOfStudy || "Undeclared"} 
              {userProfile?.graduationYear && ` • Class of ${userProfile.graduationYear}`}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
