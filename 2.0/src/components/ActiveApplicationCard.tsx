import React from "react";
import { CheckCircle, Clock, Calendar, ShieldAlert, FileText, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export interface ActiveApplication {
  id: string;
  scholarshipId: string;
  title: string;
  university: string;
  logoUrl: string;
  progress: number; // e.g. 90
  status: "Submitted" | "Under Review" | "Interview Scheduled" | "Accepting Apps" | "Offer Received";
  appliedDate: string;
  deadlineDate?: string;
  documentsUploaded: string[];
  totalDocuments: number;
}

interface ActiveApplicationCardProps {
  app: ActiveApplication;
  onSelect: (id: string) => void;
  onWithdraw: (id: string) => void;
}

export const ActiveApplicationCard: React.FC<ActiveApplicationCardProps> = ({
  app,
  onSelect,
  onWithdraw,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Offer Received":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
            <CheckCircle className="h-3 w-3" />
            <span>Offer Received</span>
          </span>
        );
      case "Interview Scheduled":
        return (
          <span className="inline-flex items-center gap-1 bg-violet-500/20 text-violet-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-violet-500/30">
            <Calendar className="h-3 w-3" />
            <span>Interview Scheduled</span>
          </span>
        );
      case "Under Review":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
            <Clock className="h-3 w-3" />
            <span>Under Review</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-500/30">
            <CheckCircle className="h-3 w-3" />
            <span>Submitted</span>
          </span>
        );
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/5 backdrop-blur-md border border-white/20 rounded-[32px] p-6 shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-shadow flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
              <img src={app.logoUrl} alt={app.university} className="h-4 w-4 md:h-6 md:w-6 object-contain" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{app.university}</h3>
              <h4 className="font-heading font-bold text-white text-sm leading-snug hover:underline cursor-pointer" onClick={() => onSelect(app.scholarshipId)}>
                {app.title}
              </h4>
            </div>
          </div>
          {getStatusBadge(app.status)}
        </div>

        {/* Progress Tracker */}
        <div className="space-y-1.5 mb-5">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span>Application Complete</span>
            <span>{app.progress}%</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${app.progress}%` }}
            />
          </div>
        </div>

        {/* Uploaded Documents Indicator */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <FileText className="h-4 w-4 text-purple-300" />
            <div>
              <p className="font-semibold text-white">Supporting Portfolios</p>
              <p className="text-[10px] text-slate-400 font-medium">
                Uploaded: {app.documentsUploaded.join(", ") || "None"}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-purple-200 bg-purple-500/30 px-2 py-1 rounded-md">
            {app.documentsUploaded.length}/{app.totalDocuments} Docs
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-4">
        <span className="text-[10px] text-slate-400 font-semibold">
          Applied on {app.appliedDate}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onWithdraw(app.id)}
            className="text-[10px] font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 px-2.5 py-1.5 rounded-lg transition-colors border border-transparent hover:border-rose-500/30"
          >
            Withdraw
          </button>
          <button
            onClick={() => onSelect(app.scholarshipId)}
            className="flex items-center gap-0.5 text-xs font-bold text-purple-300 hover:underline hover:translate-x-0.5 transition-transform"
          >
            <span>Review Opportunity</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
