import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';
import { BRD, generateIdea, uploadFile, uploadText } from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';

type HeroTab = 'upload' | 'paste' | 'generate';

interface GenerateInputs {
    teamSize: number;
    skillLevel: string;
    projectType: string;
    platform: string;
    targetMarket: string;
    techStack: string;
    domain: string;
    constraints: string;
    hackathonHours: number;
}

interface HeroCardProps {
    heroTab: HeroTab;
    setHeroTab: (t: HeroTab) => void;
    textInput: string;
    setTextInput: (v: string) => void;
    generateInputs: GenerateInputs;
    setGenerateInputs: React.Dispatch<React.SetStateAction<GenerateInputs>>;
    setLoading: (v: boolean) => void;
    setBrd: (brd: BRD) => void;
    setActiveTab: (tab: any) => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({
    heroTab, setHeroTab, textInput, setTextInput,
    generateInputs, setGenerateInputs, setLoading, setBrd, setActiveTab
}) => {
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
            setActiveTab('summary');
            navigate('/dashboard');
        } catch { alert('Failed to process the document. Make sure the backend is running.'); }
        finally { setLoading(false); }
    };

    const handleTextUpload = async () => {
        if (!currentUser) { navigate('/login'); return; }
        if (!textInput.trim()) return;
        setLoading(true);
        try {
            const data = await uploadText(textInput);
            setBrd(data);
            setActiveTab('summary');
            navigate('/dashboard');
        } catch { alert('Failed to process text. Make sure the backend is running.'); }
        finally { setLoading(false); }
    };

    const handleGenerateIdea = async () => {
        if (!currentUser) { navigate('/login'); return; }
        setLoading(true);
        try {
            const formattedInputs = {
                ...generateInputs,
                techStack: generateInputs.techStack.split(',').map(s => s.trim()).filter(s => s)
            };
            const data = await generateIdea(formattedInputs);
            setBrd(data);
            setActiveTab('summary');
            navigate('/dashboard');
        } catch { alert('Failed to generate idea. Make sure the backend is running and the GROQ_API_KEY is valid.'); }
        finally { setLoading(false); }
    };

    return (
        <div className="hero-card">
            <div className="hero-tabs">
                <button className={`hero-tab ${heroTab === 'upload' ? 'active' : ''}`} onClick={() => setHeroTab('upload')}>
                    <UploadCloud size={16} /> Upload Theme
                </button>
                <button className={`hero-tab ${heroTab === 'paste' ? 'active' : ''}`} onClick={() => setHeroTab('paste')}>
                    <FileText size={16} /> Paste Info
                </button>
                <button className={`hero-tab ${heroTab === 'generate' ? 'active' : ''}`} onClick={() => setHeroTab('generate')}>
                    <Loader2 size={16} /> Personalized Generate
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
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload}
                            style={{ display: 'none' }} accept=".txt,.pdf,.docx" />
                    </div>
                ) : heroTab === 'paste' ? (
                    <div className="paste-zone fade-in">
                        <textarea
                            className="hero-textarea clean"
                            placeholder="Paste hackathon theme or meeting notes here..."
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                        />
                        <div className="flex justify-end mt-4">
                            <button className="btn btn-primary" onClick={handleTextUpload}
                                disabled={!textInput.trim()} style={{ padding: '0.75rem 1.5rem', fontWeight: 500 }}>
                                Step 1: Extract Theme &rarr;
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="generate-zone fade-in" style={{ padding: '0.5rem 0' }}>
                        <div className="grid-2 gap-4">
                            <div className="input-stacked">
                                <label className="text-xs">Project Type</label>
                                <select className="input" value={generateInputs.projectType}
                                    onChange={(e) => setGenerateInputs({ ...generateInputs, projectType: e.target.value, platform: '' })}>
                                    <option>Software</option>
                                    <option>Hardware</option>
                                    <option>Hybrid</option>
                                </select>
                            </div>
                            <div className="input-stacked">
                                <label className="text-xs">Category / Platform</label>
                                <select className="input" value={generateInputs.platform}
                                    onChange={(e) => setGenerateInputs({ ...generateInputs, platform: e.target.value })}>
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
                                <select className="input" value={generateInputs.targetMarket}
                                    onChange={(e) => setGenerateInputs({ ...generateInputs, targetMarket: e.target.value })}>
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
                                <input className="input" placeholder="React, Node.js..." value={generateInputs.techStack}
                                    onChange={(e) => setGenerateInputs({ ...generateInputs, techStack: e.target.value })} />
                            </div>
                            <div className="input-stacked">
                                <label className="text-xs">Domain / Focus Area</label>
                                <input className="input" placeholder="FinTech, Health, EdTech..." value={generateInputs.domain}
                                    onChange={(e) => setGenerateInputs({ ...generateInputs, domain: e.target.value })} />
                            </div>
                            <div className="input-stacked">
                                <label className="text-xs">Team Skill Level</label>
                                <select className="input" value={generateInputs.skillLevel}
                                    onChange={(e) => setGenerateInputs({ ...generateInputs, skillLevel: e.target.value })}>
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                    <option>Vibe Coder</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-4 align-center justify-between">
                            <div className="input-stacked" style={{ flex: 1 }}>
                                <label className="text-xs">Constraints (Optional)</label>
                                <input className="input" style={{ fontSize: '0.9rem' }} placeholder="e.g. Must use cloud"
                                    value={generateInputs.constraints}
                                    onChange={(e) => setGenerateInputs({ ...generateInputs, constraints: e.target.value })} />
                            </div>
                            <div className="input-stacked" style={{ width: '80px' }}>
                                <label className="text-xs">Team</label>
                                <input type="number" className="input" value={generateInputs.teamSize}
                                    onChange={(e) => setGenerateInputs({ ...generateInputs, teamSize: parseInt(e.target.value) })}
                                    min="1" max="10" />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button className="btn btn-primary" onClick={handleGenerateIdea} style={{ padding: '0.75rem 2.5rem' }}>
                                Launch HackGinn &rarr;
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
