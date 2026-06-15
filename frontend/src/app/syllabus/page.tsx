'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, UploadCloud, CheckCircle, Clock, AlertTriangle, ArrowRight, Loader } from 'lucide-react';

export default function Syllabus() {
  const { uploadSyllabus, syllabusList, activeSyllabus } = useApp();
  
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!file) return;
    setAnalyzing(true);
    try {
      const res = await uploadSyllabus(file);
      setAnalysisResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
      setFile(null);
    }
  };

  const subjectsToShow = analysisResult?.subjects || activeSyllabus?.subjects || [];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white">Upload Center</h1>
        <p className="text-slate-400 text-sm">Upload your university syllabus PDF. Our AI will automatically map subjects, extract topics, and create your custom learning roadmap.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upload Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Upload New Syllabus</h3>

            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-all ${
                dragActive 
                  ? 'border-purple-500 bg-purple-500/5' 
                  : 'border-indigo-950 hover:border-purple-900 bg-black/20'
              }`}
            >
              <input 
                id="syllabus-file-input"
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange}
                className="hidden" 
              />
              <label htmlFor="syllabus-file-input" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                <UploadCloud className="w-12 h-12 text-slate-400" />
                <span className="text-xs font-semibold text-slate-300">Drag and drop syllabus PDF here or click to browse</span>
                <span className="text-[10px] text-slate-500">PDF documents up to 10MB accepted</span>
              </label>
            </div>

            {file && (
              <div className="mt-4 p-3 bg-indigo-950/20 border border-indigo-950 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <FileText className="w-5 h-5 text-purple-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200 truncate">{file.name}</span>
                </div>
                <button
                  id="syllabus-analyze-btn"
                  onClick={handleUploadSubmit}
                  disabled={analyzing}
                  className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-xs font-bold text-white hover:from-purple-500 hover:to-indigo-500"
                >
                  Analyze
                </button>
              </div>
            )}

            {analyzing && (
              <div className="mt-6 flex flex-col items-center justify-center gap-2 text-center py-6">
                <Loader className="w-8 h-8 text-purple-500 animate-spin" />
                <span className="text-xs font-bold text-slate-200">AI Syllabus Analyzer in Progress...</span>
                <p className="text-[10px] text-slate-500 max-w-[200px]">Extracting core topics, calculating weights, and planning study times.</p>
              </div>
            )}
          </div>

          {/* Uploaded History */}
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Uploaded Documents</h3>
            <div className="flex flex-col gap-3">
              {syllabusList.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No documents uploaded yet.</p>
              ) : (
                syllabusList.map((s) => (
                  <div key={s.id} className="p-3 bg-indigo-950/10 border border-indigo-950/40 rounded-2xl flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-300 truncate max-w-[150px]">{s.fileName}</span>
                      <span className="text-[9px] text-slate-500 uppercase mt-0.5">Syllabus PDF</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Roadmap Display Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Learning Roadmap</h3>

            {subjectsToShow.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-950/30 flex items-center justify-center text-slate-500 border border-indigo-900/50">
                  📚
                </div>
                <h4 className="text-sm font-semibold text-slate-300">No Syllabus mapped yet</h4>
                <p className="text-xs text-slate-500 max-w-[280px]">Upload your course syllabus PDF on the left to instantly generate a full roadmap.</p>
              </div>
            ) : (
              <div className="relative border-l border-indigo-950/80 ml-4 space-y-8 py-2">
                {subjectsToShow.map((sub: any, i: number) => (
                  <div key={i} className="relative pl-8 group">
                    {/* Node Dot */}
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#050816] border-2 border-purple-500 group-hover:border-cyan-400 transition-colors flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:bg-cyan-400 transition-colors"></div>
                    </div>

                    <div className="p-4 bg-indigo-950/10 hover:bg-indigo-950/20 border border-indigo-950/60 rounded-3xl transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">{sub.code || 'CODE'}</span>
                          <h4 className="text-sm font-bold text-white">{sub.name}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold ${
                          sub.difficulty === 'Hard' ? 'bg-rose-950/40 text-rose-400 border border-rose-900/50' : 
                          sub.difficulty === 'Medium' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/50' : 
                          'bg-emerald-950/40 text-emerald-400 border border-emerald-900/50'
                        }`}>
                          {sub.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-400 font-semibold">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> {sub.estimatedHours || 30} Hours Estimated</span>
                        <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-slate-500" /> {sub.units?.length || 1} Units</span>
                      </div>

                      {/* Expanded Topics Nested view */}
                      {sub.units && (
                        <div className="mt-4 pt-3 border-t border-indigo-950/40 flex flex-col gap-2">
                          {sub.units.slice(0, 2).map((unit: any, idx: number) => (
                            <div key={idx} className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-300">{unit.name}</span>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {unit.topics?.map((t: any, tIdx: number) => (
                                  <span key={tIdx} className="px-2 py-0.5 rounded-lg bg-black/40 border border-indigo-950/50 text-[9px] text-slate-400">
                                    {t.name || t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
