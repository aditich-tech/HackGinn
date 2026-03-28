import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FileText, LayoutDashboard, ListChecks, Settings, Users,
    AlertTriangle, Clock, PlusCircle, LogOut, History
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { BRD, getMyIdeas } from '../../api/api';

type TabKey = 'summary' | 'features' | 'techStack' | 'targetAudience' | 'challenges' | 'roadmap';

interface SidebarProps {
    activeBrd: BRD | null;
    setBrd: (brd: BRD | null) => void;
    setIsEditing: (v: boolean) => void;
    setTextInput: (v: string) => void;
    activeTab: TabKey;
    setActiveTab: (tab: TabKey) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    activeBrd, setBrd, setIsEditing, setTextInput, activeTab, setActiveTab
}) => {
    const navigate = useNavigate();
    const [history, setHistory] = useState<BRD[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    useEffect(() => {
        getMyIdeas()
            .then(setHistory)
            .catch(() => setHistory([]))
            .finally(() => setHistoryLoading(false));
    }, [activeBrd]); // re-fetch whenever a new blueprint is generated

    const handleNewDocument = () => {
        setBrd(null);
        setIsEditing(false);
        setTextInput('');
        navigate('/');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Link to="/" className="brand" onClick={handleNewDocument}>
                    <FileText size={28} />
                    HackGinn
                </Link>
            </div>

            <nav className="sidebar-nav">
                {/* Document Structure Tabs */}
                <div className="text-xs mb-2 mt-4 ml-3" style={{ opacity: 0.5, fontWeight: 600, letterSpacing: '0.05em' }}>DOCUMENT STRUCTURE</div>
                {([
                    { key: 'summary', icon: <LayoutDashboard size={18} />, label: 'Summary Overview' },
                    { key: 'features', icon: <ListChecks size={18} />, label: 'Features', count: activeBrd?.features?.length },
                    { key: 'techStack', icon: <Settings size={18} />, label: 'Tech Stack' },
                    { key: 'targetAudience', icon: <Users size={18} />, label: 'Target Audience' },
                    { key: 'challenges', icon: <AlertTriangle size={18} />, label: 'Challenges' },
                    { key: 'roadmap', icon: <Clock size={18} />, label: 'Roadmap' },
                ] as { key: TabKey; icon: React.ReactNode; label: string; count?: number }[]).map(({ key, icon, label, count }) => (
                    <div key={key} className={`nav-item ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>
                        {icon} {label}
                        {count !== undefined && (
                            <span className="badge ml-auto" style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)' }}>{count}</span>
                        )}
                    </div>
                ))}

                {/* My History Section */}
                <div className="text-xs mb-2 mt-6 ml-3" style={{ opacity: 0.5, fontWeight: 600, letterSpacing: '0.05em' }}>
                    <History size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    MY HISTORY
                </div>
                {historyLoading ? (
                    <div className="flex-col gap-2 px-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton" style={{ height: '32px', width: '100%' }} />
                        ))}
                    </div>
                ) : history.length === 0 ? (
                    <p className="text-xs text-muted ml-3" style={{ opacity: 0.6 }}>No past blueprints yet.</p>
                ) : (
                    <div className="flex-col gap-1">
                        {history.map((item) => (
                            <div
                                key={item.id}
                                className={`nav-item ${activeBrd?.id === item.id ? 'active' : ''}`}
                                style={{ fontSize: '0.8rem', padding: '0.6rem 1.15rem' }}
                                onClick={() => {
                                    setBrd(item);
                                    setIsEditing(false);
                                    navigate('/dashboard');
                                }}
                                title={item.title}
                            >
                                <FileText size={14} style={{ flexShrink: 0 }} />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {item.title.length > 28 ? item.title.substring(0, 28) + '…' : item.title}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom Actions */}
                <div style={{ marginTop: 'auto', paddingBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button className="btn btn-secondary w-full flex items-center justify-center gap-2" onClick={handleNewDocument}>
                        <PlusCircle size={16} /> New Document
                    </button>
                    <button
                        className="btn btn-secondary w-full flex items-center justify-center gap-2"
                        onClick={async () => {
                            await signOut(auth);
                            navigate('/login');
                        }}
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </nav>
        </aside>
    );
};
