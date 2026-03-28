import React from 'react';
import {
    FileText, ListChecks, LayoutDashboard, Users,
    AlertTriangle, Clock, XCircle, PlusCircle
} from 'lucide-react';
import { BRD } from '../../api/api';

type TabKey = 'summary' | 'features' | 'techStack' | 'targetAudience' | 'challenges' | 'roadmap';

interface TabsProps {
    activeTab: TabKey;
    activeBrd: BRD | null;
    isEditing: boolean;
    setEditDraft: React.Dispatch<React.SetStateAction<BRD | null>>;
    editDraft: BRD | null;
}

function useArrayHelpers(editDraft: BRD | null, setEditDraft: React.Dispatch<React.SetStateAction<BRD | null>>) {
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
    return { updateDraftArray, updateRoadmapItem, removeDraftArrayItem, addDraftArrayItem };
}

export const DashboardTabs: React.FC<TabsProps> = ({ activeTab, activeBrd, isEditing, editDraft, setEditDraft }) => {
    const { updateDraftArray, updateRoadmapItem, removeDraftArrayItem, addDraftArrayItem } =
        useArrayHelpers(editDraft, setEditDraft);

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
                        <input
                            className="input"
                            style={{ fontSize: '1.5rem', fontWeight: 600, padding: '1rem', width: '100%' }}
                            value={activeBrd?.title || ''}
                            onChange={(e) => setEditDraft({ ...editDraft!, title: e.target.value })}
                        />
                    ) : (
                        <h1>{activeBrd?.title || 'Untitled Document'}</h1>
                    )}
                </div>
            </div>
            <div className="item-card mt-4">
                <div className="item-content">
                    <label className="text-xs">Executive Summary</label>
                    {isEditing ? (
                        <textarea
                            className="textarea mt-2"
                            style={{ minHeight: '300px' }}
                            value={activeBrd?.summary || ''}
                            onChange={(e) => setEditDraft({ ...editDraft!, summary: e.target.value })}
                        />
                    ) : (
                        <p className="mt-2" style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text-muted)' }}>
                            {activeBrd?.summary || 'No summary available.'}
                        </p>
                    )}
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
                {isEditing && (
                    <button className="btn btn-secondary" onClick={() => addDraftArrayItem('features', '')}>
                        <PlusCircle size={16} /> Add Feature
                    </button>
                )}
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
                                    {isEditing && (
                                        <button className="btn-icon-only btn-icon-danger" onClick={() => removeDraftArrayItem('features', idx)}>
                                            <XCircle size={16} />
                                        </button>
                                    )}
                                </div>
                                {isEditing ? (
                                    <textarea className="textarea" style={{ minHeight: '80px' }}
                                        value={typeof feature === 'string' ? feature : (feature as any).description}
                                        onChange={(e) => updateDraftArray('features', idx, e.target.value)} />
                                ) : (
                                    <p style={{ fontWeight: 500 }}>{typeof feature === 'string' ? feature : (feature as any).description}</p>
                                )}
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
                {isEditing && (
                    <button className="btn btn-secondary" onClick={() => addDraftArrayItem('techStack', '')}>
                        <PlusCircle size={16} /> Add Skill
                    </button>
                )}
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
                                    <input className="input" value={typeof item === 'string' ? item : (item as any).description}
                                        onChange={(e) => updateDraftArray('techStack', idx, e.target.value)} />
                                ) : (
                                    <span style={{ flex: 1, fontWeight: 600 }}>{typeof item === 'string' ? item : (item as any).description}</span>
                                )}
                            </div>
                            {isEditing && (
                                <button className="btn-icon-only btn-icon-danger flex-shrink-0" onClick={() => removeDraftArrayItem('techStack', idx)}><XCircle size={16} /></button>
                            )}
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
                {isEditing && (
                    <button className="btn btn-secondary" onClick={() => addDraftArrayItem('targetAudience', '')}>
                        <PlusCircle size={16} /> Add Audience
                    </button>
                )}
            </div>
            {(!activeBrd?.targetAudience || activeBrd.targetAudience.length === 0) ? (
                <div className="empty-state">No target audience defined.</div>
            ) : (
                <div className="flex-col gap-3">
                    {activeBrd.targetAudience.map((persona, idx) => (
                        <div key={idx} className="item-card" style={{ padding: '1rem' }}>
                            <div className="item-content w-full">
                                {isEditing ? (
                                    <input className="input" value={typeof persona === 'string' ? persona : (persona as any).description}
                                        onChange={(e) => updateDraftArray('targetAudience', idx, e.target.value)} />
                                ) : (
                                    <p style={{ fontWeight: 500 }}>{typeof persona === 'string' ? persona : (persona as any).description}</p>
                                )}
                            </div>
                            {isEditing && (
                                <button className="btn-icon-only btn-icon-danger flex-shrink-0" onClick={() => removeDraftArrayItem('targetAudience', idx)}><XCircle size={16} /></button>
                            )}
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
                    <h2><AlertTriangle size={24} color="var(--color-accent)" /> Challenges & Risks</h2>
                    <p className="text-muted">Anticipated technical and strategic risks to mitigate.</p>
                </div>
                {isEditing && (
                    <button className="btn btn-secondary" onClick={() => addDraftArrayItem('challenges', '')}>
                        <PlusCircle size={16} /> Add Challenge
                    </button>
                )}
            </div>
            {(!activeBrd?.challenges || activeBrd.challenges.length === 0) ? (
                <div className="empty-state">No challenges identified.</div>
            ) : (
                <div className="flex-col gap-4">
                    {activeBrd.challenges.map((challenge, idx) => (
                        <div key={idx} className="item-card" style={{ borderLeft: '3px solid var(--color-danger)' }}>
                            <div className="item-content w-full">
                                {isEditing ? (
                                    <textarea className="textarea" style={{ minHeight: '60px' }}
                                        value={typeof challenge === 'string' ? challenge : (challenge as any).description}
                                        onChange={(e) => updateDraftArray('challenges', idx, e.target.value)} />
                                ) : (
                                    <p style={{ fontWeight: 500 }}>{typeof challenge === 'string' ? challenge : (challenge as any).description}</p>
                                )}
                            </div>
                            {isEditing && (
                                <button className="btn-icon-only btn-icon-danger" onClick={() => removeDraftArrayItem('challenges', idx)} style={{ height: 'fit-content', marginLeft: '1rem' }}><XCircle size={16} /></button>
                            )}
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
                    {isEditing && (
                        <button className="btn btn-secondary" onClick={() => addDraftArrayItem('roadmap', { stage: 'Hackathon MVP', phase: '', description: '' })}>
                            <PlusCircle size={16} /> Add Phase
                        </button>
                    )}
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
                                                    ) : (
                                                        <span className="badge" style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}>MVP</span>
                                                    )}
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
                                                    ) : (
                                                        <span className="badge" style={{ backgroundColor: 'var(--color-text-main)', color: 'white' }}>Scaling</span>
                                                    )}
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
