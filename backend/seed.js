require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Interview = require('./models/Interview');
const Submission = require('./models/Submission');
const Roadmap = require('./models/Roadmap');

const seedData = async () => {
  try {
    const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eduai';
    await mongoose.connect(connUri);
    console.log('Database connected for seeding...');

    // Clear existing
    await User.deleteMany();
    await Interview.deleteMany();
    await Submission.deleteMany();
    await Roadmap.deleteMany();

    console.log('Purged existing records.');

    // 1. Create Admin
    const adminUser = new User({
      name: 'System Admin',
      email: 'admin@eduai.com',
      password: 'adminpassword', // Will be hashed by UserSchema presave hook
      isAdmin: true,
      streak: 12,
      analytics: {
        problemsSolved: 0,
        interviewsCompleted: 0,
        averageScore: 0
      }
    });
    await adminUser.save();
    console.log('Created Admin User: admin@eduai.com / adminpassword');

    // 2. Create Student
    const studentUser = new User({
      name: 'Rahul Sharma (CSE-AIML)',
      email: 'student@eduai.com',
      password: 'studentpassword',
      isAdmin: false,
      streak: 5,
      analytics: {
        problemsSolved: 3,
        interviewsCompleted: 4,
        averageScore: 74
      }
    });
    await studentUser.save();
    console.log('Created Student User: student@eduai.com / studentpassword');

    // 3. Create Sample Submissions for Student
    const submissions = [
      {
        user: studentUser._id,
        problemId: 'two-sum',
        problemTitle: 'Two Sum',
        language: 'javascript',
        code: `function twoSum(nums, target) {\n  const map = new Map();\n  for(let i=0; i<nums.length; i++) {\n    const diff = target - nums[i];\n    if(map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n}`,
        status: 'Accepted',
        testCasesPassed: 3,
        totalTestCases: 3
      },
      {
        user: studentUser._id,
        problemId: 'valid-parentheses',
        problemTitle: 'Valid Parentheses',
        language: 'python',
        code: `def is_valid(s):\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top: return False\n        else:\n            stack.append(char)\n    return not stack`,
        status: 'Accepted',
        testCasesPassed: 5,
        totalTestCases: 5
      },
      {
        user: studentUser._id,
        problemId: 'binary-search',
        problemTitle: 'Binary Search',
        language: 'cpp',
        code: `class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int l = 0, r = nums.size()-1;\n        while(l <= r) {\n            int mid = l + (r-l)/2;\n            if(nums[mid] == target) return mid;\n            if(nums[mid] < target) l = mid+1;\n            else r = mid-1;\n        }\n        return -1;\n    }\n};`,
        status: 'Accepted',
        testCasesPassed: 4,
        totalTestCases: 4
      }
    ];
    await Submission.insertMany(submissions);
    console.log('Seeded sample coding submissions.');

    // 4. Create Sample Mock Interview sessions for Student
    const interviews = [
      {
        user: studentUser._id,
        type: 'Technical',
        duration: 320,
        score: 68,
        feedback: {
          confidenceScore: 70,
          communicationScore: 65,
          technicalAccuracy: 68,
          strengths: ['Clear code syntax explanations.', 'Good structured algorithmic approaches.'],
          improvements: ['Elaborate on binary complexity analysis details.', 'Use stronger descriptive verbs.']
        },
        transcript: [
          {
            question: 'Explain the concept of closures in JavaScript.',
            answer: 'A closure is a function that remembers its outer variables even after the outer function has executed.',
            score: 75,
            feedback: 'Good description. Adding an example about lexical environments would have made it perfect.'
          },
          {
            question: 'What is the difference between process and thread?',
            answer: 'A process represents an active program with memory, while a thread is a smaller segment inside a process sharing memory.',
            score: 60,
            feedback: 'Clear answers but missing details on inter-process communications (IPC).'
          }
        ]
      },
      {
        user: studentUser._id,
        type: 'HR',
        duration: 210,
        score: 80,
        feedback: {
          confidenceScore: 85,
          communicationScore: 82,
          technicalAccuracy: 75,
          strengths: ['Polite language patterns.', 'Sincere description of achievements.'],
          improvements: ['Work on transitional speech pauses.', 'Provide structured answers to conflict resolution.']
        },
        transcript: [
          {
            question: 'Why do you want to join our company?',
            answer: 'I want to join because you are working on cutting-edge AI features, which aligns perfectly with my CSE-AIML studies.',
            score: 80,
            feedback: 'Passionate and well-phrased response.'
          }
        ]
      }
    ];
    await Interview.insertMany(interviews);
    console.log('Seeded sample mock interview records.');

    // 5. Seed initial roadmap completed checkpoints
    const roadmaps = [
      {
        user: studentUser._id,
        title: 'MERN Stack',
        completedTopics: ['mern-1', 'mern-2']
      },
      {
        user: studentUser._id,
        title: 'DSA Roadmap',
        completedTopics: ['dsa-1', 'dsa-2', 'dsa-4']
      }
    ];
    await Roadmap.insertMany(roadmaps);
    console.log('Seeded initial roadmap checkpoints.');

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
