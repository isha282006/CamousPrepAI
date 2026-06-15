const { PrismaClient } = require('@prisma/client');

let prisma;
let isDbConnected = false;

// In-memory fallback database
const mockDb = {
  users: [],
  syllabi: [],
  subjects: [],
  units: [],
  topics: [],
  tasks: [],
  pyqAnalyses: [],
  revisions: [],
  mockTests: [],
  attempts: [],
  flashcards: [],
  goals: [],
  notifications: [],
  feedbacks: []
};

try {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
  
  // Test connection asynchronously
  prisma.$connect()
    .then(() => {
      console.log('Successfully connected to PostgreSQL database via Prisma.');
      isDbConnected = true;
    })
    .catch((err) => {
      console.warn('PostgreSQL database connection failed. Falling back to in-memory database mode.');
      console.warn('Reason:', err.message);
      isDbConnected = false;
    });
} catch (e) {
  console.warn('Prisma initialization failed. Falling back to in-memory database mode.');
  isDbConnected = false;
}

module.exports = {
  prisma,
  getDbConnected: () => isDbConnected,
  mockDb
};
