import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, ArrowLeft, Mail, Paperclip, CheckCircle } from 'lucide-react';

interface EmailComposerViewProps {
  schoolName: string;
  onBack: () => void;
}

export const EmailComposerView: React.FC<EmailComposerViewProps> = ({ schoolName, onBack }) => {
  const [subject, setSubject] = useState(`Scholarship Application Inquiry - ${schoolName}`);
  const [message, setMessage] = useState(
    `Dear Admissions Committee at ${schoolName},\n\nI am writing to express my strong interest in applying for the scholarship programs available at your esteemed institution.\n\nI have reviewed the requirements and believe my academic background and extracurricular achievements align well with your values. Please find my credentials attached.\n\nI would appreciate any further details regarding the application process.\n\nThank you for your time and consideration.\n\nSincerely,\n[Your Name]`
  );
  const [isSent, setIsSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // Use mailto link to open default mail client
    const mailtoLink = `mailto:admissions@${schoolName.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onBack();
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Search Results
      </button>

      <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/30">
            <Mail className="h-4 w-4 md:h-6 md:w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white font-heading">Compose Email</h2>
            <p className="text-slate-400 text-sm">Send a direct inquiry to {schoolName}</p>
          </div>
        </div>

        {isSent ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Email Client Opened!</h3>
            <p className="text-slate-400 max-w-sm">
              Your default email application has been opened with your message. Redirecting back...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">To</label>
              <input
                type="text"
                disabled
                value={`admissions@${schoolName.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu`}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-slate-300 text-sm opacity-70"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message</label>
              <textarea
                required
                rows={10}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-bold text-sm"
              >
                <Paperclip className="h-4 w-4" />
                Attach Documents
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-purple-500/20"
              >
                <Send className="h-4 w-4" />
                Open Email Client
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
};
