import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Crown, Sparkles, CheckCircle2, 
  Code2, Layout, Database, Cpu, X,
  ChevronRight, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BRD } from '../../api/api';

const IdeaDetailPage = () => {
  const navigate = useNavigate();
  const [selectedIdea] = useState<BRD | null>(() => {
    const stored = sessionStorage.getItem('selected_idea');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  if (!selectedIdea) {
    navigate('/ideas');
    return null;
  }

  const techBreakdown = [
    { icon: <Layout className="text-blue-400" size={20} />, title: 'Frontend Architecture', lines: ['React / Next.js SPA', 'Tailwind CSS for Prismatic UI', 'Framer Motion for spatial interactions'] },
    { icon: <Database className="text-purple-400" size={20} />, title: 'Backend & Data', lines: ['Spring Boot REST API', 'PostgreSQL for data persistence', 'Firebase Auth for security'] },
    { icon: <Cpu className="text-orange-400" size={20} />, title: 'AI Implementation', lines: ['Groq / Llama 3 API integration', 'Prompt engineering for blueprinting', 'Vector embeddings for similarity'] },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden selection:bg-accent-primary/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-5%] w-[50%] h-[50%] bg-accent-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[0%] right-[-5%] w-[40%] h-[40%] bg-accent-secondary/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Navigation */}
        <button 
          onClick={() => navigate('/ideas')}
          className="group flex items-center gap-3 text-text-muted hover:text-white transition-all text-sm font-semibold uppercase tracking-widest mb-16"
        >
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all group-hover:bg-white/5">
            <ArrowLeft size={20} />
          </div>
          Return to Idea Cards
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Idea Main Info */}
          <div className="lg:col-span-7 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles size={14} />
                Selected Concept
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">
                {selectedIdea.title}
              </h1>
              <p className="text-xl text-text-muted leading-relaxed">
                {selectedIdea.summary}
              </p>
            </motion.div>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-10 rounded-[3rem] border-white/10"
            >
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <CheckCircle2 className="text-accent-secondary" />
                Uniqueness & Competitive Edge
              </h3>
              <ul className="space-y-6">
                {selectedIdea.targetAudience.slice(0, 4).map((point, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="mt-1.5 w-6 h-6 rounded-full bg-accent-secondary/10 border border-accent-secondary/20 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary" />
                    </div>
                    <span className="text-lg text-text-muted">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>

          {/* Right Side: Tech Stack & Tools */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8 rounded-[3rem] border-white/10 bg-gradient-to-br from-surface/20 to-surface/40"
            >
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <Code2 className="text-accent-primary" />
                Tech Stack Breakdown
              </h3>
              
              <div className="space-y-8">
                {techBreakdown.map((sec, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-xl border border-white/10">{sec.icon}</div>
                      <h4 className="font-bold text-sm tracking-widest uppercase text-white/80">{sec.title}</h4>
                    </div>
                    <div className="pl-12 space-y-1.5">
                      {sec.lines.map((ln, idx) => (
                        <div key={idx} className="text-sm text-text-muted flex items-center gap-2">
                           <ChevronRight size={12} className="text-accent-primary/50" />
                           {ln}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-8 rounded-[3rem] bg-gradient-to-r from-accent-primary to-accent-secondary relative overflow-hidden group cursor-pointer"
              onClick={() => setIsPremiumModalOpen(true)}
            >
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
                <Crown size={80} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">Elevate Your Pitch</h3>
                <p className="text-white/80 text-sm mb-6 max-w-[200px]">Unlock workflow, architecture, and market analysis</p>
                <div className="bg-white text-accent-primary font-bold px-6 py-3 rounded-2xl inline-flex items-center gap-2 group-hover:px-8 transition-all">
                  Get More Info
                  <Crown size={18} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 flex justify-center pb-20">
          <button 
            onClick={() => setIsPremiumModalOpen(true)}
            className="btn-primary px-12 py-5 text-xl flex items-center gap-4 group"
          >
            Generate Full Blueprint
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Premium Modal */}
      <AnimatePresence>
        {isPremiumModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl">
             <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-4xl rounded-[3rem] p-12 relative overflow-hidden"
            >
              <button 
                onClick={() => setIsPremiumModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-text-muted hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="w-16 h-16 bg-accent-primary/20 rounded-2xl flex items-center justify-center text-accent-primary mb-8 animate-bounce">
                    <Crown size={32} />
                  </div>
                  <h2 className="text-4xl font-black mb-6">Go Beyond Ideas</h2>
                  <p className="text-lg text-text-muted mb-8 leading-relaxed">
                    The premium blueprint gives you everything you need to start building and winning immediately.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      'Full Workflow & Logic',
                      'Detailed Architecture Diagrams',
                      'Technical Feature Implementation',
                      'Ready-to-use Pitch Deck Outline',
                      'Market Competitive Analysis'
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle2 className="text-green-500" size={14} />
                        </div>
                        <span className="text-sm font-semibold">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-8 rounded-[2.5rem] bg-white/5 border-white/10 text-center">
                   <h4 className="text-text-muted uppercase tracking-widest text-xs font-bold mb-4">Select Plan</h4>
                   <div className="text-5xl font-black mb-2">$0<span className="text-xl text-text-muted">/hack</span></div>
                   <p className="text-text-muted text-sm mb-8 italic">Free for first 3 generations</p>
                   
                   <button className="btn-primary w-full py-4 rounded-2xl text-lg font-bold">
                     Upgrade To Premium 👑
                   </button>
                   
                   <p className="mt-6 text-xs text-text-muted">No credit card required for trial</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IdeaDetailPage;
