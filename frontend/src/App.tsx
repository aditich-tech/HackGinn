import React, { useState, useRef } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { generateIdea, uploadFile, uploadText, updateBrd, BRD, downloadPdf, downloadDocx } from './api/api';
import {
    FileText,
    UploadCloud,
    Loader2,
    Save,
    XCircle,
    Download,
    LayoutDashboard,
    ListChecks,
    Users,
    AlertTriangle,
    Clock,
    Edit3,
    PlusCircle,
    Network,
    LogOut,
    Sparkles,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

type TabKey = 'summary' | 'features' | 'techStack' | 'targetAudience' | 'challenges' | 'roadmap';

// ─── Brutalist Idea Card ──────────────────────────────────────────────
const IdeaCard = ({ brd, index, onSelect }: { brd: BRD; index: number; onSelect: (b: BRD) => void }) => {
    const [expanded, setExpanded] = useState(false);
    const colors = ['var(--border-focus)', 'var(--accent-color)', 'var(--danger-color)', 'var(--success-color)'];
    const accent = colors[index % colors.length];

    return (
        <div
            className="section-panel fade-in"
            style={{
                borderTop: `8px solid ${accent}`,
                padding: '1.5rem',
                marginBottom: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}
        >
            <div className="flex items-center justify-between">
                <span className="badge" style={{ background: accent, fontSize: '0.7rem' }}>
                    IDEA {String(index + 1).padStart(2, '0')}
                </span>
                <button
                    className="btn-icon-only"
                    onClick={() => setExpanded(!expanded)}
                    title={expanded ? 'Collapse' : 'Expand'}
                >
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: 1.2 }}>{brd.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.4 }}>
                {brd.summary}
            </p>

            {expanded && (
                <div style={{ borderTop: '2px dotted var(--border-stark)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {brd.techStack && brd.techStack.length > 0 && (
                        <div>
                            <p className="text-xs" style={{ marginBottom: '0.4rem' }}>Tech Stack</p>
                            <div className="flex" style={{ gap: '0.4rem', flexWrap: 'wrap' }}>
                                {brd.techStack.map((t, i) => (
                                    <span key={i} className="badge" style={{ fontSize: '0.7rem', background: 'var(--bg-base)', color: 'var(--text-primary)', boxShadow: '2px 2px 0 var(--border-stark)' }}>{t}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {brd.features && brd.features.length > 0 && (
                        <div>
                            <p className="text-xs" style={{ marginBottom: '0.4rem' }}>Top Features</p>
                            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {brd.features.slice(0, 3).map((f, i) => (
                                    <li key={i} style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                        {typeof f === 'string' ? f : (f as any).description}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <button
                className="btn btn-primary"
                style={{ marginTop: 'auto', padding: '0.65rem 1rem', fontSize: '0.85rem' }}
                onClick={() => onSelect(brd)}
            >
                <Edit3 size={14} /> Select This Idea
            </button>
        </div>
    );
};

// ─── App ─────────────────────────────────────────────────────────────
function App() {
    const [brd, setBrd] = useState<BRD | null>(null);
    const [ideas, setIdeas] = useState<BRD[]>([]);
    const [loading, setLoading] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editDraft, setEditDraft] = useState<BRD | null>(null);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabKey>('summary');
    const [heroTab, setHeroTab] = useState<'upload' | 'paste' | 'generate'>('upload');
    const [generateInputs, setGenerateInputs] = useState({
        teamSize: 1,
        skillLevel: 'Intermediate',
        projectType: 'Software',
        platform: '',
        targetMarket: '',
        techStack: '',
        domain: '',
        constraints: '',
        hackathonHours: 24
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!currentUser) { navigate('/login'); return; }
        const file = event.target.files?.[0];
        if (!file) return;
        setLoading(true);
        try {
            const data = await uploadFile(file);
            setBrd(data);
            setIdeas([]);
            setActiveTab('summary');
            navigate('/dashboard');
        } catch (error) {
            alert('Failed to process the document. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleTextUpload = async () => {
        if (!currentUser) { navigate('/login'); return; }
        if (!textInput.trim()) return;
        setLoading(true);
        try {
            const data = await uploadText(textInput);
            setBrd(data);
            setIdeas([]);
            setActiveTab('summary');
            navigate('/dashboard');
        } catch (error) {
            alert('Failed to process text. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    // ── 4 Parallel Calls ──────────────────────────────────────────────
    const handleGenerateIdea = async () => {
        if (!currentUser) { navigate('/login'); return; }
        setLoading(true);
        try {
            const formattedInputs = {
                ...generateInputs,
                techStack: generateInputs.techStack.split(',').map(s => s.trim()).filter(s => s)
            };
            const [idea1, idea2, idea3, idea4] = await Promise.all([
                generateIdea(formattedInputs),
                generateIdea(formattedInputs),
                generateIdea(formattedInputs),
                generateIdea(formattedInputs),
            ]);
            setIdeas([idea1, idea2, idea3, idea4]);
            setBrd(null);
            navigate('/dashboard');
        } catch (error) {
            alert('Failed to generate ideas. Make sure the backend is running and GROQ_API_KEY is valid.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectIdea = (selected: BRD) => {
        setBrd(selected);
        setIdeas([]);
        setActiveTab('summary');
    };

    const handleSaveBrd = async () => {
        if (!editDraft) return;
        setSaving(true);
        try {
            const data = await updateBrd(editDraft.id, editDraft);
            setBrd(data);
            setIsEditing(false);
            setEditDraft(null);
        } catch (error) {
            alert('Failed to save BRD.');
        } finally {
            setSaving(false);
        }
    };

    const updateDraftArray = (field: keyof BRD, index: number, value: any) => {
        if (!editDraft) return;
        const newArr = [...(editDraft[field] as any[])];
        newArr[index] = value;
        setEditDraft({ ...editDraft, [field]: newArr });
    };

    const updateRoadmapItem = (index: number, key: string, value: string) => {
        if (!editDraft) return;
        const newArr = [...(editDraft.roadmap as any[])];
        newArr[index] = { ...newArr[index], [key]: value };
        setEditDraft({ ...editDraft, roadmap: newArr });
    };

    const removeDraftArrayItem = (field: keyof BRD, index: number) => {
        if (!editDraft) return;
        const newArr = [...(editDraft[field] as any[])];
        newArr.splice(index, 1);
        setEditDraft({ ...editDraft, [field]: newArr });
    };

    const addDraftArrayItem = (field: keyof BRD, emptyObj: any) => {
        if (!editDraft) return;
        setEditDraft({ ...editDraft, [field]: [...(editDraft[field] as any[]), emptyObj] });
    };

    const startEditing = () => {
        setEditDraft(JSON.parse(JSON.stringify(brd)));
        setIsEditing(true);
    };

    const activeBrd = isEditing ? editDraft : brd;

    // ── Tab Renderers ─────────────────────────────────────────────────

    const renderSummaryTab = () => (
        <div className="section-panel fade-in">
            <div className="panel-header">
                <h2><FileText size={24} color="var(--color-accent)" /> Document Overview</h2>
                <p className="text-muted">High-level summary and title of the project.</p>
            </div>
            <div className="item-card">
                <div className="item-content">
                    <label className="text-xs">Project Title</label>
                    {isEditing ? (
                        <input className="input" style={{ fontSize: '1.5rem', fontWeight: 600, padding: '1rem', width: '100%' }}
                            value={activeBrd?.title || ''} onChange={(e) => setEditDraft({ ...editDraft!, title: e.target.value })} />
                    ) : <h1>{activeBrd?.title || 'Untitled Document'}</h1>}
                </div>
            </div>
            <div className="item-card mt-4">
                <div className="item-content">
                    <label className="text-xs">Executive Summary</label>
                    {isEditing ? (
                        <textarea className="textarea mt-2" style={{ minHeight: '300px' }}
                            value={activeBrd?.summary || ''} onChange={(e) => setEditDraft({ ...editDraft!, summary: e.target.value })} />
                    ) : <p className="mt-2" style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text-muted)' }}>{activeBrd?.summary || 'No summary available.'}</p>}
                </div>
            </div>
        </div>
    );

    const renderFeaturesTab = () => (
        <div className="section-panel fade-in">
            <div className="panel-header flex justify-between items-center">
                <div>
                    <h2><ListChecks size={24} color="var(--color-accent)" /> Functional Features</h2>
                    <p className="text-muted">Core features and user flows for the hackathon application.</p>
                </div>
                {isEditing && <button className="btn btn-secondary" onClick={() => addDraftArrayItem('features', '')}><PlusCircle size={16} /> Add Feature</button>}
            </div>
            {(!activeBrd?.features || activeBrd.features.length === 0) ? (
                <div className="empty-state">No features generated.</div>
            ) : (
                <div className="flex-col gap-4">
                    {activeBrd.features.map((feature, idx) => (
                        <div key={idx} className="item-card">
                            <div className="item-content w-full">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="badge">FEATURE-{idx + 1}</span>
                                    {isEditing && <button className="btn-icon-only btn-icon-danger" onClick={() => removeDraftArrayItem('features', idx)}><XCircle size={16} /></button>}
                                </div>
                                {isEditing ? (
                                    <textarea className="textarea" style={{ minHeight: '80px' }} value={typeof feature === 'string' ? feature : (feature as any).description} onChange={(e) => updateDraftArray('features', idx, e.target.value)} />
                                ) : <p style={{ fontWeight: 500 }}>{typeof feature === 'string' ? feature : (feature as any).description}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderTechStackTab = () => (
        <div className="section-panel fade-in">
            <div className="panel-header flex justify-between items-center">
                <div>
                    <h2><LayoutDashboard size={24} color="var(--color-accent)" /> Technical Stack</h2>
                    <p className="text-muted">Recommended tools, frameworks, and database choices.</p>
                </div>
                {isEditing && <button className="btn btn-secondary" onClick={() => addDraftArrayItem('techStack', '')}><PlusCircle size={16} /> Add Skill</button>}
            </div>
            {(!activeBrd?.techStack || activeBrd.techStack.length === 0) ? (
                <div className="empty-state">No tech stack recommended yet.</div>
            ) : (
                <div className="flex-col gap-3">
                    {activeBrd.techStack.map((item, idx) => (
                        <div key={idx} className="item-card" style={{ padding: '1rem', alignItems: 'center' }}>
                            <div className="item-content flex" style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem', width: '100%' }}>
                                <span className="text-xs text-muted" style={{ minWidth: '24px' }}>{(idx + 1).toString().padStart(2, '0')}</span>
                                {isEditing ? (
                                    <input className="input" value={typeof item === 'string' ? item : (item as any).description} onChange={(e) => updateDraftArray('techStack', idx, e.target.value)} />
                                ) : <span style={{ flex: 1, fontWeight: 600 }}>{typeof item === 'string' ? item : (item as any).description}</span>}
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
                <div>
                    <h2><Users size={24} color="var(--color-accent)" /> Target Audience</h2>
                    <p className="text-muted">Primary users and personas for this hackathon project.</p>
                </div>
                {isEditing && <button className="btn btn-secondary" onClick={() => addDraftArrayItem('targetAudience', '')}><PlusCircle size={16} /> Add Audience</button>}
            </div>
            {(!activeBrd?.targetAudience || activeBrd.targetAudience.length === 0) ? (
                <div className="empty-state">No audience defined yet.</div>
            ) : (
                <div className="grid-2 gap-4">
                    {activeBrd.targetAudience.map((persona, idx) => (
                        <div key={idx} className="item-card flex justify-between" style={{ padding: '1rem', alignItems: 'center' }}>
                            {isEditing ? (
                                <input className="input" placeholder="Persona Description" value={typeof persona === 'string' ? persona : (persona as any).name} onChange={(e) => updateDraftArray('targetAudience', idx, e.target.value)} />
                            ) : <span className="font-semibold">{typeof persona === 'string' ? persona : (persona as any).name}</span>}
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
                <div>
                    <h2><AlertTriangle size={24} color="var(--color-danger)" /> Risks & Challenges</h2>
                    <p className="text-muted">Likely hurdles and technical complexity warnings.</p>
                </div>
                {isEditing && <button className="btn btn-secondary" onClick={() => addDraftArrayItem('challenges', '')}><PlusCircle size={16} /> Add Challenge</button>}
            </div>
            {(!activeBrd?.challenges || activeBrd.challenges.length === 0) ? (
                <div className="empty-state">No challenges identified.</div>
            ) : (
                <div className="flex-col gap-4">
                    {activeBrd.challenges.map((challenge, idx) => (
                        <div key={idx} className="item-card" style={{ borderLeft: "3px solid var(--color-danger)" }}>
                            <div className="item-content w-full">
                                {isEditing ? (
                                    <textarea className="textarea" style={{ minHeight: '60px' }} value={typeof challenge === 'string' ? challenge : (challenge as any).description} onChange={(e) => updateDraftArray('challenges', idx, e.target.value)} />
                                ) : <p style={{ fontWeight: 500 }}>{typeof challenge === 'string' ? challenge : (challenge as any).description}</p>}
                            </div>
                            {isEditing && <button className="btn-icon-only btn-icon-danger" onClick={() => removeDraftArrayItem('challenges', idx)} style={{ height: 'fit-content', marginLeft: '1rem' }}><XCircle size={16} /></button>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderRoadmapTab = () => {
        const mvpPhases = activeBrd?.roadmap?.filter(m => m.stage && m.stage.includes('MVP')) || [];
        const scalingPhases = activeBrd?.roadmap?.filter(m => m.stage && m.stage.includes('Scaling')) || [];
        return (
            <div className="section-panel fade-in">
                <div className="panel-header flex justify-between items-center">
                    <div>
                        <h2><Clock size={24} color="var(--color-accent)" /> Execution Roadmap</h2>
                        <p className="text-muted">A phased approach split into Hackathon MVP and Future Scaling.</p>
                    </div>
                    {isEditing && <button className="btn btn-secondary" onClick={() => addDraftArrayItem('roadmap', { stage: 'Hackathon MVP', phase: '', description: '' })}><PlusCircle size={16} /> Add Phase</button>}
                </div>
                {(!activeBrd?.roadmap || activeBrd.roadmap.length === 0) ? (
                    <div className="empty-state">No roadmap generated.</div>
                ) : (
                    <div className="flex-col gap-8">
                        <div>
                            <h3 className="mb-4 text-xl" style={{ borderBottom: '2px dotted var(--border-stark)', paddingBottom: '0.5rem' }}>Core MVP</h3>
                            {mvpPhases.length === 0 ? <p className="text-muted">No MVP phases defined.</p> : (
                                <div className="flex-col gap-4">
                                    {activeBrd!.roadmap.map((item, idx) => {
                                        if (!item.stage || !item.stage.includes('MVP')) return null;
                                        return (
                                            <div key={idx} className="item-card flex-col gap-2">
                                                <div className="flex justify-between items-center w-full">
                                                    {isEditing ? (
                                                        <select className="input mb-2" style={{ width: 'fit-content', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} value={item.stage} onChange={(e) => updateRoadmapItem(idx, 'stage', e.target.value)}>
                                                            <option value="Hackathon MVP">MVP</option>
                                                            <option value="Post-Hackathon Scaling">Scaling</option>
                                                        </select>
                                                    ) : <span className="badge" style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}>MVP</span>}
                                                    {isEditing && <button className="btn-icon-only btn-icon-danger flex-shrink-0" onClick={() => removeDraftArrayItem('roadmap', idx)}><XCircle size={16} /></button>}
                                                </div>
                                                {isEditing ? (
                                                    <div className="flex-col gap-2 w-full">
                                                        <input className="input font-semibold" placeholder="Phase Name" value={item.phase} onChange={(e) => updateRoadmapItem(idx, 'phase', e.target.value)} />
                                                        <textarea className="textarea" placeholder="Description" value={item.description} onChange={(e) => updateRoadmapItem(idx, 'description', e.target.value)} />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <h4 className="mb-1">{item.phase}</h4>
                                                        <p className="text-sm text-muted">{item.description}</p>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="mb-4 text-xl" style={{ borderBottom: '2px dotted var(--border-stark)', paddingBottom: '0.5rem' }}>Post-Hackathon Scaling</h3>
                            {scalingPhases.length === 0 ? <p className="text-muted">No scaling phases defined.</p> : (
                                <div className="flex-col gap-4">
                                    {activeBrd!.roadmap.map((item, idx) => {
                                        if (!item.stage || !item.stage.includes('Scaling')) return null;
                                        return (
                                            <div key={idx} className="item-card flex-col gap-2">
                                                <div className="flex justify-between items-center w-full">
                                                    {isEditing ? (
                                                        <select className="input mb-2" style={{ width: 'fit-content', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} value={item.stage} onChange={(e) => updateRoadmapItem(idx, 'stage', e.target.value)}>
                                                            <option value="Hackathon MVP">MVP</option>
                                                            <option value="Post-Hackathon Scaling">Scaling</option>
                                                        </select>
                                                    ) : <span className="badge" style={{ backgroundColor: 'var(--color-text-main)', color: 'white' }}>Scaling</span>}
                                                    {isEditing && <button className="btn-icon-only btn-icon-danger flex-shrink-0" onClick={() => removeDraftArrayItem('roadmap', idx)}><XCircle size={16} /></button>}
                                                </div>
                                                {isEditing ? (
                                                    <div className="flex-col gap-2 w-full">
                                                        <input className="input font-semibold" placeholder="Phase Name" value={item.phase} onChange={(e) => updateRoadmapItem(idx, 'phase', e.target.value)} />
                                                        <textarea className="textarea" placeholder="Description" value={item.description} onChange={(e) => updateRoadmapItem(idx, 'description', e.target.value)} />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <h4 className="mb-1">{item.phase}</h4>
                                                        <p className="text-sm text-muted">{item.description}</p>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'summary': return renderSummaryTab();
            case 'features': return renderFeaturesTab();
            case 'techStack': return renderTechStackTab();
            case 'targetAudience': return renderTargetAudienceTab();
            case 'challenges': return renderChallengesTab();
            case 'roadmap': return renderRoadmapTab();
            default: return null;
        }
    };

    // ── Loading Skeleton ──────────────────────────────────────────────
    const renderLoadingSkeleton = () => (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="skeleton" style={{ width: '120px', height: '24px' }}></div>
                </div>
                <div className="sidebar-nav mt-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="skeleton mb-2" style={{ width: '100%', height: '36px' }}></div>
                    ))}
                </div>
            </aside>
            <main className="main-stage">
                <header className="stage-header">
                    <div className="skeleton" style={{ width: '200px', height: '24px' }}></div>
                    <div className="skeleton" style={{ width: '100px', height: '36px' }}></div>
                </header>
                <div className="stage-content">
                    <div className="content-container">
                        <div className="section-panel">
                            <div className="panel-header">
                                <div className="skeleton mb-2" style={{ width: '250px', height: '32px' }}></div>
                                <div className="skeleton" style={{ width: '400px', height: '16px' }}></div>
                            </div>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="item-card flex-col gap-4">
                                    <div className="skeleton" style={{ width: '30%', height: '16px' }}></div>
                                    <div className="skeleton" style={{ width: '100%', height: '60px' }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

    // ── Landing Page ──────────────────────────────────────────────────
    const renderLandingPage = () => {
        if (loading) return renderLoadingSkeleton();

        return (
            <div className="landing-page">
                <nav className="landing-nav fade-in">
                    <div className="nav-brand">
                        <FileText size={28} />
                        <span>HackGinn</span>
                    </div>
                    <div className="nav-links">
                        <span className="nav-link">Product</span>
                        <span className="nav-link">Solutions</span>
                        <span className="nav-link">Documentation</span>
                    </div>
                    <div className="nav-actions">
                        {currentUser ? (
                            <>
                                <span className="user-greeting">Hi, {currentUser.displayName || currentUser.email?.split('@')[0]}</span>
                                <Link to="/dashboard" className="btn btn-primary" style={{ textDecoration: 'none' }}>Dashboard</Link>
                                <button className="btn btn-secondary" onClick={() => signOut(auth)}>Logout</button>
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
                        <p className="hero-subtitle-left">
                            We are the intelligent engine for converting hackathon themes into structured project blueprints with unprecedented accuracy.
                        </p>
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
                                    <button className={`hero-tab ${heroTab === 'upload' ? 'active' : ''}`} onClick={() => setHeroTab('upload')}>
                                        <UploadCloud size={16} /> Upload Theme
                                    </button>
                                    <button className={`hero-tab ${heroTab === 'paste' ? 'active' : ''}`} onClick={() => setHeroTab('paste')}>
                                        <FileText size={16} /> Paste Info
                                    </button>
                                    <button className={`hero-tab ${heroTab === 'generate' ? 'active' : ''}`} onClick={() => setHeroTab('generate')}>
                                        <Sparkles size={16} /> Generate 4 Ideas
                                    </button>
                                </div>

                                <div className="hero-card-content">
                                    {heroTab === 'upload' ? (
                                        <div className="upload-zone clean" onClick={() => fileInputRef.current?.click()}>
                                            <div className="icon-ring">
                                                <UploadCloud size={32} color="var(--accent-color)" />
                                            </div>
                                            <div>
                                                <h3 className="mb-1" style={{ fontSize: '1.25rem' }}>Select a hackathon theme file</h3>
                                                <p className="text-sm text-muted">Supports PDF, DOCX, or TXT</p>
                                            </div>
                                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept=".txt,.pdf,.docx" />
                                        </div>
                                    ) : heroTab === 'paste' ? (
                                        <div className="paste-zone fade-in">
                                            <textarea className="hero-textarea clean" placeholder="Paste hackathon theme or meeting notes here..."
                                                value={textInput} onChange={(e) => setTextInput(e.target.value)} />
                                            <div className="flex justify-end mt-4">
                                                <button className="btn btn-primary" onClick={handleTextUpload} disabled={!textInput.trim()}
                                                    style={{ padding: '0.75rem 1.5rem', fontWeight: 500 }}>
                                                    Extract Theme &rarr;
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="generate-zone fade-in" style={{ padding: '0.5rem 0' }}>
                                            <div className="grid-2 gap-4">
                                                <div className="input-stacked">
                                                    <label className="text-xs">Project Type</label>
                                                    <select className="input" value={generateInputs.projectType} onChange={(e) => setGenerateInputs({ ...generateInputs, projectType: e.target.value, platform: '' })}>
                                                        <option>Software</option>
                                                        <option>Hardware</option>
                                                        <option>Hybrid</option>
                                                    </select>
                                                </div>
                                                <div className="input-stacked">
                                                    <label className="text-xs">Category / Platform</label>
                                                    <select className="input" value={generateInputs.platform} onChange={(e) => setGenerateInputs({ ...generateInputs, platform: e.target.value })}>
                                                        {generateInputs.projectType === 'Hardware' ? (
                                                            <>
                                                                <option value="">Select Hardware Type</option>
                                                                <option>IoT Device</option>
                                                                <option>Robotics</option>
                                                                <option>Wearable</option>
                                                                <option>Embedded System</option>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <option value="">Select Software Type</option>
                                                                <option>Web App</option>
                                                                <option>Mobile App</option>
                                                                <option>AI / ML Model</option>
                                                                <option>API / Backend</option>
                                                                <option>CLI / Tool</option>
                                                            </>
                                                        )}
                                                    </select>
                                                </div>
                                                <div className="input-stacked">
                                                    <label className="text-xs">Target Market</label>
                                                    <select className="input" value={generateInputs.targetMarket} onChange={(e) => setGenerateInputs({ ...generateInputs, targetMarket: e.target.value })}>
                                                        <option value="">Any Market</option>
                                                        <option>B2B (Enterprise)</option>
                                                        <option>B2C (Consumer)</option>
                                                        <option>B2B2C</option>
                                                        <option>Internal Tool</option>
                                                        <option>Open Source</option>
                                                    </select>
                                                </div>
                                                <div className="input-stacked">
                                                    <label className="text-xs">Tech Stack (Comma Separated)</label>
                                                    <input className="input" placeholder="React, Node.js..." value={generateInputs.techStack} onChange={(e) => setGenerateInputs({ ...generateInputs, techStack: e.target.value })} />
                                                </div>
                                                <div className="input-stacked">
                                                    <label className="text-xs">Domain / Focus Area</label>
                                                    <input className="input" placeholder="FinTech, Health, EdTech..." value={generateInputs.domain} onChange={(e) => setGenerateInputs({ ...generateInputs, domain: e.target.value })} />
                                                </div>
                                                <div className="input-stacked">
                                                    <label className="text-xs">Team Skill Level</label>
                                                    <select className="input" value={generateInputs.skillLevel} onChange={(e) => setGenerateInputs({ ...generateInputs, skillLevel: e.target.value })}>
                                                        <option>Beginner</option>
                                                        <option>Intermediate</option>
                                                        <option>Advanced</option>
                                                        <option>Vibe Coder</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 mt-4 items-center justify-between">
                                                <div className="input-stacked" style={{ flex: 1 }}>
                                                    <label className="text-xs">Constraints (Optional)</label>
                                                    <input className="input" style={{ fontSize: '0.9rem' }} placeholder="e.g. Must use cloud" value={generateInputs.constraints} onChange={(e) => setGenerateInputs({ ...generateInputs, constraints: e.target.value })} />
                                                </div>
                                                <div className="input-stacked" style={{ width: '80px' }}>
                                                    <label className="text-xs">Team</label>
                                                    <input type="number" className="input" value={generateInputs.teamSize} onChange={(e) => setGenerateInputs({ ...generateInputs, teamSize: parseInt(e.target.value) })} min="1" max="10" />
                                                </div>
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
                                <div className="abstract-card blue-card">
                                    <FileText size={48} className="illustration-icon" />
                                    <div className="skeleton-line"></div>
                                    <div className="skeleton-line short"></div>
                                </div>
                                <div className="abstract-card violet-card">
                                    <ListChecks size={40} className="illustration-icon" />
                                    <div className="skeleton-line"></div>
                                    <div className="skeleton-line medium"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="feature-cards-section fade-in">
                    <div className="feature-card">
                        <UploadCloud size={32} className="feature-icon" />
                        <h3>Skill Mapping</h3>
                        <p>Generate ideas that perfectly match your team's technical expertise and learning goals.</p>
                        <a href="#learn" className="feature-link">Learn More &rarr;</a>
                    </div>
                    <div className="feature-card">
                        <LayoutDashboard size={32} className="feature-icon" />
                        <h3>Technical Blueprint</h3>
                        <p>Get a full architecture breakdown including database schemas and recommended API designs.</p>
                        <a href="#learn" className="feature-link">Learn More &rarr;</a>
                    </div>
                    <div className="feature-card">
                        <AlertTriangle size={32} className="feature-icon" />
                        <h3>Risk Analysis</h3>
                        <p>Avoid common hackathon pitfalls with AI-identified technical risks and mitigation plans.</p>
                        <a href="#learn" className="feature-link">Learn More &rarr;</a>
                    </div>
                    <div className="feature-card">
                        <Network size={32} className="feature-icon" />
                        <h3>Execution Roadmap</h3>
                        <p>Convert your idea into a 24/48-hour phased timeline to ensure you finish on time.</p>
                        <a href="#learn" className="feature-link">Learn More &rarr;</a>
                    </div>
                </div>

                <div className="landing-backdrop-diagonal"></div>
            </div>
        );
    };

    // ── Dashboard ─────────────────────────────────────────────────────
    const renderDashboard = () => {
        // Show 4-card grid when ideas are generated
        if (ideas.length > 0 && !brd) {
            return (
                <div className="dashboard-layout">
                    <aside className="sidebar">
                        <div className="sidebar-header">
                            <Link to="/" className="brand" onClick={() => { setBrd(null); setIdeas([]); }}>
                                <FileText size={28} /> HackGinn
                            </Link>
                        </div>
                        <nav className="sidebar-nav mt-8">
                            <div className="text-xs mb-2 mt-4 ml-3" style={{ opacity: 0.5, fontWeight: 600 }}>AI RESULTS</div>
                            <div className="nav-item active">
                                <Sparkles size={18} /> 4 Generated Ideas
                            </div>
                        </nav>
                        <div style={{ padding: '1.25rem', borderTop: '2px solid var(--border-stark)', marginTop: 'auto' }}>
                            <button className="btn btn-secondary w-full" onClick={() => { setBrd(null); setIdeas([]); navigate('/'); }}>
                                <LogOut size={16} /> Back to Home
                            </button>
                        </div>
                    </aside>
                    <main className="main-stage">
                        <header className="stage-header">
                            <div>
                                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>4 AI-Generated Concepts</h2>
                                <p className="text-xs" style={{ opacity: 0.6 }}>Select one to explore its full blueprint</p>
                            </div>
                            <button className="btn btn-secondary" onClick={() => { setBrd(null); setIdeas([]); navigate('/'); }}>
                                <LogOut size={16} /> New Session
                            </button>
                        </header>
                        <div className="stage-content">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
                                {ideas.map((idea, i) => (
                                    <IdeaCard key={i} brd={idea} index={i} onSelect={handleSelectIdea} />
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            );
        }

        // Classic single-BRD dashboard
        return (
            <div className="dashboard-layout">
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <Link to="/" className="brand" onClick={() => { setBrd(null); setIsEditing(false); setTextInput(''); setIdeas([]); }}>
                            <FileText size={28} /> HackGinn
                        </Link>
                    </div>
                    <nav className="sidebar-nav mt-8">
                        <div className="text-xs mb-2 mt-4 ml-3" style={{ opacity: 0.5, fontWeight: 600, letterSpacing: '0.05em' }}>DOCUMENT STRUCTURE</div>
                        {(['summary', 'features', 'techStack', 'targetAudience', 'challenges', 'roadmap'] as TabKey[]).map((tab) => {
                            const icons: Record<TabKey, React.ReactNode> = {
                                summary: <LayoutDashboard size={18} />, features: <ListChecks size={18} />,
                                techStack: <LayoutDashboard size={18} />, targetAudience: <Users size={18} />,
                                challenges: <AlertTriangle size={18} />, roadmap: <Clock size={18} />
                            };
                            const labels: Record<TabKey, string> = {
                                summary: 'Summary Overview', features: 'Functional Features',
                                techStack: 'Technical Stack', targetAudience: 'Target Audience',
                                challenges: 'Risks & Challenges', roadmap: 'Execution Roadmap'
                            };
                            return (
                                <div key={tab} className={`nav-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                                    {icons[tab]} {labels[tab]}
                                </div>
                            );
                        })}
                    </nav>
                    <div style={{ padding: '1.25rem', borderTop: '2px solid var(--border-stark)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button className="btn btn-secondary w-full" style={{ fontSize: '0.9rem', padding: '0.6rem' }}
                            onClick={() => { downloadPdf(brd!.id, brd!.title); }}>
                            <Download size={16} /> PDF
                        </button>
                        <button className="btn btn-secondary w-full" style={{ fontSize: '0.9rem', padding: '0.6rem' }}
                            onClick={() => { downloadDocx(brd!.id, brd!.title); }}>
                            <Download size={16} /> DOCX
                        </button>
                        <button className="btn btn-secondary w-full" style={{ fontSize: '0.9rem', padding: '0.6rem' }}
                            onClick={() => signOut(auth)}>
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                </aside>

                <main className="main-stage">
                    <header className="stage-header">
                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>{activeBrd?.title || 'Select a section'}</h2>
                            <p className="text-xs" style={{ opacity: 0.6 }}>{isEditing ? 'Editing Mode — changes not yet saved' : 'View mode'}</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            {isEditing ? (
                                <>
                                    <button className="btn btn-primary" onClick={handleSaveBrd} disabled={saving}>
                                        {saving ? <><Loader2 size={16} className="button-spinner" /> Saving...</> : <><Save size={16} /> Save</>}
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => { setIsEditing(false); setEditDraft(null); }}>
                                        <XCircle size={16} /> Cancel
                                    </button>
                                </>
                            ) : (
                                <button className="btn btn-secondary" onClick={startEditing}>
                                    <Edit3 size={16} /> Edit
                                </button>
                            )}
                        </div>
                    </header>
                    <div className="stage-content">
                        <div className="content-container">{renderActiveTab()}</div>
                    </div>
                </main>
            </div>
        );
    };

    // ── Protected Route ───────────────────────────────────────────────
    const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
        const { currentUser, loading: authLoading } = useAuth();
        if (authLoading) return renderLoadingSkeleton();
        if (!currentUser) return <Navigate to="/login" replace />;
        return <>{children}</>;
    };

    // ── Routes ────────────────────────────────────────────────────────
    return (
        <Routes>
            <Route path="/" element={renderLandingPage()} />
            <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/signup" element={currentUser ? <Navigate to="/dashboard" replace /> : <Signup />} />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    {renderDashboard()}
                </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
