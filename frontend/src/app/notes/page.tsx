'use client';

import React, { useState } from 'react';
import { BookOpen, FileText, Plus, Save, Trash, Copy, Check } from 'lucide-react';

export default function Notes() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const [notesList, setNotesList] = useState([
    {
      id: '1',
      title: 'Arrays vs Linked Lists Comparison',
      subject: 'Data Structures',
      content: 'Contiguous arrays offer O(1) index reads but require O(n) shifts for index additions.\nLinked lists consist of non-contiguous nodes pointing to next buffers, enabling O(1) inserts at known addresses but suffering from O(n) sequential search times.'
    },
    {
      id: '2',
      title: 'CPU Scheduling Summary',
      subject: 'Operating Systems',
      content: 'Preemptive CPU Scheduling allows interrupting a running process (e.g. Round Robin, SRTF) whereas Non-preemptive scheduling lets process completion dictate CPU handoffs (e.g. FCFS, SJF).'
    }
  ]);

  const activeNote = notesList[selectedIdx] || null;

  const handleTextChange = (val: string) => {
    if (!activeNote) return;
    setNotesList(prev => prev.map((n, i) => i === selectedIdx ? { ...n, content: val } : n));
  };

  const handleCopy = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDelete = () => {
    if (notesList.length <= 1) {
      alert('Keep at least one note document.');
      return;
    }
    setNotesList(prev => prev.filter((_, i) => i !== selectedIdx));
    setSelectedIdx(0);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          AI Notebook
          <BookOpen className="w-6 h-6 text-purple-400" />
        </h1>
        <p className="text-slate-400 text-sm">Organize and refine study notes compiled dynamically by the AI Tutor.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar list */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="glass-card p-4 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider pl-1">Study Documents</h3>
            
            <div className="flex flex-col gap-2">
              {notesList.map((n, idx) => (
                <div 
                  key={n.id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`p-3 border rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${
                    selectedIdx === idx 
                      ? 'border-purple-500 bg-purple-500/10' 
                      : 'border-indigo-950 hover:border-indigo-900 bg-black/10'
                  }`}
                >
                  <FileText className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold text-slate-200 truncate">{n.title}</span>
                    <span className="text-[9px] text-slate-500 mt-0.5">{n.subject}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notebook editor pane */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {activeNote && (
            <div className="glass-card p-6 rounded-[24px] min-h-[460px] flex flex-col justify-between">
              
              {/* Header options */}
              <div className="flex items-center justify-between border-b border-indigo-950/30 pb-4 mb-4">
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-white">{activeNote.title}</h3>
                  <span className="text-[10px] text-purple-400 font-semibold mt-0.5">{activeNote.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    id="notes-copy-btn"
                    onClick={handleCopy} 
                    className="p-2 rounded-xl bg-indigo-950/20 border border-indigo-950 text-slate-400 hover:text-white"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button 
                    id="notes-delete-btn"
                    onClick={handleDelete} 
                    className="p-2 rounded-xl bg-rose-950/15 border border-rose-950/30 text-rose-400 hover:bg-rose-950/30"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Editor Workspace */}
              <textarea
                value={activeNote.content}
                onChange={(e) => handleTextChange(e.target.value)}
                className="flex-1 w-full bg-black/25 border border-indigo-950/60 p-5 rounded-2xl text-xs text-slate-300 focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
                rows={14}
              />

              <div className="mt-4 pt-4 border-t border-indigo-950/30 flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase">
                <span>Direct Save Enabled</span>
                <span>Compiled via CampusPrep AI</span>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
