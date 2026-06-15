'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ClipboardCheck, Sparkles, Award, Clock, ArrowRight, ShieldCheck, HelpCircle, Loader } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MockTests() {
  const { generateMockTest, submitMockTest, mockAttempts } = useApp();

  const [selectedSubject, setSelectedSubject] = useState('Data Structures');
  const [testType, setTestType] = useState<'MCQ' | 'SUBJECTIVE'>('MCQ');
  const [duration, setDuration] = useState(30);
  
  const [testLoading, setTestLoading] = useState(false);
  const [activeTest, setActiveTest] = useState<any>(null);
  
  // Test Taker State
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [scoreReport, setScoreReport] = useState<any>(null);

  // Timer Effect
  useEffect(() => {
    if (!activeTest || secondsLeft <= 0 || scoreReport) return;
    
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTest, secondsLeft, scoreReport]);

  const handleStartTest = async () => {
    setTestLoading(true);
    setScoreReport(null);
    setAnswers({});
    try {
      const test = await generateMockTest(selectedSubject, testType, duration);
      setActiveTest(test);
      setSecondsLeft(duration * 60);
    } catch (e) {
      console.error(e);
    } finally {
      setTestLoading(false);
    }
  };

  const handleSelectOption = (qIdx: number, val: string) => {
    setAnswers(prev => ({ ...prev, [qIdx]: val }));
  };

  const handleTextChange = (qIdx: number, val: string) => {
    setAnswers(prev => ({ ...prev, [qIdx]: val }));
  };

  const handleSubmitTest = async () => {
    if (!activeTest) return;
    setSubmitting(true);

    const questionsList = activeTest.questions || [];
    const answersArray = Array.from({ length: questionsList.length }).map((_, i) => answers[i] || '');

    try {
      const report = await submitMockTest(activeTest.id, answersArray);
      setScoreReport(report);
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a78bfa', '#6366f1']
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = () => {
    alert('Time has expired! Automatically submitting your responses.');
    handleSubmitTest();
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const questionsToShow = activeTest ? activeTest.questions : [];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          Mock Tests
          <ClipboardCheck className="w-6 h-6 text-purple-400" />
        </h1>
        <p className="text-slate-400 text-sm">Launch a simulated timed exam. Get automatic AI grading reports detailing points division and customized recommendations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Set up options / attempts */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Configure mock test */}
          {!activeTest && (
            <div className="glass-card p-6 rounded-[24px]">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Configure Exam</h3>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Course Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-3 py-2 text-xs glass-input focus:outline-none appearance-none"
                  >
                    <option className="bg-[#0c0f24]" value="Data Structures">Data Structures</option>
                    <option className="bg-[#0c0f24]" value="Operating Systems">Operating Systems</option>
                    <option className="bg-[#0c0f24]" value="Database Management">Database Management</option>
                    <option className="bg-[#0c0f24]" value="Computer Networks">Computer Networks</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Question Type</label>
                    <select
                      value={testType}
                      onChange={(e) => setTestType(e.target.value as any)}
                      className="px-3 py-2 text-xs glass-input focus:outline-none appearance-none"
                    >
                      <option className="bg-[#0c0f24]" value="MCQ">MCQ (Auto)</option>
                      <option className="bg-[#0c0f24]" value="SUBJECTIVE">Subjective</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Duration (Min)</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="px-3 py-2 text-xs glass-input focus:outline-none appearance-none"
                    >
                      <option className="bg-[#0c0f24]" value="10">10 Mins</option>
                      <option className="bg-[#0c0f24]" value="30">30 Mins</option>
                      <option className="bg-[#0c0f24]" value="60">60 Mins</option>
                    </select>
                  </div>
                </div>

                <button
                  id="mock-start-test-btn"
                  onClick={handleStartTest}
                  disabled={testLoading}
                  className="w-full py-2.5 px-4 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold text-xs text-white shadow-lg transition-all flex items-center justify-center gap-1.5"
                >
                  {testLoading ? 'Compiling Exam File...' : 'Start Mock Test'}
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Past Attempts history */}
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Attempt History</h3>
            <div className="flex flex-col gap-3">
              {mockAttempts.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No tests completed yet.</p>
              ) : (
                mockAttempts.map((item) => (
                  <div key={item.id} className="p-3 bg-indigo-950/10 border border-indigo-950/40 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-400" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-200">{item.subjectName}</span>
                        <span className="text-[9px] text-slate-500">{item.date}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 px-2 py-0.5 rounded-lg">
                      {item.score}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Test Workspace Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-[24px] min-h-[400px] flex flex-col justify-between">
            
            {/* NO ACTIVE TEST VIEW */}
            {!activeTest && (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-24 text-slate-500">
                <ClipboardCheck className="w-12 h-12 text-slate-500" />
                <h4 className="text-xs font-semibold text-slate-400">Mock Exam Workspace is empty</h4>
                <p className="text-[10px] text-slate-500 max-w-[240px]">Configure your exam parameters on the left to start a timed study evaluation.</p>
              </div>
            )}

            {/* TIMED EXAM IN PROGRESS */}
            {activeTest && !scoreReport && (
              <div className="flex-1 flex flex-col justify-between">
                
                {/* Timer Header */}
                <div className="flex items-center justify-between border-b border-indigo-950/30 pb-4 mb-6">
                  <div className="flex flex-col">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Exam Mode: {activeTest.subjectName}</h4>
                    <span className="text-[10px] text-purple-400 font-semibold mt-0.5">{activeTest.type} Format</span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-950/40 border border-indigo-900/50 rounded-xl">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold font-mono text-cyan-400">{formatTime(secondsLeft)}</span>
                  </div>
                </div>

                {/* Questions render */}
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-[380px] pr-2">
                  {questionsToShow.map((q: any, idx: number) => {
                    const questionText = q.question || q;
                    return (
                      <div key={idx} className="p-4 bg-indigo-950/10 border border-indigo-950/40 rounded-2xl flex flex-col gap-3">
                        <h4 className="text-xs font-bold text-slate-200">
                          <span className="text-purple-400 mr-1.5">Q{idx + 1}.</span> {questionText}
                        </h4>

                        {/* MCQ options render */}
                        {activeTest.type === 'MCQ' ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                            {q.options?.map((opt: string, oIdx: number) => {
                              const isSelected = answers[idx] === opt;
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSelectOption(idx, opt)}
                                  className={`px-3 py-2 text-left text-xs font-medium border rounded-xl transition-all ${
                                    isSelected 
                                      ? 'border-purple-500 bg-purple-500/10 text-purple-300'
                                      : 'border-indigo-950 text-slate-400 hover:bg-indigo-950/30'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          // Subjective Text Area
                          <textarea
                            rows={3}
                            placeholder="Write your explanation in detail (minimum 10 words for full points)..."
                            value={answers[idx] || ''}
                            onChange={(e) => handleTextChange(idx, e.target.value)}
                            className="w-full p-3 bg-black/40 border border-indigo-950 rounded-2xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submission bottom buttons */}
                <div className="flex items-center justify-between border-t border-indigo-950/30 mt-6 pt-4">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Auto-Save Enabled</span>
                  </div>
                  
                  <button
                    id="mock-submit-answers-btn"
                    onClick={handleSubmitTest}
                    disabled={submitting}
                    className="py-2.5 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold text-xs text-white"
                  >
                    {submitting ? 'Evaluating via AI...' : 'Submit Exam'}
                  </button>
                </div>
              </div>
            )}

            {/* AI SCORE REPORT AND FEEDBACK */}
            {scoreReport && (
              <div className="flex-1 flex flex-col gap-6 animate-fade-in">
                
                {/* Score Header */}
                <div className="p-5 bg-gradient-to-r from-purple-950/20 to-indigo-950/20 border border-indigo-900/40 rounded-3xl flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Mock Report Card</h4>
                    <span className="text-xs text-slate-400 mt-1 font-medium">{selectedSubject} {testType} Attempt</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-emerald-400">{scoreReport.score}%</span>
                    <span className="text-[8px] font-semibold text-slate-500 uppercase mt-0.5">Overall Grade</span>
                  </div>
                </div>

                {/* Overall comments summary */}
                <div className="p-4 bg-indigo-950/15 border border-indigo-950/40 rounded-2xl flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-purple-400 uppercase">AI Review Summary</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">{scoreReport.overallSummary}</p>
                </div>

                {/* Point details list */}
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px] pr-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Detailed Breakdown</h4>
                  
                  {scoreReport.feedback?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-black/25 border border-indigo-950/60 rounded-2xl flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-200">Q{idx + 1}. {item.question}</span>
                        <span className="text-[9px] font-bold text-emerald-400">{item.points} / {item.maxPoints} pts</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] p-2 bg-indigo-950/10 rounded-xl border border-indigo-950/30">
                        <div>
                          <span className="font-semibold text-slate-400">Your Answer:</span>
                          <p className="text-slate-300 mt-0.5 truncate">{item.studentAnswer || '(No response)'}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-400">Correct Answer:</span>
                          <p className="text-slate-300 mt-0.5 truncate">{item.correctAnswer}</p>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 leading-normal pl-1"><span className="font-semibold text-purple-400">Feedback:</span> {item.explanation}</p>
                    </div>
                  ))}
                </div>

                {/* Restart trigger */}
                <button
                  id="mock-restart-test-btn"
                  onClick={() => { setActiveTest(null); setScoreReport(null); }}
                  className="py-2 px-5 self-end bg-indigo-950/30 hover:bg-indigo-950/60 border border-indigo-950 rounded-xl text-xs font-bold text-slate-300"
                >
                  Configure New Exam
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
