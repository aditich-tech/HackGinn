import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Sparkles, Send, 
  Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IdeaCard from '../../components/ideas/IdeaCard';
import { BRD, generateIdea } from '../../api/api';

const IdeasPage = () => {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<BRD[]>([]);
  const [history, setHistory] = useState<BRD[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modificationText, setModificationText] = useState('');

  useEffect(() => {
    // Load initially generated ideas from session
    const stored = sessionStorage.getItem('generated_ideas');
    if (stored) {
      const parsed = JSON.parse(stored);
      setIdeas(parsed);
      setHistory([parsed]);
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIdeas(history[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIdeas(history[currentIndex + 1]);
    }
  };

  const generateMore = async () => {
    setLoading(true);
    try {
      // Create new request with modifications
      // Here we'd typically merge with the original form data, 
      // but for simulation, we'll just resend and add the modification.
      // In a real app, you'd store the original request in session too.
      const originalRequestRaw = sessionStorage.getItem('last_request');
      const originalRequest = originalRequestRaw ? JSON.parse(originalRequestRaw) : { theme: 'Hackathon Project' };
      
      const updatedRequest = {
        ...originalRequest,
        constraints: `${originalRequest.constraints || ''}, ${modificationText}`.trim()
      };

      const promises = [
        generateIdea(updatedRequest),
        generateIdea(updatedRequest),
        generateIdea(updatedRequest),
        generateIdea(updatedRequest),
      ];

      const results = await Promise.all(promises);
      
      const newHistory = [...history, results];
      setHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);
      setIdeas(results);
      setModificationText('');
    } catch (err) {
      console.error('Generation failed:', err);
      alert('Failed to generate more ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-accent-primary/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-accent-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-accent-secondary/10 rounded-full blur-[100px] animate-pulse-slow" />
      </div>

      <div className="relative z-10 w-full px-6 md:px-12 py-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-3 text-text-muted hover:text-white transition-all text-sm font-semibold uppercase tracking-widest"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all group-hover:bg-white/5">
              <ArrowLeft size={16} />
            </div>
            Refine Parameters
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">
              AI Generated <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">Concepts</span>
            </h1>
            <p className="text-text-muted font-medium">Batch {currentIndex + 1} of {history.length}</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="p-3 glass-card rounded-2xl flex items-center gap-3">
               <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
               <span className="text-xs font-bold text-text-muted tracking-widest uppercase">AI Engine Active</span>
             </div>
          </div>
        </header>

        {/* Results Grid - Full Width as requested */}
        <div className="w-full mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {ideas.map((idea, idx) => (
                <motion.div
                  key={idea.id || `${currentIndex}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <IdeaCard idea={idea} index={idx} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Batch Navigation */}
        <nav className="flex items-center justify-between max-w-lg mx-auto mb-20 p-2 glass-card rounded-3xl border-white/5 shadow-xl">
          <button
            disabled={currentIndex === 0 || loading}
            onClick={handlePrevious}
            className={`flex items-center gap-3 py-3 px-6 rounded-2xl transition-all font-semibold ${
              currentIndex === 0 
                ? 'text-white/20 cursor-not-allowed' 
                : 'text-white hover:bg-white/10 active:scale-95'
            }`}
          >
            <ArrowLeft size={20} />
            Previous
          </button>
          
          <div className="flex gap-2">
            {history.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-accent-primary w-6' : 'bg-white/10'}`} 
              />
            ))}
          </div>

          <button
            disabled={currentIndex === history.length - 1 || loading}
            onClick={handleNext}
            className={`flex items-center gap-3 py-3 px-6 rounded-2xl transition-all font-semibold ${
              currentIndex === history.length - 1 
                ? 'text-white/20 cursor-not-allowed' 
                : 'text-white hover:bg-white/10 active:scale-95'
            }`}
          >
            View More
            <ArrowRight size={20} />
          </button>
        </nav>

        {/* Generate More Section - Bottom */}
        <section className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">Need a modification?</h3>
            <p className="text-text-muted text-sm">Refine your ideas based on new constraints or context</p>
          </div>
          
          <div className="glass-card p-2 pr-4 rounded-[2.5rem] flex items-center gap-2 border-white/10 shadow-2xl focus-within:border-accent-primary/50 transition-all">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center shrink-0">
              <Sparkles className="text-accent-primary" size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Enter modifications (e.g. 'Use AI-driven UI', 'Mobile first approach')..."
              className="bg-transparent border-none outline-none flex-1 py-4 text-white px-2 placeholder:text-text-muted text-lg"
              value={modificationText}
              onChange={(e) => setModificationText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateMore()}
            />
            <button 
              disabled={loading || !modificationText.trim()}
              onClick={generateMore}
              className={`btn-primary px-8 py-3 h-full rounded-2xl ${loading || !modificationText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Generate More
                  <Send size={18} />
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IdeasPage;
