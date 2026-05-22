const pdf = require('pdf-parse');
const { GoogleGenAI } = require('@google/generative-ai');

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
  } catch (err) {
    console.error('Failed to initialize Gemini API in resume controller:', err);
  }
}

// @desc    Upload & Analyze Resume
// @route   POST /api/resume/analyze
// @access  Private
const analyzeResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a PDF resume');
    }

    // Parse the PDF buffer
    let parsedData;
    try {
      parsedData = await pdf(req.file.buffer);
    } catch (parseError) {
      console.error('pdf-parse failed:', parseError);
      res.status(400);
      throw new Error('Failed to parse PDF document. Ensure the file is not corrupted.');
    }

    const resumeText = parsedData.text;

    // Prompt for Gemini
    const systemPrompt = `You are an expert HR recruiter and ATS (Applicant Tracking System) optimization specialist.
    Analyze the following resume text and return a JSON object with:
    - atsScore (integer 0-100)
    - missingSkills (array of strings)
    - weakBulletPoints (array of objects with 'original' and 'suggestion' string keys)
    - grammarImprovements (array of objects with 'original' and 'correction' string keys)
    - projectSuggestions (array of objects with 'title' and 'description' keys)
    - optimizedSuggestions (array of strings)
    Return raw JSON only.`;

    const userPrompt = `Resume Content:\n\n${resumeText}`;

    // Fallback function for local analyzer
    const localAnalyze = () => {
      const lowerText = resumeText.toLowerCase();
      
      const skillsDatabase = [
        { name: 'React', keyword: 'react' },
        { name: 'Redux', keyword: 'redux' },
        { name: 'Node.js', keyword: 'node' },
        { name: 'Express.js', keyword: 'express' },
        { name: 'MongoDB', keyword: 'mongo' },
        { name: 'TypeScript', keyword: 'typescript' },
        { name: 'Docker', keyword: 'docker' },
        { name: 'AWS', keyword: 'aws' },
        { name: 'Git', keyword: 'git' },
        { name: 'Jest', keyword: 'jest' },
        { name: 'Python', keyword: 'python' }
      ];

      const foundSkills = [];
      const missingSkills = [];

      skillsDatabase.forEach(skill => {
        if (lowerText.includes(skill.keyword)) {
          foundSkills.push(skill.name);
        } else {
          missingSkills.push(skill.name);
        }
      });

      // Calculate score based on found skills
      const baseScore = 55;
      const skillsScore = Math.min(foundSkills.length * 5, 30);
      const formattingBonus = lowerText.includes('education') || lowerText.includes('experience') ? 10 : 0;
      const atsScore = Math.min(baseScore + skillsScore + formattingBonus, 95);

      // Identify weak bullet points (heuristic based on common words)
      const weakPoints = [];
      if (lowerText.includes('responsible for')) {
        weakPoints.push({
          original: "Responsible for developing web applications.",
          suggestion: "Led the development of 3 high-impact web applications, reducing page loading speed by 25%."
        });
      }
      if (lowerText.includes('helped in')) {
        weakPoints.push({
          original: "Helped in testing software modules.",
          suggestion: "Implemented unit and integration tests using Jest, boosting test coverage from 40% to 85%."
        });
      }
      if (weakPoints.length === 0) {
        weakPoints.push({
          original: "Worked on implementing features in frontend.",
          suggestion: "Collaborated with cross-functional teams to engineer 10+ frontend features in React, elevating active user engagement by 15%."
        });
      }

      // Project Suggestions based on missing/found tech
      const projectSuggestions = [];
      if (!foundSkills.includes('Docker') || !foundSkills.includes('AWS')) {
        projectSuggestions.push({
          title: "CI/CD Deployment with Docker & AWS EC2",
          description: "Containerize a full-stack MERN application using Docker Compose and automate deployment to an AWS EC2 instance with GitHub Actions."
        });
      }
      if (foundSkills.includes('React') && !foundSkills.includes('Redux')) {
        projectSuggestions.push({
          title: "Real-time E-commerce Store with Redux Toolkit",
          description: "Build an e-commerce platform incorporating Redux state management, shopping cart caches, and Stripe gateway simulation."
        });
      }
      if (projectSuggestions.length === 0) {
        projectSuggestions.push({
          title: "Microservices-based Chat Engine",
          description: "Develop a high-concurrency chatting application using Node.js, Socket.io, Redis adapter, and MongoDB database sharding."
        });
      }

      const mockAnalysis = {
        atsScore,
        missingSkills: missingSkills.slice(0, 5),
        weakBulletPoints: weakPoints,
        grammarImprovements: [
          {
            original: "I have created several projects...",
            correction: "Engineered multiple scalable projects..."
          }
        ],
        projectSuggestions,
        optimizedSuggestions: [
          "Include action verbs at the beginning of each bullet point (e.g. Developed -> Engineered, Created -> Implemented).",
          "Add quantitative metrics (percentages, dollar amounts, hours saved) to demonstrate measurable impact.",
          "Add a dedicated Skills section categorizing Languages, Frameworks, and Tools for better ATS scanning."
        ]
      };

      return JSON.stringify(mockAnalysis);
    };

    let resultText;
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
        resultText = result.response.text();
      } catch (err) {
        console.warn('Gemini parser failed, using local analysis fallback');
        resultText = localAnalyze();
      }
    } else {
      resultText = localAnalyze();
    }

    let analysisData;
    try {
      let cleanJson = resultText.trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.substring(7);
      }
      if (cleanJson.endsWith('```')) {
        cleanJson = cleanJson.substring(0, cleanJson.length - 3);
      }
      analysisData = JSON.parse(cleanJson.trim());
    } catch (e) {
      analysisData = JSON.parse(localAnalyze());
    }

    res.json({
      success: true,
      analysis: analysisData,
      rawTextLength: resumeText.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeResume
};
