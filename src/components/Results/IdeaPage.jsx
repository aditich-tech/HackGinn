import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Check, Sparkles, Layers, Terminal, Layout, Share2, Target, TrendingUp, Compass, Rocket } from 'lucide-react';

const IdeaPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const idea = location.state?.idea;
  const [isPremium, setIsPremium] = useState(JSON.parse(localStorage.getItem('isPremium') || 'false'));
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (!idea) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Idea not found</h2>
        <button onClick={() => navigate('/results')} className="btn-ghost" style={{ marginTop: '2rem' }}>
          Back to Results
        </button>
      </div>
    );
  }

  const handleUpgrade = () => {
    setIsPremium(true);
    localStorage.setItem('isPremium', 'true');
    setShowUpgradeModal(false);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 4rem 6rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Navigation */}
      <button 
        onClick={() => navigate(-1)} 
        className="btn-ghost" 
        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '3rem', fontSize: '1.1rem' }}
      >
        <ArrowLeft size={20} /> Return to Idea Cards
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem' }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Header */}
          <div>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'hsl(var(--accent-primary))', lineHeight: '1.1' }}>
              {idea.title}
            </h1>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'hsl(var(--text-secondary))' }}>
              {idea.description} This solution is engineered to address the core inefficiencies in the current market by utilizing a robust, scalable architecture and a user-centric design language.
            </p>
          </div>

          {/* Uniqueness */}
          <div className="glass-container" style={{ padding: '2.5rem', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Sparkles size={24} color="hsl(var(--accent-primary))" /> Why it's Unique
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingLeft: '1.5rem', fontSize: '1.1rem', color: 'hsl(var(--text-secondary))' }}>
              <li><strong>Market Gap:</strong> Unlike existing solutions, {idea.title} focuses specifically on the intersection of user intent and automated workflows.</li>
              <li><strong>Innovative Tech:</strong> {idea.uniqueness}</li>
              <li><strong>Scalability:</strong> Built on a modular foundation that allows for rapid expansion into adjacent domains.</li>
              <li><strong>User Experience:</strong> Prioritizes a feedback loop that adapts to individual user behaviors in real-time.</li>
            </ul>
          </div>

          {/* Tech Stack Breakdown */}
          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Terminal size={26} color="hsl(var(--accent-primary))" /> Tech Stack Breakdown
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="glass-container" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid hsla(var(--accent-primary), 0.1)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <Layout size={18} /> Frontend & UI
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'hsl(var(--text-secondary))' }}>
                  Using modern frameworks like <strong>{idea.techStack[0]}</strong> for a responsive, high-performance interface with smooth animations and state management.
                </p>
              </div>
              <div className="glass-container" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid hsla(var(--accent-secondary), 0.1)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <Layers size={18} /> Backend & Logic
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'hsl(var(--text-secondary))' }}>
                  Powered by <strong>{idea.techStack[idea.techStack.length-1]}</strong> to handle complex data processing, secure API endpoints, and real-time synchronization.
                </p>
              </div>
              <div className="glass-container" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid hsla(var(--accent-primary), 0.1)', gridColumn: 'span 2' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <Rocket size={18} /> Integrated Tools
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'hsl(var(--text-secondary))' }}>
                  The stack includes <strong>{idea.techStack.slice(1, -1).join(', ')}</strong> to facilitate advanced features like machine learning, decentralized storage, or third-party integrations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-container" style={{ padding: '2rem', borderRadius: '24px', position: 'sticky', top: '2rem' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Project Status</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'hsl(var(--accent-primary))', marginBottom: '2rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 10px currentColor' }} />
              Ready for Implementation
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                Save This Idea <Check size={18} />
              </button>
              <button className="btn-ghost" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                Share Concept <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Content / Get More Info */}
      <div style={{ marginTop: '6rem' }}>
        {!isPremium ? (
          <div className="glass-container" style={{ padding: '4rem', textAlign: 'center', border: '2px solid hsla(var(--accent-primary), 0.3)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              <Crown size={40} color="hsl(var(--accent-primary))" opacity={0.2} />
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Want the Full <span style={{ color: 'hsl(var(--accent-primary))' }}>Playbook?</span></h2>
            <p style={{ fontSize: '1.2rem', color: 'hsl(var(--text-secondary))', maxWidth: '700px', margin: '0 auto 3rem' }}>
              Unlock the step-by-step workflow, detailed architecture, pitch deck slides, and market analysis for this project.
            </p>
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className="btn-primary" 
              style={{ padding: '1.5rem 4rem', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '1rem' }}
            >
              Get More Info <Crown size={22} />
            </button>
          </div>
        ) : (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
            <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, hsla(var(--accent-primary), 0.3), transparent)' }} />
            
            {/* Detailed Premium Content sections */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                <section>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <Rocket size={26} color="hsl(var(--accent-primary))" /> Implementation Workflow
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {idea.workflow?.map((step, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '1.2rem' }}>
                                <div style={{ minWidth: '32px', height: '32px', borderRadius: '50%', background: 'hsla(var(--accent-primary), 0.1)', border: '1px solid hsla(var(--accent-primary), 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: 'hsl(var(--accent-primary))', fontWeight: 'bold' }}>
                                    {idx + 1}
                                </div>
                                <p style={{ color: 'hsl(var(--text-secondary))', lineHeight: '1.6' }}>{step}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <Target size={26} color="hsl(var(--accent-primary))" /> Pitch Deck Strategy
                    </h3>
                    <div className="glass-container" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'hsl(var(--accent-primary))', letterSpacing: '0.1em' }}>Problem Statement</label>
                            <p style={{ marginTop: '0.5rem' }}>{idea.pitch?.problem}</p>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'hsl(var(--accent-primary))', letterSpacing: '0.1em' }}>Unique Solution</label>
                            <p style={{ marginTop: '0.5rem' }}>{idea.pitch?.solution}</p>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'hsl(var(--accent-primary))', letterSpacing: '0.1em' }}>Demo Highlight</label>
                            <p style={{ marginTop: '0.5rem' }}>{idea.pitch?.demo}</p>
                        </div>
                    </div>
                </section>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem' }}>
                <section>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <Compass size={26} color="hsl(var(--accent-primary))" /> Architecture Overview
                    </h3>
                    <div className="glass-container" style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '1.1rem', background: 'hsla(0, 0%, 0%, 0.3)', border: '1px solid hsla(var(--accent-primary), 0.2)' }}>
                        {idea.architecture}
                    </div>
                </section>
                <section>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <TrendingUp size={26} color="hsl(var(--accent-primary))" /> Market Analysis
                    </h3>
                    <p style={{ color: 'hsl(var(--text-secondary))', lineHeight: '1.7' }}>
                        {idea.market}
                    </p>
                </section>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="glass-container modal-content" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <Crown size={60} color="hsl(var(--accent-primary))" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>HackGinn <span style={{ color: 'hsl(var(--accent-primary))' }}>Pro</span></h2>
            <p style={{ fontSize: '1.1rem', color: 'hsl(var(--text-secondary))', marginBottom: '2.5rem' }}>
              Unlock full project workflow, tools, pitch deck, and market insights with HackGinn Pro. 
              Gain the competitive edge you need to win your next hackathon.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn-primary" onClick={handleUpgrade} style={{ padding: '1.2rem' }}>
                Upgrade Now - $19/mo
              </button>
              <button className="btn-ghost" onClick={() => setShowUpgradeModal(false)}>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaPage;
