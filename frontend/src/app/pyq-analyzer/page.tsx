'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileSearch, UploadCloud, AlertCircle, BarChart as ChartIcon, FileText, ChevronRight, Award, Loader } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function PYQAnalyzer() {
  const { apiUrl, token, backendOnline } = useApp();
  
  const [selectedSubject, setSelectedSubject] = useState('Data Structures');
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [pyqRecords, setPyqRecords] = useState<any[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<any>(null);

  const defaultSubjects = ['Data Structures', 'Operating Systems', 'Database Management', 'Computer Networks'];

  // Default Analysis for immediate preview
  const defaultAnalysis = {
    repeatedQuestions: [
      { question: "Explain the differences between Singly and Doubly Linked Lists.", frequency: 5, importance: "High" },
      { question: "What is CPU Scheduling? Differentiate between Preemptive and Non-preemptive scheduling with diagrams.", frequency: 4, importance: "High" },
      { question: "Implement a Queue data structure using two Stacks.", frequency: 3, importance: "Medium" },
      { question: "Write a SQL query to fetch the second-highest salary from an Employee table.", frequency: 3, importance: "Medium" }
    ],
    weightageAnalysis: [
      { unit: "Linear Structures", weightage: 30, color: '#8b5cf6' },
      { unit: "Non-Linear Structures", weightage: 40, color: '#6366f1' },
      { unit: "Sorting and Hashing", weightage: 15, color: '#06b6d4' },
      { unit: "Search Algorithms", weightage: 15, color: '#ec4899' }
    ],
    unitTrends: [
      { year: "2023", difficulty: "Medium", topicsFocused: "BFS/DFS, BST insertion, Queue Implementation" },
      { year: "2024", difficulty: "Hard", topicsFocused: "AVL Trees rotation, Graph cycles, Hashing" },
      { year: "2025", difficulty: "Medium", topicsFocused: "Doubly linked lists, QuickSort trace" }
    ],
    examPatterns: {
      mcqCount: 20,
      subjectiveCount: 8,
      totalMarks: 100,
      passingMarks: 40
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setAnalyzing(true);

    if (backendOnline && token) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subjectName', selectedSubject);

      try {
        const res = await fetch(`${apiUrl}/pyq/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          const parsedAnalysis = {
            repeatedQuestions: JSON.parse(data.repeatedQuestions),
            weightageAnalysis: JSON.parse(data.weightageAnalysis),
            unitTrends: JSON.parse(data.unitTrends),
            examPatterns: JSON.parse(data.examPatterns)
          };
          setActiveAnalysis(parsedAnalysis);
          setPyqRecords(prev => [data, ...prev]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setAnalyzing(false);
        setFile(null);
      }
    } else {
      // Mock Offline Timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      setActiveAnalysis(defaultAnalysis);
      setAnalyzing(false);
      setFile(null);
    }
  };

  const currentAnalysis = activeAnalysis || defaultAnalysis;

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          PYQ Analyzer
          <FileSearch className="w-6 h-6 text-purple-400" />
        </h1>
        <p className="text-slate-400 text-sm">Upload university exam Previous Year Question papers. Extrapolate question frequencies, subject focus weights, and patterns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upload PYQ Form */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Analyze Exam Paper</h3>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Course Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 text-xs glass-input focus:outline-none appearance-none"
                >
                  {defaultSubjects.map((sub, idx) => (
                    <option key={idx} className="bg-[#0c0f24]" value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-dashed border-indigo-950 hover:border-purple-900 bg-black/20 rounded-2xl p-6 text-center cursor-pointer">
                <input 
                  id="pyq-file"
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange}
                  className="hidden" 
                />
                <label htmlFor="pyq-file" className="cursor-pointer flex flex-col items-center gap-1.5">
                  <UploadCloud className="w-10 h-10 text-slate-500" />
                  <span className="text-[11px] text-slate-300 font-semibold">Select exam PDF file</span>
                </label>
              </div>

              {file && (
                <div className="p-2.5 bg-indigo-950/20 border border-indigo-950 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-300 truncate max-w-[120px]">{file.name}</span>
                  <button 
                    id="pyq-upload-submit"
                    type="submit"
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-[10px] font-bold"
                  >
                    Analyze
                  </button>
                </div>
              )}
            </form>

            {analyzing && (
              <div className="mt-4 flex flex-col items-center justify-center gap-2 py-4 text-center">
                <Loader className="w-6 h-6 text-purple-400 animate-spin" />
                <span className="text-[11px] font-bold text-slate-200">Deconstructing exam formats...</span>
              </div>
            )}
          </div>

          {/* Exam Pattern Structure */}
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Exam Structure</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-indigo-950/15 border border-indigo-950/40 rounded-2xl flex flex-col gap-0.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase">MCQs Count</span>
                <span className="text-xl font-extrabold text-purple-400">{currentAnalysis.examPatterns.mcqCount}</span>
              </div>
              <div className="p-3 bg-indigo-950/15 border border-indigo-950/40 rounded-2xl flex flex-col gap-0.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Subjective</span>
                <span className="text-xl font-extrabold text-indigo-400">{currentAnalysis.examPatterns.subjectiveCount}</span>
              </div>
              <div className="p-3 bg-indigo-950/15 border border-indigo-950/40 rounded-2xl flex flex-col gap-0.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Total Marks</span>
                <span className="text-xl font-extrabold text-cyan-400">{currentAnalysis.examPatterns.totalMarks}</span>
              </div>
              <div className="p-3 bg-indigo-950/15 border border-indigo-950/40 rounded-2xl flex flex-col gap-0.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Pass Criteria</span>
                <span className="text-xl font-extrabold text-emerald-400">{currentAnalysis.examPatterns.passingMarks}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Weightage Chart */}
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Unit-wise Weightage (%)</h3>
            <div className="w-full h-52 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentAnalysis.weightageAnalysis}>
                  <XAxis dataKey="unit" stroke="#64748b" fontSize={9} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d1127', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontSize: '10px' }}
                    itemStyle={{ color: '#8b5cf6', fontSize: '10px' }}
                  />
                  <Bar dataKey="weightage" radius={[8, 8, 0, 0]}>
                    {currentAnalysis.weightageAnalysis.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Repeated Questions */}
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Frequent Questions (AI Highlight)</h3>
            <div className="flex flex-col gap-3">
              {currentAnalysis.repeatedQuestions.map((q: any, i: number) => (
                <div key={i} className="p-3 bg-indigo-950/10 border border-indigo-950/40 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-purple-950/60 flex items-center justify-center border border-purple-900/50">
                      <span className="text-[10px] font-extrabold text-purple-400">{q.frequency}x</span>
                    </div>
                    <span className="text-xs text-slate-300 font-medium leading-relaxed max-w-[400px]">{q.question}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold ${
                    q.importance === 'High' ? 'bg-rose-950/40 text-rose-400 border border-rose-900/50' : 'bg-amber-950/40 text-amber-400 border border-amber-900/50'
                  }`}>
                    {q.importance}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Year wise Trends Table */}
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Year-wise Focus Trends</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-indigo-950/50 text-[10px] text-slate-400 uppercase font-bold">
                    <th className="py-2.5">Year</th>
                    <th className="py-2.5">Difficulty</th>
                    <th className="py-2.5">Key Focus Areas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-950/30 text-xs">
                  {currentAnalysis.unitTrends.map((trend: any, i: number) => (
                    <tr key={i} className="text-slate-300">
                      <td className="py-3 font-bold text-purple-400">{trend.year}</td>
                      <td className="py-3 font-semibold">{trend.difficulty}</td>
                      <td className="py-3 text-slate-400">{trend.topicsFocused}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
