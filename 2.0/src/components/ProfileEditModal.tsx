import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Camera, User, BookOpen, Calendar, Save, LogOut } from "lucide-react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: { name: string; avatar: string | null; fieldOfStudy: string; graduationYear?: string } | null;
  onSave: (profile: { name: string; avatar: string | null; fieldOfStudy: string; graduationYear?: string }) => void;
  onLogout?: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, userProfile, onSave, onLogout }) => {
  const [name, setName] = useState(userProfile?.name || "");
  const [fieldOfStudy, setFieldOfStudy] = useState(userProfile?.fieldOfStudy || "");
  const [graduationYear, setGraduationYear] = useState(userProfile?.graduationYear || "");
  const [avatar, setAvatar] = useState<string | null>(userProfile?.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      fieldOfStudy,
      graduationYear,
      avatar
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-white/10 shadow-lg rounded-[32px] overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-heading font-bold text-white">Edit Profile</h2>
              <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-400 transition-colors">
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col items-center justify-center mb-6">
                <div 
                  className="relative h-24 w-24 rounded-full bg-black/20 border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-purple-500 transition-colors group"
                >
                  {avatar ? (
                    <img referrerPolicy="no-referrer" src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-6 w-6 md:h-8 md:w-8 text-slate-500 group-hover:text-purple-400 transition-colors" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <Camera className="h-4 w-4 md:h-6 md:w-6 text-white" />
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleAvatarChange}
                  />
                </div>
                <span className="text-xs text-slate-400 mt-3 font-medium">Update Photo</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <input 
                    required 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Field of Study</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <BookOpen className="h-4.5 w-4.5" />
                  </div>
                  <input 
                    required 
                    type="text" 
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="e.g. Computer Science" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Graduation Year</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <input 
                    type="text" 
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="e.g. 2026" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm transition-all" 
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
              >
                <Save className="h-4.5 w-4.5" />
                <span>Save Profile</span>
              </button>
              
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onLogout) onLogout();
                    onClose();
                  }}
                  className="w-full h-12 border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
