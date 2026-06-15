'use client';

import React from 'react';
import { FolderLock, FileText, Download, Trash, Award } from 'lucide-react';

export default function Resources() {
  const resourceFiles = [
    { name: 'Semester_6_Syllabus.pdf', type: 'Syllabus PDF', size: '2.4 MB', date: 'May 28, 2026' },
    { name: 'DSA_PastPapers_2025.pdf', type: 'PYQ Exam PDF', size: '4.8 MB', date: 'May 29, 2026' },
    { name: 'OperatingSystems_LectureNotes.pdf', type: 'Notes PDF', size: '1.2 MB', date: 'May 30, 2026' }
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          Study Storage
          <FolderLock className="w-6 h-6 text-purple-400" />
        </h1>
        <p className="text-slate-400 text-sm">Store course files, syllabi drafts, exam blueprints, and assignment references securely.</p>
      </div>

      <div className="glass-card p-6 rounded-[24px]">
        <div className="flex items-center justify-between border-b border-indigo-950/30 pb-4 mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Storage Index</h3>
          <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/30 border border-cyan-900/50 px-2 py-0.5 rounded-lg">8.4 MB of 100 MB Used</span>
        </div>

        <div className="flex flex-col gap-3">
          {resourceFiles.map((file, idx) => (
            <div key={idx} className="p-3.5 bg-indigo-950/10 border border-indigo-950/40 rounded-2xl flex items-center justify-between hover:border-indigo-900 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-950/60 flex items-center justify-center border border-indigo-900/50">
                  <FileText className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-200">{file.name}</span>
                  <div className="flex items-center gap-2 mt-0.5 text-[9px] text-slate-500 font-semibold">
                    <span>{file.type}</span>
                    <span>•</span>
                    <span>{file.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9px] text-slate-500 font-bold uppercase mr-4">{file.date}</span>
                <button 
                  id={`resource-download-${idx}`}
                  className="p-1.5 rounded-lg bg-indigo-950/20 border border-indigo-950 text-slate-400 hover:text-white"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
