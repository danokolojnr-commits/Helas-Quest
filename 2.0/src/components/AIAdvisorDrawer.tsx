import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { MessageSquare, X, Send, Sparkles, User, RefreshCw, AlertCircle } from "lucide-react";
import { ChatMessage } from "../types";
import { USER_AVATAR } from "../data";

export const AIAdvisorDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Hello, Alex! I am your **Hilas Quest AI Advisor**.\n\nI can analyze your credentials, match you with prestigious grants, or review your Statement of Purpose (SOP).\n\nWhat would you like to explore today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [interactionId, setInteractionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Recommend STEM scholarships for GPA 3.8",
    "How do I qualify for Oxford's Clarendon?",
    "Tips for writing a great Personal Essay",
    "Evaluate my Stanford Fellowship match",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setLoading(true);
    setErrorMsg(null);

    // Prepare history to send to server
    const historyPayload = messages.map((m) => ({
      role: m.role,
      text: m.text,
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, previousInteractionId: interactionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to receive feedback from server.");
      }

      const data = await response.json();
      
      if (data.interactionId) {
        setInteractionId(data.interactionId);
      }
      
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        text: data.text || "I was unable to formulate a response.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error("AI Advisor call failed:", err);
      setErrorMsg("Unable to contact AI Advisor. Reconnecting using local assistant.");
      // Fallback response locally
      setTimeout(() => {
        const localReplyText = getLocalFallbackReply(text);
        setMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            role: "model",
            text: localReplyText,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setLoading(false);
      }, 1000);
      return;
    } finally {
      setLoading(false);
    }
  };

  const getLocalFallbackReply = (text: string) => {
    const q = text.toLowerCase();
    if (q.includes("gpa") || q.includes("grade") || q.includes("eligible")) {
      return `### Academic Profile Matcher\n\nHere are standard parameters for Hilas Quest scholarships:\n- **Global Tech Excellence Scholarship:** Min GPA 3.8/4.0. STEM-specific.\n- **Global Leaders Fellowship (Stanford):** Min GPA 3.7/4.0. Strong leadership background.\n- **DAAD Excellence (Germany):** Min GPA 3.5/4.0. Open to international STEM students.\n\n*Would you like me to help draft a checklist for one of these?*`;
    }
    if (q.includes("stanford") || q.includes("california")) {
      return `### Stanford University Spotlight\n\nStanford is ranked **#2 National Ranking** with a **94% graduation rate**.\n\nKey Opportunities:\n1. **Global Leaders Fellowship** ($85,000 full tuition + stipend)\n2. **Stanford Fund Scholarship** ($15,000/yr undergraduate award)\n3. **Knight-Hennessy Scholars** (Full tuition graduate fellowship)\n\nYou can explore these and apply directly in our portal under the **Universities > Stanford** tab!`;
    }
    if (q.includes("essay") || q.includes("sop") || q.includes("statement of purpose")) {
      return `### Statement of Purpose (SOP) Tips\n\nA great SOP for competitive scholarships should contain:\n1. **The Hook:** A vivid personal anecdote introducing your academic passion.\n2. **Academic Alignment:** Direct correlation between your past research and your target degree.\n3. **Vision of Impact:** How this funding enables you to give back and lead.\n\n*If you paste a draft, I can review its structure and tone for you!*`;
    }
    return `Hello! I am your **Hilas Quest AI Advisor**. How can I help you today?\n\nI can:\n- **Evaluate your profile** for specific scholarship matches.\n- Provide insights on top universities like **Stanford**, **Oxford**, or **MIT**.\n- Review your **Statement of Purpose** or guide your document preparation.\n- Help you plan your application timeline.`;
  };

  // Helper to safely format simple markdown (bold text & newlines) without heavy dependencies
  const formatMarkdown = (txt: string) => {
    return txt.split("\n").map((line, i) => {
      let formatted = line;
      // Handle bold **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      formatted = formatted.replace(boldRegex, "<strong>$1</strong>");

      // Handle bullet lists
      if (formatted.startsWith("- ") || formatted.startsWith("* ")) {
        return (
          <li
            key={i}
            className="ml-4 list-disc text-xs text-slate-200 leading-relaxed mb-1"
            dangerouslySetInnerHTML={{ __html: formatted.substring(2) }}
          />
        );
      }

      // Handle simple list headings with numbering
      if (/^\d+\.\s/.test(formatted)) {
        return (
          <p
            key={i}
            className="text-xs font-semibold text-white mt-2 mb-1"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      }

      // Handle section titles starting with ###
      if (formatted.startsWith("### ")) {
        return (
          <h4
            key={i}
            className="text-sm font-bold text-white mt-3 mb-1 pb-1 border-b border-white/10"
            dangerouslySetInnerHTML={{ __html: formatted.substring(4) }}
          />
        );
      }

      return (
        <p
          key={i}
          className="text-xs text-slate-300 leading-relaxed mb-2"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.div 
        drag 
        dragMomentum={false}
        className={`fixed z-50 cursor-grab active:cursor-grabbing ${isOpen ? 'opacity-0 pointer-events-none' : 'bottom-6 right-6 md:bottom-8 md:right-8'}`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-0 md:gap-2.5 w-12 h-12 md:w-auto md:h-auto md:px-4.5 md:py-3.5 bg-purple-600 text-white hover:bg-purple-500 rounded-full md:rounded-2xl shadow-2xl md:shadow-xl hover:shadow-lg transition-colors group border border-purple-400 touch-none"
        >
          <div className="relative">
            <MessageSquare className="h-5 w-5 text-white md:group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 md:h-2 md:w-2 bg-white rounded-full animate-ping" />
          </div>
          <span className="hidden md:inline text-xs font-bold font-heading tracking-wide whitespace-nowrap">Hilas Quest AI Advisor</span>
        </button>
      </motion.div>

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          <div className="w-[calc(100vw-3rem)] md:w-[380px] h-[60vh] md:h-[550px] max-h-[700px] bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl flex flex-col justify-between shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-black/20 text-white p-4.5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="bg-purple-500 p-1.5 rounded-lg text-white flex items-center justify-center">
                <Sparkles className="h-4 w-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs font-bold font-heading tracking-wide">Hilas Quest AI Advisor</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-semibold text-slate-300">Powered by Gemini</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Warning state */}
          {errorMsg && (
            <div className="bg-amber-500/20 border-b border-amber-500/30 p-2 text-[10px] text-amber-200 flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Conversation stream */}
          <div className="flex-1 overflow-y-auto p-4.5 bg-transparent space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 border ${
                      isUser ? "bg-white/10 border-white/20" : "bg-purple-500 border-purple-400"
                    }`}
                  >
                    {isUser ? (
                      <img src={USER_AVATAR} className="h-full w-full rounded-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    )}
                  </div>
                  <div className="max-w-[75%] space-y-1">
                    <div
                      className={`p-3 rounded-2xl text-xs border ${
                        isUser
                          ? "bg-purple-500/20 text-white border-purple-500/30 rounded-tr-none"
                          : "bg-white/10 text-white border-white/20 rounded-tl-none shadow-sm"
                      }`}
                    >
                      {formatMarkdown(msg.text)}
                    </div>
                    <span className="text-[8px] text-slate-400 font-medium block text-right px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2.5">
                <div className="h-7 w-7 rounded-full bg-purple-500 flex items-center justify-center shrink-0 border border-purple-400">
                  <Sparkles className="h-3.5 w-3.5 text-white animate-spin" />
                </div>
                <div className="bg-white/10 border border-white/20 text-slate-300 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5 text-slate-400 animate-spin" />
                  <span className="text-[11px] font-semibold italic">Advisor is analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompt suggestions (shown if short history) */}
          {messages.length < 3 && !loading && (
            <div className="px-4.5 py-2.5 bg-transparent border-t border-white/10">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Suggested Prompts</p>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-[10px] bg-white/5 border border-white/10 hover:bg-white/20 hover:border-white/30 text-slate-300 hover:text-white px-2 py-1 rounded-lg transition-all text-left font-medium"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input tray */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            className="p-3 border-t border-white/10 bg-black/20 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              disabled={loading}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about profile, essays, requirements..."
              className="flex-1 text-xs px-3 py-2 border border-white/20 bg-white/5 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || loading}
              className="h-8.5 w-8.5 bg-white text-slate-900 hover:bg-slate-200 disabled:bg-white/10 disabled:text-slate-500 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
        </div>
      )}
    </>
  );
};
