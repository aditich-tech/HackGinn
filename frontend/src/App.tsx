import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { updateBrd, BRD, downloadPdf, downloadDocx } from './api/api';
import {
    FileText, UploadCloud, Loader2, Save, XCircle,
    Download, Edit3, ListChecks, Network, AlertTriangle, LayoutDashboard
} from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { Sidebar } from './components/layout/Sidebar';
import { HeroCard } from './components/forms/HeroCard';
import { DashboardTabs } from './components/dashboard/DashboardTabs';

type TabKey = 'summary' | 'features' | 'techStack' | 'targetAudience' | 'challenges' | 'roadmap';

function App() {
    const [brd, setBrd] = useState<BRD | null>(null);
    const [loading, setLoading] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editDraft, setEditDraft] = useState<BRD | null>(null);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabKey>('summary');
    const [heroTab, setHeroTab] = useState<'upload' | 'paste' | 'generate'>('upload');
    const [generateInputs, setGenerateInputs] = useState({
        teamSize: 1, skillLevel: 'Intermediate', projectType: 'Software',
        platform: '', targetMarket: '', techStack: '', domain: '', constraints: '', hackathonHours: 24
    });

    const { currentUser } = useAuth();
    const activeBrd = isEditing ? editDraft : brd;

    const handleSaveBrd = async () => {
        if (!editDraft) return;
        setSaving(true);
        try {
            const data = await updateBrd(editDraft.id, editDraft);
            setBrd(data);
            setIsEditing(false);
            setEditDraft(null);
        } catch { alert('Failed to save BRD.'); }
        finally { setSaving(false); }
    };

    const startEditing = () => {
        setEditDraft(JSON.parse(JSON.stringify(brd)));
        setIsEditing(true);
    };

    // ==========================================
    // LOADING SKELETON
    // ==========================================
    if (loading) {
        return (
            <div className="dashboard-layout">
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <div className="skeleton" style={{ width: '120px', height: '24px' }} />
                    </div>
                    <div className="sidebar-nav mt-8">
                        <div className="skeleton mb-4" style={{ width: '80px', height: '12px' }} />
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="skeleton mb-2" style={{ width: '100%', height: '36px' }} />
                        ))}
                    </div>
                </aside>
                <main className="main-stage">
                    <header className="stage-header">
                        <div className="skeleton" style={{ width: '200px', height: '24px' }} />
                        <div className="skeleton" style={{ width: '100px', height: '36px' }} />
                    </header>
                    <div className="stage-content">
                        <div className="content-container">
                            <div className="section-panel">
                                <div className="panel-header">
                                    <div className="skeleton mb-2" style={{ width: '250px', height: '32px' }} />
                                    <div className="skeleton" style={{ width: '400px', height: '16px' }} />
                                </div>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="item-card flex-col gap-4">
                                        <div className="skeleton" style={{ width: '30%', height: '16px' }} />
                                        <div className="skeleton" style={{ width: '100%', height: '60px' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // ==========================================
    // LANDING PAGE
    // ==========================================
    const renderLandingPage = () => (
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
                        We are the intelligent engine for converting transcripts and scattered notes into structured Business Requirements with unprecedented accuracy.
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
                        <HeroCard
                            heroTab={heroTab} setHeroTab={setHeroTab}
                            textInput={textInput} setTextInput={setTextInput}
                            generateInputs={generateInputs} setGenerateInputs={setGenerateInputs}
                            setLoading={setLoading} setBrd={setBrd} setActiveTab={setActiveTab}
                        />
                    ) : (
                        <div className="hero-illustration">
                            <div className="abstract-card blue-card">
                                <FileText size={48} className="illustration-icon" />
                                <div className="skeleton-line" />
                                <div className="skeleton-line short" />
                            </div>
                            <div className="abstract-card violet-card">
                                <ListChecks size={40} className="illustration-icon" />
                                <div className="skeleton-line" />
                                <div className="skeleton-line medium" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="feature-cards-section fade-in">
                {[
                    { icon: <UploadCloud size={32} />, title: 'Skill Mapping', desc: "Generate ideas that perfectly match your team's technical expertise and learning goals." },
                    { icon: <LayoutDashboard size={32} />, title: 'Technical Blueprint', desc: 'Get a full architecture breakdown including database schemas and recommended API designs.' },
                    { icon: <AlertTriangle size={32} />, title: 'Risk Analysis', desc: 'Avoid common hackathon pitfalls with AI-identified technical risks and mitigation plans.' },
                    { icon: <Network size={32} />, title: 'Execution Roadmap', desc: 'Convert your idea into a 24/48-hour phased timeline to ensure you finish on time.' },
                ].map(({ icon, title, desc }) => (
                    <div key={title} className="feature-card">
                        <span className="feature-icon">{icon}</span>
                        <h3>{title}</h3>
                        <p>{desc}</p>
                        <a href="#learn" className="feature-link">Learn More &rarr;</a>
                    </div>
                ))}
            </div>
            <div className="landing-backdrop-diagonal" />
        </div>
    );

    // ==========================================
    // DASHBOARD
    // ==========================================
    const renderDashboard = () => (
        <div className="dashboard-layout">
            <Sidebar
                activeBrd={activeBrd}
                setBrd={setBrd}
                setIsEditing={setIsEditing}
                setTextInput={setTextInput}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <main className="main-stage">
                <header className="stage-header">
                    <div className="flex items-center gap-4">
                        {isEditing ? (
                            <span className="badge" style={{ color: 'var(--color-accent)', borderColor: 'var(--color-border-focus)' }}>Editing Draft</span>
                        ) : (
                            <span className="badge">Read-Only</span>
                        )}
                        <h3 className="m-0 text-lg font-medium" style={{ color: 'var(--color-text-main)' }}>
                            {activeBrd?.title
                                ? activeBrd.title.substring(0, 60) + (activeBrd.title.length > 60 ? '...' : '')
                                : 'Untitled Document'}
                        </h3>
                    </div>

                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <button className="btn btn-secondary" onClick={() => { setIsEditing(false); setEditDraft(null); }} disabled={saving}>
                                    <XCircle size={16} /> Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleSaveBrd} disabled={saving}>
                                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-secondary" onClick={startEditing}>
                                    <Edit3 size={16} /> Edit
                                </button>
                                {brd && (
                                    <>
                                        <button onClick={() => downloadPdf(brd.id, brd.title)} className="btn btn-primary">
                                            <Download size={16} /> PDF
                                        </button>
                                        <button onClick={() => downloadDocx(brd.id, brd.title)} className="btn btn-primary">
                                            <Download size={16} /> DOCX
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </header>

                <div className="stage-content">
                    <div className="content-container">
                        <DashboardTabs
                            activeTab={activeTab}
                            activeBrd={activeBrd}
                            isEditing={isEditing}
                            editDraft={editDraft}
                            setEditDraft={setEditDraft}
                        />
                    </div>
                </div>
            </main>
        </div>
    );

    const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
        const { currentUser, loading } = useAuth();
        if (loading) return null;
        if (!currentUser) return <Navigate to="/login" replace />;
        return <>{children}</>;
    };

    return (
        <Routes>
            <Route path="/" element={renderLandingPage()} />
            <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/signup" element={currentUser ? <Navigate to="/dashboard" replace /> : <Signup />} />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    {(!activeBrd && !loading) ? <Navigate to="/" replace /> : renderDashboard()}
                </ProtectedRoute>
            } />
        </Routes>
    );
}

export default App;
