'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  GraduationCap, 
  CalendarRange, 
  FileText, 
  Sparkles, 
  BookOpen, 
  ClipboardCheck, 
  FileSearch, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  FolderLock, 
  Search, 
  Bell, 
  MessageSquare,
  ArrowRight,
  ChevronDown,
  User,
  Settings as SettingsIcon,
  HelpCircle,
  Menu,
  X,
  CreditCard,
  LogOut,
  Send,
  Sparkle
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    user, 
    notifications, 
    markNotificationsAsRead, 
    logout, 
    isSidebarCollapsed, 
    setSidebarCollapsed,
    getTopicDetails
  } = useApp();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  
  // AI assistant chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Hello! I am your CampusPrep AI assistant. How can I help you study today? Ask doubts, generate notes, or take a quick quiz!' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Exclude sidebar/header on auth/onboarding pages
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/onboarding';

  const sidebarItems: SidebarItem[] = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'AI Tutor', href: '/ai-tutor', icon: GraduationCap },
    { name: 'Study Planner', href: '/study-planner', icon: CalendarRange },
    { name: 'Syllabus', href: '/syllabus', icon: FileText },
    { name: 'Revision Hub', href: '/revision-hub', icon: Sparkles },
    { name: 'Mock Tests', href: '/mock-tests', icon: ClipboardCheck },
    { name: 'PYQ Analyzer', href: '/pyq-analyzer', icon: FileSearch },
    { name: 'Progress', href: '/progress', icon: TrendingUp },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Notes', href: '/notes', icon: BookOpen },
    { name: 'Flashcards', href: '/flashcards', icon: Sparkle },
    { name: 'Resources', href: '/resources', icon: FolderLock },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  // Insert Admin panel link for admin accounts
  if (user?.role === 'ADMIN') {
    sidebarItems.push({ name: 'Admin Panel', href: '/admin', icon: HelpCircle });
  }

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setChatLoading(true);

    try {
      // Direct call explaining a quick doubted topic
      const res = await getTopicDetails('General Doubt Solver', userText);
      setChatMessages(prev => [...prev, { sender: 'ai', text: res.beginner || 'Here is what I found: ' + res.detailed }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I ran into an error. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  if (isAuthPage) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen flex text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* 1. LEFT SIDEBAR (DESKTOP) */}
      <aside 
        className={`hidden md:flex flex-col shrink-0 border-r border-indigo-950 bg-[#03040c] transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } p-4 justify-between h-screen sticky top-0`}
      >
        <div className="flex flex-col gap-6 overflow-y-auto pr-1">
          {/* Logo Section */}
          <div className="flex items-center justify-between mt-2 px-2">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-lg text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                  C
                </div>
                <span className="font-extrabold text-xl bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent tracking-tight">
                  CampusPrep AI
                </span>
              </div>
            )}
            {isSidebarCollapsed && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-lg text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] mx-auto">
                C
              </div>
            )}
            
            <button 
              id="sidebar-toggle-btn"
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              className="text-slate-400 hover:text-white p-1 hover:bg-slate-900 rounded-md transition-colors"
            >
              {isSidebarCollapsed ? '»' : '«'}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 mt-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  id={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive 
                      ? 'sidebar-active shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-indigo-950/20'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-400'} transition-colors`} />
                  {!isSidebarCollapsed && <span>{item.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Card / User Info */}
        <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-indigo-950">
          {!isSidebarCollapsed && (
            <div className="glass-card p-3 rounded-2xl bg-indigo-950/10 border-indigo-950/40">
              <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-1">Upgrade to Pro</h4>
              <p className="text-[10px] text-slate-400 mb-2.5 leading-relaxed">Unlock unlimited AI tutoring, advanced analytics & more.</p>
              <button 
                id="upgrade-now-btn"
                className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-bold text-white hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
              >
                Upgrade Now
              </button>
            </div>
          )}

          {/* User profile dropdown button */}
          <div className="relative">
            <button
              id="profile-dropdown-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-indigo-950/20 transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white border border-indigo-500">
                  {user?.name ? user.name[0] : 'P'}
                </div>
                {!isSidebarCollapsed && (
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate leading-tight">{user?.name || 'Priya Sharma'}</p>
                    <p className="text-[10px] text-slate-400 truncate leading-none mt-1">{user?.email || 'priya@example.com'}</p>
                  </div>
                )}
              </div>
              {!isSidebarCollapsed && <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
            </button>

            {isProfileOpen && !isSidebarCollapsed && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-[#0d1127] border border-indigo-950 rounded-2xl shadow-xl p-2 z-50 animate-glow">
                <button
                  id="profile-settings-btn"
                  onClick={() => { router.push('/settings'); setIsProfileOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-indigo-950/40 rounded-xl transition-all"
                >
                  <User className="w-4 h-4 text-purple-400" />
                  View Profile
                </button>
                <button
                  id="profile-logout-btn"
                  onClick={() => { logout(); router.push('/login'); setIsProfileOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MOBILE HEADER & SIDEBAR MENU */}
      <div className="md:hidden w-full flex items-center justify-between p-4 bg-[#03040c] border-b border-indigo-950 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]">
            C
          </div>
          <span className="font-extrabold text-lg bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
            CampusPrep AI
          </span>
        </div>
        <button 
          id="mobile-menu-btn"
          onClick={() => setIsMobileOpen(true)}
          className="text-slate-300 p-2 hover:bg-indigo-950/30 rounded-xl"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 bg-[#03040c]/90 z-50 flex flex-col p-4 animate-fade-in md:hidden">
          <div className="flex items-center justify-between border-b border-indigo-950 pb-4 mb-4">
            <span className="font-bold text-xl">Menu</span>
            <button 
              id="close-mobile-menu-btn"
              onClick={() => setIsMobileOpen(false)}
              className="text-slate-300 p-2 hover:bg-indigo-950/30 rounded-xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-2 overflow-y-auto max-h-[70vh]">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => { router.push(item.href); setIsMobileOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'sidebar-active shadow-[0_0_10px_rgba(139,92,246,0.15)]' : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5 text-purple-400" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-indigo-950 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white border border-indigo-500">
                P
              </div>
              <div>
                <p className="text-sm font-semibold">{user?.name || 'Priya Sharma'}</p>
                <p className="text-xs text-slate-400">{user?.email || 'priya@example.com'}</p>
              </div>
            </div>
            <button 
              id="mobile-logout-btn"
              onClick={() => { logout(); router.push('/login'); setIsMobileOpen(false); }}
              className="p-2 text-rose-400 hover:bg-rose-950/20 rounded-xl"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col min-h-screen bg-[#050816] overflow-x-hidden">
        {/* TOP NAVIGATION BAR */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#050816]/40 backdrop-blur-md border-b border-indigo-950/30 sticky top-0 z-30">
          {/* Search bar matching reference */}
          <div className="relative w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              id="global-search-input"
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-12 py-2 text-xs bg-indigo-950/20 border border-indigo-950/50 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-200 placeholder-slate-500 transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-slate-500 bg-[#0d1127] border border-indigo-950 px-1.5 py-0.5 rounded-md">
              ⌘ K
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification drop */}
            <div className="relative">
              <button 
                id="notification-badge-btn"
                onClick={() => { setIsNotifOpen(!isNotifOpen); markNotificationsAsRead(); }}
                className="p-2 text-slate-300 hover:text-white hover:bg-indigo-950/20 rounded-xl relative transition-all border border-indigo-950/40"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-[8px] font-bold text-white ring-1 ring-[#050816]">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 glass-card bg-[#0d1127]/95 border-indigo-950/80 rounded-2xl shadow-2xl p-4 z-50 animate-glow">
                  <div className="flex items-center justify-between border-b border-indigo-950/60 pb-2 mb-2">
                    <span className="text-xs font-bold text-purple-400">Notifications</span>
                    <button 
                      id="close-notif-btn"
                      onClick={() => setIsNotifOpen(false)}
                      className="text-[10px] text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center text-[10px] text-slate-500 py-4">No new notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-2 hover:bg-indigo-950/30 rounded-xl transition-all">
                          <h5 className="text-[11px] font-semibold text-slate-200">{n.title}</h5>
                          <p className="text-[10px] text-slate-400 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* AI Assistant Button in Top Nav */}
            <button 
              id="top-ai-assistant-btn"
              onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-bold rounded-xl text-white hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </button>

            {/* Small avatar profile card */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white border border-indigo-500">
              {user?.name ? user.name[0] : 'P'}
            </div>
          </div>
        </header>

        {/* PAGE INJECTED VIEWPORTS */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* 4. FLOATING AI ASSISTANT CHATBOT MODAL */}
      {isAiAssistantOpen && (
        <div className="fixed bottom-6 right-6 w-96 glass-card bg-[#0b0e22]/98 border-purple-900/40 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden animate-float">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-b border-indigo-950 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                🤖
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  Study Buddy AI
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                </h4>
                <p className="text-[9px] text-slate-400">Gemini Pro-Ready Agent</p>
              </div>
            </div>
            <button 
              id="close-ai-assistant-btn"
              onClick={() => setIsAiAssistantOpen(false)}
              className="text-slate-400 hover:text-white p-1 hover:bg-indigo-950/40 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-72 min-h-60 flex flex-col">
            {chatMessages.map((msg, i) => (
              <div 
                key={i} 
                className={`max-w-[80%] p-2.5 rounded-2xl text-[11px] leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-purple-600 text-white rounded-br-none self-end' 
                    : 'bg-[#121634] text-slate-200 rounded-bl-none self-start border border-indigo-950'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {chatLoading && (
              <div className="bg-[#121634] text-slate-300 text-[10px] p-2 rounded-2xl rounded-bl-none max-w-[80%] self-start border border-indigo-950 animate-pulse">
                Analyzing concept and generating detailed tutor notes...
              </div>
            )}
          </div>

          {/* Input form */}
          <form onSubmit={handleSendChat} className="p-3 border-t border-indigo-950 bg-indigo-950/20 flex gap-2">
            <input 
              id="ai-assistant-chat-input"
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask doubts, request quiz, or summarize topics..."
              className="flex-1 px-3 py-2 text-xs bg-[#03040c] border border-indigo-950 rounded-xl focus:outline-none focus:border-purple-500 text-slate-200"
            />
            <button 
              id="ai-assistant-send-btn"
              type="submit"
              className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg transition-all flex items-center justify-center shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
