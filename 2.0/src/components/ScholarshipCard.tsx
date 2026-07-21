import React from "react";
import { Bookmark, MapPin, DollarSign, Calendar, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Scholarship } from "../types";

interface ScholarshipCardProps {
  scholarship: Scholarship;
  isBookmarked: boolean;
  onBookmarkToggle: (id: string, e: React.MouseEvent) => void;
  onSelect: (id: string) => void;
  onUniversitySelect: (uniId: string, e: React.MouseEvent) => void;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  isBookmarked,
  onBookmarkToggle,
  onSelect,
  onUniversitySelect,
}) => {
  // Extract university id matching slug
  const uniId = scholarship.university.toLowerCase().includes("stanford")
    ? "stanford"
    : scholarship.university.toLowerCase().includes("oxford")
    ? "oxford"
    : "stanford";

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Actively Reviewing":
        return "bg-indigo-500/20 text-indigo-200 border-indigo-500/30";
      case "Due Soon":
        return "bg-amber-500/20 text-amber-200 border-amber-500/30 animate-pulse";
      case "Closed":
        return "bg-red-500/20 text-red-200 border-red-500/30";
      case "Open":
      case "Accepting Apps":
        return "bg-emerald-500/20 text-emerald-200 border-emerald-500/30";
      default:
        return "bg-white/10 text-slate-300 border-white/20";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
      transition={{ duration: 0.4 }}
      onClick={() => onSelect(scholarship.id)}
      className="bg-white/5 backdrop-blur-md border border-white/20 rounded-[32px] p-6 flex flex-col justify-between cursor-pointer group relative overflow-hidden shadow-lg"
    >
      <div>
        {/* Card Header (Logo and Bookmark) */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            
            <div>
              <span
                onClick={(e) => onUniversitySelect(uniId, e)}
                className="text-xs font-bold text-white hover:underline cursor-pointer flex items-center gap-1"
              >
                {scholarship.university}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-slate-300 font-medium">
                <MapPin className="h-3 w-3" />
                <span>{scholarship.country}</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => onBookmarkToggle(scholarship.id, e)}
            className="h-6 w-6 md:h-8 md:w-8 rounded-lg border border-white/20 flex items-center justify-center text-slate-300 hover:text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/30 transition-all"
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-purple-400 text-purple-400" : ""}`} />
          </button>
        </div>

        {/* Title and description */}
        <h3 className="font-heading font-bold text-white group-hover:text-purple-300 text-sm leading-snug mb-2 group-hover:underline">
          {scholarship.title}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
          {scholarship.summary}
        </p>
      </div>

      <div>
        {/* Pricing / Details Row */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Award Amount</span>
            <div className="flex items-center text-sm font-bold text-white gap-0.5">
              <DollarSign className="h-3.5 w-3.5 text-purple-400" />
              <span>{scholarship.amount}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Degree Target</span>
            <span className="text-xs font-semibold text-slate-200">{scholarship.level}</span>
          </div>
        </div>

        {/* Footer badges and CTA */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
          <div className="flex flex-wrap gap-1.5 max-w-[70%]">
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${getStatusStyle(scholarship.status)}`}>
              {scholarship.status}
            </span>
            {scholarship.isFullFunding && (
              <span className="text-[9px] font-bold bg-purple-500/20 text-purple-200 border border-purple-500/30 px-2 py-0.5 rounded-md">
                100% Fund
              </span>
            )}
          </div>

          <span className="text-xs font-bold text-white flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
            <span>Details</span>
            <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};
