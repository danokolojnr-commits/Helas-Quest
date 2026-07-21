import { HeroSlider } from "./components/HeroSlider";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Award,
  CheckCircle,
  FileText,
  ChevronRight,
  Bookmark,
  ArrowLeft,
  Send,
  MessageSquare,
  Plus,
  Trash2,
  Mail,
  MailOpen,
  AlertCircle,
  Info,
  Sparkles,
  Building,
  Briefcase,
  GraduationCap,
  DollarSign,
  Clock,
  CheckSquare,
  Check,
  Building2,
  Globe,
  ChevronDown,
} from "lucide-react";

import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { ScholarshipCard } from "./components/ScholarshipCard";
import { MyApplicationsView } from "./components/MyApplicationsView";
import { ActiveApplication } from "./components/ActiveApplicationCard";
import { AIAdvisorDrawer } from "./components/AIAdvisorDrawer";
import { AdminDashboard } from "./components/AdminDashboard";
import { ProfileEditModal } from "./components/ProfileEditModal";
import { UniversitiesView } from "./components/UniversitiesView";
import { EmailComposerView } from "./components/EmailComposerView";
import { AuthPage } from "./components/AuthPage";
import { Scholarship, University, Task, InboxMessage } from "./types";
import {
  SCHOLARSHIPS,
  UNIVERSITIES,
  INITIAL_TASKS,
  INITIAL_INBOX,
  SPOTLIGHTS
} from "./data";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { playClickSound } from "./lib/audio";

export default function App() {
  // Global click sound
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button')) {
        playClickSound();
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);
  // Authentication State
  const [userProfile, setUserProfile] = useState<{ name: string; avatar: string | null; fieldOfStudy: string; graduationYear?: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Application State
  const [applications, setApplications] = useState<ActiveApplication[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserProfile({
          name: user.displayName || user.email?.split('@')[0] || "User",
          avatar: user.photoURL || null,
          fieldOfStudy: "Undeclared", // From onboarding
        });

        // Load applications
        const appsRef = collection(db, "applications");
        const appsQ = query(appsRef, where("userId", "==", user.uid));
        const unsubscribeApps = onSnapshot(appsQ, (snapshot) => {
          const appsData = snapshot.docs.map(d => d.data() as ActiveApplication);
          setApplications(appsData);
        });

        // Load tasks
        const tasksRef = collection(db, "tasks");
        const tasksQ = query(tasksRef, where("userId", "==", user.uid));
        const unsubscribeTasks = onSnapshot(tasksQ, (snapshot) => {
          const tasksData = snapshot.docs.map(d => d.data() as Task);
          setTasks(tasksData.length ? tasksData : INITIAL_TASKS);
        });

        // Load bookmarks
        const bmsRef = collection(db, "bookmarks");
        const bmsQ = query(bmsRef, where("userId", "==", user.uid));
        const unsubscribeBms = onSnapshot(bmsQ, (snapshot) => {
          const bmsData = snapshot.docs.map(d => d.data().scholarshipId);
          setBookmarks(bmsData);
        });

        setIsAuthLoading(false);

        return () => {
          unsubscribeApps();
          unsubscribeTasks();
          unsubscribeBms();
        };

      } else {
        const savedGuest = localStorage.getItem('eduquest_guest_profile');
        if (savedGuest) {
          try {
            setUserProfile(JSON.parse(savedGuest));
          } catch (e) {
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
        setApplications([]);
        setTasks(INITIAL_TASKS);
        setBookmarks([]);
        setIsAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (profile: { name: string; avatar: string | null; fieldOfStudy: string; graduationYear?: string }) => {
    // Auth is handled by onAuthStateChanged listener
    if (profile.name === "Guest Student" || !auth.currentUser) {
      localStorage.setItem('eduquest_guest_profile', JSON.stringify(profile));
    }
    setUserProfile(profile); // Optimistic
  };

  const handleLogout = async () => {
    localStorage.removeItem('eduquest_guest_profile');
    setUserProfile(null);
    await signOut(auth);
  };

  // Navigation State
  const [selectedSchoolForEmail, setSelectedSchoolForEmail] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('eduquest_view');
      if (saved) return saved;
    } catch(e) {}
    return "scholarships";
  });
  React.useEffect(() => {
    try {
      localStorage.setItem('eduquest_view', currentView);
    } catch(e) {}
  }, [currentView]);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string | null>(null);

  // Scholarship Data State
  const [scholarshipsData, setScholarshipsData] = useState<Scholarship[]>([]);
  const [isLoadingScholarships, setIsLoadingScholarships] = useState(true);

  useEffect(() => {
    const fetchScholarships = async (retries = 3) => {
      try {
        const res = await fetch("/api/scholarships");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data.scholarships) {
          setScholarshipsData(data.scholarships);
        }
        setIsLoadingScholarships(false);
      } catch (err) {
        if (retries > 0) {
          setTimeout(() => fetchScholarships(retries - 1), 1500);
        } else {
          console.warn("Using fallback scholarships data due to API unavailability:", err);
          setScholarshipsData(SCHOLARSHIPS);
          setIsLoadingScholarships(false);
        }
      }
    };
    fetchScholarships();
  }, []);

  // Search & Filtering State
  const [searchVal, setSearchVal] = useState<string>("");
  const [degreeFilter, setDegreeFilter] = useState<string>("Any");
  const [countryFilter, setCountryFilter] = useState<string>("Any");
  const [fullFundingFilter, setFullFundingFilter] = useState<boolean>(false);
  const [partialFundingFilter, setPartialFundingFilter] = useState<boolean>(false);


  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [headerClickCount, setHeaderClickCount] = useState<number>(0);

  // Bookmark / Saved State

  // Admissions Inbox
  const [inbox, setInbox] = useState<InboxMessage[]>(INITIAL_INBOX);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [newTaskVal, setNewTaskVal] = useState<string>("");

  // Application submission modal/wizard states
  const [formStep, setFormStep] = useState<number>(1);
  const [uploadedSOP, setUploadedSOP] = useState<boolean>(false);
  const [uploadedTranscript, setUploadedTranscript] = useState<boolean>(false);
  const [uploadedRecoms, setUploadedRecoms] = useState<boolean>(false);
  const [showCelebrate, setShowCelebrate] = useState<boolean>(false);
  const [appliedScholarship, setAppliedScholarship] = useState<Scholarship | null>(null);

  // Handles toggle saved state
  const handleBookmarkToggle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isBookmarked = bookmarks.includes(id);
    
    // Optimistic UI update
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );

    if (!auth.currentUser) return;

    try {
      if (isBookmarked) {
        // We can't directly delete by userId and scholarshipId without querying first
        // So we will use a composite ID: userId_scholarshipId
        await deleteDoc(doc(db, "bookmarks", `${auth.currentUser.uid}_${id}`));
      } else {
        await setDoc(doc(db, "bookmarks", `${auth.currentUser.uid}_${id}`), {
          userId: auth.currentUser.uid,
          scholarshipId: id
        });
      }
    } catch (err) {
      console.error(err);
      // Revert if failed
      setBookmarks((prev) =>
        prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
      );
    }
  };

  // Navigates directly to Stanford details
  const handleUniversitySelect = (uniId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentView("universities");
    setSelectedScholarshipId(null);
  };

  // Filters calculation
  const filteredScholarships = scholarshipsData.filter((s) => {
    // Search query match
    const query = searchVal.toLowerCase();
    const matchesSearch =
      s.title.toLowerCase().includes(query) ||
      s.university.toLowerCase().includes(query) ||
      s.summary.toLowerCase().includes(query);

    // Degree level match
    let matchesDegree = true;
    if (degreeFilter !== "Any") {
      if (degreeFilter === "STEM") {
        matchesDegree = s.category === "STEM";
      } else {
        matchesDegree = s.level.toLowerCase().includes(degreeFilter.toLowerCase());
      }
    }

    // Country match
    const matchesCountry = countryFilter === "Any" || s.country === countryFilter;

    // Funding match
    let matchesFunding = true;
    if (fullFundingFilter && !partialFundingFilter) {
      matchesFunding = s.isFullFunding;
    } else if (partialFundingFilter && !fullFundingFilter) {
      matchesFunding = !s.isFullFunding;
    }

    // Saved match
    const matchesSaved = !showSavedOnly || bookmarks.includes(s.id);

    return matchesSearch && matchesDegree && matchesCountry && matchesFunding && matchesSaved;
  });

  // Selects a scholarship for detailed view
  const handleSelectScholarship = (id: string) => {
    setSelectedScholarshipId(id);
    setCurrentView("details");
    // Reset form step when opening a new detail
    setFormStep(1);
    setUploadedSOP(false);
    setUploadedTranscript(false);
    setUploadedRecoms(false);
  };

  // Withdraws an application
  const handleWithdrawApplication = async (id: string) => {
    // Optimistic
    setApplications((prev) => prev.filter((a) => a.id !== id));
    if (!auth.currentUser) return;
    try {
      await deleteDoc(doc(db, "applications", id));
    } catch (err) {
      console.error(err);
    }
  };

  // Submits the multi-step application form
  const handleApplySubmit = async (scholarship: Scholarship) => {
    // Generate new active application
    const newApp: ActiveApplication & { userId?: string } = {
      id: `app-${Date.now()}`,
      scholarshipId: scholarship.id,
      title: scholarship.title,
      university: scholarship.university,
      logoUrl: scholarship.logoUrl,
      progress: 100,
      status: "Submitted",
      appliedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      documentsUploaded: [
        uploadedSOP ? "Personal SOP" : "",
        uploadedTranscript ? "Academic Transcript" : "",
        uploadedRecoms ? "Recommendation Letters" : ""
      ].filter(Boolean),
      totalDocuments: scholarship.requiredDocuments.length
    };

    if (auth.currentUser) {
      newApp.userId = auth.currentUser.uid;
    }

    // Optimistic update
    setApplications((prev) => [newApp as ActiveApplication, ...prev]);
    setAppliedScholarship(scholarship);
    setShowCelebrate(true);

    if (auth.currentUser) {
      // Save to firestore
      try {
        await setDoc(doc(db, "applications", newApp.id), newApp);
      } catch (err) {
        console.error(err);
      }
    }

    // Reset step
    setFormStep(1);
  };

  // Toggles task completion state
  const handleTaskToggle = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Optimistic
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );

    if (!auth.currentUser) return;
    try {
      await setDoc(doc(db, "tasks", taskId), { ...task, completed: !task.completed }, { merge: true });
    } catch (err) {
      console.error(err);
    }
  };

  // Adds custom task to dashboard
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskVal.trim()) return;

    const newTask: Task & { userId?: string } = {
      id: `task-${Date.now()}`,
      title: newTaskVal.trim(),
      dueDate: "Due next week",
      completed: false
    };

    if (auth.currentUser) {
      newTask.userId = auth.currentUser.uid;
    }

    setTasks((prev) => [...prev, newTask as Task]);
    setNewTaskVal("");

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "tasks", newTask.id), newTask);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Deletes task
  const handleDeleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (!auth.currentUser) return;
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (err) {
      console.error(err);
    }
  };

  // Opens and marks message as read
  const handleOpenMessage = (msgId: string) => {
    setSelectedMessageId((prev) => (prev === msgId ? null : msgId));
    setInbox((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, unread: false } : m))
    );
  };

  const selectedScholarship = scholarshipsData.find((s) => s.id === selectedScholarshipId);

  if (isAuthLoading) {
    return <div className="flex h-screen bg-[#0f172a] text-white items-center justify-center">Loading...</div>;
  }

  if (!userProfile) {
    return <AuthPage onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex h-screen bg-[#0f172a] text-white font-sans antialiased overflow-hidden relative z-0">
      {/* Background Mesh Gradients */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0) 60%)', willChange: 'transform, opacity' }}
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0) 60%)', willChange: 'transform, opacity' }}
      />
      <motion.div 
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[20%] right-[10%] w-[30%] h-[40%] -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(236,72,153,0) 60%)', willChange: 'transform, opacity' }}
      />
      <motion.div 
        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0) 60%)', willChange: 'transform, opacity' }}
      />

      {/* Sidebar navigation */}
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setSelectedScholarshipId(null);
        }}
        savedCount={bookmarks.length}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Global top bar */}
        <TopBar
          applications={applications}
          searchVal={searchVal}
          onSearchChange={setSearchVal}
          showSavedOnly={showSavedOnly}
          onToggleSavedOnly={() => setShowSavedOnly((prev) => !prev)}
          currentView={currentView}
          onMenuToggle={() => setIsMobileMenuOpen(true)}
          userProfile={userProfile}
          onEditProfile={() => setCurrentView("applications")}
          onHeaderClick={() => {
            if (currentView === "admin") {
              const newCount = headerClickCount + 1;
              if (newCount >= 4) {
                setCurrentView("tehilla");
                setHeaderClickCount(0);
              } else {
                setHeaderClickCount(newCount);
              }
            }
          }}
        />

        {/* Dynamic Inner views scrollpane */}
        <main className="flex-1 overflow-y-auto bg-transparent p-4 md:p-8 relative z-10 pb-24 md:pb-8">
          <AnimatePresence mode="wait">
            {/* 1. SCHOLARSHIP SEARCH PAGE */}
            {currentView === "scholarships" && (
              <motion.div
                key="scholarships-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 max-w-7xl mx-auto"
              >
                <HeroSlider />

                                                {/* Search filters layout */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-5 shadow-xl flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                    <div className="space-y-1.5 flex-1 min-w-[140px] max-w-[200px]">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5"/> Degree Target
                      </label>
                      <div className="relative">
                        <select
                          value={degreeFilter}
                          onChange={(e) => setDegreeFilter(e.target.value)}
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors font-semibold text-white appearance-none cursor-pointer [&>option]:bg-slate-800"
                        >
                          <option value="Any">Any Level</option>
                          <option value="Bachelors">Bachelors / Undergrad</option>
                          <option value="Masters">Masters Programs</option>
                          <option value="PhD">PhD / Graduate Fellow</option>
                          <option value="STEM">STEM-Priority Only</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-[140px] max-w-[200px]">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5"/> Host Region
                      </label>
                      <div className="relative">
                        <select
                          value={countryFilter}
                          onChange={(e) => setCountryFilter(e.target.value)}
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors font-semibold text-white appearance-none cursor-pointer [&>option]:bg-slate-800"
                        >
                          <option value="Any">Global Host</option>
                          <option value="USA">USA</option>
                          <option value="UK">United Kingdom</option>
                          <option value="Germany">Germany</option>
                          <option value="Switzerland">Switzerland</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex gap-4 items-center self-end h-[34px]">
                      <label className="flex items-center gap-2 cursor-pointer group bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-all">
                        <input
                          type="checkbox"
                          checked={fullFundingFilter}
                          onChange={(e) => setFullFundingFilter(e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-3.5 h-3.5 rounded border border-white/30 bg-black/20 peer-checked:bg-purple-500 peer-checked:border-purple-500 flex items-center justify-center transition-all">
                           <Check className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-300 peer-checked:text-white transition-colors">Full Funding</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-all">
                        <input
                          type="checkbox"
                          checked={partialFundingFilter}
                          onChange={(e) => setPartialFundingFilter(e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-3.5 h-3.5 rounded border border-white/30 bg-black/20 peer-checked:bg-blue-500 peer-checked:border-blue-500 flex items-center justify-center transition-all">
                           <Check className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-300 peer-checked:text-white transition-colors">Partial Support</span>
                      </label>
                    </div>
                  </div>
                  <div className="text-right w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t border-white/10 md:border-none">
                    <p className="text-sm md:text-base font-extrabold text-white font-heading">{filteredScholarships.length} <span className="text-purple-400">Opportunities</span></p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Matching criteria</p>
                  </div>
                </div>

                {/* Grants list grid */}
                {filteredScholarships.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredScholarships.map((s) => (
                      <ScholarshipCard
                        key={s.id}
                        scholarship={s}
                        isBookmarked={bookmarks.includes(s.id)}
                        onBookmarkToggle={handleBookmarkToggle}
                        onSelect={handleSelectScholarship}
                        onUniversitySelect={handleUniversitySelect}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-lg">
                    <div className="h-8 w-8 md:h-12 md:w-12 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                      <AlertCircle className="h-4 w-4 md:h-6 md:w-6 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-white text-sm">No match found</h3>
                      <p className="text-xs text-slate-300 leading-relaxed mt-1">
                        Try refining your search text or removing filters to discover more prestigious grants.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSearchVal("");
                        setDegreeFilter("Any");
                        setCountryFilter("Any");
                        setFullFundingFilter(false);
                        setPartialFundingFilter(false);
                        setShowSavedOnly(false);
                      }}
                      className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/20 transition-colors border border-white/10"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* 2. DISCOVER / CURATED EXPLORE PAGE */}
            {currentView === "discover" && (
              <motion.div
                key="discover-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {/* Spotlights Slider Grid */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Curated University Spotlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {SPOTLIGHTS.map((spot, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20px" }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-lg relative group cursor-pointer"
                        onClick={() => {
                          if (spot.name.includes("Stanford")) {
                            handleUniversitySelect("stanford");
                          } else {
                            handleUniversitySelect("oxford");
                          }
                        }}
                      >
                        <div className="h-44 overflow-hidden relative">
                          <img
                            src={spot.imageUrl}
                            alt={spot.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                          {spot.tag && (
                            <span className="absolute top-4 left-4 bg-purple-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                              {spot.tag}
                            </span>
                          )}
                          <div className="absolute bottom-4 left-4 text-white">
                            <h4 className="font-heading font-bold text-sm leading-tight">{spot.name}</h4>
                            <p className="text-[10px] text-slate-200 flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" />
                              <span>{spot.location}</span>
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Profile Evaluation Alert Card */}
                <div className="bg-white/5 backdrop-blur-md rounded-[32px] p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-white/20 shadow-lg relative overflow-hidden">
                  <div className="absolute -right-12 -bottom-12 h-44 w-44 rounded-full bg-white/5 border-2 border-white/10" />
                  <div className="flex items-center gap-4.5">
                    <div className="bg-purple-500 p-3 rounded-2xl text-white">
                      <Sparkles className="h-4 w-4 md:h-6 md:w-6 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base">Your AI Academic Match Profile</h3>
                      <p className="text-xs text-slate-300 leading-normal mt-1 max-w-xl">
                        Hilas Quest AI analyzes your profile (**GPA: 3.8 / Major: CS**) and recommends active scholarships with higher admittance chances. Open the advisor at the bottom right to begin a deep-dive evaluation!
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 relative z-10">
                    <button
                      onClick={() => handleSelectScholarship("global-tech-excellence")}
                      className="bg-white text-slate-900 font-bold px-4 py-2 text-xs rounded-xl hover:bg-slate-200 transition-colors cursor-pointer shadow-lg shadow-white/10"
                    >
                      View Best Match
                    </button>
                  </div>
                </div>

                {/* Highly aligned recommendations */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Highly Aligned Recommendations</h3>
                    <button
                      onClick={() => {
                        setCurrentView("scholarships");
                        setDegreeFilter("STEM");
                      }}
                      className="text-xs font-bold text-purple-300 hover:underline"
                    >
                      Explore STEM Priority
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {scholarshipsData.slice(0, 2).map((s) => (
                      <ScholarshipCard
                        key={s.id}
                        scholarship={s}
                        isBookmarked={bookmarks.includes(s.id)}
                        onBookmarkToggle={handleBookmarkToggle}
                        onSelect={handleSelectScholarship}
                        onUniversitySelect={handleUniversitySelect}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. SCHOLARSHIP DETAILS VIEW */}
            {currentView === "details" && selectedScholarship && (
              <motion.div
                key="details-page"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 max-w-7xl mx-auto"
              >
                {/* Back button */}
                <button
                  onClick={() => setCurrentView("scholarships")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors bg-white/5 border border-white/10 px-3.5 py-1.8 rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Opportunities</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left block - guidelines */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-[32px] p-6.5 shadow-lg space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                          <img src={selectedScholarship.logoUrl} alt="Logo" className="h-9 w-9 object-contain" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-300">{selectedScholarship.university}</span>
                          <h2 className="font-heading font-bold text-white text-lg leading-tight">{selectedScholarship.title}</h2>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/10 text-center">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Host Region</span>
                          <span className="text-xs font-bold text-white block mt-1">{selectedScholarship.country}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Target Level</span>
                          <span className="text-xs font-bold text-white block mt-1">{selectedScholarship.level}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Deadline</span>
                          <span className="text-xs font-bold text-pink-400 block mt-1">{selectedScholarship.deadline}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-heading font-bold text-white text-sm">Opportunity Overview</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {selectedScholarship.detailedDescription}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-[32px] p-6.5 shadow-lg space-y-4">
                      <h3 className="font-heading font-bold text-white text-sm">Key Selection Timeline</h3>
                      <div className="relative border-l-2 border-white/20 pl-6 ml-3 space-y-6">
                        {selectedScholarship.timeline.map((t, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-10px" }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                            className="relative"
                          >
                            {/* Dot indicator */}
                            <div
                              className={`absolute -left-[31px] h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                t.current
                                  ? "bg-purple-500 border-purple-300"
                                  : "bg-white/10 border-white/30"
                              }`}
                            >
                              {t.current && <span className="h-1.5 w-1.5 bg-white rounded-full" />}
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400">{t.date}</span>
                              <h4 className="text-xs font-bold text-white">{t.label}</h4>
                              <p className="text-[11px] text-slate-300 leading-normal">{t.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Block - Checklist & Apply Button */}
                  <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-[32px] p-6 shadow-lg space-y-4">
                      <div className="text-center pb-4 border-b border-white/10">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Award Valuation</span>
                        <h2 className="font-heading font-extrabold text-white text-lg md:text-xl md:text-2xl mt-1">{selectedScholarship.amount}</h2>
                        <span className="text-[9px] bg-purple-500/20 text-purple-200 font-bold px-2 py-0.5 rounded border border-purple-500/30 mt-2 inline-block">
                          {selectedScholarship.isFullFunding ? "Fully Funded Scholar" : "Partial Academic Aid"}
                        </span>
                      </div>

                      {/* Criteria */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-white">Candidacy Parameters</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] font-semibold py-1 border-b border-white/10">
                            <span className="text-slate-400">Academic Focus:</span>
                            <span className="text-slate-200">{selectedScholarship.fieldOfStudy}</span>
                          </div>
                          <div className="flex justify-between text-[11px] font-semibold py-1 border-b border-white/10">
                            <span className="text-slate-400">Degree Level:</span>
                            <span className="text-slate-200">{selectedScholarship.degreeLevel}</span>
                          </div>
                          <div className="flex justify-between text-[11px] font-semibold py-1 border-b border-white/10">
                            <span className="text-slate-400">Status Eligible:</span>
                            <span className="text-slate-200">{selectedScholarship.studentStatus}</span>
                          </div>
                        </div>
                      </div>

                      {/* Document Required checklist */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-white">Required Credentials</h4>
                        <div className="space-y-2">
                          {selectedScholarship.requiredDocuments.map((doc, idx) => (
                            <motion.div 
                              key={idx} 
                              initial={{ opacity: 0, x: 10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true, margin: "-10px" }}
                              transition={{ duration: 0.3, delay: idx * 0.1 }}
                              className="flex gap-2.5 items-start text-[11px]"
                            >
                              <div className="bg-white/10 p-1 rounded-md text-white shrink-0 mt-0.5">
                                <FileText className="h-3 w-3" />
                              </div>
                              <div>
                                <p className="font-bold text-white">{doc.title}</p>
                                <p className="text-[9px] text-slate-400 mt-0.5">{doc.desc}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Apply Wizard State */}
                      <div className="pt-4 border-t border-white/10 space-y-4">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">Submission Status</p>

                        {/* Interactive Steps Form */}
                        {applications.some((a) => a.scholarshipId === selectedScholarship.id) ? (
                          <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 p-4 rounded-xl text-center space-y-2">
                            <CheckCircle className="h-5 w-5 mx-auto" />
                            <p className="text-xs font-bold">You already applied!</p>
                            <p className="text-[10px] leading-relaxed">
                              Successfully submitted on record. Check dashboard to track progress.
                            </p>
                            <button
                              onClick={() => setCurrentView("applications")}
                              className="text-xs font-bold underline text-white mt-1 block w-full text-center"
                            >
                              Go to Dashboard
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {formStep === 1 && (
                              <button
                                onClick={() => setFormStep(2)}
                                className="w-full py-2 md:py-3 bg-white hover:bg-slate-200 text-slate-900 font-bold text-[10px] md:text-xs rounded-lg md:rounded-xl shadow-md tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer"
                              >
                                <GraduationCap className="h-3 w-3 md:h-4 md:w-4" />
                                <span>Apply</span>
                              </button>
                            )}

                            {formStep === 2 && (
                              <div className="bg-white/10 border border-white/20 p-4 rounded-xl space-y-3">
                                <h4 className="text-[11px] font-bold text-white uppercase">Step 2: Upload Documents</h4>

                                <div className="space-y-2">
                                  <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer p-2 bg-white/5 rounded-lg border border-white/20">
                                    <input
                                      type="checkbox"
                                      checked={uploadedSOP}
                                      onChange={(e) => setUploadedSOP(e.target.checked)}
                                      className="rounded border-white/30 bg-white/10 text-purple-500 focus:ring-purple-500"
                                    />
                                    <span>Statement of Purpose (SOP)</span>
                                  </label>
                                  <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer p-2 bg-white/5 rounded-lg border border-white/20">
                                    <input
                                      type="checkbox"
                                      checked={uploadedTranscript}
                                      onChange={(e) => setUploadedTranscript(e.target.checked)}
                                      className="rounded border-white/30 bg-white/10 text-purple-500 focus:ring-purple-500"
                                    />
                                    <span>Official Transcripts</span>
                                  </label>
                                  <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer p-2 bg-white/5 rounded-lg border border-white/20">
                                    <input
                                      type="checkbox"
                                      checked={uploadedRecoms}
                                      onChange={(e) => setUploadedRecoms(e.target.checked)}
                                      className="rounded border-white/30 bg-white/10 text-purple-500 focus:ring-purple-500"
                                    />
                                    <span>Recommendation Letters</span>
                                  </label>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-white/10">
                                  <button
                                    onClick={() => setFormStep(1)}
                                    className="flex-1 py-1.8 border border-white/20 text-slate-300 hover:bg-white/5 rounded-lg text-[10px] font-bold"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    disabled={!uploadedSOP || !uploadedTranscript}
                                    onClick={() => handleApplySubmit(selectedScholarship)}
                                    className="flex-1 py-1.8 bg-purple-500 hover:bg-purple-400 disabled:bg-white/5 disabled:text-slate-500 text-white rounded-lg text-[10px] font-extrabold cursor-pointer transition-colors"
                                  >
                                    Submit File
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}


            {/* 4. UNIVERSITIES VIEW */}
            {currentView === "universities" && (
              <UniversitiesView onEmailSchool={(school) => { setSelectedSchoolForEmail(school); setCurrentView("email-application"); }} />
            )}

            
            {/* 5. MY APPLICATIONS VIEW */}
            
            {currentView === "email-application" && selectedSchoolForEmail && (
              <motion.div
                key="email-application-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="h-full"
              >
                <EmailComposerView
                  schoolName={selectedSchoolForEmail}
                  onBack={() => {
                    setCurrentView("applications");
                    setSelectedSchoolForEmail(null);
                  }}
                />
              </motion.div>
            )}

            {currentView === "applications" && (
              <motion.div
                key="applications-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="h-full"
              >
                <MyApplicationsView
                  bookmarks={bookmarks}
                  userProfile={userProfile}
                  applications={applications}
                  onEmailSchool={(school) => { setSelectedSchoolForEmail(school); setCurrentView("email-application"); }}
                  onApply={async (scholarshipId, details) => {
                    const sInfo = scholarshipsData.find(s => s.id === scholarshipId);
                    
                    const newApp: ActiveApplication & { userId?: string } = {
                      id: 'app-' + Math.random().toString(36).substr(2, 9),
                      scholarshipId,
                      title: sInfo?.title || "Scholarship Application",
                      university: sInfo?.university || "University",
                      logoUrl: sInfo?.logoUrl || "",
                      progress: 100,
                      status: "Submitted",
                      appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                      deadlineDate: sInfo?.deadline || "",
                      documentsUploaded: ["Statement of Purpose", "Academic Transcript"],
                      totalDocuments: 2
                    };
                    if (auth.currentUser) {
                      newApp.userId = auth.currentUser.uid;
                    }

                    setApplications(prev => [newApp as ActiveApplication, ...prev]);
                    setShowCelebrate(true);
                    setTimeout(() => setShowCelebrate(false), 3000);

                    if (auth.currentUser) {
                      try {
                        await setDoc(doc(db, "applications", newApp.id), newApp);
                      } catch (err) {
                        console.error(err);
                      }
                    }
                  }}
                />
              </motion.div>
            )}
            {currentView === "admin" && (
              <motion.div
                key="admin-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <AdminDashboard scholarships={scholarshipsData} setScholarships={setScholarshipsData} />
              </motion.div>
            )}
            {currentView === "tehilla" && (
              <motion.div
                key="tehilla-page"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
              >
                <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-4 animate-pulse">
                  Hello, Tehilla!
                </h1>
                <p className="text-slate-300 text-lg md:text-xl max-w-lg">
                  You found the secret page! I am waiting for your instructions on what to put here.
                </p>
                <button
                  onClick={() => {
                    setSearchVal('');
                    setCurrentView('scholarships');
                  }}
                  className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-bold transition-all"
                >
                  Go Back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <ProfileEditModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        userProfile={userProfile} 
        onSave={handleAuthSuccess} 
        onLogout={handleLogout}
      />

      {/* Floating AI Academic Advisor panel */}
      <AIAdvisorDrawer />

      {/* Dynamic Overlay Celebration for Application Submissions */}
      <AnimatePresence>
        {showCelebrate && appliedScholarship && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900/90 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-lg relative overflow-hidden border border-white/20"
            >
              {/* Gold confetti particles mockup */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500" />

              <div className="h-12 w-12 md:h-16 md:w-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-300 mx-auto shadow-lg shadow-purple-500/10">
                <CheckCircle className="h-8 w-8 md:h-10 md:w-10 stroke-[2]" />
              </div>

              <div className="space-y-2">
                <h2 className="font-heading font-extrabold text-white text-lg md:text-xl leading-tight">Submission Completed!</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your application portfolio for **{appliedScholarship.title}** has been received successfully by **{appliedScholarship.university}**.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-left space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Admissions Host:</span>
                  <span className="text-[#031632]">{appliedScholarship.university}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Applicant Name:</span>
                  <span className="text-[#031632]">Alex Rivera</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Tracking ID:</span>
                  <span className="text-[#031632] font-mono font-bold uppercase">EQ-{(Math.random() * 1000000).toFixed(0)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCelebrate(false);
                    setCurrentView("applications");
                  }}
                  className="flex-1 py-3 bg-[#031632] hover:bg-[#072450] text-[#fdc003] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Track in Applications
                </button>
                <button
                  onClick={() => {
                    setShowCelebrate(false);
                    setCurrentView("scholarships");
                  }}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
