export const portfolioData = {
  personalInfo: {
    name: "Amit Yadav",
    title: "Full-Stack Developer focused on AI-powered web products",
    bio: "Computer Science undergraduate building practical AI-enabled web applications with React, Node.js, serverless APIs, and clean product interfaces. I care about dependable architecture, readable code, and experiences that feel fast and easy to use.",
    location: "Punjab, India",
    email: "ay5589370@gmail.com",
    availability: "Open to internships, junior developer roles, and focused product collaborations"
  },

  profiles: {
    github: "https://github.com/ay5589370-cyber",
    leetcode: "https://leetcode.com/u/7kyE953dD4/"
  },

  education: [
    {
      degree: "B.Tech in Computer Science & Engineering",
      institution: "Chandigarh University",
      duration: "2024 - 2028",
      highlights: [
        "Core Focus: Data Structures & Algorithms, Operating Systems, DBMS, and Web Development",
        "Beyond Academics: Turning classroom concepts into practical projects and strengthening problem-solving skills through consistent coding practice"
      ]
    }
  ],

  skills: [
    {
      category: "Frontend Development",
      items: ["React", "JavaScript (ES6+)", "HTML5", "CSS3", "Responsive interfaces", "Animation-driven UI"]
    },
    {
      category: "Backend & Cloud",
      items: ["Node.js", "Express.js", "Serverless API routes", "REST APIs", "Firebase"]
    },
    {
      category: "Programming Languages",
      items: ["C++", "JavaScript", "Python", "SQL"]
    },
    {
      category: "Computer Science Core",
      items: ["Data Structures & Algorithms", "CPU scheduling", "System design basics", "Database management"]
    },
    {
      category: "AI & Modern Tools",
      items: ["Multi-provider AI APIs", "Speech recognition & synthesis", "Git / GitHub", "Vite"]
    }
  ],

  projects: [
    {
      id: "studymind-ai",
      title: "StudyMind AI",
      category: "AI Learning Platform",
      description: "A student-focused AI learning platform that converts PDFs, notes, and topics into structured study support with personalized content generation.",
      features: [
        "PDF, notes, and topic-based study flows",
        "AI-generated explanations and learning content",
        "Multi-language support for broader accessibility",
        "Clean student-first interface"
      ],
      liveDemo: "https://studymind-flax.vercel.app/",
      github: null,
      technologies: ["JavaScript", "HTML5", "CSS3", "Groq AI API", "Firebase", "Vercel"],
      featured: true
    },
    {
      id: "cpu-visualizer",
      title: "CPU Scheduling Visualizer",
      category: "Interactive Operating Systems Tool",
      description: "An interactive simulator for learning classic CPU scheduling algorithms through process inputs, Gantt charts, and performance metrics.",
      algorithms: [
        "First-Come, First-Served (FCFS)",
        "Shortest Job First (SJF - Non-Preemptive)",
        "Shortest Remaining Time First (SRTF - Preemptive)",
        "Round Robin (RR)",
        "Priority Scheduling (Non-Preemptive)"
      ],
      features: [
        "Dynamic process input for arrival, burst, and priority values",
        "Visual Gantt chart timeline",
        "Waiting, turnaround, and response time analysis",
        "Average metrics for comparing algorithms"
      ],
      liveDemo: "https://cpu-scheduling-visualizer-swart.vercel.app/",
      github: null,
      technologies: ["React", "JavaScript", "CSS3 Canvas/Grid", "Operating Systems Logic"],
      featured: true
    }
  ],

  suggestedQuestions: [
    "Who is Amit?",
    "Tell me about Amit's skills.",
    "What is StudyMind AI?",
    "Explain the CPU Scheduling Visualizer.",
    "What technologies does Amit use?",
    "Why should I hire Amit?"
  ]
};

export const PORTFOLIO_SYSTEM_PROMPT = `You are Amit Yadav's personal portfolio assistant named "Ask Amit AI".
Answer questions about Amit using ONLY the information supplied in the portfolio context below.
Never invent experience, companies, certifications, awards, statistics, contact information, or achievements.
If information is unavailable in this prompt context, politely reply:
"I don't have that information in Amit's portfolio yet."

PORTFOLIO CONTEXT:
${JSON.stringify(portfolioData, null, 2)}
`;
