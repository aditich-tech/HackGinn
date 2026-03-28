import React from 'react';
import { X, Code, Layout, Cpu, Box, CheckCircle, Crown, Lock, Rocket, Target, BarChart, Presentation, Zap } from 'lucide-react';

const IdeaDetail = ({ idea, isPremium, onClose, onUpgrade }) => {
  if (!idea) return null;

  if (!isPremium) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5, 5, 20, 0.9)', zIndex: 4000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.5rem' }} onClick={onClose}>
        <div className="glass-container glass-card animate-fade-in" style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem' }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'hsla(var(--accent-secondary), 0.2)', borderRadius: '50%' }}>
              <Crown size={48} color="hsl(var(--accent-secondary))" />
            </div>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Unlock <span style={{ color: 'hsl(var(--accent-secondary))' }}>HackGinn Pro</span></h2>
          <p style={{ color: 'hsl(var(--text-secondary))', lineHeight: '1.6', marginBottom: '2rem' }}>
            Get exclusive access to detailed project breakdowns, implementation workflows, suggested tools, and professional pitch deck guidance for this idea.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={onUpgrade} className="btn-primary" style={{ height: '50px', fontSize: '1.1rem', background: 'linear-gradient(135deg, hsl(var(--accent-secondary)), #e91e63)' }}>
              Upgrade to Pro 👑
            </button>
            <button onClick={onClose} className="btn-ghost">Maybe Later</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      background: 'rgba(5, 5, 15, 0.98)', 
      zIndex: 3000, 
      overflowY: 'auto',
      padding: '2rem'
    }}>
      <div className="container" style={{ maxWidth: '1100px', padding: '2rem 0' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', direction: 'column', gap: '0.5rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', background: 'hsl(var(--accent-secondary))', padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>HackGinn Pro AI</span>
                    <Sparkles size={14} color="hsl(var(--accent-primary))" />
               </div>
               <h1 style={{ fontSize: '3.5rem', color: 'hsl(var(--accent-primary))', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>{idea.title}</h1>
               <p style={{ fontSize: '1.25rem', color: 'hsl(var(--text-secondary))', maxWidth: '800px', lineHeight: '1.4' }}>{idea.description}</p>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.8rem', borderRadius: '50%' }}>
            <X size={32} />
          </button>
        </div>

        {/* Detailed Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '3rem' }}>
          
          {/* Column 1: Strategy & Growth */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            <section className="glass-container glass-card" style={{ borderLeft: '4px solid hsl(var(--accent-primary))' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                <Presentation size={20} color="hsl(var(--accent-primary))" /> Pitch Deck Strategy
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ fontSize: '0.75rem', color: 'hsl(var(--accent-primary))', fontWeight: 'bold' }}>THE PROBLEM</label>
                    <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>{idea.pitch.problem}</p>
                </div>
                <div>
                    <label style={{ fontSize: '0.75rem', color: 'hsl(var(--accent-primary))', fontWeight: 'bold' }}>OUR SOLUTION</label>
                    <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>{idea.pitch.solution}</p>
                </div>
                <div>
                    <label style={{ fontSize: '0.75rem', color: 'hsl(var(--accent-primary))', fontWeight: 'bold' }}>UNIQUE VALUE PROP</label>
                    <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'hsl(var(--accent-primary))' }}>{idea.pitch.usp}</p>
                </div>
              </div>
            </section>

            <section className="glass-container glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                <Rocket size={20} color="hsl(var(--accent-secondary))" /> Implementation Workflow
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {idea.workflow.map((step, i) => (
                     <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.8rem', background: 'hsla(var(--text-primary), 0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>0{i+1}</span>
                        <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>{step}</p>
                     </div>
                 ))}
              </div>
            </section>
          </div>

          {/* Column 2: Tech & Architecture */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <section className="glass-container glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                <Cpu size={20} color="hsl(var(--accent-primary))" /> Pro Architecture
              </h3>
              <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: '1px dashed hsla(var(--border-glass), 0.5)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                 {idea.architecture.split('->').map((node, i) => (
                     <div key={i} style={{ paddingLeft: `${i * 1.5}rem`, color: i % 2 === 0 ? 'hsl(var(--accent-primary))' : 'hsl(var(--text-primary))' }}>
                        {i > 0 ? '↳ ' : ''}{node.trim()}
                     </div>
                 ))}
              </div>
            </section>

            <section className="glass-container glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                <BarChart size={20} color="hsl(var(--accent-secondary))" /> Market & Future Scope
              </h3>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', opacity: 0.9 }}>
                 {idea.market}
              </p>
              <div style={{ padding: '1rem', background: 'hsla(var(--accent-secondary), 0.1)', borderRadius: '10px' }}>
                 <label style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>SCALABILITY PATH</label>
                 <p style={{ fontSize: '0.9rem', color: 'hsl(var(--accent-secondary))' }}>{idea.futureScope}</p>
              </div>
            </section>
          </div>

        </div>

        <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center', gap: '2rem', paddingBottom: '4rem' }}>
             <button className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <CheckCircle size={20} /> Deploy to Dev Environment
             </button>
             <button className="btn-ghost" style={{ padding: '1rem 3rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Box size={20} /> Export Specs (JSON)
             </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetail;
