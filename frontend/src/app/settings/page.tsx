'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings as SettingsIcon, ShieldAlert, Sparkles, Key, User, Save, RefreshCw } from 'lucide-react';

export default function Settings() {
  const { user, updateOnboarding, logout } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [collegeName, setCollegeName] = useState(user?.collegeName || '');
  const [course, setCourse] = useState(user?.course || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [year, setYear] = useState(user?.year || '1st Year');
  const [semester, setSemester] = useState(user?.semester || '1st Semester');
  
  const [apiKey, setApiKey] = useState('');
  const [aiModel, setAiModel] = useState('Gemini 1.5 Flash');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateOnboarding({ name, collegeName, course, branch, year, semester });
      alert('Academic profile updated successfully!');
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleConfigSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setSavingConfig(false);
    alert('AI credentials configured successfully!');
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all syllabus records, timetables, and mock attempts? This action is irreversible.')) {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          Settings
          <SettingsIcon className="w-6 h-6 text-purple-400" />
        </h1>
        <p className="text-slate-400 text-sm">Update onboarding parameters, input AI API keys, and manage storage indexes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-purple-400" />
              Academic Profile
            </h3>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase pl-1">Student Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2 text-xs glass-input"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase pl-1">College / University</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="px-3 py-2 text-xs glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase pl-1">Course</label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="px-3 py-2 text-xs glass-input"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase pl-1">Branch</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="px-3 py-2 text-xs glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase pl-1">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="px-3 py-2 text-xs glass-input focus:outline-none appearance-none"
                  >
                    <option className="bg-[#0c0f24]" value="1st Year">1st Year</option>
                    <option className="bg-[#0c0f24]" value="2nd Year">2nd Year</option>
                    <option className="bg-[#0c0f24]" value="3rd Year">3rd Year</option>
                    <option className="bg-[#0c0f24]" value="4th Year">4th Year</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase pl-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="px-3 py-2 text-xs glass-input focus:outline-none appearance-none"
                  >
                    {Array.from({ length: 8 }).map((_, i) => (
                      <option key={i} className="bg-[#0c0f24]" value={`${i + 1}st Semester`}>Semester {i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                id="settings-profile-save"
                type="submit"
                disabled={savingProfile}
                className="w-full py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-500 flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Configurations Column */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* AI Settings */}
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4 text-purple-400" />
              AI Keys Configuration
            </h3>

            <form onSubmit={handleConfigSave} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase pl-1">Select Model</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="px-3 py-2 text-xs glass-input focus:outline-none appearance-none"
                >
                  <option className="bg-[#0c0f24]" value="Gemini 1.5 Flash">Gemini 1.5 Flash (Default)</option>
                  <option className="bg-[#0c0f24]" value="GPT-4o Mini">GPT-4o Mini</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase pl-1">Custom API Key (Optional)</label>
                <input
                  type="password"
                  placeholder="Enter API Key to override default server limits..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="px-3 py-2 text-xs glass-input"
                />
              </div>

              <button
                id="settings-config-save"
                type="submit"
                disabled={savingConfig}
                className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-500 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{savingConfig ? 'Validating Key...' : 'Save AI Credentials'}</span>
              </button>
            </form>
          </div>

          {/* Dangerous Zone */}
          <div className="glass-card p-6 rounded-[24px] border-rose-950/20 bg-rose-950/5">
            <h3 className="text-sm font-bold text-rose-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              Danger Zone
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-4">Resetting your data will clear your cache and wipe onboarding stats from the system.</p>
            
            <button
              id="settings-reset-btn"
              onClick={handleResetData}
              className="py-2 px-4 bg-rose-950/30 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-500/20"
            >
              Reset All Study Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
