import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, X, Upload, Users, Award, Globe, Code2, 
  Settings2, Clock, Sparkles, ChevronRight, Loader2 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { generateIdea } from '../../api/api';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    theme: '',
    materialsText: '',
    skillLevel: '',
    teamSize: '',
    teamSkill: '',
    domains: [] as string[],
    customDomain: '',
    techStacks: [] as string[],
    currentTechInput: '',
    constraints: [] as string[],
    customConstraint: '',
    timeToSubmit: '',
    timeUnit: 'hrs' as 'hrs' | 'days',
  });

  const skillLevels = ['Beginner', 'Moderate', 'Advanced', 'Vibe Coder'];
  const domainOptions = ['AI', 'ML', 'App', 'Web', 'Cyber', 'AR/VR'];
  const constraintOptions = ['Simple', 'Unique', 'Fast-buildable', 'Innovative', 'Vibecoder-friendly'];

  const toggleChip = (list: string[], item: string, field: string) => {
    const newList = list.includes(item) 
      ? list.filter((i: string) => i !== item) 
      : [...list, item];
    setFormData({ ...formData, [field]: newList });
  };

  const addTechStack = () => {
    if (formData.currentTechInput.trim()) {
      setFormData({
        ...formData,
        techStacks: [...formData.techStacks, formData.currentTechInput.trim()],
        currentTechInput: ''
      });
    }
  };

  const removeTechStack = (index: number) => {
    setFormData({
      ...formData,
      techStacks: formData.techStacks.filter((_: string, i: number) => i !== index)
    });
  };

  const addCustomDomain = () => {
    if (formData.customDomain.trim() && !formData.domains.includes(formData.customDomain.trim())) {
      setFormData({
        ...formData,
        domains: [...formData.domains, formData.customDomain.trim()],
        customDomain: ''
      });
    }
  };

  const addCustomConstraint = () => {
    if (formData.customConstraint.trim() && !formData.constraints.includes(formData.customConstraint.trim())) {
      setFormData({
        ...formData,
        constraints: [...formData.constraints, formData.customConstraint.trim()],
        customConstraint: ''
      });
    }
  };

  const handleGenerate = async () => {
    if (!formData.theme.trim()) {
      alert("Please provide a hackathon theme.");
      return;
    }
    if (!formData.skillLevel) {
      alert("Please select your skill level.");
      return;
    }
    if (formData.domains.length === 0) {
      alert("Please select at least one domain.");
      return;
    }

    setLoading(true);
    try {
      // Map frontend form back to backend request
      const requestData = {
        theme: formData.theme,
        materials: formData.materialsText,
        skillLevel: formData.skillLevel,
        teamSize: parseInt(formData.teamSize) || 1,
        teamSkill: formData.teamSkill || formData.skillLevel,
        domain: formData.domains.join(', '),
        techStack: formData.techStacks,
        constraints: formData.constraints.join(', '),
        hackathonHours: formData.timeUnit === 'days' 
          ? parseInt(formData.timeToSubmit) * 24 
          : parseInt(formData.timeToSubmit) || 24,
      };

      // Call API 4 times in parallel as requested
      const promises = [
        generateIdea(requestData),
        generateIdea(requestData),
        generateIdea(requestData),
        generateIdea(requestData),
      ];

      const results = await Promise.all(promises);
      
      // Store ideas in sessionStorage for the results page
      sessionStorage.setItem('generated_ideas', JSON.stringify(results));
      navigate('/ideas');
    } catch (err) {
      console.error('Generation failed:', err);
      alert('Failed to generate ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Configure Project</h1>
            <p className="text-text-muted">Fill in the details for your AI co-founder</p>
          </div>
          <button 
            onClick={() => logout()}
            className="text-sm text-text-muted hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Section 1: Theme */}
            <section className="glass-card p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-accent-primary" size={20} />
                <h2 className="text-lg font-semibold">Hackathon Theme</h2>
              </div>
              <input 
                type="text" 
                placeholder="e.g. Sustainable Future, AI for Good..."
                className="glass-input w-full"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              />
            </section>

            {/* Section 2: Materials */}
            <section className="glass-card p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <Upload className="text-accent-secondary" size={20} />
                <h2 className="text-lg font-semibold">Materials & Instructions</h2>
              </div>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer group">
                  <Upload className="mx-auto text-text-muted group-hover:text-accent-secondary mb-2 transition-colors" size={24} />
                  <p className="text-sm text-text-muted">Upload PDF or DOC materials</p>
                </div>
                <textarea 
                  placeholder="Paste instructions or additional details..."
                  className="glass-input w-full h-32 resize-none"
                  value={formData.materialsText}
                  onChange={(e) => setFormData({ ...formData, materialsText: e.target.value })}
                />
              </div>
            </section>

            {/* Section 3: Tech Stack */}
            <section className="glass-card p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <Code2 className="text-accent-primary" size={20} />
                <h2 className="text-lg font-semibold">Tech Stack</h2>
              </div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. React, Python..."
                    className="glass-input flex-1"
                    value={formData.currentTechInput}
                    onChange={(e) => setFormData({ ...formData, currentTechInput: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && addTechStack()}
                  />
                  <button 
                    onClick={addTechStack}
                    className="p-3 bg-accent-primary rounded-xl text-white hover:opacity-90 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.techStacks.map((tech: string, i: number) => (
                    <span key={i} className="chip bg-white/10 flex items-center gap-2 pr-2">
                      {tech}
                      <button onClick={() => removeTechStack(i)}>
                        <X size={14} className="text-text-muted hover:text-white" />
                      </button>
                    </span>
                  ))}
                  {formData.techStacks.length === 0 && (
                    <p className="text-xs text-text-muted italic">Hint: You can also write 'Vibe Coder' if unsure.</p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Section 4: Skills & Team */}
            <section className="glass-card p-6 rounded-3xl grid grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="text-accent-secondary" size={18} />
                  <span className="text-sm font-semibold">Your Skill Level</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillLevels.map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setFormData({ ...formData, skillLevel: lvl })}
                      className={`chip text-[12px] px-3 ${formData.skillLevel === lvl ? 'chip-active' : ''}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="text-accent-primary" size={18} />
                  <span className="text-sm font-semibold">Team Size</span>
                </div>
                <input 
                  type="number" 
                  placeholder="Count"
                  className="glass-input w-full"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="text-accent-secondary" size={18} />
                  <span className="text-sm font-semibold">Overall Team Skill</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillLevels.map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setFormData({ ...formData, teamSkill: lvl })}
                      className={`chip text-[12px] px-3 ${formData.teamSkill === lvl ? 'chip-active' : ''}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 5: Domain Selection */}
            <section className="glass-card p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="text-accent-secondary" size={20} />
                <h2 className="text-lg font-semibold">Domain</h2>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {domainOptions.map(domain => (
                  <button
                    key={domain}
                    onClick={() => toggleChip(formData.domains, domain, 'domains')}
                    className={`chip ${formData.domains.includes(domain) ? 'chip-active' : ''}`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Custom domain..."
                  className="glass-input flex-1"
                  value={formData.customDomain}
                  onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomDomain()}
                />
                <button 
                  onClick={addCustomDomain}
                  className="btn-secondary px-4"
                >
                  Add
                </button>
              </div>
            </section>

            {/* Section 6: Constraints */}
            <section className="glass-card p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <Settings2 className="text-accent-primary" size={20} />
                <h2 className="text-lg font-semibold">Constraints</h2>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {constraintOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => toggleChip(formData.constraints, opt, 'constraints')}
                    className={`chip ${formData.constraints.includes(opt) ? 'chip-active' : ''}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Custom constraint..."
                  className="glass-input flex-1"
                  value={formData.customConstraint}
                  onChange={(e) => setFormData({ ...formData, customConstraint: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomConstraint()}
                />
                <button 
                  onClick={addCustomConstraint}
                  className="btn-secondary px-4"
                >
                  Add
                </button>
              </div>
            </section>

            {/* Section 7: Time Control */}
            <section className="glass-card p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="text-accent-secondary" size={20} />
                <h2 className="text-lg font-semibold">Time to Submit</h2>
              </div>
              <div className="flex gap-4">
                <input 
                  type="number" 
                  className="glass-input flex-1"
                  placeholder="Value"
                  value={formData.timeToSubmit}
                  onChange={(e) => setFormData({ ...formData, timeToSubmit: e.target.value })}
                />
                <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
                  <button 
                    onClick={() => setFormData({ ...formData, timeUnit: 'hrs' })}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${formData.timeUnit === 'hrs' ? 'bg-accent-secondary text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
                  >
                    hrs
                  </button>
                  <button 
                    onClick={() => setFormData({ ...formData, timeUnit: 'days' })}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${formData.timeUnit === 'days' ? 'bg-accent-secondary text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
                  >
                    days
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Generate Button */}
        <motion.div 
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary px-12 py-5 text-xl relative group overflow-hidden"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Generating Your Winning Ideas...
              </>
            ) : (
              <>
                Generate Ideas
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
