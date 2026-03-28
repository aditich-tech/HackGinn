import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, ExternalLink, Heart } from 'lucide-react';

const SavedIdeas = () => {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem('likedIdeas') || '[]');
    setSaved(liked);
  }, []);

  const removeIdea = (id) => {
    const updated = saved.filter(i => i.id !== id);
    setSaved(updated);
    localStorage.setItem('likedIdeas', JSON.stringify(updated));
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/results" className="btn-ghost" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </Link>
        <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Heart size={24} color="hsl(var(--accent-primary))" fill="hsl(var(--accent-primary))" /> 
          Saved <span style={{ color: 'hsl(var(--accent-primary))' }}>Ideas</span>
        </h2>
      </div>

      {saved.length === 0 ? (
        <div className="glass-container glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '1.2rem' }}>No saved ideas yet. Go generate some!</p>
          <Link to="/dashboard" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>Get Started</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {saved.map(idea => (
            <div key={idea.id} className="glass-container glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ color: 'hsl(var(--accent-primary))', marginBottom: '0.8rem' }}>{idea.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', lineHeight: '1.5' }}>{idea.description}</p>
                <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {idea.techStack.map(tech => (
                    <span key={tech} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'hsla(var(--text-primary), 0.1)', borderRadius: '4px' }}>{tech}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="btn-primary" style={{ flex: 1, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <ExternalLink size={14} /> Open
                </button>
                <button onClick={() => removeIdea(idea.id)} className="btn-ghost" style={{ padding: '0.6rem', color: '#ff4444' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedIdeas;
