'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkle, HelpCircle, ArrowRight, RotateCw, Sparkles, Check, CheckCircle2 } from 'lucide-react';

export default function Flashcards() {
  const { flashcards, addNewFlashcard, reviewFlashcard } = useApp();

  const [activeIdx, setActiveIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddDeck, setShowAddDeck] = useState(false);

  // Form states
  const [subject, setSubject] = useState('Data Structures');
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const currentCard = flashcards[activeIdx] || null;

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setActiveIdx((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const handleRating = async (rating: 'Easy' | 'Medium' | 'Hard') => {
    if (!currentCard) return;
    await reviewFlashcard(currentCard.id, rating);
    handleNext();
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !question || !answer) return;
    
    addNewFlashcard({
      subjectName: subject,
      topicName: topic,
      question,
      answer,
      difficulty: 'Medium'
    });

    setTopic('');
    setQuestion('');
    setAnswer('');
    setShowAddDeck(false);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          Flashcards
          <Sparkle className="w-6 h-6 text-purple-400 fill-purple-400/20" />
        </h1>
        <p className="text-slate-400 text-sm">Review card lists with Spaced Repetition (SRS). Rate card difficulty to schedule optimal future study repetitions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Statistics & Creator panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Configure Decks</h3>
            
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-indigo-950/10 border border-indigo-950/40 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Total Flashcards</span>
                <span className="font-bold text-purple-400 bg-purple-950/30 border border-purple-900/50 px-2 py-0.5 rounded-lg">{flashcards.length} Cards</span>
              </div>
              <div className="p-3 bg-indigo-950/10 border border-indigo-950/40 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">SRS Queue</span>
                <span className="font-bold text-cyan-400 bg-cyan-950/30 border border-cyan-900/50 px-2 py-0.5 rounded-lg">2 Due Today</span>
              </div>
            </div>

            <button
              id="flashcard-toggle-drawer"
              onClick={() => setShowAddDeck(!showAddDeck)}
              className="w-full py-2.5 px-4 mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold text-xs text-white"
            >
              {showAddDeck ? 'Hide Creator' : 'Create New Card'}
            </button>
          </div>

          {showAddDeck && (
            <div className="glass-card p-6 rounded-[24px] animate-fade-in">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">New Flashcard</h3>
              <form onSubmit={handleCreateCard} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="px-3 py-2 text-xs glass-input focus:outline-none appearance-none"
                  >
                    <option className="bg-[#0c0f24]" value="Data Structures">Data Structures</option>
                    <option className="bg-[#0c0f24]" value="Operating Systems">Operating Systems</option>
                    <option className="bg-[#0c0f24]" value="Database Management">Database Management</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Topic</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arrays"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="px-3 py-2 text-xs glass-input"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Question / Prompt</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Question or term..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="px-3 py-2 text-xs glass-input"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Answer / Definition</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Detailed explanation..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="px-3 py-2 text-xs glass-input"
                  />
                </div>
                <button
                  id="flashcard-submit-btn"
                  type="submit"
                  className="w-full py-2 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-500"
                >
                  Save Card
                </button>
              </form>
            </div>
          )}
        </div>

        {/* 3D Reviewer panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card p-8 rounded-[32px] min-h-[420px] flex flex-col justify-between items-center bg-gradient-to-tr from-indigo-950/10 to-[#050816] border-indigo-900/30">
            
            {!currentCard ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-20 text-slate-500">
                <HelpCircle className="w-12 h-12 text-slate-500" />
                <h4 className="text-xs font-semibold text-slate-400">Card list is empty</h4>
                <p className="text-[10px] text-slate-500 max-w-[200px]">Create flashcards or upload syllabus to generate mock review cards.</p>
              </div>
            ) : (
              <div className="w-full flex-1 flex flex-col justify-between items-center gap-6">
                
                {/* Deck progress numbers */}
                <div className="flex items-center justify-between w-full border-b border-indigo-950/40 pb-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">{currentCard.subjectName}</span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{currentCard.topicName}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-bold">CARD {activeIdx + 1} OF {flashcards.length}</span>
                </div>

                {/* 3D Flip Card Container */}
                <div 
                  id="flashcard-3d-box"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full max-w-lg h-56 relative cursor-pointer group"
                  style={{ perspective: '1000px' }}
                >
                  <div 
                    className="w-full h-full rounded-[24px] transition-transform duration-500 ease-in-out border border-indigo-950/80 p-6 flex flex-col items-center justify-center text-center shadow-xl relative"
                    style={{ 
                      transformStyle: 'preserve-3d', 
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      background: 'rgba(13, 17, 39, 0.65)'
                    }}
                  >
                    {/* Front Face (Question) */}
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center p-6"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">Question</span>
                      <p className="text-sm font-bold text-slate-100 leading-relaxed max-w-[340px]">{currentCard.question}</p>
                      
                      <div className="absolute bottom-4 flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase">
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Click to flip</span>
                      </div>
                    </div>

                    {/* Back Face (Answer) */}
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center p-6"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-3">Answer Explanation</span>
                      <p className="text-xs text-slate-200 leading-relaxed font-semibold max-w-[340px]">{currentCard.answer}</p>
                    </div>
                  </div>
                </div>

                {/* Performance SRS scoring buttons */}
                <div className="flex flex-col items-center gap-4 w-full mt-4">
                  {isFlipped ? (
                    <div className="flex items-center gap-3 w-full max-w-sm">
                      <button
                        id="review-hard-btn"
                        onClick={() => handleRating('Hard')}
                        className="flex-1 py-2 px-3 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/40 text-rose-400 rounded-xl text-[10px] font-bold uppercase transition-all"
                      >
                        Hard (Repeat)
                      </button>
                      <button
                        id="review-medium-btn"
                        onClick={() => handleRating('Medium')}
                        className="flex-1 py-2 px-3 bg-indigo-950/30 hover:bg-indigo-950/60 border border-indigo-900/40 text-indigo-400 rounded-xl text-[10px] font-bold uppercase transition-all"
                      >
                        Medium
                      </button>
                      <button
                        id="review-easy-btn"
                        onClick={() => handleRating('Easy')}
                        className="flex-1 py-2 px-3 bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-900/40 text-emerald-400 rounded-xl text-[10px] font-bold uppercase transition-all"
                      >
                        Easy
                      </button>
                    </div>
                  ) : (
                    <button
                      id="flashcard-flip-btn"
                      onClick={() => setIsFlipped(true)}
                      className="py-2.5 px-6 bg-indigo-950/40 hover:bg-indigo-950/60 border border-indigo-950 text-xs text-slate-400 hover:text-white rounded-xl font-bold flex items-center gap-1.5 transition-all"
                    >
                      <span>Reveal Answer</span>
                      <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
