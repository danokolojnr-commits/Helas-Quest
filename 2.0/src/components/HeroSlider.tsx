import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=1200",
    title: "Discover Your Future",
    desc: "Explore thousands of fully and partially funded scholarships at top universities across the globe. Your academic journey starts here."
  },
  {
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
    title: "Global Opportunities",
    desc: "Connect with international institutions and unlock pathways to study abroad with full financial support."
  },
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
    title: "Empowering Students",
    desc: "We match you with the best programs tailored to your academic excellence and personal goals."
  },
  {
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
    title: "Achieve Your Dreams",
    desc: "Seamlessly apply to multiple scholarships and track your admissions in real-time."
  },
  {
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200",
    title: "Limitless Potential",
    desc: "Take the next step in your education. Gain access to resources that turn aspirations into reality."
  },
  {
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200",
    title: "Inspiring Excellence",
    desc: "Join a network of exceptional scholars and build a foundation for lifelong success."
  }
];

export const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-64 md:h-80 rounded-[32px] overflow-hidden border border-white/20 shadow-lg mb-8 group">
      {SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className={`w-full h-full object-cover transition-transform duration-[5000ms] ease-out ${
              idx === currentSlide ? "scale-105" : "scale-100"
            }`}
            referrerPolicy="no-referrer"
            
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay" />
          
          {idx === currentSlide && (
            <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 max-w-2xl">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight leading-none mb-4"
              >
                {slide.title}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-200 text-sm md:text-base leading-relaxed"
              >
                {slide.desc}
              </motion.p>
            </div>
          )}
        </div>
      ))}

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-4 flex items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors border border-white/10"
        >
          <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors border border-white/10"
        >
          <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 \${idx === currentSlide ? 'w-6 bg-purple-400' : 'w-2 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};
