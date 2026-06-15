'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarRange, Clock, Coffee, ShieldAlert, Sparkles, Check, ListChecks } from 'lucide-react';

export default function StudyPlanner() {
  const { generateTimetable, tasks } = useApp();
  
  const [collegeStart, setCollegeStart] = useState('09:00');
  const [collegeEnd, setCollegeEnd] = useState('15:00');
  const [freeHours, setFreeHours] = useState('3');
  const [weekendAvailable, setWeekendAvailable] = useState('Yes');
  const [preference, setPreference] = useState('Spaced Repetition');
  const [generating, setGenerating] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await generateTimetable({
        collegeStart,
        collegeEnd,
        freeHours,
        weekendAvailable,
        preference
      });
      setShowSchedule(true);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white">Study Planner</h1>
        <p className="text-slate-400 text-sm">Schedule study slots automatically around your university schedule. Set college timings to prevent planning conflicts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Settings */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Configure Schedule</h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase pl-1">College Start</label>
                  <input
                    type="time"
                    value={collegeStart}
                    onChange={(e) => setCollegeStart(e.target.value)}
                    className="px-3 py-2 text-xs glass-input focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase pl-1">College End</label>
                  <input
                    type="time"
                    value={collegeEnd}
                    onChange={(e) => setCollegeEnd(e.target.value)}
                    className="px-3 py-2 text-xs glass-input focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Daily Study Target (Hours)</label>
                <select
                  value={freeHours}
                  onChange={(e) => setFreeHours(e.target.value)}
                  className="px-3 py-2 text-xs glass-input focus:outline-none appearance-none"
                >
                  <option className="bg-[#0c0f24]" value="2">2 Hours / Day</option>
                  <option className="bg-[#0c0f24]" value="3">3 Hours / Day</option>
                  <option className="bg-[#0c0f24]" value="4">4 Hours / Day</option>
                  <option className="bg-[#0c0f24]" value="5">5 Hours / Day</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Weekend Study</label>
                  <select
                    value={weekendAvailable}
                    onChange={(e) => setWeekendAvailable(e.target.value)}
                    className="px-3 py-2 text-xs glass-input focus:outline-none appearance-none"
                  >
                    <option className="bg-[#0c0f24]" value="Yes">Yes, heavy load</option>
                    <option className="bg-[#0c0f24]" value="No">No, relax</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Study Style</label>
                  <select
                    value={preference}
                    onChange={(e) => setPreference(e.target.value)}
                    className="px-3 py-2 text-xs glass-input focus:outline-none appearance-none"
                  >
                    <option className="bg-[#0c0f24]" value="Spaced Repetition">Spaced Repetition</option>
                    <option className="bg-[#0c0f24]" value="Pomodoro">Pomodoro (25/5)</option>
                    <option className="bg-[#0c0f24]" value="Deep Work">Deep Work (90m)</option>
                  </select>
                </div>
              </div>

              <button
                id="generate-timetable-btn"
                type="submit"
                disabled={generating}
                className="w-full py-2.5 px-4 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold text-xs text-white shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                {generating ? 'Creating Optimal Plan...' : 'Generate Smart Plan'}
                <Sparkles className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-3 text-amber-400/90">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Collision Engine Active</span>
                <p className="text-[9px] text-slate-400 leading-normal">Planner will auto-skip slot mapping between {collegeStart} and {collegeEnd} to ensure focus is dedicated solely to classes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Display Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-[24px]">
            <div className="flex items-center justify-between border-b border-indigo-950/30 pb-4 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Your Timetable</h3>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-900/50 px-2 py-0.5 rounded-lg">Auto Conflict Checked</span>
            </div>

            {!showSchedule && tasks.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center gap-3">
                <CalendarRange className="w-10 h-10 text-slate-500" />
                <h4 className="text-xs font-semibold text-slate-300">No Timetable Active</h4>
                <p className="text-[10px] text-slate-500 max-w-[240px]">Configure your college parameters and hit generate to construct your plan.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* College Block Marker */}
                <div className="flex items-center gap-4 p-3 bg-slate-950/40 border border-slate-900/40 rounded-2xl opacity-60">
                  <span className="text-[10px] font-bold text-slate-500 w-16">{collegeStart}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400">Class Block Hours</span>
                    <span className="text-[9px] text-slate-500">Locked - Avoids double booking</span>
                  </div>
                </div>

                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-3.5 bg-indigo-950/10 border border-indigo-950/40 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 w-16">{task.timeSlot}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    <div className="flex flex-col flex-1">
                      <span className="text-xs font-bold text-slate-200">{task.subjectName}</span>
                      <span className="text-[9px] text-purple-400 font-semibold mt-0.5">{task.topicName}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 bg-indigo-950/40 border border-indigo-950 px-2.5 py-1 rounded-xl">
                      {preference}
                    </span>
                  </div>
                ))}

                {/* Free hour buffer */}
                <div className="flex items-center gap-4 p-3 bg-emerald-950/5 border border-emerald-950/10 rounded-2xl">
                  <span className="text-[10px] font-bold text-emerald-500 w-16">7:30 PM</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <div className="flex flex-col flex-1">
                    <span className="text-xs font-bold text-emerald-400">Pomodoro Break</span>
                    <span className="text-[9px] text-slate-500">30 min block - Relaxation</span>
                  </div>
                  <Coffee className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
