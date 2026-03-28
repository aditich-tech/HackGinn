import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Heart, Zap, History, ChevronRight, ChevronLeft } from 'lucide-react';
import { generateIdeas, generateSimilar } from '../../services/aiService';
import IdeaCard from './IdeaCard';

const Results = () => {
  const navigate = useNavigate();
  const [ideaSets, setIdeaSets] = useState(() => {
    const saved = sessionStorage.getItem('ideaSets');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSetIndex, setCurrentSetIndex] = useState(() => {
    const saved = sessionStorage.getItem('currentSetIndex');
    return saved ? parseInt(saved) : -1;
  });
  const [loading, setLoading] = useState(false); // Default to false if we have saved data
  const [direction, setDirection] = useState('right');

  useEffect(() => {
    if (ideaSets.length === 0) {
      loadInitialSet();
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('ideaSets', JSON.stringify(ideaSets));
    sessionStorage.setItem('currentSetIndex', currentSetIndex.toString());
  }, [ideaSets, currentSetIndex]);

  const loadInitialSet = async () => {
    setLoading(true);
    const inputs = JSON.parse(localStorage.getItem('lastInputs') || '{}');
    const newIdeas = await generateIdeas(inputs);
    setIdeaSets([newIdeas]);
    setCurrentSetIndex(0);
    setLoading(false);
  };

  const handleViewMore = async () => {
    if (currentSetIndex < ideaSets.length - 1) {
      setDirection('right');
      setCurrentSetIndex(prev => prev + 1);
    } else {
      setLoading(true);
      setDirection('right');
      const inputs = JSON.parse(localStorage.getItem('lastInputs') || '{}');
      const newIdeas = await generateIdeas(inputs);
      setIdeaSets(prev => [...prev, newIdeas]);
      setCurrentSetIndex(prev => prev + 1);
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentSetIndex > 0) {
      setDirection('left');
      setCurrentSetIndex(prev => prev - 1);
    }
  };

  const handleSimilar = async (idea) => {
    setLoading(true);
    setDirection('right');
    const similar = await generateSimilar(idea);
    // When generating similar, we might want to branch the history or just push as next
    setIdeaSets(prev => [...prev.slice(0, currentSetIndex + 1), similar]);
    setCurrentSetIndex(prev => prev + 1);
    setLoading(false);
  };

  const handleLike = (idea, status) => {
    const liked = JSON.parse(localStorage.getItem('likedIdeas') || '[]');
    if (status) {
      if (!liked.find(i => i.id === idea.id)) {
        localStorage.setItem('likedIdeas', JSON.stringify([...liked, idea]));
        // Mock backend notification
        console.log("Saving idea to backend for recommendations:", idea.title);
      }
    } else {
      localStorage.setItem('likedIdeas', JSON.stringify(liked.filter(i => i.id !== idea.id)));
      // Mark as not preferred
      console.log("Marking idea as not preferred:", idea.title);
    }
  };

  const handlePrefer = (idea) => {
    navigate(`/idea/${idea.id}`, { state: { idea } });
  };

  if (loading && ideaSets.length === 0) {
     return (
        <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
          <div className="glass-container" style={{ padding: '3rem', borderRadius: '50%', border: '2px solid hsla(var(--accent-primary), 0.3)' }}>
            <Loader2 size={100} className="animate-spin" color="hsl(var(--accent-primary))" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem' }} className="animate-pulse">Synthesizing Creative Streams...</h2>
            <p style={{ color: 'hsl(var(--text-secondary))', marginTop: '0.8rem' }}>Generating high-fidelity concepts with HackGinn Engine</p>
          </div>
        </div>
      );
  }

  const currentIdeas = ideaSets[currentSetIndex] || [];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '6rem', overflowX: 'hidden', width: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', padding: '0 4rem' }}>
        <button onClick={() => navigate('/dashboard')} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem' }}>
          <ArrowLeft size={20} /> Edit Core Requirements
        </button>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', letterSpacing: '-0.03em' }}>
          Tailored <span style={{ color: 'hsl(var(--accent-primary))' }}>Proposals</span>
        </h2>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/saved" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.2rem' }}>
            <Heart size={20} /> Saved
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'hsla(var(--border-glass), 0.3)', padding: '0.6rem 1.2rem', border: '1px solid hsla(var(--accent-primary), 0.2)', borderRadius: '25px', fontSize: '0.9rem' }}>
            <History size={18} /> Set {currentSetIndex + 1}
          </div>
        </div>
      </div>

      {/* Main Display Area - Full Width */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', minHeight: '600px', position: 'relative', width: '100%', padding: '0 2rem' }}>
        
        {/* Previous Button Container */}
        <div style={{ width: '200px', display: 'flex', justifyContent: 'center' }}>
          {currentSetIndex > 0 && (
            <button className="nav-btn prev-btn" onClick={handlePrevious} style={{ padding: '15px 30px', fontSize: '16px' }}>
              ← Previous
            </button>
          )}
        </div>

        {/* Ideas Grid - Immersive Full Width */}
        <div 
          key={currentSetIndex}
          className={`ideas-container slide-in-${direction}`}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '2.5rem', 
            flex: 1,
            width: '100%',
            padding: '1rem'
          }}
        >
          {loading && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderRadius: '30px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <Loader2 className="animate-spin" size={60} color="hsl(var(--accent-primary))" />
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'hsl(var(--accent-primary))' }}>Refining Ideas...</span>
              </div>
            </div>
          )}
          {currentIdeas.map((idea, idx) => (
            <IdeaCard 
              key={`${idea.id}-${idx}-${currentSetIndex}`}
              idea={idea}
              onPrefer={handlePrefer}
              onSimilar={handleSimilar}
              onLike={handleLike}
              onDislike={(idea, status) => handleLike(idea, false)}
            />
          ))}
        </div>

        {/* View More Button Container */}
        <div style={{ width: '200px', display: 'flex', justifyContent: 'center' }}>
          <button className="nav-btn next-btn" onClick={handleViewMore} style={{ padding: '15px 30px', fontSize: '16px' }}>
            Next Set →
          </button>
        </div>
      </div>

      {/* GEN-MORE Section (Bottom of Page) */}
      <div style={{ marginTop: '5rem', padding: '0 4rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div className="glass-container" style={{ 
          width: '100%', 
          maxWidth: '1000px', 
          padding: '2.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem',
          border: '1px solid hsla(var(--accent-primary), 0.2)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
        }}>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Want something <span style={{ color: 'hsl(var(--accent-primary))' }}>different?</span></h3>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '1rem' }}>Enter any specific changes or improvements you'd like to see in these ideas.</p>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <input 
              id="refinement-input"
              type="text" 
              placeholder="Enter any changes or improvements you want in ideas..." 
              style={{ flex: 1, padding: '1.2rem 1.5rem', fontSize: '1.1rem', background: 'hsla(var(--bg-dark), 0.5)', borderRadius: '15px' }}
            />
            <button 
              className="btn-primary" 
              style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
              onClick={async () => {
                const text = document.getElementById('refinement-input').value;
                if (!text) return;
                setLoading(true);
                setDirection('right');
                const inputs = JSON.parse(localStorage.getItem('lastInputs') || '{}');
                const newIdeas = await generateIdeas({ ...inputs, additionalNotes: text });
                setIdeaSets(prev => [...prev.slice(0, currentSetIndex + 1), newIdeas]);
                setCurrentSetIndex(prev => prev + 1);
                setLoading(false);
                document.getElementById('refinement-input').value = '';
              }}
            >
              Generate More <Sparkles size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Full Detail View removed as it is now a separate page */}

      <style>{`
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }

        /* Navigation Buttons Styling */
        .nav-btn {
          position: relative;
          padding: 10px 20px;
          border-radius: 7px;
          border: 1px solid rgb(61, 106, 255);
          font-size: 14px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 2px;
          background: transparent;
          color: #fff;
          overflow: hidden;
          box-shadow: 0 0 0 0 transparent;
          -webkit-transition: all 0.2s ease-in;
          -moz-transition: all 0.2s ease-in;
          transition: all 0.2s ease-in;
          cursor: pointer;
          white-space: nowrap;
        }

        .nav-btn:hover {
          background: rgb(61, 106, 255);
          box-shadow: 0 0 30px 5px rgba(0, 142, 236, 0.815);
          -webkit-transition: all 0.2s ease-out;
          -moz-transition: all 0.2s ease-out;
          transition: all 0.2s ease-out;
        }

        .nav-btn:hover::before {
          -webkit-animation: sh02 0.5s 0s linear;
          -moz-animation: sh02 0.5s 0s linear;
          animation: sh02 0.5s 0s linear;
        }

        .nav-btn::before {
          content: '';
          display: block;
          width: 0px;
          height: 86%;
          position: absolute;
          top: 7%;
          left: 0%;
          opacity: 0;
          background: #fff;
          box-shadow: 0 0 50px 30px #fff;
          -webkit-transform: skewX(-20deg);
          -moz-transform: skewX(-20deg);
          -ms-transform: skewX(-20deg);
          -o-transform: skewX(-20deg);
          transform: skewX(-20deg);
        }

        @keyframes sh02 {
          from { opacity: 0; left: 0%; }
          50% { opacity: 1; }
          to { opacity: 0; left: 100%; }
        }

        .nav-btn:active {
          box-shadow: 0 0 0 0 transparent;
          -webkit-transition: box-shadow 0.2s ease-in;
          -moz-transition: box-shadow 0.2s ease-in;
          transition: box-shadow 0.2s ease-in;
        }

        /* Slide Animations */
        .slide-in-right {
          animation: slideInRight 0.6s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        .slide-in-left {
          animation: slideInLeft 0.6s cubic-bezier(0.23, 1, 0.32, 1) both;
        }

        @keyframes slideInRight {
          0% { transform: translateX(50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          0% { transform: translateX(-50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Results;
