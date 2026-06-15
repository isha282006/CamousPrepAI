const { GoogleGenAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY || '';
let genAI = null;

if (apiKey) {
  try {
    // Note: The new Google Gen AI SDK uses GoogleGenAI or GoogleGenerativeAI
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('Gemini API service initialized successfully.');
  } catch (err) {
    console.error('Error initializing Gemini API client:', err.message);
  }
} else {
  console.warn('GEMINI_API_KEY not found. CampusPrep AI will operate in simulation mode.');
}

/**
 * Syllabus Analyzer
 */
async function analyzeSyllabus(pdfText, fileName) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        Analyze the following syllabus text extracted from the file "${fileName}".
        Extract a list of subjects. For each subject, extract its list of units, and for each unit, extract its topics.
        Rate the difficulty of each subject (Hard, Medium, Easy) and estimate the study time in hours needed for the subject.
        Return the result strictly as a valid JSON object matching this structure:
        {
          "subjects": [
            {
              "name": "Subject Name",
              "code": "Subject Code",
              "difficulty": "Hard/Medium/Easy",
              "estimatedHours": 35.5,
              "units": [
                {
                  "name": "Unit Name/Number",
                  "order": 1,
                  "topics": [
                    {
                      "name": "Topic Name",
                      "difficulty": "Hard/Medium/Easy",
                      "estimatedMinutes": 45
                    }
                  ]
                }
              ]
            }
          ]
        }
        Do not output any markdown code blocks or explanations, just the raw JSON.
        Syllabus Text:
        ${pdfText.substring(0, 10000)}
      `;

      const response = await model.generateContent(prompt);
      const cleaned = response.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('Error in actual Gemini syllabus analysis, using mock:', e);
    }
  }

  // High-fidelity Mock Syllabus
  return {
    subjects: [
      {
        name: "Data Structures",
        code: "CS-301",
        difficulty: "Hard",
        estimatedHours: 40,
        units: [
          {
            name: "Unit 1: Linear Data Structures",
            order: 1,
            topics: [
              { name: "Arrays and Linked Lists", difficulty: "Medium", estimatedMinutes: 60 },
              { name: "Stacks and Queues", difficulty: "Easy", estimatedMinutes: 45 },
              { name: "Singly vs Doubly Linked Lists", difficulty: "Medium", estimatedMinutes: 50 }
            ]
          },
          {
            name: "Unit 2: Trees and Graphs",
            order: 2,
            topics: [
              { name: "Binary Search Trees", difficulty: "Hard", estimatedMinutes: 75 },
              { name: "Graph Traversals BFS and DFS", difficulty: "Hard", estimatedMinutes: 90 },
              { name: "Heap Data Structures", difficulty: "Medium", estimatedMinutes: 60 }
            ]
          }
        ]
      },
      {
        name: "Operating Systems",
        code: "CS-302",
        difficulty: "Medium",
        estimatedHours: 35,
        units: [
          {
            name: "Unit 1: Processes and Threads",
            order: 1,
            topics: [
              { name: "Process Management", difficulty: "Medium", estimatedMinutes: 60 },
              { name: "CPU Scheduling Algorithms", difficulty: "Hard", estimatedMinutes: 80 },
              { name: "Process Synchronization", difficulty: "Hard", estimatedMinutes: 90 }
            ]
          },
          {
            name: "Unit 2: Memory Management",
            order: 2,
            topics: [
              { name: "Paging and Segmentation", difficulty: "Medium", estimatedMinutes: 70 },
              { name: "Virtual Memory and Page Replacement", difficulty: "Hard", estimatedMinutes: 80 }
            ]
          }
        ]
      },
      {
        name: "Database Management",
        code: "CS-303",
        difficulty: "Medium",
        estimatedHours: 30,
        units: [
          {
            name: "Unit 1: Relational Model",
            order: 1,
            topics: [
              { name: "SQL Queries", difficulty: "Medium", estimatedMinutes: 60 },
              { name: "ER Diagrams & Normalization", difficulty: "Hard", estimatedMinutes: 80 }
            ]
          }
        ]
      },
      {
        name: "Computer Networks",
        code: "CS-304",
        difficulty: "Hard",
        estimatedHours: 45,
        units: [
          {
            name: "Unit 1: Network Layers",
            order: 1,
            topics: [
              { name: "IP Addressing & Subnetting", difficulty: "Hard", estimatedMinutes: 85 },
              { name: "Routing Protocols", difficulty: "Hard", estimatedMinutes: 90 }
            ]
          }
        ]
      },
      {
        name: "Discrete Mathematics",
        code: "MA-301",
        difficulty: "Hard",
        estimatedHours: 50,
        units: [
          {
            name: "Unit 1: Relations & Functions",
            order: 1,
            topics: [
              { name: "Equivalence Relations", difficulty: "Medium", estimatedMinutes: 60 },
              { name: "Partial Orderings & Lattices", difficulty: "Hard", estimatedMinutes: 90 }
            ]
          }
        ]
      },
      {
        name: "Artificial Intelligence",
        code: "CS-305",
        difficulty: "Medium",
        estimatedHours: 32,
        units: [
          {
            name: "Unit 1: Introduction",
            order: 1,
            topics: [
              { name: "Heuristic Search Strategies", difficulty: "Hard", estimatedMinutes: 70 }
            ]
          }
        ]
      }
    ]
  };
}

/**
 * Topic Details & Explain
 */
async function explainTopic(subjectName, topicName) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are an elite academic AI Tutor. Explain the topic "${topicName}" for the subject "${subjectName}".
        Provide:
        1. A beginner-level explanation (simple, everyday analogies).
        2. A detailed-level explanation (technical terms, depth, academic style).
        3. Clear examples with steps.
        4. Ten interactive practice questions (JSON array of strings).
        5. Five multiple choice quiz questions.
        Return the result strictly as a valid JSON object matching this structure:
        {
          "beginner": "Beginner explanation text",
          "detailed": "Detailed explanation text",
          "examples": "Examples text or step-by-step documentation",
          "practiceQuestions": ["Q1", "Q2", "Q3", ...],
          "quiz": [
            {
              "question": "Quiz question text",
              "options": ["A", "B", "C", "D"],
              "correctAnswerIndex": 0,
              "explanation": "Why this is correct"
            }
          ]
        }
        Do not output any markdown code blocks or explanations, just the raw JSON.
      `;
      const response = await model.generateContent(prompt);
      const cleaned = response.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('Error in Gemini explaining topic, using mock:', e);
    }
  }

  // Mock explanations
  return {
    beginner: `Imagine you are organizing a deck of cards. An array is like a physical card holder box where each slot has a number stamped on it (0, 1, 2...). You can slide a card into any slot instantly. A linked list, on the other hand, is like a treasure hunt or a paper chain: each card has a clue pointing to where the next card is hidden. You can't jump directly to Card 5 without reading the clues starting from Card 1.`,
    detailed: `An array is a collection of contiguous memory locations storing elements of the same data type, offering O(1) random access time. However, array resizing is costly (O(n)) and insertion/deletion requires shifting elements. In contrast, a Linked List is a dynamic data structure where elements (nodes) are allocated non-contiguously in heap memory. Each node consists of a data field and a reference/link (pointer) to the next node in the sequence. Linked lists support O(1) insertion/deletion once the position is located, but traversal is sequential and takes O(n) time.`,
    examples: `Example 1: Dynamic Array vs Singly Linked List insertion.\nSuppose we want to insert 'X' at position 0 in an array of size 5: [A, B, C, D, E].\n1. Move E to index 5, D to 4, C to 3, B to 2, A to 1.\n2. Insert X at index 0. This required 5 shifts.\n\nNow, doing this in a linked list:\n1. Create a new Node(X).\n2. Set X.next = Head.\n3. Set Head = X.\nNo elements had to be shifted! O(1) insertion completed.`,
    practiceQuestions: [
      "Define contiguous memory allocation and explain its relevance to Arrays.",
      "What is the time complexity of searching for an element in an unsorted Array vs an unsorted Singly Linked List?",
      "Why is a Doubly Linked List preferred over a Singly Linked List for reversing traversals?",
      "Write pseudocode to insert a node at the end of a Singly Linked List.",
      "Explain the concept of 'Cache Locality' and how arrays benefit from it compared to linked lists.",
      "What is a circular linked list, and what is its primary use case?",
      "What is memory fragmentation, and how do linked lists avoid/introduce it?",
      "Illustrate how stacks are implemented using both arrays and linked lists.",
      "Detail how to detect a loop in a linked list using Floyd's Cycle-Finding Algorithm.",
      "Explain how a dynamic array (like ArrayList in Java or vector in C++) handles array resizing behind the scenes."
    ],
    quiz: [
      {
        question: "What is the time complexity of accessing an element at index 'k' in a standard array?",
        options: ["O(1)", "O(log n)", "O(n)", "O(k)"],
        correctAnswerIndex: 0,
        explanation: "Since arrays reside in contiguous memory, the address of index k is computed directly as BaseAddress + k * ElementSize, taking constant O(1) time."
      },
      {
        question: "Which of the following is an advantage of a linked list over an array?",
        options: [
          "Constant time access to any elements",
          "Dynamic memory size allocation",
          "Better cache localization",
          "Lower memory overhead per element"
        ],
        correctAnswerIndex: 1,
        explanation: "Linked lists are dynamic. They grow and shrink at runtime without needing a costly contiguous resizing block."
      },
      {
        question: "In a Singly Linked List, how much memory overhead is introduced for pointers per node (on a 64-bit system)?",
        options: ["0 bytes", "4 bytes", "8 bytes", "16 bytes"],
        correctAnswerIndex: 2,
        explanation: "On a 64-bit machine, memory pointers require 8 bytes (64 bits) of space to address heap memory."
      },
      {
        question: "Which algorithm detects loops in a Linked List using two pointers moving at different speeds?",
        options: ["Binary Search", "Dijkstra's Algorithm", "Floyd's Cycle-Finding Algorithm", "Kruskal's Algorithm"],
        correctAnswerIndex: 2,
        explanation: "Floyd's Cycle-Finding (Tortoise and Hare) uses a slow pointer (1 step) and a fast pointer (2 steps) to detect loops in O(n) time."
      },
      {
        question: "What is the worst-case time complexity to delete a node in the middle of a Singly Linked List if only the pointer to that node is given?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswerIndex: 0,
        explanation: "By copying the data from the next node into the current node and deleting the next node (Node.data = Node.next.data; Node.next = Node.next.next), deletion can be performed in O(1) time without traversing from the head."
      }
    ]
  };
}

/**
 * Grade Mock Test
 */
async function gradeMockTest(subjectName, questions, answers) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        Evaluate the answers provided by a student for a Mock Test on "${subjectName}".
        Questions:
        ${JSON.stringify(questions)}
        
        Student Answers:
        ${JSON.stringify(answers)}

        Calculate an overall percentage score (0 to 100).
        Provide a detailed feedback report listing each question, the correct answer, the student's answer, and helpful feedback for each.
        Return the result strictly as a valid JSON object matching this structure:
        {
          "score": 85,
          "feedback": [
            {
              "question": "Question text",
              "studentAnswer": "Student answer text",
              "correctAnswer": "Correct answer text",
              "points": 5,
              "maxPoints": 10,
              "explanation": "Detailed feedback on what was correct or missing"
            }
          ],
          "overallSummary": "A paragraph summarizing the student's strengths and areas of improvement."
        }
        Do not output any markdown code blocks or explanations, just the raw JSON.
      `;
      const response = await model.generateContent(prompt);
      const cleaned = response.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('Error in actual Gemini mock test grading, using mock:', e);
    }
  }

  // Mock grading
  let scoreSum = 0;
  const feedback = questions.map((q, idx) => {
    const studentAns = answers[idx] || '';
    const isCorrect = studentAns.toLowerCase().includes('o(1)') || studentAns.toLowerCase().includes('dynamic') || studentAns.length > 5;
    const points = isCorrect ? 10 : 3;
    scoreSum += points;
    return {
      question: q.question || q,
      studentAnswer: studentAns,
      correctAnswer: q.options ? q.options[q.correctAnswerIndex || 0] : "O(1) access time, Dynamic memory, Node structural pointer references.",
      points: points,
      maxPoints: 10,
      explanation: isCorrect 
        ? "Excellent job. Your answer identifies the core concept accurately with appropriate supporting details." 
        : "Partial marks. You need to elaborate more on the memory management aspects and pointers."
    };
  });

  const percentage = Math.round((scoreSum / (questions.length * 10)) * 100);

  return {
    score: percentage,
    feedback: feedback,
    overallSummary: `You demonstrated a good basic understanding of ${subjectName}. Focus more on time complexity derivations and memory allocations to secure full marks in subjective questions.`
  };
}

/**
 * PYQ Analyzer
 */
async function analyzePYQ(pdfText, fileName, subjectName) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        Analyze the Previous Year Question (PYQ) paper text extracted from "${fileName}" for the subject "${subjectName}".
        Extract repeated questions, important topics, weightage of each unit, and general exam trends.
        Return the result strictly as a valid JSON object matching this structure:
        {
          "repeatedQuestions": [
            { "question": "Question text", "frequency": 4, "importance": "High" }
          ],
          "weightageAnalysis": [
            { "unit": "Unit Name", "weightage": 35 }
          ],
          "unitTrends": [
            { "year": "2023", "difficulty": "Medium", "topicsFocused": ["Topic A", "Topic B"] }
          ],
          "examPatterns": {
            "mcqCount": 10,
            "subjectiveCount": 5,
            "totalMarks": 100,
            "passingMarks": 40
          }
        }
        Do not output any markdown code blocks or explanations, just the raw JSON.
        PYQ Text:
        ${pdfText.substring(0, 10000)}
      `;
      const response = await model.generateContent(prompt);
      const cleaned = response.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('Error in actual Gemini PYQ analysis, using mock:', e);
    }
  }

  // Mock PYQ analysis
  return {
    repeatedQuestions: [
      { question: "Explain the differences between Singly and Doubly Linked Lists.", frequency: 5, importance: "High" },
      { question: "What is CPU Scheduling? Differentiate between Preemptive and Non-preemptive scheduling with scheduling chart diagrams.", frequency: 4, importance: "High" },
      { question: "Implement a Queue data structure using two Stacks.", frequency: 3, importance: "Medium" },
      { question: "Write a SQL query to fetch the second-highest salary from an Employee table.", frequency: 3, importance: "Medium" }
    ],
    weightageAnalysis: [
      { unit: "Linear Data Structures", weightage: 30 },
      { unit: "Non-Linear Data Structures (Trees/Graphs)", weightage: 40 },
      { unit: "Sorting and Hashing", weightage: 15 },
      { unit: "Search Algorithms", weightage: 15 }
    ],
    unitTrends: [
      { year: "2023", difficulty: "Medium", topicsFocused: ["BFS/DFS", "BST insertion", "Infix-to-Postfix conversion"] },
      { year: "2024", difficulty: "Hard", topicsFocused: ["AVL trees rotation", "Graph cycle detection", "Matrix representation"] },
      { year: "2025", difficulty: "Medium", topicsFocused: ["Doubly linked lists", "QuickSort trace", "Hash collision resolution"] }
    ],
    examPatterns: {
      mcqCount: 20,
      subjectiveCount: 8,
      totalMarks: 100,
      passingMarks: 40
    }
  };
}

/**
 * Revision Guide Generator
 */
async function generateRevisionNotes(subjectName, topicName, type) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        Create a detailed, beautiful markdown Revision Guide for the topic "${topicName}" in "${subjectName}".
        The revision format requested is: "${type}" (Choose from: QUICK, FULL, FORMULA, LAST_MINUTE, ONE_DAY).
        Use markdown formatting, headings, bold text, bullet points, and code snippets.
        Return the result strictly as a JSON object:
        {
          "content": "Your markdown content here"
        }
        Do not output any markdown code blocks outside of the JSON.
      `;
      const response = await model.generateContent(prompt);
      const cleaned = response.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('Error in actual Gemini revision notes, using mock:', e);
    }
  }

  // Mock revision notes
  let content = '';
  if (type === 'QUICK') {
    content = `# Quick Revision: ${topicName} (${subjectName})
- **Array**: Fixed-size contiguous memory blocks. Element access is \`O(1)\` via memory arithmetic. Resizing is \`O(n)\`.
- **Linked List**: Dynamic nodes containing data and address pointer references. Element access is \`O(n)\`. Resizing and node insertion is \`O(1)\` once reference is acquired.
- **Key Trade-off**: Arrays provide instant random access but are size-inflexible. Linked lists are dynamic and size-flexible but require traversing nodes sequentially.`;
  } else if (type === 'FORMULA') {
    content = `# Formula Sheet: Data Structures & Math (${subjectName})
### Time Complexities Table
| Operation | Array | Singly Linked List | Doubly Linked List |
| :--- | :--- | :--- | :--- |
| **Access** | \`O(1)\` | \`O(n)\` | \`O(n)\` |
| **Search** | \`O(n)\` / \`O(log n)\` | \`O(n)\` | \`O(n)\` |
| **Insertion** | \`O(n)\` | \`O(1)\` (at head) | \`O(1)\` |
| **Deletion** | \`O(n)\` | \`O(1)\` (after node) | \`O(1)\` |

### Space Complexities
- Array space: \`O(n)\` (raw elements only)
- Singly Linked List space: \`O(n)\` elements + \`O(n)\` pointers
- Doubly Linked List space: \`O(n)\` elements + \`2 * O(n)\` pointer references`;
  } else {
    content = `# Revision Summary: ${topicName}
## Core Concepts
Detailed summary of ${topicName} for exam preparation.
- **Dynamic memory allocation**: Utilizes the heap space rather than stack allocation.
- **Traversal logic**: Use of a temporary pointer to iterate through nodes:
\`\`\`cpp
Node* temp = head;
while (temp != nullptr) {
    // Process temp->data
    temp = temp->next;
}
\`\`\`
- **Edge cases to watch for**: Empty list (head is null), Single-node list, Deleting head node, Updating tail pointers.`;
  }

  return { content };
}

module.exports = {
  analyzeSyllabus,
  explainTopic,
  gradeMockTest,
  analyzePYQ,
  generateRevisionNotes
};
