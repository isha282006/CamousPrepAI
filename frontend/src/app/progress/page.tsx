'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, ShieldAlert, Award, Calendar, Clock, BarChart as ChartIcon, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Progress() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const productivityData = [
    { name: 'Week 1', score: 65, hours: 18 },
    { name: 'Week 2', score: 72, hours: 22 },
    { name: 'Week 3', score: 78, hours: 23.5 },
    { name: 'Week 4', score: 85, hours: 29 }
  ];

  const weakTopics = [
    { subject: 'Operating Systems', topic: 'Process Synchronization', score: '52% Quiz Score', status: 'Requires Review' },
    { subject: 'Computer Networks', topic: 'IP Addressing & Subnetting', score: '58% Quiz Score', status: 'Requires Review' },
    { subject: 'Discrete Mathematics', topic: 'Partial Orderings & Lattices', score: '62% Quiz Score', status: 'Moderate' }
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          Progress & Analytics
          <TrendingUp className="w-6 h-6 text-purple-400" />
        </h1>
        <p className="text-slate-400 text-sm">Analyze exam readiness, identify weak topics, track task metrics, and monitor academic trends.</p>
      </div>

      {/* Grid dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Readiness Meter & Weak topics */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Readiness Meter */}
          <div className="glass-card p-6 rounded-[24px] flex flex-col items-center text-center">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider self-start">Exam Readiness Meter</h3>
            
            <div className="w-40 h-40 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(99,102,241,0.06)" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="url(#purpleCyanGrad)" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="251.2" 
                  strokeDashoffset="55.2" // 78% progress
                  strokeLinecap="round" 
                />
                <defs>
                  <linearGradient id="purpleCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white">78%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Ready for Finals</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-6 leading-relaxed max-w-[280px]">
              You are making good progress! Review your 2 identified weak topics to boost readiness score above 85%.
            </p>
          </div>

          {/* Weak Topic Alerts */}
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Weak Topics Detected</h3>
            <div className="flex flex-col gap-3">
              {weakTopics.map((item, idx) => (
                <div key={idx} className="p-3 bg-rose-950/10 border border-rose-500/20 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">{item.topic}</span>
                      <span className="text-[9px] text-slate-500 mt-0.5">{item.subject}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <span className="text-[10px] font-bold text-rose-400">{item.score}</span>
                    <span className="text-[8px] text-slate-500 font-semibold uppercase">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Productivity & Chart Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Productivity chart */}
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Productivity & Study Hours</h3>
            {mounted && (
              <div className="w-full h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.04)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={9} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0d1127', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px' }}
                      labelStyle={{ color: '#fff', fontSize: '10px' }}
                      itemStyle={{ color: '#8b5cf6', fontSize: '10px' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2.5} name="Productivity Score (%)" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="hours" stroke="#06b6d4" strokeWidth={2.5} name="Weekly Hours" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Stats Breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Topics Completed</span>
              <span className="text-2xl font-extrabold text-white mt-1">42 / 50</span>
              <span className="text-[8px] text-slate-400 mt-0.5">84% Syllabus coverage</span>
            </div>
            <div className="glass-card p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Quizzes Taken</span>
              <span className="text-2xl font-extrabold text-white mt-1">18 Tests</span>
              <span className="text-[8px] text-slate-400 mt-0.5">86% Average accuracy</span>
            </div>
            <div className="glass-card p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Revision Hours</span>
              <span className="text-2xl font-extrabold text-white mt-1">8.5 hrs</span>
              <span className="text-[8px] text-slate-400 mt-0.5">Focused on active recall</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
