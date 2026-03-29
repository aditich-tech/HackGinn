import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, ThumbsUp, ThumbsDown, Copy, 
  ArrowUpRight, Sparkles, X, Check 
} from 'lucide-react';
import { BRD } from '../../api/api';
import { useNavigate } from 'react-router-dom';

interface IdeaCardProps {
  idea: BRD;
  index: number;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interaction, setInteraction] = useState<'like' | 'dislike' | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(`${idea.title}\n\n${idea.summary}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navigateToDetail = () => {
    // Store selected idea in session for the detail page
    sessionStorage.setItem('selected_idea', JSON.stringify(idea));
    navigate('/idea-detail');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass-card p-6 rounded-[2.5rem] flex flex-col h-full relative group hover:border-accent-primary/50 transition-colors"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-accent-primary">
            <Sparkles size={18} />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleCopy}
              className="p-2 hover:bg-white/10 rounded-lg text-text-muted transition-colors"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3 line-clamp-2 min-h-[3.5rem] leading-tight">
          {idea.title}
        </h3>
        
        <p className="text-text-muted text-sm mb-6 line-clamp-3 flex-1 overflow-hidden">
          {idea.summary}
        </p>

        <div className="space-y-4 pt-4 border-t border-white/5">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold block mb-2">
              Suggested Tech Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {idea.techStack.slice(0, 3).map((tech, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 bg-accent-secondary/10 text-accent-secondary rounded-md border border-accent-secondary/20">
                  {tech}
                </span>
              ))}
              {idea.techStack.length > 3 && (
                <span className="text-[11px] px-2 py-0.5 text-text-muted italic">
                  +{idea.techStack.length - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-secondary py-2 px-3 text-xs w-full"
            >
              <Eye size={14} />
              What It Does
            </button>
            <button 
              onClick={navigateToDetail}
              className="btn-primary py-2 px-3 text-xs w-full whitespace-nowrap"
            >
              I Prefer This
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <button 
                onClick={() => setInteraction('like')}
                className={`p-2 rounded-xl transition-all border ${interaction === 'like' ? 'bg-accent-secondary/20 border-accent-secondary text-accent-secondary' : 'bg-white/5 border-white/5 text-text-muted hover:text-white'}`}
              >
                <ThumbsUp size={16} />
              </button>
              <button 
                onClick={() => setInteraction('dislike')}
                className={`p-2 rounded-xl transition-all border ${interaction === 'dislike' ? 'bg-accent-secondary/20 border-accent-secondary text-accent-secondary' : 'bg-white/5 border-white/5 text-text-muted hover:text-white'}`}
              >
                <ThumbsDown size={16} />
              </button>
            </div>
            
            <button 
              className="text-xs text-text-muted hover:text-accent-primary font-semibold transition-colors flex items-center gap-1 group/btn"
            >
              Similar
              <ArrowUpRight size={12} className="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal - What It Does */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-2xl rounded-[3rem] p-8 md:p-12 relative overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-text-muted hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-accent-primary/20 rounded-2xl flex items-center justify-center text-accent-primary">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{idea.title}</h2>
                  <p className="text-text-muted">The Core Explained</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-3">Problem Statement</h4>
                  <p className="text-lg leading-relaxed">{idea.summary}</p>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-3">Key Solution Features</h4>
                  <ul className="space-y-3">
                    {idea.features.map((feat, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-secondary shrink-0" />
                        <span className="text-text-muted">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="btn-primary px-8"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IdeaCard;
