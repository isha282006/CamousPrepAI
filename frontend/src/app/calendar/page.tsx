'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';

export default function StudyCalendar() {
  const [currentMonth, setCurrentMonth] = useState('June 2026');

  // Simulated calendar dates for June 2026
  const daysInMonth = Array.from({ length: 30 }).map((_, i) => {
    const dayNum = i + 1;
    // Add mock schedules
    let events: Array<{ name: string; color: string }> = [];
    if (dayNum === 5) events = [{ name: 'DSA Exam', color: 'bg-rose-500' }];
    if (dayNum === 12) events = [{ name: 'OS Exam', color: 'bg-blue-500' }];
    if (dayNum === 19) events = [{ name: 'DBMS Exam', color: 'bg-teal-500' }];
    if (dayNum === 10 || dayNum === 18 || dayNum === 24) events = [{ name: 'Revision', color: 'bg-purple-500' }];
    return { dayNum, events };
  });

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          Study Calendar
          <CalendarIcon className="w-6 h-6 text-purple-400" />
        </h1>
        <p className="text-slate-400 text-sm">Schedule study targets, mock test attempts, and final university paper timings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Calendar widget */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="glass-card p-6 rounded-[24px]">
            
            {/* Header navigator */}
            <div className="flex items-center justify-between border-b border-indigo-950/30 pb-4 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{currentMonth}</h3>
              <div className="flex items-center gap-1.5">
                <button className="p-1 rounded bg-[#0d1127] border border-indigo-950 text-slate-400 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1 rounded bg-[#0d1127] border border-indigo-950 text-slate-400 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-2.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {/* Offset days for June 2026 (Starts on Monday) */}
              {daysInMonth.map((day) => (
                <div 
                  key={day.dayNum} 
                  className="min-h-[76px] p-2 bg-indigo-950/10 hover:bg-indigo-950/20 border border-indigo-950/30 rounded-2xl flex flex-col justify-between text-left transition-all"
                >
                  <span className="text-xs font-bold text-slate-400">{day.dayNum}</span>
                  <div className="flex flex-col gap-1 mt-2">
                    {day.events.map((ev, idx) => (
                      <span key={idx} className={`px-1.5 py-0.5 rounded text-[8px] font-bold text-white truncate max-w-full ${ev.color}`}>
                        {ev.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Schedule alerts list sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Weekly Milestones</h3>
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-indigo-950/15 border border-indigo-950/40 rounded-2xl flex gap-3 text-xs text-slate-300">
                <Bookmark className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-200">Complete 3 Unit revision sheets</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Deadline: June 5, 2026</span>
                </div>
              </div>
              <div className="p-3 bg-indigo-950/15 border border-indigo-950/40 rounded-2xl flex gap-3 text-xs text-slate-300">
                <Bookmark className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-200">Submit 2 subjective mock tests</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Deadline: June 12, 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
