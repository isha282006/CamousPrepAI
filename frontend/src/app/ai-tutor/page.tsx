'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, HelpCircle, GraduationCap, ClipboardList, Sparkles, Send, Play, CheckCircle, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AITutor() {
  const { getTopicDetails, activeSyllabus } = useApp();

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [activeTab, setActiveTab] = useState<'beginner' | 'detailed' | 'examples' | 'practice' | 'quiz'>('beginner');
  
  const [loading, setLoading] = useState(false);
  const [tutorData, setTutorData] = useState<any>(null);
  
  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Doubt states
  const [doubtInput, setDoubtInput] = useState('');
  const [doubtResponse, setDoubtResponse] = useState('');
  const [doubtLoading, setDoubtLoading] = useState(false);

  // Fallback selector data if syllabus not uploaded yet
  const defaultSubjects = [
    { name: 'Data Structures', topics: ['Arrays and Linked Lists', 'Stacks and Queues', 'Binary Search Trees'] },
    { name: 'Operating Systems', topics: ['Process Management', 'CPU Scheduling Algorithms', 'Paging and Segmentation'] },
    { name: 'Database Management', topics: ['SQL Queries', 'ER Diagrams & Normalization'] }
  ];

  const subjectsList = activeSyllabus?.subjects || defaultSubjects;
  const currentTopics = subjectsList.find((s: any) => s.name === selectedSubject)?.topics?.map((t: any) => t.name || t) || [];

  const handleFetchTutor = async () => {
    if (!selectedSubject || !selectedTopic) return;
    setLoading(true);
    setTutorData(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setDoubtResponse('');
    
    try {
      const data = await getTopicDetails(selectedSubject, selectedTopic);
      setTutorData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizOptionSelect = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    // Check score
    let correctCount = 0;
    tutorData.quiz.forEach((q: any, idx: number) => {
      if (quizAnswers[idx] === q.correctAnswerIndex) correctCount++;
    });
    
    if (correctCount === tutorData.quiz.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a78bfa', '#6366f1', '#06b6d4']
      });
    }
  };

  const handleAskDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtInput.trim()) return;

    setDoubtLoading(true);
    setDoubtResponse('');
    
    try {
      const res = await getTopicDetails(selectedSubject, `Doubt: ${doubtInput} about topic ${selectedTopic}`);
      setDoubtResponse(res.beginner || res.detailed);
    } catch (e) {
      setDoubtResponse('Error connecting to tutor agent. Please try again.');
    } finally {
      setDoubtLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          AI Tutor
          <Sparkles className="w-6 h-6 text-purple-400" />
        </h1>
        <p className="text-slate-400 text-sm">Select a course subject and topic to get explained details, academic notes, flash quizzes, and doubt answering.</p>
      </div>

      {/* Selectors and doubt solver in grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Topic Selector Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Select Topic</h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Subject</label>
                <select
                  id="tutor-subject-select"
                  value={selectedSubject}
                  onChange={(e) => { setSelectedSubject(e.target.value); setSelectedTopic(''); }}
                  className="px-3 py-2 text-xs glass-input focus:outline-none appearance-none"
                >
                  <option value="">Choose Subject</option>
                  {subjectsList.map((s: any, idx: number) => (
                    <option key={idx} className="bg-[#0c0f24]" value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {selectedSubject && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Topic</label>
                  <select
                    id="tutor-topic-select"
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="px-3 py-2 text-xs glass-input focus:outline-none appearance-none"
                  >
                    <option value="">Choose Topic</option>
                    {currentTopics.map((t: string, idx: number) => (
                      <option key={idx} className="bg-[#0c0f24]" value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                id="tutor-start-btn"
                onClick={handleFetchTutor}
                disabled={loading || !selectedTopic}
                className="w-full py-2.5 px-4 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold text-xs text-white shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                {loading ? 'Consulting Syllabus AI...' : 'Start Learning'}
                <Play className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Doubt Solver */}
          {tutorData && (
            <div className="glass-card p-6 rounded-[24px]">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Solve Doubts</h3>
              
              <form onSubmit={handleAskDoubt} className="flex gap-2">
                <input
                  id="tutor-doubt-input"
                  type="text"
                  placeholder="Ask a question about this topic..."
                  value={doubtInput}
                  onChange={(e) => setDoubtInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-[#03040c] border border-indigo-950 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
                />
                <button
                  id="tutor-doubt-submit"
                  type="submit"
                  className="p-2 bg-purple-600 text-white rounded-xl"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {doubtLoading && (
                <p className="text-[10px] text-purple-400 mt-3 animate-pulse">Formulating simple explanation...</p>
              )}

              {doubtResponse && (
                <div className="mt-4 p-3 bg-indigo-950/20 border border-indigo-950/60 rounded-2xl">
                  <h4 className="text-[10px] font-bold text-purple-400 uppercase">AI Explanation</h4>
                  <p className="text-[10.5px] text-slate-300 mt-1.5 leading-relaxed">{doubtResponse}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Explanations & Quiz Workspace */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-[24px] min-h-[400px] flex flex-col">
            
            {/* TABS */}
            <div className="flex items-center border-b border-indigo-950/30 pb-4 mb-4 gap-4 overflow-x-auto">
              {(['beginner', 'detailed', 'examples', 'practice', 'quiz'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  disabled={!tutorData}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    !tutorData ? 'opacity-40 cursor-not-allowed' : ''
                  } ${
                    activeTab === tab 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab === 'beginner' ? 'Analogy' : tab === 'detailed' ? 'Notes' : tab}
                </button>
              ))}
            </div>

            {/* Content view */}
            {!tutorData ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-20 text-slate-500">
                <GraduationCap className="w-12 h-12 text-slate-500" />
                <h4 className="text-sm font-semibold text-slate-400">Tutor workspace is waiting</h4>
                <p className="text-xs text-slate-500 max-w-[280px]">Select a course topic on the left and hit Start Learning to fetch notes.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                {/* 1. Beginner Analogy */}
                {activeTab === 'beginner' && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <BookOpen className="w-5 h-5 text-purple-400" />
                      Beginner Analogy Explanation
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-normal bg-purple-950/5 p-4 rounded-2xl border border-purple-900/10">
                      {tutorData.beginner}
                    </p>
                  </div>
                )}

                {/* 2. Detailed Notes */}
                {activeTab === 'detailed' && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <GraduationCap className="w-5 h-5 text-purple-400" />
                      Academic detailed Notes
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-normal bg-indigo-950/5 p-4 rounded-2xl border border-indigo-950/40">
                      {tutorData.detailed}
                    </p>
                  </div>
                )}

                {/* 3. Examples */}
                {activeTab === 'examples' && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <h3 className="text-base font-bold text-white">Interactive Examples</h3>
                    <pre className="text-xs text-slate-300 font-mono bg-black/40 p-4 rounded-2xl border border-indigo-950/80 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {tutorData.examples}
                    </pre>
                  </div>
                )}

                {/* 4. Practice Questions */}
                {activeTab === 'practice' && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <ClipboardList className="w-5 h-5 text-purple-400" />
                      Self Practice Questions
                    </h3>
                    <div className="flex flex-col gap-3">
                      {tutorData.practiceQuestions?.map((q: string, idx: number) => (
                        <div key={idx} className="p-3 bg-indigo-950/10 border border-indigo-950/40 rounded-2xl text-xs text-slate-300">
                          <span className="font-bold text-purple-400 mr-2">Q{idx + 1}.</span> {q}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Quiz Section */}
                {activeTab === 'quiz' && (
                  <div className="flex flex-col gap-5 animate-fade-in">
                    <h3 className="text-base font-bold text-white">Topic Quiz</h3>
                    
                    <div className="flex flex-col gap-6">
                      {tutorData.quiz?.map((q: any, qIdx: number) => (
                        <div key={qIdx} className="p-4 bg-indigo-950/10 border border-indigo-950/40 rounded-2xl flex flex-col gap-3">
                          <h4 className="text-xs font-bold text-slate-200">
                            <span className="text-purple-400 mr-1.5">Q{qIdx + 1}.</span> {q.question}
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                            {q.options?.map((opt: string, oIdx: number) => {
                              const isSelected = quizAnswers[qIdx] === oIdx;
                              const isCorrect = q.correctAnswerIndex === oIdx;
                              let btnClass = "border-indigo-950 text-slate-300 hover:bg-indigo-950/30";
                              
                              if (isSelected) {
                                btnClass = "border-purple-500 bg-purple-500/10 text-purple-300";
                              }
                              
                              if (quizSubmitted) {
                                if (isCorrect) {
                                  btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-400";
                                } else if (isSelected) {
                                  btnClass = "border-rose-500 bg-rose-500/10 text-rose-400";
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleQuizOptionSelect(qIdx, oIdx)}
                                  className={`px-3 py-2 text-left text-xs font-medium border rounded-xl transition-all ${btnClass}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <div className="p-3 bg-black/20 rounded-xl mt-1 text-[10px] text-slate-400 border border-indigo-950/30">
                              <span className="font-bold text-purple-400 block mb-0.5">Explanation:</span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {!quizSubmitted && (
                      <button
                        id="tutor-submit-quiz"
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length !== tutorData.quiz.length}
                        className="py-2.5 px-6 self-end bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-xs text-white"
                      >
                        Submit Answers
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
