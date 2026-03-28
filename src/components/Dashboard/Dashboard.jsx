import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Upload, Trash2, Sliders, Users, Brain, Code, Globe, Timer, FileText, Zap, X, Check } from 'lucide-react';

const TagInput = ({ tags, onAdd, onRemove, placeholder, hint }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = input.trim().replace(',', '');
      if (val && !tags.includes(val)) {
        onAdd(val);
        setInput('');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '40px' }}>
        {tags.map(tag => (
          <span key={tag} className="glass-container" style={{ 
            padding: '0.3rem 0.8rem', 
            borderRadius: '20px', 
            fontSize: '0.85rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.4rem',
            background: 'hsla(var(--accent-primary), 0.15)',
            border: '1px solid hsla(var(--accent-primary), 0.3)'
          }}>
            {tag}
            <X size={14} style={{ cursor: 'pointer' }} onClick={() => onRemove(tag)} />
          </span>
        ))}
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          style={{ flex: 1, background: 'transparent', border: 'none', padding: '0.2rem', minWidth: '120px' }}
        />
      </div>
      {hint && <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', fontStyle: 'italic' }}>{hint}</p>}
    </div>
  );
};

const ToggleChips = ({ options, selected, onToggle, customPlaceholder, onCustomAdd }) => {
  const [custom, setCustom] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              border: '1px solid',
              borderColor: selected.includes(opt) ? 'hsl(var(--accent-primary))' : 'hsla(var(--border-glass), 1)',
              background: selected.includes(opt) ? 'hsla(var(--accent-primary), 0.2)' : 'transparent',
              color: selected.includes(opt) ? 'hsl(var(--accent-primary))' : 'hsl(var(--text-secondary))',
              transition: 'var(--transition-smooth)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            {selected.includes(opt) && <Check size={14} />}
            {opt}
          </button>
        ))}
      </div>
      {customPlaceholder && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder={customPlaceholder}
            value={custom} 
            onChange={(e) => setCustom(e.target.value)}
            style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
          />
          <button 
            type="button" 
            onClick={() => { if(custom) { onCustomAdd(custom); setCustom(''); } }}
            className="btn-ghost" 
            style={{ padding: '0.5rem' }}
          >
            <Plus size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    teamSize: '',
    skillLevel: '',
    techStack: [],
    domains: [],
    constraints: [],
    timeToSubmit: '',
    timeUnit: 'hrs',
    theme: '',
    additionalNotes: '',
    uploadedFile: null
  });

  const [domainOptions, setDomainOptions] = useState(['AI', 'ML', 'App', 'Web', 'Cyber', 'AR/VR']);
  const [constraintOptions] = useState(['Simple', 'Unique', 'Fast-buildable', 'Innovative', 'Vibecoder-friendly']);

  const user = JSON.parse(localStorage.getItem('user'));
  const isReturning = localStorage.getItem('hasVisited');

  useEffect(() => {
    localStorage.setItem('hasVisited', 'true');
  }, []);

  const toggleItem = (key, val) => {
    setFormData(prev => {
      const list = prev[key];
      const newList = list.includes(val) ? list.filter(i => i !== val) : [...list, val];
      return { ...prev, [key]: newList };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, uploadedFile: file });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem('lastInputs', JSON.stringify(formData));
    setTimeout(() => {
      setLoading(false);
      navigate('/results');
    }, 3000);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          {isReturning ? `Welcome back, ${user?.name}!` : `Welcome, ${user?.name}!`}
        </h1>
        <p style={{ color: 'hsl(var(--text-secondary))' }}>Fine-tune your requirements to generate groundbreaking concepts.</p>
      </header>

      <form onSubmit={handleGenerate} className="glass-container glass-card" style={{ maxWidth: '850px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontWeight: '600' }}>
              <Users size={18} color="hsl(var(--accent-primary))" /> Team Size & Level
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="number" 
                placeholder="Enter team size"
                value={formData.teamSize}
                onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
                style={{ width: '130px' }}
              />
              <select 
                value={formData.skillLevel}
                onChange={(e) => setFormData({...formData, skillLevel: e.target.value})}
                style={{ flex: 1 }}
                required
              >
                <option value="" disabled>Select skill level</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Vibe Coder</option>
              </select>
            </div>
          </section>

          <section>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontWeight: '600' }}>
              <Code size={18} color="hsl(var(--accent-primary))" /> Tech Stack
            </label>
            <TagInput 
              tags={formData.techStack}
              onAdd={(val) => setFormData({...formData, techStack: [...formData.techStack, val]})}
              onRemove={(val) => setFormData({...formData, techStack: formData.techStack.filter(t => t !== val)})}
              placeholder="e.g., MERN, Python, Flutter, TensorFlow"
              hint={<span>Hint: You can also write <b>'Vibe Coder'</b> if you're unsure about the tech stack.</span>}
            />
          </section>

          <section>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontWeight: '600' }}>
              <Globe size={18} color="hsl(var(--accent-primary))" /> Domain
            </label>
            <ToggleChips 
              options={domainOptions}
              selected={formData.domains}
              onToggle={(val) => toggleItem('domains', val)}
              customPlaceholder="Add custom domain..."
              onCustomAdd={(val) => { setDomainOptions([...domainOptions, val]); toggleItem('domains', val); }}
            />
          </section>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontWeight: '600' }}>
              <Sliders size={18} color="hsl(var(--accent-primary))" /> Constraints
            </label>
            <ToggleChips 
              options={constraintOptions}
              selected={formData.constraints}
              onToggle={(val) => toggleItem('constraints', val)}
            />
          </section>

          <section>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontWeight: '600' }}>
              <Timer size={18} color="hsl(var(--accent-primary))" /> Time to Submit
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="number" 
                placeholder="Value" 
                value={formData.timeToSubmit}
                onChange={(e) => setFormData({...formData, timeToSubmit: e.target.value})}
                style={{ flex: 1 }}
              />
              <div className="glass-container" style={{ display: 'flex', padding: '0.2rem', borderRadius: '10px' }}>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, timeUnit: 'hrs'})}
                  style={{ 
                    padding: '0.4rem 0.8rem', 
                    fontSize: '0.8rem', 
                    borderRadius: '8px',
                    background: formData.timeUnit === 'hrs' ? 'hsl(var(--accent-primary))' : 'transparent',
                    color: formData.timeUnit === 'hrs' ? 'white' : 'inherit'
                  }}
                >hrs</button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, timeUnit: 'days'})}
                  style={{ 
                    padding: '0.4rem 0.8rem', 
                    fontSize: '0.8rem', 
                    borderRadius: '8px',
                    background: formData.timeUnit === 'days' ? 'hsl(var(--accent-primary))' : 'transparent',
                    color: formData.timeUnit === 'days' ? 'white' : 'inherit'
                  }}
                >days</button>
              </div>
            </div>
          </section>

          <section>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontWeight: '600' }}>
              <Brain size={18} color="hsl(var(--accent-primary))" /> Hackathon Theme
            </label>
            <input 
              type="text" 
              placeholder="e.g. AI for Social Good" 
              value={formData.theme}
              onChange={(e) => setFormData({...formData, theme: e.target.value})}
              style={{ width: '100%' }}
            />
          </section>

          <section>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontWeight: '600' }}>
              <Upload size={18} color="hsl(var(--accent-primary))" /> Material Upload
            </label>
            <div 
              className="glass-container"
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'hsl(var(--accent-primary))'; }}
              onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'hsla(var(--border-glass), 1)'; }}
              onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if(file) setFormData({...formData, uploadedFile: file}); }}
              style={{ 
                border: '2px dashed hsla(var(--border-glass), 1)', 
                borderRadius: '12px', 
                padding: '1.2rem', 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx" style={{ display: 'none' }} />
              {formData.uploadedFile ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                  <FileText size={20} color="hsl(var(--accent-primary))" />
                  <span style={{ fontSize: '0.9rem', color: 'hsl(var(--text-primary))', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {formData.uploadedFile.name}
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setFormData({...formData, uploadedFile: null}); }}
                    style={{ background: 'transparent', padding: '0.2rem', color: '#ff4444' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={24} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>PDF, DOC, DOCX up to 10MB</p>
                </>
              )}
            </div>
          </section>
        </div>

        {/* Bottom Section */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <section>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontWeight: '600' }}>
              <FileText size={18} color="hsl(var(--accent-primary))" /> Additional Instructions
            </label>
            <textarea 
              rows="2" 
              placeholder="Any specific features or focus areas?" 
              value={formData.additionalNotes}
              onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
              style={{ width: '100%', resize: 'none' }}
            />
          </section>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ height: '55px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}
          >
            {loading ? <><Loader2 className="animate-spin" /> Synthesizing...</> : <><Zap size={18} /> Generate Personalized Ideas</>}
          </button>
        </div>
      </form>
      
      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Dashboard;
