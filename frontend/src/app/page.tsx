'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useRouter } from 'next/navigation';
import { 
  Flame, 
  Clock, 
  BookOpen, 
  Award, 
  Plus, 
  ArrowRight, 
  Calendar, 
  CheckSquare, 
  Square,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  LineChart,
  Line
} from 'recharts';

export default function Dashboard() {
  const router = useRouter();
  const { 
    user, 
    tasks, 
    toggleTaskCompletion, 
    addNewTask,
    activeSyllabus
  } = useApp();

  const [mounted, setMounted] = useState(false);
  const [scheduleTab, setScheduleTab] = useState<'today' | 'week' | 'month'>('today');
  const [newTaskInput, setNewTaskInput] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stats Sparkline Data
  const streakSparkline = [
    { value: 4 }, { value: 6 }, { value: 5 }, { value: 8 }, { value: 9 }, { value: 11 }, { value: 12 }
  ];

  const timeSparkline = [
    { value: 2 }, { value: 3.5 }, { value: 2.8 }, { value: 4.5 }, { value: 5.2 }, { value: 4.0 }, { value: 2.5 }
  ];

  // Radar Chart Data
  const radarData = [
    { subject: 'DSA', A: 85, fullMark: 100 },
    { subject: 'DBMS', A: 70, fullMark: 100 },
    { subject: 'OS', A: 65, fullMark: 100 },
    { subject: 'CN', A: 80, fullMark: 100 },
    { subject: 'Maths', A: 75, fullMark: 100 },
    { subject: 'AI', A: 60, fullMark: 100 },
  ];

  // Weekly Area Chart Data
  const weeklyHoursData = [
    { day: 'Mon', hours: 2.0 },
    { day: 'Tue', hours: 2.5 },
    { day: 'Wed', hours: 3.0 },
    { day: 'Thu', hours: 4.5 },
    { day: 'Fri', hours: 5.2 },
    { day: 'Sat', hours: 3.8 },
    { day: 'Sun', hours: 2.5 },
  ];

  // Subjects Progress List
  const subjectsProgress = [
    { name: 'Data Structures', progress: 85, color: 'bg-emerald-500', text: 'text-emerald-400' },
    { name: 'Operating Systems', progress: 65, color: 'bg-purple-500', text: 'text-purple-400' },
    { name: 'Database Management', progress: 70, color: 'bg-blue-500', text: 'text-blue-400' },
    { name: 'Computer Networks', progress: 80, color: 'bg-amber-500', text: 'text-amber-400' },
    { name: 'Discrete Mathematics', progress: 75, color: 'bg-teal-500', text: 'text-teal-400' },
    { name: 'Artificial Intelligence', progress: 60, color: 'bg-pink-500', text: 'text-pink-400' },
  ];

  // Upcoming Exams List
  const upcomingExams = [
    { subject: 'Data Structures', date: 'May 15, 2024', daysLeft: 5, color: 'bg-purple-950/40 text-purple-400 border-purple-900/50' },
    { subject: 'Operating Systems', date: 'May 22, 2024', daysLeft: 12, color: 'bg-blue-950/40 text-blue-400 border-blue-900/50' },
    { subject: 'Database Management', date: 'May 29, 2024', daysLeft: 19, color: 'bg-teal-950/40 text-teal-400 border-teal-900/50' },
  ];

  // Recent Activity Feed
  const recentActivities = [
    { text: 'Completed Arrays and Linked Lists', time: '2h ago', type: 'complete', color: 'text-emerald-400' },
    { text: 'Generated mock test for DBMS', time: '5h ago', type: 'mock', color: 'text-purple-400' },
    { text: 'Reviewed notes: OS Processes', time: 'Yesterday', type: 'note', color: 'text-blue-400' },
    { text: 'Scored 85% in CN Quiz', time: 'Yesterday', type: 'score', color: 'text-amber-400' }
  ];

  // Continue Learning Carousel Cards
  const continueLearningCards = [
    { topic: 'Arrays and Linked Lists', subject: 'Data Structures', progress: 85, color: 'from-blue-600 to-indigo-600' },
    { topic: 'Relations and Functions', subject: 'Discrete Mathematics', progress: 60, color: 'from-purple-600 to-indigo-600' },
    { topic: 'Process Management', subject: 'Operating Systems', progress: 40, color: 'from-teal-600 to-emerald-600' },
    { topic: 'SQL Queries', subject: 'Database Management', progress: 70, color: 'from-fuchsia-600 to-pink-600' }
  ];

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    addNewTask({
      timeSlot: '8:00 PM',
      subjectName: 'Self Study',
      topicName: newTaskInput,
      date: new Date().toISOString().split('T')[0]
    });
    setNewTaskInput('');
    setShowAddTask(false);
  };

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % continueLearningCards.length);
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + continueLearningCards.length) % continueLearningCards.length);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* 1. DASHBOARD HEADER */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
          Good Morning, {user?.name ? user.name.split(' ')[0] : 'Priya'}! 👋
        </h1>
        <p className="text-slate-400 text-sm font-medium">
          You're on a {user?.streak || 12} day study streak. Keep it up!
        </p>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Study Streak */}
        <div className="glass-card p-5 rounded-[24px] flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-orange-400 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-orange-400/20" />
              <span>Study Streak</span>
            </div>
            <span className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              {user?.streak || 12} Days
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Keep going!</span>
          </div>
          {mounted && (
            <div className="w-20 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={streakSparkline}>
                  <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Card 2: Study Time */}
        <div className="glass-card p-5 rounded-[24px] flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Study Time</span>
            </div>
            <span className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              {user?.studyHours || 23.5} hrs
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">This week</span>
          </div>
          {mounted && (
            <div className="w-20 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSparkline}>
                  <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Card 3: Subjects */}
        <div className="glass-card p-5 rounded-[24px] flex flex-col justify-between">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Subjects</span>
            </div>
            <span className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              {user?.subjectsCount || '6 / 7'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">In Progress</span>
          </div>
          <div className="w-full bg-indigo-950/60 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>

        {/* Card 4: Exam Readiness */}
        <div className="glass-card p-5 rounded-[24px] flex flex-col justify-between">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-1.5 text-purple-400 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Exam Readiness</span>
            </div>
            <span className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              78 %
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Good Progress</span>
          </div>
          <div className="w-full bg-indigo-950/60 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= COLUMN 1 & 2 (8 Cols Span on large screens) ================= */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* A. Study Plan Timeline */}
          <div className="glass-card p-6 rounded-[24px]">
            <div className="flex items-center justify-between border-b border-indigo-950/30 pb-4 mb-4">
              <h3 className="text-base font-bold text-white">Study Plan</h3>
              <div className="flex items-center bg-[#0d1127] border border-indigo-950 p-1 rounded-xl">
                {(['today', 'week', 'month'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setScheduleTab(tab)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                      scheduleTab === tab 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Timetable schedule content */}
            <div className="flex flex-col gap-4">
              {tasks.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  No slots generated. Upload your syllabus to create your timetable!
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between group p-1.5 hover:bg-indigo-950/10 rounded-xl transition-all">
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-bold text-slate-500 w-16">{task.timeSlot}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-200">{task.subjectName}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{task.topicName}</span>
                      </div>
                    </div>
                    
                    <button
                      id={`task-check-${task.id}`}
                      onClick={() => toggleTaskCompletion(task.id, !task.completed)}
                      className="text-slate-400 hover:text-purple-400 transition-colors"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-5 h-5 text-purple-500 fill-purple-500/10" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Custom Task Entry Form */}
            {showAddTask && (
              <form onSubmit={handleAddTaskSubmit} className="mt-4 flex gap-2">
                <input
                  id="add-task-input"
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="Enter task description (e.g. Revise Stack structures)..."
                  className="flex-1 px-3 py-1.5 text-xs bg-[#03040c] border border-indigo-950 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
                />
                <button
                  id="add-task-submit-btn"
                  type="submit"
                  className="px-3 py-1.5 text-xs font-bold bg-purple-600 text-white rounded-xl hover:bg-purple-500"
                >
                  Add
                </button>
              </form>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-indigo-950/30">
              <button
                id="toggle-add-task-btn"
                onClick={() => setShowAddTask(!showAddTask)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4 text-purple-400" />
                <span>Add Task</span>
              </button>
              <button 
                id="view-full-plan-btn"
                onClick={() => router.push('/study-planner')}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white transition-colors"
              >
                <span>View Full Plan</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
              </button>
            </div>
          </div>

          {/* Radar & Weekly Charts Area split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* B. Progress Overview (Radar) */}
            <div className="glass-card p-6 rounded-[24px] flex flex-col justify-between min-h-[340px]">
              <div className="flex items-center justify-between border-b border-indigo-950/30 pb-3 mb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Progress Overview</h4>
                <span className="text-[10px] text-slate-400 font-bold bg-[#0d1127] border border-indigo-950 px-2 py-0.5 rounded-lg">This Week</span>
              </div>
              
              {mounted && (
                <div className="w-full h-60 mt-2 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="rgba(99,102,241,0.15)" />
                      <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(99,102,241,0.2)" tick={false} />
                      <Radar name="Student" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* C. Time Spent (Area Chart) */}
            <div className="glass-card p-6 rounded-[24px] flex flex-col justify-between min-h-[340px]">
              <div className="flex items-center justify-between border-b border-indigo-950/30 pb-3 mb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Time Spent This Week</h4>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/30 border border-cyan-900/50 px-2 py-0.5 rounded-lg">5.2h Peak</span>
              </div>

              {mounted && (
                <div className="w-full h-60 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyHoursData}>
                      <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#64748b" fontSize={9} axisLine={false} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={9} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0d1127', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px' }}
                        labelStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#8b5cf6', fontSize: '10px' }}
                      />
                      <Area type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

          </div>

          {/* D. Subject Progress List */}
          <div className="glass-card p-6 rounded-[24px]">
            <div className="flex items-center justify-between border-b border-indigo-950/30 pb-4 mb-4">
              <h3 className="text-base font-bold text-white">Subject Progress</h3>
              <span className="text-[10px] text-slate-400 font-bold bg-[#0d1127] border border-indigo-950 px-2.5 py-0.5 rounded-lg uppercase tracking-wider">Overall Progress</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {subjectsProgress.map((sub, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300">{sub.name}</span>
                    <span className={sub.text}>{sub.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-indigo-950/60 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${sub.color}`} style={{ width: `${sub.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ================= COLUMN 3 (4 Cols Span on large screens) ================= */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* E. Upcoming Exams */}
          <div className="glass-card p-6 rounded-[24px]">
            <div className="flex items-center justify-between border-b border-indigo-950/30 pb-4 mb-4">
              <h3 className="text-base font-bold text-white">Upcoming Exams</h3>
              <button 
                id="view-all-exams-btn"
                onClick={() => router.push('/progress')}
                className="text-[10px] text-purple-400 font-bold hover:text-purple-300"
              >
                View All
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {upcomingExams.map((exam, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-indigo-950/20 border border-indigo-950/40 rounded-2xl hover:border-indigo-850 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-950/60 flex items-center justify-center border border-indigo-900/50">
                      <Calendar className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">{exam.subject}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{exam.date}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-xl text-[9px] font-extrabold border ${exam.color}`}>
                    {exam.daysLeft} Days
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* F. AI Study Assistant Call-to-action */}
          <div className="glass-card p-6 rounded-[24px] bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-[#050816] border-purple-900/30 flex items-center justify-between relative overflow-hidden animate-glow">
            <div className="flex flex-col gap-1 w-[60%]">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                AI Study Assistant 🌟
              </h3>
              <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                Need help with a topic? Ask me anything about your studies...
              </p>
              <button 
                id="dashboard-ask-ai-btn"
                onClick={() => {
                  const btn = document.getElementById('top-ai-assistant-btn');
                  if (btn) btn.click();
                }}
                className="mt-4 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-[10px] font-extrabold text-white transition-all w-24 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
              >
                <span>Ask AI</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            {/* Stylized Robot Avatar Mock */}
            <div className="w-24 h-24 relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-purple-500/30 animate-pulse absolute"></div>
              <span className="text-5xl animate-float">🤖</span>
            </div>
          </div>

          {/* G. Recent Activity */}
          <div className="glass-card p-6 rounded-[24px]">
            <div className="flex items-center justify-between border-b border-indigo-950/30 pb-4 mb-4">
              <h3 className="text-base font-bold text-white">Recent Activity</h3>
            </div>

            <div className="flex flex-col gap-4">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-1"></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-300 font-medium">{act.text}</span>
                    <span className="text-[9px] text-slate-500 mt-0.5">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 4. CONTINUE LEARNING SLIDER */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Continue Learning</h3>
          <div className="flex items-center gap-1.5">
            <button 
              id="slider-prev-btn"
              onClick={prevCarousel}
              className="p-1.5 rounded-lg bg-indigo-950/20 border border-indigo-950/40 hover:bg-indigo-900/30 transition-all text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              id="slider-next-btn"
              onClick={nextCarousel}
              className="p-1.5 rounded-lg bg-indigo-950/20 border border-indigo-950/40 hover:bg-indigo-900/30 transition-all text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Learning Cards Grid with simulated sliding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {continueLearningCards.map((card, i) => {
            const isVisible = (i + carouselIndex) % continueLearningCards.length < 4;
            return (
              <div 
                key={i}
                className={`glass-card p-5 rounded-[24px] flex flex-col justify-between min-h-[160px] bg-gradient-to-tr ${card.color}/5 border-indigo-950/40`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white truncate max-w-[150px]">{card.topic}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 truncate">{card.subject}</span>
                  </div>
                  <button 
                    id={`learn-play-${i}`}
                    onClick={() => router.push(`/ai-tutor?subject=${encodeURIComponent(card.subject)}&topic=${encodeURIComponent(card.topic)}`)}
                    className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </button>
                </div>
                
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>{card.progress}% Complete</span>
                  </div>
                  <div className="w-full h-1 bg-indigo-950/50 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${card.progress}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
