import React, { useState } from "react";
import { Scholarship } from "../types";
import { Sparkles, Trash2, Plus, RefreshCw, AlertCircle } from "lucide-react";

interface AdminDashboardProps {
  scholarships: Scholarship[];
  setScholarships: React.Dispatch<React.SetStateAction<Scholarship[]>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ scholarships, setScholarships }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(3);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/generate-scholarships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topic || "General", count }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate scholarships");
      }
      
      if (data.scholarships && Array.isArray(data.scholarships)) {
        // Ensure unique IDs
        const newScholarships = data.scholarships.map((s: any) => ({
          ...s,
          id: `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));
        setScholarships(prev => [...newScholarships, ...prev]);
        setTopic("");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    setScholarships(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-[32px] p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
            <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-white">AI Scholarship Finder</h2>
            <p className="text-xs text-slate-300">Automatically discover and add real-world free scholarships to your platform.</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-200 p-4 rounded-xl flex items-center gap-2 mb-6">
            <AlertCircle className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Topic / Field (Optional)</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Computer Science in Canada"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div className="w-full md:w-32 space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Count</label>
            <input
              type="number"
              min="1"
              max="5"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full md:w-auto h-12 px-6 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span>{isGenerating ? "Finding..." : "Find Free Scholarships"}</span>
          </button>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-[32px] p-8 shadow-lg">
        <h3 className="text-lg font-heading font-bold text-white mb-6">Manage Existing Scholarships ({scholarships.length})</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Scholarship Name</th>
                <th className="pb-3 font-semibold">University/Org</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {scholarships.map((s) => (
                <tr key={s.id} className="text-sm text-slate-200">
                  <td className="py-4 font-medium text-white">{s.title}</td>
                  <td className="py-4">{s.university}</td>
                  <td className="py-4 text-emerald-400 font-semibold">{s.amount}</td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => handleDelete(s.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {scholarships.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              No scholarships found. Use the AI Finder above to add some!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
