'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { HelpCircle, Key, Users, FileText, Database, ShieldAlert, Cpu, Heart, Check } from 'lucide-react';

export default function AdminPanel() {
  const { getAdminStats } = useApp();
  
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        setStats(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          Admin Dashboard
          <HelpCircle className="w-6 h-6 text-purple-400" />
        </h1>
        <p className="text-slate-400 text-sm">Monitor platform registration levels, storage capacities, Gemini API token costs, and student satisfaction feedback.</p>
      </div>

      {loading ? (
        <p className="text-xs text-slate-500">Loading admin variables...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Metrics grids */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Quick counters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 flex items-center justify-center border border-purple-900/50">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Active Students</span>
                  <span className="text-xl font-extrabold text-white mt-0.5">{stats.studentCount} Users</span>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-950/60 flex items-center justify-center border border-indigo-900/50">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-bold uppercase">AI Token Usage</span>
                  <span className="text-xl font-extrabold text-white mt-0.5">{stats.aiTokenUsage.toLocaleString()}</span>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/60 flex items-center justify-center border border-cyan-900/50">
                  <Database className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Server Storage</span>
                  <span className="text-xl font-extrabold text-white mt-0.5">{stats.totalStorageMB} MB</span>
                </div>
              </div>
            </div>

            {/* Feedback queue */}
            <div className="glass-card p-6 rounded-[24px]">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Student Feedbacks</h3>
              
              <div className="flex flex-col gap-3">
                {stats.feedbacks?.map((f: any, idx: number) => (
                  <div key={idx} className="p-4 bg-indigo-950/15 border border-indigo-950/40 rounded-2xl flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-indigo-950/50 border border-indigo-900/40 flex items-center justify-center font-bold text-[10px] text-purple-400 shrink-0">
                        {f.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-200">{f.name}</span>
                        <p className="text-[10.5px] text-slate-400 mt-1.5 leading-relaxed font-normal">{f.feedbackText}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 text-amber-400">
                      <Heart className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="text-xs font-extrabold">{f.rating}.0</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Admin instructions / configs */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="glass-card p-6 rounded-[24px]">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Usage Restrictions</h3>
              
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Gemini Rate Limits</span>
                  <span className="font-bold text-purple-400">15 RPM</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Max Upload Size</span>
                  <span className="font-bold text-indigo-400">10 MB / File</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Max Database Cache</span>
                  <span className="font-bold text-cyan-400">512 MB</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
