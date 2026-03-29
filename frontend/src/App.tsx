import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { generateIdea, uploadText, updateBrd, downloadPdf, downloadDocx, getMyIdeas, BRD } from './api/api';
import ReactMarkdown from 'react-markdown';
import {
  FileText, UploadCloud, Loader2, Save, XCircle, Download,
  LayoutDashboard, ListChecks, Users, AlertTriangle, Clock,
  Edit3, PlusCircle, Network, LogOut, Sparkles, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

type TabKey = 'summary' | 'features' | 'techStack' | 'targetAudience' | 'challenges' | 'roadmap' | 'prd';

// ─── Fix #13 — module-level constants, not rebuilt on every render ────────────
const TAB_KEYS: TabKey[] = ['summary', 'prd', 'features', 'techStack', 'targetAudience', 'challenges', 'roadmap'];
const TAB_LABELS: Record<TabKey, string> = {
  summary: 'Summary Overview', features: 'Functional Features',
  techStack: 'Technical Stack', targetAudience: 'Target Audience',
  challenges: 'Risks & Challenges', roadmap: 'Execution Roadmap',
  prd: 'Detailed PRD',
};
const TAB_ICON_MAP: Record<TabKey, React.ElementType> = {
  summary: LayoutDashboard, features: ListChecks,
  techStack: LayoutDashboard, targetAudience: Users,
  challenges: AlertTriangle, roadmap: Clock, prd: FileText,
};
const IDEA_COLORS = ['var(--border-focus)', 'var(--accent-color)', 'var(--danger-color)', 'var(--success-color)'];

// ─── IdeaCard Component ───────────────────────────────────────────────────────
const IdeaCard = ({ brd, index, onSelect }: { brd: BRD; index: number; onSelect: (b: BRD) => void }) => {
  const [expanded, setExpanded] = useState(false);
  const accent = IDEA_COLORS[index % IDEA_COLORS.length];
  return (
    <div className="section-panel fade-in" style={{ borderTop: `8px solid ${accent}`, padding: '1.5rem', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="flex items-center justify-between">
        <span className="badge" style={{ background: accent, fontSize: '0.7rem' }}>IDEA {String(index + 1).padStart(2, '0')}</span>
        <button className="btn-icon-only" onClick={() => setExpanded(!expanded)} title={expanded ? 'Collapse' : 'Expand'}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: 1.2 }}>{brd.title}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.4 }}>{brd.summary}</p>
      {expanded && (
        <div style={{ borderTop: '2px dotted var(--border-stark)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {brd.techStack?.length > 0 && (
            <div>
              <p className="text-xs" style={{ marginBottom: '0.4rem' }}>Tech Stack</p>
              <div className="flex" style={{ gap: '0.4rem', flexWrap: 'wrap' }}>
                {brd.techStack.map((t, i) => <span key={i} className="badge" style={{ fontSize: '0.7rem', background: 'var(--bg-base)', color: 'var(--text-primary)', boxShadow: '2px 2px 0 var(--border-stark)' }}>{t}</span>)}
              </div>
            </div>
          )}
          {brd.features?.length > 0 && (
            <div>
              <p className="text-xs" style={{ marginBottom: '0.4rem' }}>Top Features</p>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {/* Fix #10 — features is now string[], no more typeof guard */}
                {brd.features.slice(0, 3).map((f, i) => (
                  <li key={i} style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <button className="btn btn-primary" style={{ marginTop: 'auto', padding: '0.65rem 1rem', fontSize: '0.85rem' }} onClick={() => onSelect(brd)}>
        <Edit3 size={14} /> Select This Idea
      </button>
    </div>
  );
};

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  const [brd, setBrd] = useState<BRD | null>(null);
  const [ideas, setIdeas] = useState<BRD[]>([]);
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState<BRD | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('summary');
  const [heroTab, setHeroTab] = useState<'generate' | 'paste'>('generate');
  const [generateInputs, setGenerateInputs] = useState({
    teamSize: 1, skillLevel: 'Intermediate', projectType: 'Software',
    platform: '', targetMarket: '', techStack: '', domain: '', constraints: '', hackathonHours: 24,
  });
    const [history, setHistory] = useState<BRD[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const { currentUser, logout } = useAuth();

    const fetchHistory = React.useCallback(async () => {
      if (!currentUser) return;
      setHistoryLoading(true);
      try {
        const data = await getMyIdeas();
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setHistoryLoading(false);
      }
    }, [currentUser]);

    React.useEffect(() => {
      fetchHistory();
    }, [brd, fetchHistory]);

    const navigate = useNavigate();
  const activeBrd = isEditing ? editDraft : brd;

  // ── Handlers ──────────────────────────────────────────────────────────────



  const handleTextUpload = async () => {
    if (!currentUser) { navigate('/login'); return; }
    if (!textInput.trim()) return;
    setLoading(true);
    try {
      const data = await uploadText(textInput);
      setBrd(data); setIdeas([]); setActiveTab('summary'); navigate('/dashboard');
    } catch { alert('Failed to process text.'); }
    finally { setLoading(false); }
  };

  // Fix #1 — Promise.allSettled so partial successes are kept
  const handleGenerateIdea = async () => {
    if (!currentUser) { navigate('/login'); return; }
    setLoading(true);
    try {
      const formattedInputs = {
        ...generateInputs,
        techStack: generateInputs.techStack.split(',').map(s => s.trim()).filter(Boolean),
      };
      const results = await Promise.allSettled([
        generateIdea(formattedInputs), generateIdea(formattedInputs),
        generateIdea(formattedInputs), generateIdea(formattedInputs),
      ]);
      const successful = results
        .filter((r): r is PromiseFulfilledResult<BRD> => r.status === 'fulfilled')
        .map(r => r.value);
      if (successful.length === 0) throw new Error('All 4 generations failed. Check backend and GROQ_API_KEY.');
      setIdeas(successful); setBrd(null); navigate('/dashboard');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to generate ideas.');
    } finally { setLoading(false); }
  };

  const handleSelectIdea = (selected: BRD) => { setBrd(selected); setIdeas([]); setActiveTab('summary'); };

  const handleSaveBrd = async () => {
    if (!editDraft) return;
    setSaving(true);
    try {
      const data = await updateBrd(editDraft.id, editDraft);
      setBrd(data); setIsEditing(false); setEditDraft(null);
    } catch { alert('Failed to save BRD.'); }
    finally { setSaving(false); }
  };

  // Fix #2 + #15 — null guard + try/catch on downloads
  const handleDownloadPdf = async () => {
    if (!brd) return;
    try { await downloadPdf(brd.id, brd.title); }
    catch { alert('Export failed. The blueprint may have been deleted.'); }
  };

  const handleDownloadDocx = async () => {
    if (!brd) return;
    try { await downloadDocx(brd.id, brd.title); }
    catch { alert('Export failed. The blueprint may have been deleted.'); }
  };

  // ── Edit Helpers ──────────────────────────────────────────────────────────
  const updateDraftArray = (field: keyof BRD, index: number, value: unknown) => {
    if (!editDraft) return;
    const newArr = [...(editDraft[field] as unknown[])];
    newArr[index] = value;
    setEditDraft({ ...editDraft, [field]: newArr });
  };
  const updateRoadmapItem = (index: number, key: string, value: string) => {
    if (!editDraft) return;
    const newArr = [...editDraft.roadmap];
    newArr[index] = { ...newArr[index], [key]: value };
    setEditDraft({ ...editDraft, roadmap: newArr });
  };
  const removeDraftArrayItem = (field: keyof BRD, index: number) => {
    if (!editDraft) return;
    const newArr = [...(editDraft[field] as unknown[])];
    newArr.splice(index, 1);
    setEditDraft({ ...editDraft, [field]: newArr });
  };
  const addDraftArrayItem = (field: keyof BRD, emptyObj: unknown) => {
    if (!editDraft) return;
    setEditDraft({ ...editDraft, [field]: [...(editDraft[field] as unknown[]), emptyObj] });
  };
  const startEditing = () => { setEditDraft(JSON.parse(JSON.stringify(brd))); setIsEditing(true); };

  // ── Tab Renderers ─────────────────────────────────────────────────────────
  const renderSummaryTab = () => (
    <div className="section-panel fade-in">
      <div className="panel-header">
        <h2><FileText size={24} color="var(--color-accent)" /> Document Overview</h2>
        <p className="text-muted">High-level summary and title of the project.</p>
      </div>
      <div className="item-card"><div className="item-content">
        <label className="text-xs">Project Title</label>
        {isEditing ? <input className="input" style={{ fontSize: '1.5rem', fontWeight: 600, padding: '1rem', width: '100%' }} value={activeBrd?.title || ''} onChange={e => setEditDraft({ ...editDraft!, title: e.target.value })} /> : <h1>{activeBrd?.title || 'Untitled Document'}</h1>}
      </div></div>
      <div className="item-card mt-4"><div className="item-content">
        <label className="text-xs">Executive Summary</label>
        {isEditing ? <textarea className="textarea mt-2" style={{ minHeight: '300px' }} value={activeBrd?.summary || ''} onChange={e => setEditDraft({ ...editDraft!, summary: e.target.value })} /> : <p className="mt-2" style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text-muted)' }}>{activeBrd?.summary || 'No summary available.'}</p>}
      </div></div>
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="section-panel fade-in">
      <div className="panel-header flex justify-between items-center">
        <div><h2><ListChecks size={24} color="var(--color-accent)" /> Functional Features</h2><p className="text-muted">Core features and user flows.</p></div>
        {isEditing && <button className="btn btn-secondary" onClick={() => addDraftArrayItem('features', '')}><PlusCircle size={16} /> Add Feature</button>}
      </div>
      {!activeBrd?.features?.length ? <div className="empty-state">No features generated.</div> : (
        <div className="flex-col gap-4">
          {activeBrd.features.map((feature, idx) => (
            <div key={idx} className="item-card"><div className="item-content w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="badge">FEATURE-{idx + 1}</span>
                {isEditing && <button className="btn-icon-only btn-icon-danger" onClick={() => removeDraftArrayItem('features', idx)}><XCircle size={16} /></button>}
              </div>
              {/* Fix #10 — feature is string, no typeof guard needed */}
              {isEditing ? <textarea className="textarea" style={{ minHeight: '80px' }} value={feature} onChange={e => updateDraftArray('features', idx, e.target.value)} /> : <p style={{ fontWeight: 500 }}>{feature}</p>}
            </div></div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTechStackTab = () => (
    <div className="section-panel fade-in">
      <div className="panel-header flex justify-between items-center">
        <div><h2><LayoutDashboard size={24} color="var(--color-accent)" /> Technical Stack</h2><p className="text-muted">Recommended tools and frameworks.</p></div>
        {isEditing && <button className="btn btn-secondary" onClick={() => addDraftArrayItem('techStack', '')}><PlusCircle size={16} /> Add Skill</button>}
      </div>
      {!activeBrd?.techStack?.length ? <div className="empty-state">No tech stack recommended yet.</div> : (
        <div className="flex-col gap-3">
          {activeBrd.techStack.map((item, idx) => (
            <div key={idx} className="item-card" style={{ padding: '1rem', alignItems: 'center' }}>
              <div className="item-content flex" style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem', width: '100%' }}>
                <span className="text-xs text-muted" style={{ minWidth: '24px' }}>{String(idx + 1).padStart(2, '0')}</span>
                {isEditing ? <input className="input" value={item} onChange={e => updateDraftArray('techStack', idx, e.target.value)} /> : <span style={{ flex: 1, fontWeight: 600 }}>{item}</span>}
              </div>
              {isEditing && <button className="btn-icon-only btn-icon-danger flex-shrink-0" onClick={() => removeDraftArrayItem('techStack', idx)}><XCircle size={16} /></button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTargetAudienceTab = () => (
    <div className="section-panel fade-in">
      <div className="panel-header flex justify-between items-center">
        <div><h2><Users size={24} color="var(--color-accent)" /> Target Audience</h2><p className="text-muted">Primary users and personas.</p></div>
        {isEditing && <button className="btn btn-secondary" onClick={() => addDraftArrayItem('targetAudience', '')}><PlusCircle size={16} /> Add Audience</button>}
      </div>
      {!activeBrd?.targetAudience?.length ? <div className="empty-state">No audience defined yet.</div> : (
        <div className="grid-2 gap-4">
          {activeBrd.targetAudience.map((persona, idx) => (
            <div key={idx} className="item-card flex justify-between" style={{ padding: '1rem', alignItems: 'center' }}>
              {isEditing ? <input className="input" value={persona} onChange={e => updateDraftArray('targetAudience', idx, e.target.value)} /> : <span className="font-semibold">{persona}</span>}
              {isEditing && <button className="btn-icon-only btn-icon-danger flex-shrink-0" onClick={() => removeDraftArrayItem('targetAudience', idx)}><XCircle size={16} /></button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderChallengesTab = () => (
    <div className="section-panel fade-in">
      <div className="panel-header flex justify-between items-center">
        <div><h2><AlertTriangle size={24} color="var(--color-danger)" /> Risks & Challenges</h2><p className="text-muted">Likely hurdles and technical warnings.</p></div>
        {isEditing && <button className="btn btn-secondary" onClick={() => addDraftArrayItem('challenges', '')}><PlusCircle size={16} /> Add Challenge</button>}
      </div>
      {!activeBrd?.challenges?.length ? <div className="empty-state">No challenges identified.</div> : (
        <div className="flex-col gap-4">
          {activeBrd.challenges.map((challenge, idx) => (
            <div key={idx} className="item-card" style={{ borderLeft: '3px solid var(--color-danger)' }}>
              <div className="item-content w-full">
                {isEditing ? <textarea className="textarea" style={{ minHeight: '60px' }} value={challenge} onChange={e => updateDraftArray('challenges', idx, e.target.value)} /> : <p style={{ fontWeight: 500 }}>{challenge}</p>}
              </div>
              {isEditing && <button className="btn-icon-only btn-icon-danger" onClick={() => removeDraftArrayItem('challenges', idx)} style={{ height: 'fit-content', marginLeft: '1rem' }}><XCircle size={16} /></button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRoadmapTab = () => {
    const renderPhaseGroup = (label: string, filter: (m: BRD['roadmap'][0]) => boolean, badgeStyle: React.CSSProperties) => (
      <div>
        <h3 className="mb-4 text-xl" style={{ borderBottom: '2px dotted var(--border-stark)', paddingBottom: '0.5rem' }}>{label}</h3>
        {!activeBrd?.roadmap?.filter(filter).length ? <p className="text-muted">No phases defined.</p> : (
          <div className="flex-col gap-4">
            {activeBrd!.roadmap.map((item, idx) => {
              if (!filter(item)) return null;
              return (
                <div key={idx} className="item-card flex-col gap-2">
                  <div className="flex justify-between items-center w-full">
                    {isEditing ? (
                      <select className="input mb-2" style={{ width: 'fit-content', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} value={item.stage} onChange={e => updateRoadmapItem(idx, 'stage', e.target.value)}>
                        <option value="Hackathon MVP">MVP</option>
                        <option value="Post-Hackathon Scaling">Scaling</option>
                      </select>
                    ) : <span className="badge" style={badgeStyle}>{item.stage?.includes('MVP') ? 'MVP' : 'Scaling'}</span>}
                    {isEditing && <button className="btn-icon-only btn-icon-danger flex-shrink-0" onClick={() => removeDraftArrayItem('roadmap', idx)}><XCircle size={16} /></button>}
                  </div>
                  {isEditing ? (
                    <div className="flex-col gap-2 w-full">
                      <input className="input font-semibold" placeholder="Phase Name" value={item.phase} onChange={e => updateRoadmapItem(idx, 'phase', e.target.value)} />
                      <textarea className="textarea" placeholder="Description" value={item.description} onChange={e => updateRoadmapItem(idx, 'description', e.target.value)} />
                    </div>
                  ) : <><h4 className="mb-1">{item.phase}</h4><p className="text-sm text-muted">{item.description}</p></>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
    return (
      <div className="section-panel fade-in">
        <div className="panel-header flex justify-between items-center">
          <div><h2><Clock size={24} color="var(--color-accent)" /> Execution Roadmap</h2><p className="text-muted">Phased approach: MVP → Scaling.</p></div>
          {isEditing && <button className="btn btn-secondary" onClick={() => addDraftArrayItem('roadmap', { stage: 'Hackathon MVP', phase: '', description: '' })}><PlusCircle size={16} /> Add Phase</button>}
        </div>
        {!activeBrd?.roadmap?.length ? <div className="empty-state">No roadmap generated.</div> : (
          <div className="flex-col gap-8">
            {renderPhaseGroup('Core MVP', m => !!m.stage?.includes('MVP'), { backgroundColor: 'var(--color-accent)', color: 'white' })}
            {renderPhaseGroup('Post-Hackathon Scaling', m => !!m.stage?.includes('Scaling'), { backgroundColor: 'var(--color-text-main)', color: 'white' })}
          </div>
        )}
      </div>
    );
  };

  const renderPrdTab = () => (
    <div className="section-panel fade-in">
      <div className="panel-header">
        <h2><FileText size={24} color="var(--color-accent)" /> Product Requirement Document</h2>
        <p className="text-muted">A comprehensive breakdown of requirements, goals, and success metrics.</p>
      </div>
      <div className="item-card"><div className="item-content">
        {isEditing ? (
          <textarea
            className="textarea"
            style={{ minHeight: '600px', lineHeight: '1.6', fontSize: '1rem' }}
            value={activeBrd?.prd || ''}
            onChange={e => setEditDraft({ ...editDraft!, prd: e.target.value })}
          />
        ) : (
          <div className="markdown-content" style={{ lineHeight: '1.8', color: 'var(--color-text-main)', fontSize: '1.05rem' }}>
            <ReactMarkdown>{activeBrd?.prd || 'No PRD generated for this idea.'}</ReactMarkdown>
          </div>
        )}
      </div></div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'prd': return renderPrdTab();
      case 'summary': return renderSummaryTab();
      case 'features': return renderFeaturesTab();
      case 'techStack': return renderTechStackTab();
      case 'targetAudience': return renderTargetAudienceTab();
      case 'challenges': return renderChallengesTab();
      case 'roadmap': return renderRoadmapTab();
    }
  };

  // ── Loading Skeleton ──────────────────────────────────────────────────────
  const renderLoadingSkeleton = () => (
    <div className="dashboard-layout">
      <aside className="sidebar"><div className="sidebar-header"><div className="skeleton" style={{ width: '120px', height: '24px' }} /></div>
        <div className="sidebar-nav mt-8">{[1,2,3,4,5,6].map(i => <div key={i} className="skeleton mb-2" style={{ width: '100%', height: '36px' }} />)}</div>
      </aside>
      <main className="main-stage"><header className="stage-header"><div className="skeleton" style={{ width: '200px', height: '24px' }} /><div className="skeleton" style={{ width: '100px', height: '36px' }} /></header>
        <div className="stage-content"><div className="content-container"><div className="section-panel"><div className="panel-header"><div className="skeleton mb-2" style={{ width: '250px', height: '32px' }} /><div className="skeleton" style={{ width: '400px', height: '16px' }} /></div>
          {[1,2,3].map(i => <div key={i} className="item-card flex-col gap-4"><div className="skeleton" style={{ width: '30%', height: '16px' }} /><div className="skeleton" style={{ width: '100%', height: '60px' }} /></div>)}</div></div></div>
      </main>
    </div>
  );

  // ── Landing Page ──────────────────────────────────────────────────────────
  const renderLandingPage = () => {
    if (loading) return renderLoadingSkeleton();
    return (
      <div className="landing-page">
        <nav className="landing-nav fade-in">
          <div className="nav-brand"><FileText size={28} /><span>HackGinn</span></div>
          <div className="nav-links"><span className="nav-link">Product</span><span className="nav-link">Solutions</span><span className="nav-link">Documentation</span></div>
          <div className="nav-actions">
            {currentUser ? (
              <>
                <span className="user-greeting">Hi, {currentUser.displayName || currentUser.email?.split('@')[0]}</span>
                <Link to="/dashboard" className="btn btn-primary" style={{ textDecoration: 'none' }}>Dashboard</Link>
                {/* Fix #9 — logout() from AuthContext */}
                <button className="btn btn-secondary" onClick={() => logout()}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" style={{ textDecoration: 'none', fontWeight: 800 }}>Log In</Link>
                <Link to="/signup" className="btn btn-primary" style={{ textDecoration: 'none' }}>Sign Up</Link>
              </>
            )}
          </div>
        </nav>

        <div className="split-hero fade-in">
          <div className="hero-content-left">
            <h1 className="hero-title">Inventive, Sharp, Magnificent.</h1>
            <p className="hero-subtitle-left">We are the intelligent engine for converting hackathon themes into structured project blueprints with unprecedented accuracy.</p>
            {!currentUser && (
              <div className="hero-ctas">
                <Link to="/signup" className="btn btn-primary" style={{ textDecoration: 'none', padding: '1rem 2.5rem' }}>Get Started</Link>
                <Link to="/login" className="btn btn-secondary" style={{ textDecoration: 'none', padding: '1rem 2.5rem' }}>Learn More</Link>
              </div>
            )}
          </div>

          <div className="hero-content-right">
            {currentUser ? (
              <div className="hero-card">
                <div className="hero-tabs">
                  {(['generate', 'paste'] as const).map(t => (
                    <button key={t} className={`hero-tab ${heroTab === t ? 'active' : ''}`} onClick={() => setHeroTab(t)}>
                      {t === 'generate' && <><Sparkles size={16} /> Generate 4 Ideas</>}
                      {t === 'paste' && <><FileText size={16} /> Paste Info</>}
                    </button>
                  ))}
                </div>
                <div className="hero-card-content">
                  {heroTab === 'paste' && (
                    <div className="paste-zone fade-in">
                      <textarea className="hero-textarea clean" placeholder="Paste hackathon theme or meeting notes here..." value={textInput} onChange={e => setTextInput(e.target.value)} />
                      <div className="flex justify-end mt-4">
                        <button className="btn btn-primary" onClick={handleTextUpload} disabled={!textInput.trim()} style={{ padding: '0.75rem 1.5rem' }}>Generate Blueprint &rarr;</button>
                      </div>
                    </div>
                  )}
                  {heroTab === 'generate' && (
                    <div className="generate-zone fade-in" style={{ padding: '0.5rem 0' }}>
                      <div className="grid-2 gap-4">
                        <div className="input-stacked"><label className="text-xs">Project Type</label>
                          <select className="input" value={generateInputs.projectType} onChange={e => setGenerateInputs({ ...generateInputs, projectType: e.target.value, platform: '' })}>
                            <option>Software</option><option>Hardware</option><option>Hybrid</option>
                          </select></div>
                        <div className="input-stacked"><label className="text-xs">Category / Platform</label>
                          <select className="input" value={generateInputs.platform} onChange={e => setGenerateInputs({ ...generateInputs, platform: e.target.value })}>
                            {generateInputs.projectType === 'Hardware' ? (
                              <><option value="">Select Hardware Type</option><option>IoT Device</option><option>Robotics</option><option>Wearable</option><option>Embedded System</option></>
                            ) : (
                              <><option value="">Select Software Type</option><option>Web App</option><option>Mobile App</option><option>AI / ML Model</option><option>API / Backend</option><option>CLI / Tool</option></>
                            )}
                          </select></div>
                        <div className="input-stacked"><label className="text-xs">Target Market</label>
                          <select className="input" value={generateInputs.targetMarket} onChange={e => setGenerateInputs({ ...generateInputs, targetMarket: e.target.value })}>
                            <option value="">Any Market</option><option>B2B (Enterprise)</option><option>B2C (Consumer)</option><option>B2B2C</option><option>Internal Tool</option><option>Open Source</option>
                          </select></div>
                        <div className="input-stacked"><label className="text-xs">Tech Stack (Comma Separated)</label>
                          <input className="input" placeholder="React, Node.js..." value={generateInputs.techStack} onChange={e => setGenerateInputs({ ...generateInputs, techStack: e.target.value })} /></div>
                        <div className="input-stacked"><label className="text-xs">Domain / Focus Area</label>
                          <input className="input" placeholder="FinTech, Health, EdTech..." value={generateInputs.domain} onChange={e => setGenerateInputs({ ...generateInputs, domain: e.target.value })} /></div>
                        <div className="input-stacked"><label className="text-xs">Team Skill Level</label>
                          <select className="input" value={generateInputs.skillLevel} onChange={e => setGenerateInputs({ ...generateInputs, skillLevel: e.target.value })}>
                            <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Vibe Coder</option>
                          </select></div>
                      </div>
                      <div className="flex gap-4 mt-4 items-center justify-between">
                        <div className="input-stacked" style={{ flex: 1 }}><label className="text-xs">Constraints (Optional)</label>
                          <input className="input" style={{ fontSize: '0.9rem' }} placeholder="e.g. Must use cloud" value={generateInputs.constraints} onChange={e => setGenerateInputs({ ...generateInputs, constraints: e.target.value })} /></div>
                        <div className="input-stacked" style={{ width: '80px' }}><label className="text-xs">Team</label>
                          <input type="number" className="input" value={generateInputs.teamSize} onChange={e => setGenerateInputs({ ...generateInputs, teamSize: parseInt(e.target.value) })} min="1" max="10" /></div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <button className="btn btn-primary" onClick={handleGenerateIdea} style={{ padding: '0.75rem 2.5rem' }}>
                          <Sparkles size={16} /> Generate 4 Ideas &rarr;
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hero-illustration">
                <div className="abstract-card blue-card"><FileText size={48} className="illustration-icon" /><div className="skeleton-line" /><div className="skeleton-line short" /></div>
                <div className="abstract-card violet-card"><ListChecks size={40} className="illustration-icon" /><div className="skeleton-line" /><div className="skeleton-line medium" /></div>
              </div>
            )}
          </div>
        </div>

        <div className="feature-cards-section fade-in">
          {[
            { icon: <UploadCloud size={32} className="feature-icon" />, title: 'Skill Mapping', desc: "Generate ideas that perfectly match your team's technical expertise and learning goals." },
            { icon: <LayoutDashboard size={32} className="feature-icon" />, title: 'Technical Blueprint', desc: 'Get a full architecture breakdown including database schemas and recommended API designs.' },
            { icon: <AlertTriangle size={32} className="feature-icon" />, title: 'Risk Analysis', desc: 'Avoid common hackathon pitfalls with AI-identified technical risks and mitigation plans.' },
            { icon: <Network size={32} className="feature-icon" />, title: 'Execution Roadmap', desc: 'Convert your idea into a 24/48-hour phased timeline to ensure you finish on time.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="feature-card">{icon}<h3>{title}</h3><p>{desc}</p><a href="#learn" className="feature-link">Learn More &rarr;</a></div>
          ))}
        </div>
        <div className="landing-backdrop-diagonal" />
      </div>
    );
  };

  // ── Dashboard ─────────────────────────────────────────────────────────────
  const renderDashboard = () => {
    // Fix #1 — If nothing generated yet, show the Generator (Landing Page) instead of empty dashboard
    if (!brd && ideas.length === 0) {
      return renderLandingPage();
    }

    // 4-card ideas grid
    if (ideas.length > 0 && !brd) {
      return (
        <div className="dashboard-layout">
          <aside className="sidebar">
            <div className="sidebar-header"><Link to="/" className="brand" onClick={() => { setBrd(null); setIdeas([]); }}><FileText size={28} /> HackGinn</Link></div>
            <nav className="sidebar-nav mt-8">
              <div className="text-xs mb-2 mt-4 ml-3" style={{ opacity: 0.5, fontWeight: 600 }}>AI RESULTS</div>
              <div className="nav-item active"><Sparkles size={18} /> 4 Generated Ideas</div>
            </nav>
            <div style={{ padding: '1.25rem', borderTop: '2px solid var(--border-stark)', marginTop: 'auto' }}>
              <button className="btn btn-secondary w-full" onClick={() => { setBrd(null); setIdeas([]); navigate('/'); }}><LogOut size={16} /> Back to Home</button>
            </div>
          </aside>
          <main className="main-stage">
            <header className="stage-header">
              <div><h2 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>4 AI-Generated Concepts</h2><p className="text-xs" style={{ opacity: 0.6 }}>Select one to explore its full blueprint</p></div>
              <button className="btn btn-secondary" onClick={() => { setBrd(null); setIdeas([]); navigate('/'); }}><LogOut size={16} /> New Session</button>
            </header>
            <div className="stage-content">
              {/* Fix #11 — stable composite key instead of array index */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
                {ideas.map((idea, i) => (
                  <IdeaCard key={`${idea.title}-${i}`} brd={idea} index={i} onSelect={handleSelectIdea} />
                ))}
              </div>
            </div>
          </main>
        </div>
      );
    }

    // Single-BRD full dashboard
    return (
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-header"><Link to="/" className="brand" onClick={() => { setBrd(null); setIsEditing(false); setTextInput(''); setIdeas([]); }}><FileText size={28} /> HackGinn</Link></div>
          <nav className="sidebar-nav mt-8">
            <div className="text-xs mb-2 mt-4 ml-3" style={{ opacity: 0.5, fontWeight: 600, letterSpacing: '0.05em' }}>DOCUMENT STRUCTURE</div>
            {/* Fix #13 — TAB_KEYS/TAB_LABELS/TAB_ICON_MAP are module-level constants */}
            {TAB_KEYS.map(tab => {
              const Icon = TAB_ICON_MAP[tab];
              return (
                <div key={tab} className={`nav-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  <Icon size={18} /> {TAB_LABELS[tab]}
                </div>
              );
            })}

            {/* My History / Saved Projects Section */}
            <div className="text-xs mb-2 mt-8 ml-3" style={{ opacity: 0.5, fontWeight: 600, letterSpacing: '0.05em' }}>PROJECT LIBRARY</div>
            {historyLoading ? (
              <div className="skeleton-list px-3">{[1, 2, 3].map(i => <div key={i} className="skeleton h-8 w-full mb-2" />)}</div>
            ) : history.length === 0 ? (
              <p className="text-xs text-muted ml-3 opacity-60">No saved projects yet.</p>
            ) : (
              <div className="sidebar-history-list">
                {history.map(item => (
                  <div 
                    key={item.id} 
                    className={`nav-item history-item ${brd?.id === item.id ? 'active' : ''}`}
                    style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                    onClick={() => { setBrd(item); setIdeas([]); setActiveTab('summary'); }}
                  >
                    <FileText size={14} className="flex-shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </div>
                ))}
              </div>
            )}
          </nav>
          <div style={{ padding: '1.25rem', borderTop: '2px solid var(--border-stark)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn btn-secondary w-full" style={{ fontSize: '0.9rem', padding: '0.6rem' }} onClick={() => { setBrd(null); setIdeas([]); navigate('/'); }}><PlusCircle size={16} /> New Blueprint</button>
            <button className="btn btn-secondary w-full" style={{ fontSize: '0.9rem', padding: '0.6rem' }} onClick={() => logout()}><LogOut size={16} /> Sign Out</button>
          </div>
        </aside>
        <main className="main-stage">
          <header className="stage-header">
            <div><h2 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>{activeBrd?.title || 'Select a section'}</h2><p className="text-xs" style={{ opacity: 0.6 }}>{isEditing ? 'Editing Mode — changes not yet saved' : 'View mode'}</p></div>
            <div className="flex gap-4 items-center">
              {isEditing ? (
                <>
                  <button className="btn btn-primary" onClick={handleSaveBrd} disabled={saving}>{saving ? <><Loader2 size={16} className="button-spinner" /> Saving...</> : <><Save size={16} /> Save</>}</button>
                  <button className="btn btn-secondary" onClick={() => { setIsEditing(false); setEditDraft(null); }}><XCircle size={16} /> Cancel</button>
                </>
              ) : (
                <>
                  <button className="btn btn-secondary" disabled={!brd} onClick={handleDownloadPdf}><Download size={16} /> PDF</button>
                  <button className="btn btn-secondary" disabled={!brd} onClick={handleDownloadDocx}><Download size={16} /> DOCX</button>
                  <button className="btn btn-secondary" onClick={startEditing}><Edit3 size={16} /> Edit</button>
                </>
              )}
            </div>
          </header>
          <div className="stage-content"><div className="content-container">{renderActiveTab()}</div></div>
        </main>
      </div>
    );
  };

  // ── Routes ────────────────────────────────────────────────────────────────
  return (
    <Routes>
      <Route path="/" element={renderLandingPage()} />
      <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/signup" element={currentUser ? <Navigate to="/" replace /> : <Signup />} />
      {/* Fix #3 — ProtectedRoute is a stable top-level component, not defined inline */}
      <Route path="/dashboard" element={<ProtectedRoute>{renderDashboard()}</ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
