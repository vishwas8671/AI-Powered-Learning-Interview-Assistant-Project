import React, { useState } from 'react';
import axios from 'axios';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Plus
} from 'lucide-react';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('ats'); // ats, bullet, projects, grammar

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF resumes are supported.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setAnalysis(null);
    
    // Animate loader steps for premium look
    setLoadingStep('Uploading PDF binary...');
    setTimeout(() => setLoadingStep('Extracting layout content...'), 800);
    setTimeout(() => setLoadingStep('Mapping skill arrays to recruitment models...'), 1600);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await axios.post('/api/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">AI Resume Analyzer</h1>
        <p className="text-xs text-slate-400 mt-1">Audit your resume for Applicant Tracking Systems (ATS) and tech gaps.</p>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto">
        {!analysis && !loading && (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto glow-primary">
              <FileText size={28} />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Upload Resume</h3>
              <p className="text-xs text-slate-400">PDF formatted resumes only. The parser compiles contact info, skills, education, and bullet headers.</p>
            </div>

            {error && (
              <div className="p-3 max-w-md mx-auto text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleUpload} className="max-w-md mx-auto space-y-4">
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-850 rounded-2xl p-6 hover:border-primary-500/50 transition cursor-pointer group">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center space-y-2">
                  <Upload size={24} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
                  <span className="text-xs font-bold text-slate-650 dark:text-slate-350">
                    {file ? file.name : 'Select file or drag it here'}
                  </span>
                  <span className="text-[10px] text-slate-450">Limit 5MB</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!file}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-650 text-white font-bold rounded-xl shadow-md hover:scale-[0.99] transition disabled:opacity-40 text-xs"
              >
                <span>Initiate Audit</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        )}

        {/* LOADING SCREEN */}
        {loading && (
          <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm text-center space-y-6">
            {/* Pulsing ring */}
            <div className="relative w-16 h-16 rounded-full bg-primary-600/10 flex items-center justify-center text-primary-600 mx-auto">
              <RefreshCw size={24} className="animate-spin text-primary-650" />
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Reviewing Credentials</h3>
              <p className="text-xs text-slate-400 animate-pulse">{loadingStep}</p>
            </div>
            {/* Progress bar simulation */}
            <div className="w-full max-w-xs mx-auto bg-slate-100 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary-600 h-1.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        )}

        {/* ANALYSIS RESULTS PANEL */}
        {analysis && (
          <div className="space-y-6">
            {/* Top Score summary widget */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              {/* Dial gauge */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-950 border-8 border-primary-600/10">
                  <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{analysis.atsScore}</span>
                  <svg className="absolute top-0 left-0 w-28 h-28 -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      className="stroke-primary-600 fill-none"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 48}`}
                      strokeDashoffset={`${2 * Math.PI * 48 * (1 - analysis.atsScore / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">ATS Score</span>
              </div>

              {/* Suggestions bullets preview */}
              <div className="md:col-span-3 space-y-3">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Parser Audit Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400">
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Education section parsed.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400">
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Professional experience block found.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-650 dark:text-slate-400">
                    <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{analysis.missingSkills.length} core skills missing from checklist.</span>
                  </div>
                </div>
                <button
                  onClick={() => setAnalysis(null)}
                  className="flex items-center gap-1 text-[11px] font-bold text-primary-500 hover:text-primary-400 transition pt-1.5"
                >
                  <RefreshCw size={12} /> Re-upload different resume
                </button>
              </div>
            </div>

            {/* Tab control bar */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
              {[
                { id: 'ats', name: 'ATS Skills' },
                { id: 'bullet', name: 'Bullet optimization' },
                { id: 'projects', name: 'Project suggestions' },
                { id: 'grammar', name: 'Grammar review' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-xs font-bold transition-all relative ${
                    activeTab === tab.id 
                      ? 'text-primary-600 dark:text-primary-450 border-b-2 border-primary-600 dark:border-primary-450'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}
            <div className="min-h-[220px]">
              {/* TAB 1: ATS SKILLS */}
              {activeTab === 'ats' && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250">Target Skill Gaps</h4>
                    <p className="text-[10px] text-slate-400">These skills were not parsed or identified. Consider adding them if they match your domain expertise.</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {analysis.missingSkills.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
                        <Plus size={12} className="rotate-45" /> {sk}
                      </span>
                    ))}
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
                      <Sparkles size={12} className="text-primary-500 animate-pulse" /> Optimizations tips:
                    </h4>
                    <ul className="list-disc pl-4 text-[11px] text-slate-500 space-y-1 leading-relaxed">
                      {analysis.optimizedSuggestions.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: BULLET OPTIMIZATION */}
              {activeTab === 'bullet' && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250">Bullet Points Enhancement</h4>
                    <p className="text-[10px] text-slate-400">Replace weak verbs with metrics-backed action phrasing.</p>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    {analysis.weakBulletPoints.map((bp, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl space-y-2">
                        <div>
                          <span className="text-[9px] font-extrabold text-red-550 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Original Weak Line</span>
                          <p className="text-xs text-slate-550 dark:text-slate-450 mt-1 italic">"{bp.original}"</p>
                        </div>
                        <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                          <span className="text-[9px] font-extrabold text-emerald-550 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">ATS Suggested Optimized Line</span>
                          <p className="text-xs text-slate-800 dark:text-slate-200 mt-1 font-medium">"{bp.suggestion}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PROJECT SUGGESTIONS */}
              {activeTab === 'projects' && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250">Recruiter Recommended Projects</h4>
                    <p className="text-[10px] text-slate-400">Build these projects to offset missing skills in your resume database.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {analysis.projectSuggestions.map((proj, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-2">
                        <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">PROJECT SUGGESTION</span>
                        <h4 className="font-bold text-slate-850 dark:text-slate-200 text-sm">{proj.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: GRAMMAR REVIEW */}
              {activeTab === 'grammar' && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250">Grammatical Audits</h4>
                    <p className="text-[10px] text-slate-400">Structural corrections for formal business writing guidelines.</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {analysis.grammarImprovements && analysis.grammarImprovements.length > 0 ? (
                      analysis.grammarImprovements.map((g, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Identified Phrasing</span>
                            <p className="text-xs text-slate-650 dark:text-slate-400 mt-1">"{g.original}"</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Corrected Suggestion</span>
                            <p className="text-xs text-slate-800 dark:text-slate-200 mt-1 font-semibold">"{g.correction}"</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No grammatical or phrasing issues identified.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
