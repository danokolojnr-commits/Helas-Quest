import React, { useState, useRef } from "react";
import { GraduationCap, Mail, Lock, User, ArrowRight, Sparkles, ChevronRight, Camera, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { auth, googleProvider, signInWithGoogle } from "../lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { playClickSound, playSwipeSound } from "../lib/audio";

interface AuthPageProps {
  onSuccess: (user: { name: string; avatar: string | null; fieldOfStudy: string }) => void;
}

const SLIDES = [
  {
    title: "Discover Top Scholarships",
    desc: "Find fully-funded opportunities at prestigious universities globally.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "AI-Powered Matching",
    desc: "Our AI Advisor evaluates your profile and finds the perfect grants for you.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "Track Applications",
    desc: "Manage your deadlines, essays, and required documents all in one place.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200"
  }
];

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'onboarding' | 'auth'>('onboarding');
  const [slide, setSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      playSwipeSound();
      handleNextSlide();
    }
    if (isRightSwipe && slide > 0) {
      playSwipeSound();
      setSlide(s => s - 1);
    }
  }

  const handleNextSlide = () => {
    
    if (slide < SLIDES.length - 1) {
      setSlide(s => s + 1);
    } else {
      setStep('auth');
    }
  };

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

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      if (isLogin) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        onSuccess({
          name: userCred.user.displayName || email.split("@")[0],
          avatar: userCred.user.photoURL || avatar,
          fieldOfStudy: fieldOfStudy || "Undeclared"
        });
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, {
          displayName: name,
          photoURL: avatar
        });
        onSuccess({
          name: name || "New Scholar",
          avatar: avatar,
          fieldOfStudy: fieldOfStudy || "Undeclared"
        });
      }
    } catch (err: any) {
      // Intentionally not logging to console to avoid AI Studio intercept
      if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg("Email/Password sign-in is not enabled. Please enable it in your Firebase Console under Authentication > Sign-in method.");
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg("Please enter a valid email address.");
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg("Password is too weak. Please use at least 6 characters.");
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg("This email is already in use. Please sign in instead.");
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg("Invalid email or password.");
      } else {
        setErrorMsg(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    
    try {
      const user = await signInWithGoogle();
      onSuccess({
        name: user.displayName || user.email?.split("@")[0] || "User",
        avatar: user.photoURL || avatar,
        fieldOfStudy: "Undeclared"
      });
    } catch (err: any) {
      // Intentionally not logging to console to avoid AI Studio intercept
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
        setErrorMsg("Google Sign-In popup was blocked by your browser because this app is running in a preview window. Please click the 'Open in New Tab' button at the top right to sign in.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg("Google Sign-In is not enabled. Please enable it in your Firebase Console under Authentication > Sign-in method.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setErrorMsg("This domain is not authorized for OAuth operations. Please add this app's URL to your Firebase Console under Authentication > Settings > Authorized domains.");
      } else {
        setErrorMsg(err.message);
      }
    }
  };

  const handleGuestSignIn = () => {
    
    onSuccess({
      name: "Guest Student",
      avatar: null,
      fieldOfStudy: "Computer Science"
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center relative overflow-hidden p-4">
      {/* Ambient Background Elements */}
      <motion.div 
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0) 60%)', willChange: 'transform, opacity' }}
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0) 60%)', willChange: 'transform, opacity' }}
      />
      <motion.div 
        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0) 60%)', willChange: 'transform, opacity' }}
      />

      <AnimatePresence mode="wait">
        {step === 'onboarding' ? (
          <motion.div 
            key="onboarding"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-lg relative z-10"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] overflow-hidden shadow-lg">
              <div className="relative h-64 w-full bg-[#0f172a]">
                {SLIDES.map((s, idx) => (
                  <img
                    key={idx}
                    src={s.image}
                    alt={s.title}
                    referrerPolicy="no-referrer"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                      slide === idx ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent" />
              </div>
              
              <div className="p-8 pt-0 -mt-8 relative z-10 text-center">
                <div className="inline-flex bg-gradient-to-tr from-purple-500 to-blue-500 text-white p-3 rounded-2xl shadow-lg shadow-purple-500/20 mb-6">
                  <GraduationCap className="h-6 w-6 md:h-8 md:w-8 stroke-[2]" />
                </div>
                
                <h2 className="text-2xl font-heading font-bold text-white mb-3">
                  {SLIDES[slide].title}
                </h2>
                <p className="text-slate-400 mb-8 min-h-[48px]">
                  {SLIDES[slide].desc}
                </p>

                <div className="flex justify-center gap-2 mb-8">
                  {SLIDES.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-purple-500' : 'w-2 bg-white/20'}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextSlide}
                  className="w-full h-14 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <span>{slide === SLIDES.length - 1 ? "Get Started" : "Next"}</span>
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="auth"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg relative z-10"
          >
            <div className="text-center mb-8">
              <div className="inline-flex bg-gradient-to-tr from-purple-500 to-blue-500 text-white p-3 rounded-2xl shadow-lg shadow-purple-500/20 mb-4">
                <GraduationCap className="h-6 w-6 md:h-8 md:w-8 stroke-[2]" />
              </div>
              <h1 className="text-3xl font-heading font-bold text-white mb-2">Hilas Quest</h1>
              <p className="text-slate-400">Your AI-powered scholarship hub</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {isLogin ? "Welcome back" : "Create an account"}
              </h2>
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-sm text-center">
                  {errorMsg}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="flex flex-col items-center justify-center mb-6">
                      <div className="relative h-20 w-20 rounded-full bg-black/20 border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-purple-500 transition-colors group">
                        {avatar ? (
                          <img src={avatar} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-6 w-6 md:h-8 md:w-8 text-slate-500 group-hover:text-purple-400 transition-colors" />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <Camera className="h-4 w-4 md:h-5 md:w-5 text-white" />
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={handleAvatarChange}
                        />
                      </div>
                      <span className="text-xs text-slate-400 mt-2">Profile Picture (Optional)</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                          <User className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <input 
                          required 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alex Rivera" 
                          className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Field of Study</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                          <BookOpen className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <input 
                          required 
                          type="text" 
                          value={fieldOfStudy}
                          onChange={(e) => setFieldOfStudy(e.target.value)}
                          placeholder="e.g. Computer Science" 
                          className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" 
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <Mail className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <input 
                      required 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com" 
                      className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <Lock className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <input 
                      required 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" 
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 mt-6 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 md:h-5 md:w-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? "Sign In" : "Sign Up"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full h-12 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  className="w-full h-12 mt-4 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  <span>Continue as Guest</span>
                </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    
                    setIsLogin(!isLogin);
                  }}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
            
            <div className="mt-8 text-center flex items-center justify-center gap-2 text-slate-500 text-xs">
              <Sparkles className="h-3 w-3" />
              <span>Powered by Hilas Quest AI</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
