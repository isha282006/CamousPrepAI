'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, FileText, ClipboardList, Copy, Check, Download, BookOpen, Loader } from 'lucide-react';

export default function RevisionHub() {
  const { generateRevisionMaterial, activeSyllabus } = useApp();

  const [selectedSubject, setSelectedSubject] = useState('Data Structures');
  const [selectedTopic, setSelectedTopic] = useState('Arrays and Linked Lists');
  const [noteType, setNoteType] = useState('QUICK');
  const [generating, setGenerating] = useState(false);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const defaultSubjects = [
    { name: 'Data Structures', topics: ['Arrays and Linked Lists', 'Stacks and Queues', 'Binary Search Trees'] },
    { name: 'Operating Systems', topics: ['Process Management', 'CPU Scheduling Algorithms', 'Paging and Segmentation'] },
    { name: 'Database Management', topics: ['SQL Queries', 'ER Diagrams & Normalization'] }
  ];

  const subjectsList = activeSyllabus?.subjects || defaultSubjects;
  const currentTopics = subjectsList.find((s: any) => s.name === selectedSubject)?.topics?.map((t: any) => t.name || t) || [];

  const handleGenerateNotes = async () => {
    if (!selectedSubject || !selectedTopic) return;
    setGenerating(true);
    setDocumentContent('');
    setCopied(false);
    
    try {
      const res = await generateRevisionMaterial(selectedSubject, selectedTopic, noteType);
      setDocumentContent(res.content);
    } catch (e) {
      console.error(e);
      setDocumentContent('Failed to generate study document. Please retry.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(documentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const revisionTypes = [
    { key: 'QUICK', title: 'Quick Summary', desc: 'Core concept summaries, ideal for fast revision.' },
    { key: 'FORMULA', title: 'Formula Sheets', desc: 'Mathematical equations, complexity tables.' },
    { key: 'FULL', title: 'Detailed Study Guide', desc: 'Academic topics in depth, theoretical reviews.' },
    { key: 'LAST_MINUTE', title: 'Last-Minute Prep', desc: 'Bullet checklists of exam-critical targets.' },
    { key: 'ONE_DAY', title: 'One-Day Revision', desc: 'Accelerated study route designed for single-day coverage.' }
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          Revision Hub
          <Sparkles className="w-6 h-6 text-purple-400" />
        </h1>
        <p className="text-slate-400 text-sm">Generate AI-optimized revision materials, math cheat sheets, complexity maps, or bullet summary notes on demand.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Selector Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Configure Revision Guide</h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Course Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => { setSelectedSubject(e.target.value); setSelectedTopic(''); }}
                  className="px-3 py-2 text-xs glass-input focus:outline-none appearance-none"
                >
                  {subjectsList.map((s: any, idx: number) => (
                    <option key={idx} className="bg-[#0c0f24]" value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Topic</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="px-3 py-2 text-xs glass-input focus:outline-none appearance-none"
                >
                  <option value="">Choose Topic</option>
                  {currentTopics.map((t: string, idx: number) => (
                    <option key={idx} className="bg-[#0c0f24]" value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Format Type</label>
                <div className="flex flex-col gap-2">
                  {revisionTypes.map((type) => (
                    <div 
                      key={type.key}
                      onClick={() => setNoteType(type.key)}
                      className={`p-3 border rounded-2xl cursor-pointer transition-all flex flex-col gap-0.5 ${
                        noteType === type.key 
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-indigo-950 hover:border-indigo-900 bg-black/10'
                      }`}
                    >
                      <span className="text-xs font-bold text-white">{type.title}</span>
                      <span className="text-[9px] text-slate-400">{type.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                id="generate-revision-btn"
                onClick={handleGenerateNotes}
                disabled={generating || !selectedTopic}
                className="w-full py-2.5 px-4 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold text-xs text-white shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                {generating ? 'Compiling Reference Papers...' : 'Generate Study Guide'}
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Notes Editor Screen */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-[24px] min-h-[500px] flex flex-col justify-between">
            
            {/* Header controls */}
            <div className="flex items-center justify-between border-b border-indigo-950/30 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-bold text-slate-300">Document Reader</span>
              </div>
              
              {documentContent && (
                <div className="flex items-center gap-2">
                  <button 
                    id="copy-revision-btn"
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-indigo-950/20 border border-indigo-950 hover:bg-indigo-900/30 text-slate-400 hover:text-white transition-all flex items-center gap-1.5 text-[10px] font-bold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Main content display */}
            {generating ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-20">
                <Loader className="w-8 h-8 text-purple-500 animate-spin" />
                <span className="text-xs font-bold text-slate-200">Sifting syllabus references...</span>
                <p className="text-[10px] text-slate-500 max-w-[200px]">AI notes generator is writing clean summaries and code templates.</p>
              </div>
            ) : !documentContent ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-24 text-slate-500">
                <BookOpen className="w-12 h-12 text-slate-500" />
                <h4 className="text-xs font-semibold text-slate-400">Study Document is empty</h4>
                <p className="text-[10px] text-slate-500 max-w-[240px]">Configure your notes settings on the left to start compiling revision cards.</p>
              </div>
            ) : (
              <div className="flex-1 bg-black/25 border border-indigo-950/50 p-6 rounded-2xl overflow-y-auto max-h-[480px] text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
                {documentContent}
              </div>
            )}

            {documentContent && (
              <div className="mt-4 pt-4 border-t border-indigo-950/30 flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase">
                <span>CampusPrep AI Document Compiler</span>
                <span>Ready for Exams</span>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
