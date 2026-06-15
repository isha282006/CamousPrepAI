'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Interfaces for key data models
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'ADMIN';
  collegeName?: string;
  course?: string;
  branch?: string;
  year?: string;
  semester?: string;
  streak: number;
  studyHours: number;
  subjectsCount?: string;
}

export interface Task {
  id: string;
  timeSlot: string;
  subjectName: string;
  topicName: string;
  completed: boolean;
  date: string;
}

export interface SubjectProgress {
  name: string;
  progress: number;
  color: string;
}

export interface Exam {
  id: string;
  subject: string;
  date: string;
  daysLeft: number;
  color: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface FlashcardItem {
  id: string;
  subjectName: string;
  topicName: string;
  question: string;
  answer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface MockTestItem {
  id: string;
  subjectName: string;
  type: 'MCQ' | 'SUBJECTIVE';
  durationMinutes: number;
  questions: any[];
}

export interface MockAttempt {
  id: string;
  subjectName: string;
  score: number;
  date: string;
  evaluationReport: any;
}

export interface SyllabusItem {
  id: string;
  fileName: string;
  subjects: any[];
}

interface AppContextProps {
  user: UserProfile | null;
  token: string | null;
  tasks: Task[];
  notifications: NotificationItem[];
  flashcards: FlashcardItem[];
  mockTests: MockTestItem[];
  mockAttempts: MockAttempt[];
  syllabusList: SyllabusItem[];
  activeSyllabus: SyllabusItem | null;
  loading: boolean;
  backendOnline: boolean;
  apiUrl: string;
  isSidebarCollapsed: boolean;
  
  // Functions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  updateOnboarding: (data: Partial<UserProfile>) => Promise<boolean>;
  setSidebarCollapsed: (val: boolean) => void;
  toggleTaskCompletion: (id: string, completed: boolean) => Promise<void>;
  addNewTask: (task: Omit<Task, 'id' | 'completed'>) => Promise<void>;
  uploadSyllabus: (file: File) => Promise<any>;
  generateTimetable: (pref: any) => Promise<void>;
  submitMockTest: (testId: string, answers: any[]) => Promise<any>;
  generateMockTest: (subject: string, type: 'MCQ' | 'SUBJECTIVE', duration: number) => Promise<any>;
  getTopicDetails: (subject: string, topic: string) => Promise<any>;
  generateRevisionMaterial: (subject: string, topic: string, type: string) => Promise<any>;
  addNewFlashcard: (card: Omit<FlashcardItem, 'id'>) => Promise<void>;
  reviewFlashcard: (id: string, rating: 'Easy' | 'Medium' | 'Hard') => Promise<void>;
  markNotificationsAsRead: () => Promise<void>;
  submitFeedback: (feedbackText: string, rating: number) => Promise<void>;
  getAdminStats: () => Promise<any>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const DEFAULT_API_URL = 'http://localhost:5000/api';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [mockTests, setMockTests] = useState<MockTestItem[]>([]);
  const [mockAttempts, setMockAttempts] = useState<MockAttempt[]>([]);
  const [syllabusList, setSyllabusList] = useState<SyllabusItem[]>([]);
  const [activeSyllabus, setActiveSyllabus] = useState<SyllabusItem | null>(null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);
  const [apiUrl] = useState(DEFAULT_API_URL);

  // Check backend health and load local token
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${DEFAULT_API_URL}/health`);
        if (res.ok) {
          setBackendOnline(true);
          console.log('CampusPrep Express backend online.');
        } else {
          setBackendOnline(false);
        }
      } catch (e) {
        setBackendOnline(false);
        console.warn('CampusPrep Express backend offline. Using simulated frontend state.');
      }
    };

    checkBackend();

    // Check localStorage auth
    const savedToken = localStorage.getItem('cp_token');
    const savedUser = localStorage.getItem('cp_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    } else {
      // Create a default demo user so dashboard works instantly
      const demoUser: UserProfile = {
        id: 'priya-default-id',
        email: 'priya@example.com',
        name: 'Priya Sharma',
        role: 'STUDENT',
        collegeName: 'National Institute of Technology',
        course: 'Bachelor of Technology',
        branch: 'Computer Science',
        year: '3rd Year',
        semester: '6th Semester',
        streak: 12,
        studyHours: 23.5,
        subjectsCount: '6 / 7'
      };
      setUser(demoUser);
      setToken(Buffer.from(demoUser.id).toString('base64'));
    }

    // Load initial mock list/tasks if offline
    setLoading(false);
  }, []);

  // Fetch or setup mock data when user/token updates
  useEffect(() => {
    if (!user) return;
    
    if (backendOnline && token) {
      fetchTasks();
      fetchNotifications();
      fetchFlashcards();
      fetchMockAttempts();
      fetchSyllabus();
    } else {
      // Load mock items
      setTasks([
        { id: '1', timeSlot: "9:00 AM", subjectName: "Data Structures", topicName: "Arrays and Linked Lists", completed: true, date: new Date().toISOString().split('T')[0] },
        { id: '2', timeSlot: "11:00 AM", subjectName: "Discrete Mathematics", topicName: "Relations and Functions", completed: true, date: new Date().toISOString().split('T')[0] },
        { id: '3', timeSlot: "2:00 PM", subjectName: "Operating Systems", topicName: "Process Management", completed: false, date: new Date().toISOString().split('T')[0] },
        { id: '4', timeSlot: "4:00 PM", subjectName: "Database Management", topicName: "SQL Queries", completed: true, date: new Date().toISOString().split('T')[0] },
        { id: '5', timeSlot: "6:00 PM", subjectName: "Computer Networks", topicName: "Network Layers", completed: false, date: new Date().toISOString().split('T')[0] }
      ]);
      setNotifications([
        { id: '1', title: "Revision Alert", message: "Time to revise Arrays and Linked Lists!", type: "REVISION", read: false, createdAt: new Date().toISOString() },
        { id: '2', title: "Exam Reminder", message: "Data Structures exam is in 5 days.", type: "EXAM", read: false, createdAt: new Date().toISOString() },
        { id: '3', title: "AI Motivation", message: "Keep it up Priya! You are on a 12 day streak!", type: "MOTIVATION", read: false, createdAt: new Date().toISOString() }
      ]);
      setFlashcards([
        { id: '1', subjectName: 'Data Structures', topicName: 'Arrays', question: 'What is the search time complexity in a sorted array?', answer: 'O(log n) using binary search.', difficulty: 'Medium' },
        { id: '2', subjectName: 'Operating Systems', topicName: 'Processes', question: 'What is a Process Control Block (PCB)?', answer: 'A data structure used by the OS to store all information about a process.', difficulty: 'Medium' }
      ]);
      // Mock mock tests
      setMockTests([
        { id: 'test-1', subjectName: 'Data Structures', type: 'MCQ', durationMinutes: 30, questions: [] }
      ]);
      setMockAttempts([
        { id: 'a-1', subjectName: 'Computer Networks', score: 85, date: 'Yesterday', evaluationReport: null },
        { id: 'a-2', subjectName: 'Database Management', score: 78, date: '3 days ago', evaluationReport: null }
      ]);
    }
  }, [user, backendOnline, token]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${apiUrl}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${apiUrl}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFlashcards = async () => {
    try {
      const res = await fetch(`${apiUrl}/flashcards`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFlashcards(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMockAttempts = async () => {
    try {
      const res = await fetch(`${apiUrl}/mock-test/attempts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMockAttempts(data.map((item: any) => ({
          id: item.id,
          subjectName: item.mockTest?.subjectName || 'Mock Subject',
          score: item.score,
          date: new Date(item.completedAt).toLocaleDateString(),
          evaluationReport: JSON.parse(item.evaluationReport)
        })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSyllabus = async () => {
    try {
      const res = await fetch(`${apiUrl}/syllabus`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSyllabusList(data);
        if (data.length > 0) setActiveSyllabus(data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Auth Operations
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    if (backendOnline) {
      try {
        const res = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(data.token);
          localStorage.setItem('cp_token', data.token);
          localStorage.setItem('cp_user', JSON.stringify(data.user));
          setLoading(false);
          return true;
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    // Offline simulation
    const simulatedUser: UserProfile = {
      id: email === 'admin@example.com' ? 'admin-id' : 'priya-default-id',
      email,
      name: email === 'admin@example.com' ? 'Admin Manager' : 'Priya Sharma',
      role: email === 'admin@example.com' ? 'ADMIN' : 'STUDENT',
      collegeName: 'National Institute of Technology',
      course: 'Bachelor of Technology',
      branch: 'Computer Science',
      year: '3rd Year',
      semester: '6th Semester',
      streak: 12,
      studyHours: 23.5,
      subjectsCount: '6 / 7'
    };
    setUser(simulatedUser);
    const mockTok = Buffer.from(simulatedUser.id).toString('base64');
    setToken(mockTok);
    localStorage.setItem('cp_token', mockTok);
    localStorage.setItem('cp_user', JSON.stringify(simulatedUser));
    setLoading(false);
    return true;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setLoading(true);
    if (backendOnline) {
      try {
        const res = await fetch(`${apiUrl}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name })
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(data.token);
          localStorage.setItem('cp_token', data.token);
          localStorage.setItem('cp_user', JSON.stringify(data.user));
          setLoading(false);
          return true;
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    const newUser: UserProfile = {
      id: crypto.randomUUID(),
      email,
      name,
      role: email.startsWith('admin') ? 'ADMIN' : 'STUDENT',
      streak: 1,
      studyHours: 0,
      collegeName: '',
      course: '',
      branch: '',
      year: '',
      semester: ''
    };
    setUser(newUser);
    const mockTok = Buffer.from(newUser.id).toString('base64');
    setToken(mockTok);
    localStorage.setItem('cp_token', mockTok);
    localStorage.setItem('cp_user', JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cp_token');
    localStorage.removeItem('cp_user');
  };

  const updateOnboarding = async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('cp_user', JSON.stringify(updated));

    if (backendOnline && token) {
      try {
        await fetch(`${apiUrl}/onboarding`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        });
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  };

  // Timetable
  const generateTimetable = async (pref: any) => {
    if (backendOnline && token) {
      try {
        const res = await fetch(`${apiUrl}/timetable/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(pref)
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Offline generation
    const mockTasks: Task[] = [
      { id: '1', timeSlot: "8:00 AM", subjectName: "Data Structures", topicName: "Linear Queue Implementation", completed: false, date: new Date().toISOString().split('T')[0] },
      { id: '2', timeSlot: "10:00 AM", subjectName: "Operating Systems", topicName: "CPU Scheduling FIFO", completed: false, date: new Date().toISOString().split('T')[0] },
      { id: '3', timeSlot: "1:00 PM", subjectName: "Database Management", topicName: "Basic Select Statements", completed: false, date: new Date().toISOString().split('T')[0] },
      { id: '4', timeSlot: "3:00 PM", subjectName: "Discrete Mathematics", topicName: "Equivalence Classes", completed: false, date: new Date().toISOString().split('T')[0] }
    ];
    setTasks(mockTasks);
  };

  const toggleTaskCompletion = async (id: string, completed: boolean) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t));

    // Update streak if tasks completed
    if (completed && user) {
      setUser(prev => prev ? { ...prev, streak: prev.streak + 1 } : null);
    }

    if (backendOnline && token) {
      try {
        await fetch(`${apiUrl}/tasks/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ completed })
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const addNewTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false
    };
    setTasks(prev => [...prev, newTask]);

    if (backendOnline && token) {
      try {
        await fetch(`${apiUrl}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(task)
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Syllabus Upload
  const uploadSyllabus = async (file: File): Promise<any> => {
    if (backendOnline && token) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch(`${apiUrl}/syllabus/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          fetchSyllabus();
          return data.analysis;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Offline simulation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Auto load a mock analysis into state
    const mockAnalysis = {
      subjects: [
        {
          name: "Data Structures",
          code: "CS-301",
          difficulty: "Hard",
          estimatedHours: 40,
          units: [
            {
              name: "Unit 1: Linear Structures",
              order: 1,
              topics: [
                { name: "Arrays and Linked Lists", difficulty: "Medium", estimatedMinutes: 60 },
                { name: "Stacks and Queues", difficulty: "Easy", estimatedMinutes: 45 }
              ]
            }
          ]
        }
      ]
    };
    
    const mockSylItem: SyllabusItem = {
      id: crypto.randomUUID(),
      fileName: file.name,
      subjects: mockAnalysis.subjects
    };
    
    setSyllabusList(prev => [...prev, mockSylItem]);
    setActiveSyllabus(mockSylItem);
    return mockAnalysis;
  };

  // AI Tutor Details
  const getTopicDetails = async (subject: string, topic: string): Promise<any> => {
    if (backendOnline && token) {
      try {
        const res = await fetch(`${apiUrl}/tutor/explain`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ subjectName: subject, topicName: topic })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.error(e);
      }
    }

    // High fidelity offline explanation fallback
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      beginner: `Analogy: Imagine a notebook with numbered pages. That's an Array. You know exactly what is on page 5 instantly. Now imagine a Scavenger Hunt where each clue card tells you where the next card is hidden. That's a Linked List. You can't jump straight to card 5 without reading cards 1, 2, 3, and 4 first!`,
      detailed: `Arrays represent a contiguous index-based allocation of memory with constant O(1) read access. Linked lists, however, consist of non-contiguous dynamic node memory buffers linked sequentially via reference pointers, resulting in O(n) element search delays but allowing O(1) insertions at known bounds.`,
      examples: `Example: Declaring a Singly Linked Node:\nstruct Node {\n  int val;\n  Node* next;\n};`,
      practiceQuestions: [
        "Explain stack overflow in array-based memory models.",
        "Write a function to detect a loop in a linked list."
      ],
      quiz: [
        {
          question: "Which of these data structures allows O(1) random index access?",
          options: ["Linked List", "Array", "Binary Tree", "Graph"],
          correctAnswerIndex: 1,
          explanation: "Arrays store elements contiguously, enabling mathematical calculation of element addresses in O(1) time."
        }
      ]
    };
  };

  // Mock Tests
  const generateMockTest = async (subject: string, type: 'MCQ' | 'SUBJECTIVE', duration: number): Promise<any> => {
    if (backendOnline && token) {
      try {
        const res = await fetch(`${apiUrl}/mock-test/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ subjectName: subject, type, durationMinutes: duration })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.error(e);
      }
    }

    // Offline Mock
    return {
      id: crypto.randomUUID(),
      subjectName: subject,
      type,
      durationMinutes: duration,
      questions: type === 'MCQ' ? [
        { question: "What is the time complexity of QuickSort in the average case?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(1)"], correctAnswerIndex: 1 },
        { question: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Heap", "Hash Table"], correctAnswerIndex: 1 }
      ] : [
        "Explain memory fragmentation in standard Operating System allocations.",
        "Outline how hash collisions are resolved using linear probing vs chaining."
      ]
    };
  };

  const submitMockTest = async (testId: string, answers: any[]): Promise<any> => {
    if (backendOnline && token) {
      try {
        const res = await fetch(`${apiUrl}/mock-test/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ mockTestId: testId, answers })
        });
        if (res.ok) {
          const data = await res.json();
          fetchMockAttempts();
          return data.report;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Offline evaluation
    await new Promise(resolve => setTimeout(resolve, 1000));
    const score = Math.floor(Math.random() * 30) + 70; // 70-99
    const report = {
      score,
      overallSummary: "Great performance! You demonstrated clean concept mapping. Revise sorting algorithms to secure full marks next time.",
      feedback: answers.map((ans, i) => ({
        question: `Question ${i + 1}`,
        studentAnswer: ans,
        correctAnswer: "O(n log n) average sorting time, Stack buffers.",
        points: 8,
        maxPoints: 10,
        explanation: "Correct logic was formulated. Your time complexity estimation was accurate."
      }))
    };

    setMockAttempts(prev => [
      { id: crypto.randomUUID(), subjectName: 'Syllabus Quiz', score, date: 'Just Now', evaluationReport: report },
      ...prev
    ]);
    return report;
  };

  // Revision material
  const generateRevisionMaterial = async (subject: string, topic: string, type: string): Promise<any> => {
    if (backendOnline && token) {
      try {
        const res = await fetch(`${apiUrl}/revision/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ subjectName: subject, topicName: topic, type })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.error(e);
      }
    }

    // Offline mock notes
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      content: `# ${type} Revision: ${topic}\n## Key Points\n- Core definition of ${topic} details.\n- Time complexity bounds.\n- Space savings optimizations.\n- Exam hot points.`
    };
  };

  // Flashcards
  const addNewFlashcard = async (card: Omit<FlashcardItem, 'id'>) => {
    const newCard = { ...card, id: crypto.randomUUID() };
    setFlashcards(prev => [...prev, newCard]);

    if (backendOnline && token) {
      try {
        await fetch(`${apiUrl}/flashcards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(card)
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const reviewFlashcard = async (id: string, rating: 'Easy' | 'Medium' | 'Hard') => {
    if (backendOnline && token) {
      try {
        await fetch(`${apiUrl}/flashcards/${id}/review`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ rating })
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Notifications
  const markNotificationsAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    if (backendOnline && token) {
      try {
        await fetch(`${apiUrl}/notifications/read`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Feedback & Admin Stats
  const submitFeedback = async (feedbackText: string, rating: number) => {
    if (backendOnline && token) {
      try {
        await fetch(`${apiUrl}/admin/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ feedbackText, rating })
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getAdminStats = async (): Promise<any> => {
    if (backendOnline && token) {
      try {
        const res = await fetch(`${apiUrl}/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.error(e);
      }
    }
    return {
      totalUsers: 142,
      studentCount: 140,
      syllabusCount: 92,
      mockTestCount: 412,
      aiTokenUsage: 893400,
      totalStorageMB: 124.8,
      feedbacks: [
        { id: 'f1', name: 'Rohan Verma', feedbackText: 'AI explanations are highly descriptive! Saved hours before the OS paper.', rating: 5, createdAt: new Date() },
        { id: 'f2', name: 'Sarah Khan', feedbackText: 'The mock test evaluation is scarily accurate.', rating: 5, createdAt: new Date() }
      ]
    };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        tasks,
        notifications,
        flashcards,
        mockTests,
        mockAttempts,
        syllabusList,
        activeSyllabus,
        loading,
        backendOnline,
        apiUrl,
        isSidebarCollapsed,
        setSidebarCollapsed,
        login,
        logout,
        register,
        updateOnboarding,
        toggleTaskCompletion,
        addNewTask,
        uploadSyllabus,
        generateTimetable,
        submitMockTest,
        generateMockTest,
        getTopicDetails,
        generateRevisionMaterial,
        addNewFlashcard,
        reviewFlashcard,
        markNotificationsAsRead,
        submitFeedback,
        getAdminStats
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
