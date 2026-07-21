import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, GraduationCap, Building, Search, BookOpen, AlertCircle, Calculator, CheckCircle2 } from "lucide-react";
import { playClickSound } from "../lib/audio";

interface MyApplicationsViewProps {
  onEmailSchool?: (schoolName: string) => void;
  bookmarks: string[];
  userProfile: any;
  applications: any[];
  onApply: (scholarshipId: string, details: any) => void;
}

export const MyApplicationsView: React.FC<MyApplicationsViewProps> = ({ userProfile , onEmailSchool}) => {
  const [applicantType, setApplicantType] = useState<"high_school" | "transfer">("high_school");
  const [jambScore, setJambScore] = useState("");
  const [waecGrades, setWaecGrades] = useState({ math: "A1", english: "B2", subject3: "B3", subject4: "C4", subject5: "A1" });
  const [necoGrades, setNecoGrades] = useState({ math: "A1", english: "B2", subject3: "B3", subject4: "C4", subject5: "A1" });
  const [currentUni, setCurrentUni] = useState("");
  const [currentLevel, setCurrentLevel] = useState("100 Level");
  const [currentCourse, setCurrentCourse] = useState("");
  const [currentCgpa, setCurrentCgpa] = useState("");
  const [activeTab, setActiveTab] = useState("Target");
      const [country, setCountry] = useState("Nigeria");
  const [isAssessing, setIsAssessing] = useState(false);
  const [course, setCourse] = useState("Computer Science");
      const [schools, setSchools] = useState<any[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);

  // Fetch real schools from open source API
  
  const getSubjectLabel = (subj: string) => {
    if (subj === 'math') return 'Mathematics';
    if (subj === 'english') return 'English';
    if (course === 'Computer Science' || course === 'Medicine' || course === 'Engineering') {
      if (subj === 'subject3') return 'Physics';
      if (subj === 'subject4') return 'Chemistry';
      if (subj === 'subject5') return course === 'Medicine' ? 'Biology' : 'Computer/Bio';
    } else if (course === 'Law' || course === 'Arts') {
      if (subj === 'subject3') return 'Literature';
      if (subj === 'subject4') return 'Government';
      if (subj === 'subject5') return 'CRK/IRK';
    } else {
      if (subj === 'subject3') return 'Economics';
      if (subj === 'subject4') return 'Commerce';
      if (subj === 'subject5') return 'Accounting';
    }
    return subj;
  };

  const fetchSchools = async (searchCountry: string) => {
    setLoadingSchools(true);
    try {
      const res = await fetch(`/world_universities_and_domains.json`);
      const data = await res.json();
      
      // Filter by country client-side
      const filtered = data.filter((school: any) => 
        school.country && school.country.toLowerCase() === searchCountry.toLowerCase()
      );
      
      // Only keep top 50 to avoid massive rendering
      setSchools(filtered.slice(0, 50));
    } catch (err) {
      console.error("Error fetching schools", err);
    }
    setLoadingSchools(false);
  };

  const handleAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsAssessing(true);
    fetchSchools(country);
  };

  const calculateEligibility = (schoolName: string) => {
    const score = parseInt(jambScore) || 0;
    // Simple mock logic based on score
    if (score >= 250) return { status: "High Chance", color: "text-emerald-400 border-emerald-400/20 bg-emerald-400/10" };
    if (score >= 200) return { status: "Good Chance", color: "text-blue-400 border-blue-400/20 bg-blue-400/10" };
    if (score >= 160) return { status: "Fair Chance", color: "text-amber-400 border-amber-400/20 bg-amber-400/10" };
    return { status: "Low Chance", color: "text-rose-400 border-rose-400/20 bg-rose-400/10" };
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto h-full flex flex-col pb-12">
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-3xl font-heading font-extrabold text-white tracking-tight">Eligibility Assessment</h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Enter your WAEC, NECO, and JAMB scores to discover which universities and scholarships you qualify for in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-[32px] p-6 shadow-lg">
            <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2 mb-6">
              <Calculator className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
              Academic Results
            </h3>
            
            <form onSubmit={handleAssessment} className="space-y-4">
              {/* Applicant Type Selection */}
              <div className="flex bg-black/20 p-1 rounded-xl mb-4 border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setApplicantType("high_school");
                    if (activeTab === "Transfer") setActiveTab("Target");
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${applicantType === "high_school" ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  High School Leaver
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setApplicantType("transfer");
                    if (["WAEC", "NECO", "JAMB"].includes(activeTab)) setActiveTab("Target");
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${applicantType === "transfer" ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  University Transfer
                </button>
              </div>

              {/* Tabs */}
              <div className="flex bg-white/5 rounded-xl p-1 overflow-x-auto custom-scrollbar border border-white/10 mb-4">
                {(applicantType === "high_school" ? ["Target", "WAEC", "NECO", "JAMB"] : ["Target", "Transfer"]).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      
                      setActiveTab(tab);
                    }}
                    className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "Target" && (
                  <motion.div key="target" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Country / Region</label>
                      <select 
                        value={country} 
                        onChange={e => setCountry(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                      >
                        <option value="Nigeria">Nigeria</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Ghana">Ghana</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Course of Study</label>
                      <select 
                        value={course} 
                        onChange={e => setCourse(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Medicine">Medicine & Surgery</option>
                        <option value="Law">Law</option>
                        <option value="Business">Business Administration</option>
                        <option value="Arts">Arts & Humanities</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {activeTab === "WAEC" && (
                  <motion.div key="waec" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Core WAEC Grades</label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.keys(waecGrades).map((subj, idx) => (
                        <div key={idx} className="space-y-1">
                          <span className="text-[9px] text-slate-500 uppercase font-bold">{getSubjectLabel(subj)}</span>
                          <select 
                            value={waecGrades[subj as keyof typeof waecGrades]} 
                            onChange={e => setWaecGrades({...waecGrades, [subj]: e.target.value})}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-2 text-white focus:outline-none focus:border-purple-500 text-xs"
                          >
                            {["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"].map(g => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "NECO" && (
                  <motion.div key="neco" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Core NECO Grades</label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.keys(necoGrades).map((subj, idx) => (
                        <div key={idx} className="space-y-1">
                          <span className="text-[9px] text-slate-500 uppercase font-bold">{getSubjectLabel(subj)}</span>
                          <select 
                            value={necoGrades[subj as keyof typeof necoGrades]} 
                            onChange={e => setNecoGrades({...necoGrades, [subj]: e.target.value})}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-2 text-white focus:outline-none focus:border-purple-500 text-xs"
                          >
                            {["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"].map(g => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "JAMB" && (
                  <motion.div key="jamb" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                        <span>JAMB Score</span>
                        <span className="text-purple-400">{jambScore || 0} / 400</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" max="400" 
                        value={jambScore || 0}
                        onChange={e => setJambScore(e.target.value)}
                        className="w-full accent-purple-500"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                        <span>0</span>
                        <span>200</span>
                        <span>400</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 pt-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload Result Slip (Optional)</label>
                      <label className="relative w-full border-2 border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center bg-black/20 hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="h-6 w-6 md:h-8 md:w-8 bg-white/10 rounded-full flex items-center justify-center text-slate-400 group-hover:text-purple-400 mb-2 transition-colors pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        </div>
                        <p className="text-[9px] text-slate-500 text-center mt-1 pointer-events-none">WAEC/NECO/JAMB Slip</p>
                        <input type="file" accept="image/*,application/pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      </label>
                    </div>
                  </motion.div>
                )}

                {activeTab === "Transfer" && (
                  <motion.div key="transfer" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current University (Nigeria)</label>
                      <input 
                        type="text"
                        value={currentUni}
                        onChange={e => setCurrentUni(e.target.value)}
                        placeholder="e.g. University of Lagos"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-500"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Course / Major</label>
                      <input 
                        type="text"
                        value={currentCourse}
                        onChange={e => setCurrentCourse(e.target.value)}
                        placeholder="e.g. Computer Science"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Level / Year</label>
                        <select 
                          value={currentLevel}
                          onChange={e => setCurrentLevel(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                        >
                          <option value="100 Level">100 Level</option>
                          <option value="200 Level">200 Level</option>
                          <option value="300 Level">300 Level</option>
                          <option value="400 Level">400 Level</option>
                          <option value="500 Level">500 Level</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current CGPA</label>
                        <input 
                          type="number"
                          step="0.01"
                          min="0"
                          max="5.0"
                          value={currentCgpa}
                          onChange={e => setCurrentCgpa(e.target.value)}
                          placeholder="e.g. 4.5"
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 pt-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload Transcript / Result (Optional)</label>
                      <label className="relative w-full border-2 border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center bg-black/20 hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="h-6 w-6 md:h-8 md:w-8 bg-white/10 rounded-full flex items-center justify-center text-slate-400 group-hover:text-purple-400 mb-2 transition-colors pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        </div>
                        <p className="text-[9px] text-slate-500 text-center mt-1 pointer-events-none">University Transcript</p>
                        <input type="file" accept="image/*,application/pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-8 flex gap-3">
                {activeTab !== "JAMB" && activeTab !== "Transfer" && (
                  <button 
                    type="button"
                    onClick={() => {
                      const tabs = applicantType === "high_school" ? ["Target", "WAEC", "NECO", "JAMB"] : ["Target", "Transfer"];
                      if (tabs.includes(activeTab)) {
                        setActiveTab(tabs[tabs.indexOf(activeTab) + 1]);
                      }
                    }}
                    className="w-full h-12 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center justify-center"
                  >
                    Next Step
                  </button>
                )}
                {(activeTab === "JAMB" || activeTab === "Transfer") && (
                  <button 
                    type="submit" 
                    className="w-full h-12 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                  >
                    <Search className="h-4.5 w-4.5" />
                    <span>Find Schools</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {isAssessing ? (
            <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-[32px] p-6 shadow-lg min-h-[500px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
                  Matched Universities in {country}
                </h3>
                <div className="flex gap-2">
                  {currentUni && (
                    <div className="text-xs font-medium text-slate-400 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10 hidden md:block">
                      {currentUni} <span className="text-white font-bold">({currentLevel})</span>
                    </div>
                  )}
                  {currentCgpa && (
                    <div className="text-xs font-medium text-slate-400 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                      CGPA: <span className="text-white font-bold">{currentCgpa}</span>
                    </div>
                  )}
                  {!currentCgpa && jambScore && (
                    <div className="text-xs font-medium text-slate-400 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                      JAMB: <span className="text-white font-bold">{jambScore}</span>
                    </div>
                  )}
                </div>
              </div>

              {loadingSchools ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <div className="h-6 w-6 md:h-8 md:w-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  <p className="text-sm text-slate-400 font-medium tracking-wide animate-pulse">Scanning live university databases...</p>
                </div>
              ) : schools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px] overflow-y-auto custom-scrollbar pr-2">
                  {schools.map((school, i) => {
                    const eligibility = calculateEligibility(school.name);
                    return (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10px" }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="bg-white/5 border border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 flex flex-col justify-between group"
                      >
                        <div>
                          <h4 className="font-bold text-white text-sm leading-tight mb-1">{school.name}</h4>
                          {school.web_pages && school.web_pages[0] && (
                            <a href={school.web_pages[0]} target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-400 hover:text-purple-300 transition-colors block mb-4 truncate">
                              {school.web_pages[0]}
                            </a>
                          )}
                        </div>
                        
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${eligibility.color}`}>
                              {eligibility.status}
                            </span>
                            <span className="text-[10px] text-purple-300 font-medium bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                              {Math.floor(Math.random() * 5) + 1} Scholarships Available
                            </span>
                          </div>
                          
                          <div className="flex gap-2">
                            <a 
                              href={school.web_pages && school.web_pages[0] ? school.web_pages[0] : '#'} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              Visit Uni
                            </a>
                            <button 
                              onClick={() => {
                                
                                if (onEmailSchool) onEmailSchool(school.name);
                                else alert(`Applying to ${school.name}`);
                              }}
                              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                            >
                              Apply Now
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
                  <AlertCircle className="h-8 w-8 md:h-10 md:w-10 text-slate-500" />
                  <div>
                    <p className="text-white font-bold">No schools found</p>
                    <p className="text-sm text-slate-400 mt-1">Try selecting a different country.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-md border border-white/20 border-dashed rounded-[32px] p-8 shadow-lg flex flex-col items-center justify-center h-full text-center space-y-4 min-h-[500px]">
              <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mb-2">
                <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8 text-slate-500" />
              </div>
              <h3 className="font-heading font-bold text-white text-xl">Ready for Assessment</h3>
              <p className="text-slate-400 text-sm max-w-md">
                Enter your academic records on the left to securely match with available universities and track live admission opportunities based on your credentials.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
