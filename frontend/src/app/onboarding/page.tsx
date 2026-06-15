'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import { GraduationCap, Landmark, BookOpen, Layers, Calendar, ChevronRight } from 'lucide-react';

export default function Onboarding() {
  const router = useRouter();
  const { updateOnboarding, user } = useApp();

  const [collegeName, setCollegeName] = useState(user?.collegeName || '');
  const [course, setCourse] = useState(user?.course || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [year, setYear] = useState(user?.year || '1st Year');
  const [semester, setSemester] = useState(user?.semester || '1st Semester');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeName || !course || !branch) {
      alert('Please fill in college name, course, and branch.');
      return;
    }

    setIsLoading(true);
    try {
      await updateOnboarding({
        collegeName,
        course,
        branch,
        year,
        semester
      });
      router.push('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#050816]">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full filter blur-[100px] animate-pulse"></div>

      <div className="w-full max-w-lg glass-card p-8 rounded-[32px] bg-[#0c0f24]/85 border-indigo-950/70 shadow-2xl relative z-10">
        <div className="flex flex-col mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent flex items-center gap-2">
            Welcome to CampusPrep AI 🎓
          </h2>
          <p className="text-slate-400 text-xs mt-1">Let's set up your academic profile to customize your study path.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-1">College/University Name</label>
            <div className="relative">
              <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="onboard-college-input"
                type="text"
                required
                placeholder="e.g. National Institute of Technology"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/40 border border-indigo-950/80 rounded-2xl focus:outline-none focus:border-purple-500 text-sm placeholder-slate-600 text-slate-200 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-1">Course/Degree</label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="onboard-course-input"
                  type="text"
                  required
                  placeholder="e.g. B.Tech"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/40 border border-indigo-950/80 rounded-2xl focus:outline-none focus:border-purple-500 text-sm placeholder-slate-600 text-slate-200 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-1">Branch/Specialization</label>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="onboard-branch-input"
                  type="text"
                  required
                  placeholder="e.g. Computer Science"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/40 border border-indigo-950/80 rounded-2xl focus:outline-none focus:border-purple-500 text-sm placeholder-slate-600 text-slate-200 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-1">Current Year</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  id="onboard-year-select"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/40 border border-indigo-950/80 rounded-2xl focus:outline-none focus:border-purple-500 text-sm text-slate-200 transition-all appearance-none"
                >
                  <option className="bg-[#0c0f24] text-slate-300" value="1st Year">1st Year</option>
                  <option className="bg-[#0c0f24] text-slate-300" value="2nd Year">2nd Year</option>
                  <option className="bg-[#0c0f24] text-slate-300" value="3rd Year">3rd Year</option>
                  <option className="bg-[#0c0f24] text-slate-300" value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-1">Current Semester</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  id="onboard-semester-select"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/40 border border-indigo-950/80 rounded-2xl focus:outline-none focus:border-purple-500 text-sm text-slate-200 transition-all appearance-none"
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <option key={i} className="bg-[#0c0f24] text-slate-300" value={`${i + 1}st Semester`}>
                      Semester {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            id="onboard-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 mt-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 rounded-2xl font-bold text-sm text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? 'Saving Profile...' : 'Complete Registration'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
