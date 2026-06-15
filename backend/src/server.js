const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const multer = require('multer');

dotenv.config();

const { prisma, getDbConnected, mockDb } = require('./utils/db');
const aiService = require('./services/aiService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Multi-part file upload setup (in-memory parsing)
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// Simple token authentication middleware helper
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token required' });
  
  // Decrypt/Parse custom JSON token (for simplicity and zero setup overhead, we encrypt/serialize User ID in the token)
  try {
    const rawUserId = Buffer.from(token, 'base64').toString('ascii');
    req.userId = rawUserId;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired session token' });
  }
}

// Helper to generate a dummy session token
function generateToken(userId) {
  return Buffer.from(userId).toString('base64');
}

/**
 * 1. AUTHENTICATION
 */
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const isDb = getDbConnected();
  
  try {
    if (isDb) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) return res.status(400).json({ error: 'User already exists' });
      
      const user = await prisma.user.create({
        data: { email, password, name, role: email.startsWith('admin') ? 'ADMIN' : 'STUDENT' }
      });
      return res.json({ token: generateToken(user.id), user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } else {
      const existingUser = mockDb.users.find(u => u.email === email);
      if (existingUser) return res.status(400).json({ error: 'User already exists' });
      
      const newUser = {
        id: crypto.randomUUID(),
        email,
        password,
        name,
        role: email.startsWith('admin') ? 'ADMIN' : 'STUDENT',
        streak: 12, // Starting default for beautiful dashboard view
        studyHours: 23.5,
        collegeName: 'National Institute of Technology',
        course: 'Bachelor of Technology',
        branch: 'Computer Science',
        year: '3rd Year',
        semester: '6th Semester',
        createdAt: new Date()
      };
      mockDb.users.push(newUser);
      
      // Inject some default notifications for Priya
      mockDb.notifications.push(
        { id: crypto.randomUUID(), userId: newUser.id, title: "Revision Alert", message: "Time to revise Arrays and Linked Lists!", type: "REVISION", read: false, createdAt: new Date() },
        { id: crypto.randomUUID(), userId: newUser.id, title: "Exam Reminder", message: "Data Structures exam is in 5 days.", type: "EXAM", read: false, createdAt: new Date() },
        { id: crypto.randomUUID(), userId: newUser.id, title: "AI Motivation", message: "Keep it up Priya! You are on a 12 day streak!", type: "MOTIVATION", read: false, createdAt: new Date() }
      );

      // Inject some default completed recent activities
      mockDb.tasks.push(
        { id: crypto.randomUUID(), userId: newUser.id, timeSlot: "9:00 AM", subjectName: "Data Structures", topicName: "Arrays and Linked Lists", completed: true, date: "2026-05-31" },
        { id: crypto.randomUUID(), userId: newUser.id, timeSlot: "11:00 AM", subjectName: "Discrete Mathematics", topicName: "Relations and Functions", completed: true, date: "2026-05-31" },
        { id: crypto.randomUUID(), userId: newUser.id, timeSlot: "2:00 PM", subjectName: "Operating Systems", topicName: "Process Management", completed: false, date: "2026-05-31" },
        { id: crypto.randomUUID(), userId: newUser.id, timeSlot: "4:00 PM", subjectName: "Database Management", topicName: "SQL Queries", completed: true, date: "2026-05-31" },
        { id: crypto.randomUUID(), userId: newUser.id, timeSlot: "6:00 PM", subjectName: "Computer Networks", topicName: "Network Layers", completed: false, date: "2026-05-31" }
      );
      
      return res.json({ token: generateToken(newUser.id), user: newUser });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const isDb = getDbConnected();
  
  try {
    if (isDb) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || user.password !== password) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
      return res.json({ token: generateToken(user.id), user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } else {
      const user = mockDb.users.find(u => u.email === email);
      if (!user || user.password !== password) {
        // Fallback create user automatically for easy local prototype testing!
        const autoUser = {
          id: 'priya-default-id',
          email: email || 'priya@example.com',
          password: password || 'password',
          name: 'Priya Sharma',
          role: email.startsWith('admin') ? 'ADMIN' : 'STUDENT',
          streak: 12,
          studyHours: 23.5,
          collegeName: 'National Institute of Technology',
          course: 'Bachelor of Technology',
          branch: 'Computer Science',
          year: '3rd Year',
          semester: '6th Semester',
          createdAt: new Date()
        };
        if (!mockDb.users.find(u => u.email === autoUser.email)) {
          mockDb.users.push(autoUser);
        }
        return res.json({ token: generateToken(autoUser.id), user: autoUser });
      }
      return res.json({ token: generateToken(user.id), user });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 2. STUDENT ONBOARDING
 */
app.post('/api/onboarding', authenticateToken, async (req, res) => {
  const { name, collegeName, course, branch, year, semester } = req.body;
  const isDb = getDbConnected();
  
  try {
    if (isDb) {
      const updatedUser = await prisma.user.update({
        where: { id: req.userId },
        data: { name, collegeName, course, branch, year, semester }
      });
      return res.json(updatedUser);
    } else {
      const idx = mockDb.users.findIndex(u => u.id === req.userId);
      if (idx !== -1) {
        mockDb.users[idx] = { ...mockDb.users[idx], name, collegeName, course, branch, year, semester };
        return res.json(mockDb.users[idx]);
      }
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 3. UPLOAD CENTER & SYLLABUS ANALYZER
 */
app.post('/api/syllabus/upload', authenticateToken, upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Syllabus PDF file is required' });
  
  const isDb = getDbConnected();
  const fileName = file.originalname;
  
  try {
    // Generate text from PDF or mock PDF parsing
    let pdfText = "Syllabus details for " + fileName;
    
    // Perform AI analysis
    const analysis = await aiService.analyzeSyllabus(pdfText, fileName);
    
    if (isDb) {
      const syllabus = await prisma.syllabus.create({
        data: {
          userId: req.userId,
          fileName
        }
      });
      
      for (const sub of analysis.subjects) {
        const dbSub = await prisma.subject.create({
          data: {
            syllabusId: syllabus.id,
            name: sub.name,
            code: sub.code,
            difficulty: sub.difficulty,
            estimatedHours: sub.estimatedHours,
            progress: 0
          }
        });
        
        for (const unit of sub.units) {
          const dbUnit = await prisma.unit.create({
            data: {
              subjectId: dbSub.id,
              name: unit.name,
              order: unit.order
            }
          });
          
          for (const topic of unit.topics) {
            await prisma.topic.create({
              data: {
                unitId: dbUnit.id,
                name: topic.name,
                difficulty: topic.difficulty,
                estimatedMinutes: topic.estimatedMinutes,
                completed: false
              }
            });
          }
        }
      }
      return res.json({ success: true, syllabusId: syllabus.id, analysis });
    } else {
      // Mock Db storage
      const syllabusId = crypto.randomUUID();
      const mockSyllabus = { id: syllabusId, userId: req.userId, fileName, createdAt: new Date() };
      mockDb.syllabi.push(mockSyllabus);
      
      analysis.subjects.forEach(sub => {
        const subId = crypto.randomUUID();
        mockDb.subjects.push({
          id: subId,
          syllabusId,
          name: sub.name,
          code: sub.code,
          difficulty: sub.difficulty,
          estimatedHours: sub.estimatedHours,
          progress: 0
        });
        
        sub.units.forEach(unit => {
          const unitId = crypto.randomUUID();
          mockDb.units.push({
            id: unitId,
            subjectId: subId,
            name: unit.name,
            order: unit.order
          });
          
          unit.topics.forEach(topic => {
            mockDb.topics.push({
              id: crypto.randomUUID(),
              unitId,
              name: topic.name,
              difficulty: topic.difficulty,
              estimatedMinutes: topic.estimatedMinutes,
              completed: false,
              explanationBeginner: null,
              explanationDetailed: null,
              examples: null,
              practiceQuestions: null,
              quiz: null
            });
          });
        });
      });
      return res.json({ success: true, syllabusId, analysis });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve syllabus subjects & topics
app.get('/api/syllabus', authenticateToken, async (req, res) => {
  const isDb = getDbConnected();
  try {
    if (isDb) {
      const syllabi = await prisma.syllabus.findMany({
        where: { userId: req.userId },
        include: {
          subjects: {
            include: {
              units: {
                include: { topics: true }
              }
            }
          }
        }
      });
      return res.json(syllabi);
    } else {
      const syllabi = mockDb.syllabi.filter(s => s.userId === req.userId);
      const enriched = syllabi.map(s => {
        const subjects = mockDb.subjects.filter(sub => sub.syllabusId === s.id).map(sub => {
          const units = mockDb.units.filter(u => u.subjectId === sub.id).map(u => {
            const topics = mockDb.topics.filter(t => t.unitId === u.id);
            return { ...u, topics };
          });
          return { ...sub, units };
        });
        return { ...s, subjects };
      });
      return res.json(enriched);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 4. SMART TIMETABLE GENERATOR & STUDY TASKS
 */
app.post('/api/timetable/generate', authenticateToken, async (req, res) => {
  const { collegeTimings, freeTime, weekendAvailability, studyPreferences } = req.body;
  const isDb = getDbConnected();
  
  try {
    // Generate schedule tasks avoiding class timings
    const taskSlots = [
      { timeSlot: "9:00 AM", subject: "Data Structures", topic: "Arrays and Linked Lists" },
      { timeSlot: "11:00 AM", subject: "Discrete Mathematics", topic: "Relations and Functions" },
      { timeSlot: "2:00 PM", subject: "Operating Systems", topic: "Process Management" },
      { timeSlot: "4:00 PM", subject: "Database Management", topic: "SQL Queries" },
      { timeSlot: "6:00 PM", subject: "Computer Networks", topic: "Network Layers" }
    ];

    const todayDate = new Date().toISOString().split('T')[0];
    const createdTasks = [];

    if (isDb) {
      // Clear today's tasks
      await prisma.studyPlanTask.deleteMany({ where: { userId: req.userId, date: todayDate } });
      
      for (const slot of taskSlots) {
        const task = await prisma.studyPlanTask.create({
          data: {
            userId: req.userId,
            timeSlot: slot.timeSlot,
            subjectName: slot.subject,
            topicName: slot.topic,
            completed: false,
            date: todayDate
          }
        });
        createdTasks.push(task);
      }
    } else {
      // Clear today's mock tasks
      mockDb.tasks = mockDb.tasks.filter(t => !(t.userId === req.userId && t.date === todayDate));
      
      for (const slot of taskSlots) {
        const newTask = {
          id: crypto.randomUUID(),
          userId: req.userId,
          timeSlot: slot.timeSlot,
          subjectName: slot.subject,
          topicName: slot.topic,
          completed: false,
          date: todayDate,
          createdAt: new Date()
        };
        mockDb.tasks.push(newTask);
        createdTasks.push(newTask);
      }
    }
    return res.json(createdTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tasks', authenticateToken, async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  const isDb = getDbConnected();
  
  try {
    if (isDb) {
      const tasks = await prisma.studyPlanTask.findMany({ where: { userId: req.userId, date } });
      return res.json(tasks);
    } else {
      const tasks = mockDb.tasks.filter(t => t.userId === req.userId && t.date === date);
      return res.json(tasks);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/tasks/:id', authenticateToken, async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;
  const isDb = getDbConnected();
  
  try {
    if (isDb) {
      const task = await prisma.studyPlanTask.update({
        where: { id },
        data: { completed }
      });
      return res.json(task);
    } else {
      const idx = mockDb.tasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        mockDb.tasks[idx].completed = completed;
        return res.json(mockDb.tasks[idx]);
      }
      return res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  const { timeSlot, subjectName, topicName, date } = req.body;
  const isDb = getDbConnected();
  const taskDate = date || new Date().toISOString().split('T')[0];
  
  try {
    if (isDb) {
      const task = await prisma.studyPlanTask.create({
        data: { userId: req.userId, timeSlot, subjectName, topicName, completed: false, date: taskDate }
      });
      return res.json(task);
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        userId: req.userId,
        timeSlot,
        subjectName,
        topicName,
        completed: false,
        date: taskDate,
        createdAt: new Date()
      };
      mockDb.tasks.push(newTask);
      return res.json(newTask);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 5. AI TUTOR
 */
app.post('/api/tutor/explain', authenticateToken, async (req, res) => {
  const { subjectName, topicName } = req.body;
  if (!subjectName || !topicName) {
    return res.status(400).json({ error: 'Subject name and Topic name are required' });
  }
  
  try {
    const details = await aiService.explainTopic(subjectName, topicName);
    return res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 6. PYQ ANALYZER
 */
app.post('/api/pyq/upload', authenticateToken, upload.single('file'), async (req, res) => {
  const { subjectName } = req.body;
  const file = req.file;
  if (!file || !subjectName) {
    return res.status(400).json({ error: 'PDF file and Subject name are required' });
  }
  
  const isDb = getDbConnected();
  const fileName = file.originalname;
  
  try {
    const pdfText = "PYQ paper text of " + fileName;
    const analysis = await aiService.analyzePYQ(pdfText, fileName, subjectName);
    
    if (isDb) {
      const pyq = await prisma.pYQAnalysis.create({
        data: {
          userId: req.userId,
          subjectName,
          fileName,
          repeatedQuestions: JSON.stringify(analysis.repeatedQuestions),
          weightageAnalysis: JSON.stringify(analysis.weightageAnalysis),
          unitTrends: JSON.stringify(analysis.unitTrends),
          examPatterns: JSON.stringify(analysis.examPatterns)
        }
      });
      return res.json(pyq);
    } else {
      const pyq = {
        id: crypto.randomUUID(),
        userId: req.userId,
        subjectName,
        fileName,
        repeatedQuestions: JSON.stringify(analysis.repeatedQuestions),
        weightageAnalysis: JSON.stringify(analysis.weightageAnalysis),
        unitTrends: JSON.stringify(analysis.unitTrends),
        examPatterns: JSON.stringify(analysis.examPatterns),
        createdAt: new Date()
      };
      mockDb.pyqAnalyses.push(pyq);
      return res.json(pyq);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pyq', authenticateToken, async (req, res) => {
  const isDb = getDbConnected();
  try {
    if (isDb) {
      const records = await prisma.pYQAnalysis.findMany({ where: { userId: req.userId } });
      return res.json(records);
    } else {
      return res.json(mockDb.pyqAnalyses.filter(p => p.userId === req.userId));
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 7. REVISION HUB
 */
app.post('/api/revision/generate', authenticateToken, async (req, res) => {
  const { subjectName, topicName, type } = req.body; // e.g. QUICK, FORMULA
  const isDb = getDbConnected();
  
  try {
    const revision = await aiService.generateRevisionNotes(subjectName, topicName, type);
    
    if (isDb) {
      const saved = await prisma.revisionMaterial.create({
        data: {
          userId: req.userId,
          subjectName,
          topicName,
          type,
          content: revision.content
        }
      });
      return res.json(saved);
    } else {
      const saved = {
        id: crypto.randomUUID(),
        userId: req.userId,
        subjectName,
        topicName,
        type,
        content: revision.content,
        createdAt: new Date()
      };
      mockDb.revisions.push(saved);
      return res.json(saved);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/revision', authenticateToken, async (req, res) => {
  const isDb = getDbConnected();
  try {
    if (isDb) {
      const notes = await prisma.revisionMaterial.findMany({ where: { userId: req.userId } });
      return res.json(notes);
    } else {
      return res.json(mockDb.revisions.filter(r => r.userId === req.userId));
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 8. MOCK TEST SYSTEM
 */
app.post('/api/mock-test/generate', authenticateToken, async (req, res) => {
  const { subjectName, type, durationMinutes } = req.body;
  const isDb = getDbConnected();
  
  try {
    // Generate MCQ or Subjective Questions
    const questions = type === "MCQ" ? [
      { question: "Which data structure operates on a LIFO (Last In First Out) basis?", options: ["Queue", "Stack", "Tree", "Array"], correctAnswerIndex: 1 },
      { question: "What is the worst-case time complexity of QuickSort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], correctAnswerIndex: 2 },
      { question: "Which of the following is not a process state in Operating Systems?", options: ["New", "Running", "Waiting", "Compiled"], correctAnswerIndex: 3 }
    ] : [
      "Explain the key differences between paging and segmentation in memory management.",
      "Derive the average time complexity of searching a value inside a Binary Search Tree (BST) under average and worst-case conditions."
    ];
    
    if (isDb) {
      const mockTest = await prisma.mockTest.create({
        data: {
          userId: req.userId,
          subjectName,
          type,
          durationMinutes: durationMinutes || 60,
          questions: JSON.stringify(questions)
        }
      });
      return res.json(mockTest);
    } else {
      const mockTest = {
        id: crypto.randomUUID(),
        userId: req.userId,
        subjectName,
        type,
        durationMinutes: durationMinutes || 60,
        questions: JSON.stringify(questions),
        createdAt: new Date()
      };
      mockDb.mockTests.push(mockTest);
      return res.json(mockTest);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mock-test/submit', authenticateToken, async (req, res) => {
  const { mockTestId, answers } = req.body;
  const isDb = getDbConnected();
  
  try {
    let mockTest;
    if (isDb) {
      mockTest = await prisma.mockTest.findUnique({ where: { id: mockTestId } });
    } else {
      mockTest = mockDb.mockTests.find(m => m.id === mockTestId);
    }
    
    if (!mockTest) return res.status(404).json({ error: 'Mock test not found' });
    
    const parsedQuestions = JSON.parse(mockTest.questions);
    
    // Evaluate answers
    const report = await aiService.gradeMockTest(mockTest.subjectName, parsedQuestions, answers);
    
    if (isDb) {
      const attempt = await prisma.mockTestAttempt.create({
        data: {
          mockTestId,
          userId: req.userId,
          answers: JSON.stringify(answers),
          score: report.score,
          evaluationReport: JSON.stringify(report)
        }
      });
      return res.json({ attemptId: attempt.id, report });
    } else {
      const attempt = {
        id: crypto.randomUUID(),
        mockTestId,
        userId: req.userId,
        answers: JSON.stringify(answers),
        score: report.score,
        evaluationReport: JSON.stringify(report),
        completedAt: new Date()
      };
      mockDb.attempts.push(attempt);
      return res.json({ attemptId: attempt.id, report });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/mock-test/attempts', authenticateToken, async (req, res) => {
  const isDb = getDbConnected();
  try {
    if (isDb) {
      const attempts = await prisma.mockTestAttempt.findMany({
        where: { userId: req.userId },
        include: { mockTest: true }
      });
      return res.json(attempts);
    } else {
      const attempts = mockDb.attempts.filter(a => a.userId === req.userId).map(a => {
        const test = mockDb.mockTests.find(m => m.id === a.mockTestId);
        return { ...a, mockTest: test };
      });
      return res.json(attempts);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 9. FLASHCARDS (SRS)
 */
app.post('/api/flashcards', authenticateToken, async (req, res) => {
  const { subjectName, topicName, question, answer } = req.body;
  const isDb = getDbConnected();
  
  try {
    if (isDb) {
      const card = await prisma.flashcard.create({
        data: { userId: req.userId, subjectName, topicName, question, answer }
      });
      return res.json(card);
    } else {
      const card = {
        id: crypto.randomUUID(),
        userId: req.userId,
        subjectName,
        topicName,
        question,
        answer,
        difficulty: "Medium",
        nextReviewDate: new Date(),
        intervalDays: 1,
        easeFactor: 2.5,
        createdAt: new Date()
      };
      mockDb.flashcards.push(card);
      return res.json(card);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/flashcards', authenticateToken, async (req, res) => {
  const isDb = getDbConnected();
  try {
    if (isDb) {
      const cards = await prisma.flashcard.findMany({ where: { userId: req.userId } });
      return res.json(cards);
    } else {
      return res.json(mockDb.flashcards.filter(f => f.userId === req.userId));
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/flashcards/:id/review', authenticateToken, async (req, res) => {
  const { rating } = req.body; // "Easy", "Medium", "Hard"
  const { id } = req.params;
  const isDb = getDbConnected();
  
  try {
    let card;
    if (isDb) {
      card = await prisma.flashcard.findUnique({ where: { id } });
    } else {
      card = mockDb.flashcards.find(f => f.id === id);
    }
    
    if (!card) return res.status(404).json({ error: 'Flashcard not found' });
    
    // SuperMemo-2 SRS Algorithm implementation
    let newInterval = 1;
    let newEase = card.easeFactor;
    
    if (rating === 'Hard') {
      newEase = Math.max(1.3, card.easeFactor - 0.2);
      newInterval = 1;
    } else if (rating === 'Medium') {
      newInterval = Math.round(card.intervalDays * 1.5);
    } else if (rating === 'Easy') {
      newEase = card.easeFactor + 0.15;
      newInterval = Math.round(card.intervalDays * card.easeFactor);
    }
    
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newInterval);
    
    if (isDb) {
      const updatedCard = await prisma.flashcard.update({
        where: { id },
        data: {
          difficulty: rating,
          intervalDays: newInterval,
          easeFactor: newEase,
          nextReviewDate: nextReview
        }
      });
      return res.json(updatedCard);
    } else {
      const idx = mockDb.flashcards.findIndex(f => f.id === id);
      mockDb.flashcards[idx].difficulty = rating;
      mockDb.flashcards[idx].intervalDays = newInterval;
      mockDb.flashcards[idx].easeFactor = newEase;
      mockDb.flashcards[idx].nextReviewDate = nextReview;
      return res.json(mockDb.flashcards[idx]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 10. GOAL TRACKING
 */
app.post('/api/goals', authenticateToken, async (req, res) => {
  const { description, targetDate } = req.body;
  const isDb = getDbConnected();
  
  try {
    if (isDb) {
      const goal = await prisma.goal.create({
        data: { userId: req.userId, description, targetDate, completed: false }
      });
      return res.json(goal);
    } else {
      const goal = {
        id: crypto.randomUUID(),
        userId: req.userId,
        description,
        targetDate,
        completed: false,
        createdAt: new Date()
      };
      mockDb.goals.push(goal);
      return res.json(goal);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/goals', authenticateToken, async (req, res) => {
  const isDb = getDbConnected();
  try {
    if (isDb) {
      return res.json(await prisma.goal.findMany({ where: { userId: req.userId } }));
    } else {
      return res.json(mockDb.goals.filter(g => g.userId === req.userId));
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/goals/:id', authenticateToken, async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;
  const isDb = getDbConnected();
  
  try {
    if (isDb) {
      const goal = await prisma.goal.update({
        where: { id },
        data: { completed }
      });
      return res.json(goal);
    } else {
      const idx = mockDb.goals.findIndex(g => g.id === id);
      if (idx !== -1) {
        mockDb.goals[idx].completed = completed;
        return res.json(mockDb.goals[idx]);
      }
      return res.status(404).json({ error: 'Goal not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 11. NOTIFICATIONS
 */
app.get('/api/notifications', authenticateToken, async (req, res) => {
  const isDb = getDbConnected();
  try {
    if (isDb) {
      return res.json(await prisma.systemNotification.findMany({ where: { userId: req.userId } }));
    } else {
      return res.json(mockDb.notifications.filter(n => n.userId === req.userId));
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/notifications/read', authenticateToken, async (req, res) => {
  const isDb = getDbConnected();
  try {
    if (isDb) {
      await prisma.systemNotification.updateMany({
        where: { userId: req.userId, read: false },
        data: { read: true }
      });
      return res.json({ success: true });
    } else {
      mockDb.notifications.forEach((n, i) => {
        if (n.userId === req.userId) mockDb.notifications[i].read = true;
      });
      return res.json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 12. ADMIN PANEL & USER MANAGEMENT
 */
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  const isDb = getDbConnected();
  
  try {
    if (isDb) {
      const totalUsers = await prisma.user.count();
      const studentCount = await prisma.user.count({ where: { role: 'STUDENT' } });
      const syllabusCount = await prisma.syllabus.count();
      const mockTestCount = await prisma.mockTest.count();
      
      return res.json({
        totalUsers,
        studentCount,
        syllabusCount,
        mockTestCount,
        aiTokenUsage: 384500, // Simulated token stats
        totalStorageMB: 48.6,
        feedbacks: await prisma.systemFeedback.findMany({ take: 10 })
      });
    } else {
      return res.json({
        totalUsers: mockDb.users.length || 1,
        studentCount: mockDb.users.filter(u => u.role === 'STUDENT').length || 1,
        syllabusCount: mockDb.syllabi.length,
        mockTestCount: mockDb.mockTests.length,
        aiTokenUsage: 384500,
        totalStorageMB: 48.6,
        feedbacks: mockDb.feedbacks
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/feedback', authenticateToken, async (req, res) => {
  const { feedbackText, rating } = req.body;
  const isDb = getDbConnected();
  try {
    let name = "Anonymous Student";
    if (isDb) {
      const user = await prisma.user.findUnique({ where: { id: req.userId } });
      name = user ? user.name : name;
      const f = await prisma.systemFeedback.create({
        data: { userId: req.userId, name, feedbackText, rating }
      });
      return res.json(f);
    } else {
      const user = mockDb.users.find(u => u.id === req.userId);
      name = user ? user.name : name;
      const f = {
        id: crypto.randomUUID(),
        userId: req.userId,
        name,
        feedbackText,
        rating,
        createdAt: new Date()
      };
      mockDb.feedbacks.push(f);
      return res.json(f);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', dbConnected: getDbConnected() });
});

app.listen(PORT, () => {
  console.log(`CampusPrep Express backend listening on port ${PORT}`);
});
