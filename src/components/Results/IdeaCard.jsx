import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Copy, Check, Sparkles, Send, Crown, Info } from 'lucide-react';

const IdeaCard = ({ idea, onPrefer, onSimilar, onLike, onDislike }) => {
  const [likeStatus, setLikeStatus] = useState(null); // 'like', 'dislike', or null
  const [copied, setCopied] = useState(false);
  const [showWhatItDoes, setShowWhatItDoes] = useState(false);

  const handleCopy = () => {
    const text = `
Idea: ${idea.title}

Description:
${idea.description}

Tech Stack:
- ${idea.techStack.join('\n- ')}

Uniqueness:
${idea.uniqueness}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    const newStatus = likeStatus === 'like' ? null : 'like';
    setLikeStatus(newStatus);
    onLike(idea, newStatus === 'like');
  };

  const handleDislike = () => {
    const newStatus = likeStatus === 'dislike' ? null : 'dislike';
    setLikeStatus(newStatus);
    onDislike(idea, newStatus === 'dislike');
  };

  return (
    <>
      <div className="glass-container glass-card" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.2rem',
        height: '100%',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem'
      }}>
        {/* Top Section: Title & Content */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.4rem', color: 'hsl(var(--accent-primary))', marginBottom: '1rem', lineHeight: '1.3' }}>
            {idea.title}
          </h3>
          
          <p style={{ fontSize: '0.95rem', color: 'hsl(var(--text-secondary))', lineHeight: '1.6', marginBottom: '1.2rem' }}>
            {idea.description}
          </p>

          {/* EYE Button: What It Does */}
          <button 
            onClick={() => setShowWhatItDoes(true)}
            className="btn-ghost"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontSize: '0.85rem', 
              padding: '0.6rem 1rem',
              marginBottom: '1.5rem',
              borderColor: 'hsla(var(--accent-primary), 0.3)',
              color: 'hsl(var(--accent-primary))'
            }}
          >
            <Info size={18} /> What It Does
          </button>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.5, letterSpacing: '0.05em' }}>
              Uniqueness
            </label>
            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginTop: '0.3rem' }}>"{idea.uniqueness}"</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.5, letterSpacing: '0.05em', display: 'block', marginBottom: '0.6rem' }}>
              Suggested Tech Stack
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {idea.techStack.map(tech => (
                <span key={tech} style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.3rem 0.8rem', 
                  background: 'hsla(var(--accent-primary), 0.1)', 
                  borderRadius: '8px',
                  border: '1px solid hsla(var(--accent-primary), 0.2)',
                  color: 'hsl(var(--accent-primary))'
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Middle: Like/Dislike + Copy Interaction Row */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: 'auto',
          marginBottom: '1.2rem',
          paddingTop: '1.2rem',
          borderTop: '1px solid hsla(var(--text-primary), 0.1)'
        }}>
          {/* Copy Button (Left) */}
          <button 
            onClick={handleCopy} 
            className="btn-ghost" 
            style={{ 
              padding: '0.6rem 1rem', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              fontSize: '0.9rem',
              color: copied ? 'hsl(140, 70%, 50%)' : 'inherit' 
            }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span>Copy</span>
          </button>
          
          {/* Like/Dislike Buttons (Right) - Updated to Blue highlight */}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button 
              onClick={handleLike} 
              className="btn-ghost" 
              style={{ 
                padding: '0.6rem', 
                borderRadius: '10px',
                background: likeStatus === 'like' ? 'hsla(var(--accent-primary), 0.2)' : 'transparent',
                color: likeStatus === 'like' ? 'hsl(var(--accent-primary))' : 'inherit',
                borderColor: likeStatus === 'like' ? 'hsl(var(--accent-primary))' : 'hsla(var(--text-primary), 0.1)',
                borderWidth: '1px', 
                borderStyle: 'solid',
                boxShadow: likeStatus === 'like' ? '0 0 15px hsla(var(--accent-primary), 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <ThumbsUp size={20} fill={likeStatus === 'like' ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={handleDislike} 
              className="btn-ghost" 
              style={{ 
                padding: '0.6rem', 
                borderRadius: '10px',
                background: likeStatus === 'dislike' ? 'hsla(var(--accent-primary), 0.2)' : 'transparent',
                color: likeStatus === 'dislike' ? 'hsl(var(--accent-primary))' : 'inherit',
                borderColor: likeStatus === 'dislike' ? 'hsl(var(--accent-primary))' : 'hsla(var(--text-primary), 0.1)',
                borderWidth: '1px', 
                borderStyle: 'solid',
                boxShadow: likeStatus === 'dislike' ? '0 0 15px hsla(var(--accent-primary), 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <ThumbsDown size={20} fill={likeStatus === 'dislike' ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Bottom: Main Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <button 
            onClick={() => onPrefer(idea)} 
            className="btn-primary" 
            style={{ width: '100%', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '1rem' }}
          >
            I Prefer This
          </button>
          
          <button 
            onClick={() => onSimilar(idea)} 
            className="btn-ghost" 
            style={{ width: '100%', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: '1px solid hsla(var(--text-primary), 0.1)', padding: '0.8rem' }}
          >
            <Sparkles size={16} color="hsl(var(--accent-primary))" /> Similar
          </button>
        </div>
      </div>

      {/* What It Does Modal */}
      {showWhatItDoes && (
        <div className="modal-overlay" onClick={() => setShowWhatItDoes(false)}>
          <div className="glass-container modal-content" onClick={e => e.stopPropagation()} style={{ border: '1px solid hsla(var(--accent-primary), 0.5)' }}>
            <h3 style={{ fontSize: '1.6rem', color: 'hsl(var(--accent-primary))', marginBottom: '1.2rem' }}>
              {idea.title}
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'hsl(var(--text-primary))', opacity: 0.9 }}>
              {idea.explanation || "This project is designed to solve complex challenges by leveraging state-of-the-art technologies and innovative workflows."}
            </p>
            <button 
              className="btn-primary" 
              onClick={() => setShowWhatItDoes(false)}
              style={{ marginTop: '2.5rem', width: '100%' }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default IdeaCard;
