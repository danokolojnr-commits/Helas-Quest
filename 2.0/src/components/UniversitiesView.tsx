import { UniSlider } from './UniSlider';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ChevronLeft, ChevronRight, Building, Building2, Briefcase, MapPin, Send, Locate, Stethoscope, BookOpen, Globe, Settings, Scale } from "lucide-react";
import { UNIVERSITIES, SCHOLARSHIPS } from "../data";

export const UniversitiesView = ({ onEmailSchool }: { onEmailSchool?: (schoolName: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const requestLocation = () => {
    setLocationStatus("Locating...");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLocationStatus("Location verified. Showing universities near you.");
          setCurrentIndex(0); // reset to first one
        },
        (error) => {
          setLocationStatus("Location access denied or unavailable.");
        }
      );
    } else {
      setLocationStatus("Geolocation not supported.");
    }
  };

  // If we have location, we might filter to show African ones first or near ones.
  // We'll just sort or filter based on a mock logic if userLocation is present, else normal.
  const filteredUnis = UNIVERSITIES.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => {
    if (userLocation) {
      // Mock logic: if location verified, prioritize African universities (Cape Town, Makerere, Cairo)
      const aIsAfrica = ["uct", "makerere", "cairo"].includes(a.id);
      const bIsAfrica = ["uct", "makerere", "cairo"].includes(b.id);
      if (aIsAfrica && !bIsAfrica) return -1;
      if (!aIsAfrica && bIsAfrica) return 1;
    }
    return 0;
  });

  const currentUni = filteredUnis[currentIndex] || filteredUnis[0];

  const nextUni = () => {
    if (filteredUnis.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredUnis.length);
    }
  };

  const prevUni = () => {
    if (filteredUnis.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + filteredUnis.length) % filteredUnis.length);
    }
  };

  const getIcon = (iconStr: string) => {
    switch (iconStr) {
      case "laptop": return <Building className="h-4 w-4" />;
      case "biotech": return <Building2 className="h-4 w-4" />;
      case "business_center": return <Briefcase className="h-4 w-4" />;
      case "medical": return <Stethoscope className="h-4 w-4" />;
      case "history": return <BookOpen className="h-4 w-4" />;
      case "public": return <Globe className="h-4 w-4" />;
      case "settings": return <Settings className="h-4 w-4" />;
      case "gavel": return <Scale className="h-4 w-4" />;
      case "math": return <Building className="h-4 w-4" />;
      case "science": return <Building2 className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col overflow-y-auto custom-scrollbar pb-12 pr-2">
      
      {/* Hero Image Section */}
      <div className="relative w-full h-[250px] md:h-[300px] rounded-3xl overflow-hidden mb-6 border border-white/20">
        <img referrerPolicy="no-referrer" 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200" 
          alt="Students at university" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent flex flex-col justify-end p-8 md:p-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight mb-2">
            Universities Near You
          </h2>
          <p className="text-slate-300 max-w-2xl text-sm md:text-base">
            Discover and connect with top educational institutions globally and locally.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center gap-4 flex-1 w-full">
          <Search className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search universities by name or location..."
            className="bg-transparent border-none outline-none text-white w-full placeholder-slate-400 text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentIndex(0);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={requestLocation}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl transition-colors text-sm font-bold border border-purple-500/30 whitespace-nowrap"
          >
            <Locate className="h-4 w-4" />
            Scan Location
          </button>
        </div>
      </div>
      
      {locationStatus && (
        <div className="text-center text-xs font-semibold text-purple-300">
          {locationStatus}
        </div>
      )}

      {!currentUni ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          No universities found matching your search.
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUni.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col space-y-6 pb-8"
          >
            {/* Full Banner */}
            <div className="h-64 rounded-3xl overflow-hidden relative border border-white/20 shadow-lg shrink-0">
              <img
                src={currentUni.bannerUrl}
                alt={currentUni.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Navigation Arrows */}
              {filteredUnis.length > 1 && (
                <>
                  <button onClick={prevUni} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors border border-white/10">
                    <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
                  </button>
                  <button onClick={nextUni} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors border border-white/10">
                    <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
                  </button>
                </>
              )}

              <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2.5 rounded-2xl flex items-center justify-center border border-white/20 h-14 w-14 shrink-0">
                    <Building className="h-4 w-4 md:h-6 md:w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-purple-300 text-xs font-bold uppercase tracking-widest">{currentUni.location}</span>
                    <h2 className="font-heading font-extrabold text-2xl text-white tracking-tight leading-none mt-1">
                      {currentUni.name}
                    </h2>
                  </div>
                </div>
                
                <button
                  onClick={() => onEmailSchool ? onEmailSchool(currentUni.name) : alert('Email functionality not configured')}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs rounded-lg font-semibold flex items-center gap-1 transition-all shadow-md shadow-purple-500/20"
                >
                  Apply Now <Send className="h-3 w-3 md:h-3.5 md:w-3.5" />
                </button>
              </div>
            </div>

            {/* Slider Dots */}
            {filteredUnis.length > 1 && (
              <div className="flex justify-center gap-2">
                {filteredUnis.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? "w-8 bg-purple-500" : "w-2 bg-white/20"}`}
                  />
                ))}
              </div>
            )}

            {/* Main Stats Block */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Admissions Rank", value: currentUni.rank, color: "text-white" },
                { label: "Graduation Rate", value: currentUni.gradRate, color: "text-emerald-400" },
                { label: "Undergrad Tuition", value: currentUni.tuition, color: "text-white" },
                { label: "Total Students", value: currentUni.students, color: "text-slate-300" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-5 shadow-lg text-center">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">{stat.label}</span>
                  <span className={`text-base font-extrabold block mt-2 ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left block - description */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-[32px] p-6.5 shadow-lg space-y-4">
                  <h3 className="font-heading font-bold text-white text-sm">About {currentUni.name.split(' ')[0]}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentUni.about}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {currentUni.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-bold bg-white/10 border border-white/20 text-slate-200 px-2.5 py-1 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highly Valued Academic Programs */}
                <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-[32px] p-6.5 shadow-lg space-y-4">
                  <h3 className="font-heading font-bold text-white text-sm">Premier Highly Valued Programs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentUni.programs.map((prog, i) => (
                      <div key={i} className="p-4 border border-white/10 rounded-xl bg-white/5 space-y-2">
                        <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
                          {getIcon(prog.icon)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{prog.name}</h4>
                          <p className="text-[9px] text-slate-400 mt-0.5">{prog.school}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Scholarships */}
                <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-[32px] p-6.5 shadow-lg space-y-4 mt-6">
                  <h3 className="font-heading font-bold text-white text-sm">Available Scholarships & Grants</h3>
                  
                  {SCHOLARSHIPS.filter(s => s.university.toLowerCase().includes(currentUni.name.split(' ')[0].toLowerCase()) || s.university.toLowerCase().includes(currentUni.location.split(',')[0].toLowerCase()) || currentUni.name.toLowerCase().includes(s.university.toLowerCase())).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {SCHOLARSHIPS.filter(s => s.university.toLowerCase().includes(currentUni.name.split(' ')[0].toLowerCase()) || s.university.toLowerCase().includes(currentUni.location.split(',')[0].toLowerCase()) || currentUni.name.toLowerCase().includes(s.university.toLowerCase())).map((scholarship, i) => (
                        <div key={scholarship.id} className="bg-white/10 border border-white/20 p-4 rounded-2xl">
                          <div className="flex gap-4">
                            {scholarship.logoUrl && (
                              <img referrerPolicy="no-referrer" src={scholarship.logoUrl} alt={scholarship.university} className="h-12 w-12 rounded-xl object-cover shrink-0" />
                            )}
                            <div>
                              <h4 className="text-sm font-bold text-white leading-tight">{scholarship.title}</h4>
                              <p className="text-xs text-slate-400 mt-1">{scholarship.amount} • {scholarship.level}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {scholarship.tags.slice(0,2).map((tag, idx) => (
                                  <span key={idx} className="text-[9px] bg-white/10 text-slate-300 px-2 py-0.5 rounded uppercase font-bold">{tag}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No active scholarships listed for this institution currently.</p>
                  )}
                </div>
              </div>

              {/* Right block - Spotlights */}
              <div className="space-y-6">
                {/* Contact Preview */}
                <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-[32px] p-5 shadow-lg space-y-3">
                  <h3 className="font-heading font-bold text-white text-xs">Campus Location</h3>
                  <div className="h-64 rounded-xl overflow-hidden border border-white/10 bg-slate-800 relative">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(currentUni.name + ", " + currentUni.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
