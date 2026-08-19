import { CareerInfo } from "./types";

export type CareerFamily = "ALL" | "TECH" | "HEALTHCARE" | "CREATIVE" | "BUSINESS" | "ENGINEERING";

export const ALL_CAREER_FAMILIES: { id: CareerFamily; label: string; icon: string }[] = [
  { id: "ALL", label: "All Career Tracks", icon: "✨" },
  { id: "TECH", label: "Technology & AI", icon: "💻" },
  { id: "BUSINESS", label: "Business & Finance", icon: "📈" },
  { id: "CREATIVE", label: "Design & Media", icon: "🎨" },
  { id: "HEALTHCARE", label: "Healthcare & Life Sciences", icon: "🩺" },
  { id: "ENGINEERING", label: "Core Engineering", icon: "⚙️" },
];

export const CAREER_DATASET: CareerInfo[] = [
  {
    id: "software-engineer",
    title: "Software & Systems Engineer",
    category: "Technology",
    family: "TECH",
    emoji: "💻",
    shortDescription: "Architect, build, and deploy scalable digital software, web apps, and system algorithms.",
    fullDescription: "Software Engineers design robust computing architectures, write production code, and collaborate in agile sprints to solve complex computational challenges.",
    averageSalary: "₹8.5 - 28 LPA",
    salaryRange: { entry: "₹6 - 12 LPA", mid: "₹14 - 24 LPA", senior: "₹30 - 65+ LPA" },
    futureDemand: "Very High",
    competitionLevel: "High",
    stressLevel: "Medium",
    workLifeBalance: "Moderate",
    keySkills: ["Data Structures & Algorithms", "Fullstack Development", "System Design", "Cloud Infrastructure (AWS/GCP)"],
    requiredDegrees: ["B.Tech / B.E in Computer Science / IT", "BCA / MCA"],
    recommendedExams: ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE"],
    reasons: [
      "High natural alignment with Algorithmic Logic and Problem Decomposition",
      "Preference for deep independent focus with structured digital tooling",
      "Outstanding market demand across India's booming tier-1 and global tech landscape"
    ],
    strengths: [
      "Rapid analytical debugging and procedural thinking",
      "High comfort with abstract computational systems"
    ],
    challenges: [
      "Rapid tech obsolescence requiring continuous lifelong learning",
      "Extended screen time and sedentary working sprints"
    ],
    potentialGaps: ["Advanced Distributed Systems", "System Optimization under heavy concurrency"],
    idealTraits: {
      "Algorithmic Logic": 90,
      "Technical Mastery": 92,
      "Spatial Reasoning": 75,
      "Stress Resilience": 80,
      "Creativity & Design": 70,
      "Product Empathy": 72,
      "Business Orientation": 65,
      "Communication": 70,
    },
    milestones: [
      { grade: "Grade 9-10", focus: "Logic Fundamentals", action: "Master Python/C++ basics, solve 50+ basic logic problems on HackerRank." },
      { grade: "Grade 11", focus: "Stream & Core Math", action: "Choose PCM stream, focus heavily on Functions, Calculus, and Coordinate Geometry." },
      { grade: "Grade 12", focus: "Exams & Portfolio", action: "Prepare for JEE Main/BITSAT while building 2 full-stack projects on GitHub." },
      { grade: "College Yr 1-2", focus: "CS Core & DSA", action: "Master Data Structures, Algorithms, OS, and Computer Networks." },
      { grade: "College Yr 3-4", focus: "Internships & System Design", action: "Complete 2 summer internships and contribute to open-source software." },
    ],
  },
  {
    id: "data-scientist",
    title: "AI & Data Scientist",
    category: "Technology",
    family: "TECH",
    emoji: "🧠",
    shortDescription: "Train machine learning models, uncover data insights, and engineer predictive AI algorithms.",
    fullDescription: "Data Scientists transform raw multi-modal enterprise data into intelligent mathematical models, neural nets, and actionable business strategies.",
    averageSalary: "₹10 - 32 LPA",
    salaryRange: { entry: "₹8 - 14 LPA", mid: "₹16 - 28 LPA", senior: "₹35 - 75+ LPA" },
    futureDemand: "Very High",
    competitionLevel: "High",
    stressLevel: "Medium",
    workLifeBalance: "Moderate",
    keySkills: ["Python (PyTorch, TensorFlow)", "Applied Statistics & Probability", "SQL & Big Data Pipelines", "LLM Fine-Tuning & RAG"],
    requiredDegrees: ["B.Tech in CS/AI/Data Science", "B.Sc/M.Sc in Statistics/Mathematics"],
    recommendedExams: ["JEE Main", "JEE Advanced", "ISI Admission Test", "CMI Entrance"],
    reasons: [
      "Outstanding aptitude in Mathematical Statistics and Quantitative Reasoning",
      "Curiosity for discovering patterns hidden within large multi-dimensional datasets",
      "High synergy with India's expanding frontier AI and predictive automation sector"
    ],
    strengths: [
      "Rigorous probabilistic thinking and hypothesis validation",
      "Data storytelling and feature engineering intuition"
    ],
    challenges: [
      "Ambiguous business problems with incomplete or noisy datasets",
      "High expectation to balance theoretical math with clean software engineering"
    ],
    potentialGaps: ["Deep Learning optimization at scale", "Production ML deployment (MLOps)"],
    idealTraits: {
      "Algorithmic Logic": 92,
      "Technical Mastery": 88,
      "Spatial Reasoning": 80,
      "Stress Resilience": 75,
      "Creativity & Design": 68,
      "Product Empathy": 76,
      "Business Orientation": 82,
      "Communication": 75,
    },
    milestones: [
      { grade: "Grade 9-10", focus: "Statistics & Python", action: "Learn NumPy, Pandas, and foundational exploratory data visualization." },
      { grade: "Grade 11", focus: "Advanced Math & PCM", action: "Master Linear Algebra, Probability distributions, and Matrix computations." },
      { grade: "Grade 12", focus: "Model Foundations", action: "Build 3 regression & classification models on Kaggle; prepare for STEM entrances." },
      { grade: "College Yr 1-2", focus: "ML Theory & Math", action: "Study Vector Calculus, Optimization techniques, and supervised learning algorithms." },
      { grade: "College Yr 3-4", focus: "Frontier AI & RAG", action: "Deploy Deep Learning architectures, fine-tune open weights, publish research." },
    ],
  },
  {
    id: "product-designer",
    title: "Product & UI/UX Designer",
    category: "Design & Media",
    family: "CREATIVE",
    emoji: "🎨",
    shortDescription: "Design intuitive user journeys, wireframes, and visually stunning digital products.",
    fullDescription: "Product Designers bridge human psychology and technology, creating frictionless interactive experiences and enterprise design systems.",
    averageSalary: "₹7 - 22 LPA",
    salaryRange: { entry: "₹5 - 9 LPA", mid: "₹12 - 20 LPA", senior: "₹25 - 45+ LPA" },
    futureDemand: "High",
    competitionLevel: "Moderate",
    stressLevel: "Low",
    workLifeBalance: "High",
    keySkills: ["Figma & Prototyping", "Design Systems", "User Research & Usability Testing", "Information Architecture"],
    requiredDegrees: ["B.Des / B.Arch", "B.Tech in Design Computing", "Human-Computer Interaction (HCI)"],
    recommendedExams: ["UCEED", "NID DAT", "NIFT Entrance", "JEE Main Paper 2"],
    reasons: [
      "Exceptional visual spatial awareness and empathetic understanding of user pain-points",
      "Balance between aesthetic design craft and ergonomic software usability",
      "High demand across tech unicorns building global consumer and SaaS applications"
    ],
    strengths: [
      "User empathy, micro-interaction craftsmanship, visual hierarchy mastery",
      "Fast iterative prototyping from whiteboard concepts to high-fidelity designs"
    ],
    challenges: [
      "Managing competing stakeholder feedback and design trade-offs",
      "Need to prove quantitative design ROI and conversion impact"
    ],
    potentialGaps: ["Design system token architecture", "Accessibility compliance standards (WCAG)"],
    idealTraits: {
      "Algorithmic Logic": 65,
      "Technical Mastery": 70,
      "Spatial Reasoning": 92,
      "Stress Resilience": 75,
      "Creativity & Design": 96,
      "Product Empathy": 94,
      "Business Orientation": 78,
      "Communication": 86,
    },
    milestones: [
      { grade: "Grade 9-10", focus: "Visual Foundations", action: "Practice sketches, typography theory, color harmony, and basic Figma components." },
      { grade: "Grade 11", focus: "Design Entrance Prep", action: "Study perspective drawing and observation skills for UCEED / NID DAT." },
      { grade: "Grade 12", focus: "Portfolio Building", action: "Assemble a 4-case-study UX portfolio redesigning real Indian mobile apps." },
      { grade: "College Yr 1-2", focus: "Design Systems & Research", action: "Conduct user interviews, master interactive prototyping, and learn frontend basics." },
      { grade: "College Yr 3-4", focus: "Product Strategy", action: "Lead design sprints for live products and partner with software engineering teams." },
    ],
  },
  {
    id: "financial-analyst",
    title: "Financial Analyst & Investment Strategist",
    category: "Business & Finance",
    family: "BUSINESS",
    emoji: "📈",
    shortDescription: "Analyze markets, forecast corporate valuations, and build mathematical financial models.",
    fullDescription: "Financial Analysts assess market performance, evaluate investment portfolios, and model risk for investment banks, funds, and corporate treasuries.",
    averageSalary: "₹8 - 26 LPA",
    salaryRange: { entry: "₹6 - 11 LPA", mid: "₹14 - 24 LPA", senior: "₹30 - 60+ LPA" },
    futureDemand: "High",
    competitionLevel: "High",
    stressLevel: "High",
    workLifeBalance: "Challenging",
    keySkills: ["Financial Modeling (DCF/LBO)", "Advanced Excel & Financial Python", "Valuation Analysis", "Macroeconomic Research"],
    requiredDegrees: ["B.Com (Hons) / BBA Finance", "B.A Economics (Hons)", "Chartered Accountancy (CA) / CFA"],
    recommendedExams: ["CUET UG", "IPMAT", "CFA Level 1", "CA Foundation"],
    reasons: [
      "High quantitative precision combined with strategic business acumen",
      "Enjoys macro-economic trends, market mechanics, and corporate decision making",
      "High earning potential in India's rapidly expanding fintech and capital markets"
    ],
    strengths: [
      "Rigorous numerical accuracy and risk assessment",
      "Deep financial statement analysis and investment storytelling"
    ],
    challenges: [
      "Intense quarterly earnings cycles and fast-paced market volatility",
      "Demanding work hours during deal executions and financial year ends"
    ],
    potentialGaps: ["Algorithmic quantitative modeling", "Alternative asset valuation"],
    idealTraits: {
      "Algorithmic Logic": 85,
      "Technical Mastery": 72,
      "Spatial Reasoning": 60,
      "Stress Resilience": 88,
      "Creativity & Design": 55,
      "Product Empathy": 68,
      "Business Orientation": 95,
      "Communication": 84,
    },
    milestones: [
      { grade: "Grade 9-10", focus: "Financial Literacy", action: "Understand basics of stocks, balance sheets, and compounding math." },
      { grade: "Grade 11", focus: "Commerce / Math", action: "Choose Commerce with Applied Mathematics or PCM with Economics." },
      { grade: "Grade 12", focus: "CUET / IPMAT Prep", action: "Prepare for top university finance programs (SRCC, IIM Indore IPM, St. Xavier's)." },
      { grade: "College Yr 1-2", focus: "Financial Modeling & CFA", action: "Build valuation models on Excel and prepare for CFA Level 1." },
      { grade: "College Yr 3-4", focus: "Investment Banking Internships", action: "Complete equity research or investment banking summer internships." },
    ],
  },
  {
    id: "doctor-medical",
    title: "Medical Specialist / Surgeon",
    category: "Healthcare",
    family: "HEALTHCARE",
    emoji: "🩺",
    shortDescription: "Diagnose conditions, perform clinical procedures, and improve public health outcomes.",
    fullDescription: "Medical Professionals deliver critical patient care, master physiological diagnostic sciences, and lead emergency and specialty clinical interventions.",
    averageSalary: "₹10 - 35 LPA",
    salaryRange: { entry: "₹7 - 12 LPA", mid: "₹15 - 28 LPA", senior: "₹35 - 90+ LPA" },
    futureDemand: "Very High",
    competitionLevel: "High",
    stressLevel: "Demanding",
    workLifeBalance: "Challenging",
    keySkills: ["Clinical Diagnostics", "Anatomical & Physiological Mastery", "Patient Communication", "Crisis Triage & Surgical Skill"],
    requiredDegrees: ["MBBS", "MD / MS / DNB Specialization"],
    recommendedExams: ["NEET UG", "NEET PG", "INICET"],
    reasons: [
      "High natural empathy paired with biological and scientific dedication",
      "Desire for tangible, mission-driven societal impact saving lives",
      "Perennial high respect, job security, and clinical longevity"
    ],
    strengths: [
      "Exceptional emotional resilience and crisis decision making",
      "Deep scientific memory and pattern recognition in pathology"
    ],
    challenges: [
      "Long training gestation period (5.5 yrs MBBS + 3 yrs MD/MS)",
      "High cognitive and physical stamina required for long clinical shifts"
    ],
    potentialGaps: ["Digital health diagnostics integration", "Advanced medical robotics"],
    idealTraits: {
      "Algorithmic Logic": 78,
      "Technical Mastery": 82,
      "Spatial Reasoning": 85,
      "Stress Resilience": 95,
      "Creativity & Design": 60,
      "Product Empathy": 95,
      "Business Orientation": 60,
      "Communication": 88,
    },
    milestones: [
      { grade: "Grade 9-10", focus: "Biology & Human Systems", action: "Build strong conceptual foundations in Cellular Biology and Human Physiology." },
      { grade: "Grade 11", focus: "PCB + NEET Intensive", action: "Choose PCB stream; master NCERT textbooks line-by-line with daily MCQs." },
      { grade: "Grade 12", focus: "NEET UG Qualification", action: "Solve 100+ full-length mock tests aiming for 650+ NEET benchmark score." },
      { grade: "MBBS Yr 1-3", focus: "Pre-clinical & Paraclinical", action: "Master Anatomy, Biochemistry, Pathology, Pharmacology, and Microbiology." },
      { grade: "MBBS Yr 4-5 + Intern", focus: "Rotary Clinical Rotations", action: "Gain hands-on clinical triage, minor procedures, and prepare for NEET PG / NEXT." },
    ],
  },
  {
    id: "mechanical-robotics",
    title: "Robotics & Mechatronics Engineer",
    category: "Core Engineering",
    family: "ENGINEERING",
    emoji: "⚙️",
    shortDescription: "Design autonomous hardware systems, robotic arms, sensor actuators, and electric vehicles.",
    fullDescription: "Robotics Engineers unite mechanical kinematics, embedded electronics, and control theory to create intelligent physical machines.",
    averageSalary: "₹7.5 - 24 LPA",
    salaryRange: { entry: "₹5.5 - 10 LPA", mid: "₹12 - 22 LPA", senior: "₹26 - 55+ LPA" },
    futureDemand: "Very High",
    competitionLevel: "Moderate",
    stressLevel: "Medium",
    workLifeBalance: "Moderate",
    keySkills: ["Kinematics & Dynamics", "Embedded C/C++ & ROS", "CAD/CAM (SolidWorks)", "Microcontrollers & IoT Actuators"],
    requiredDegrees: ["B.Tech / B.E in Mechanical / Mechatronics / Robotics"],
    recommendedExams: ["JEE Main", "JEE Advanced", "GATE (Postgrad)"],
    reasons: [
      "Enthusiasm for tangible physical machines, kinematics, and electronic sensors",
      "Bridging the physical world with autonomous algorithmic control",
      "High growth in India's automated manufacturing, defense tech, and EV sectors"
    ],
    strengths: [
      "Spatial mechanics intuition and multi-physics troubleshooting",
      "Hands-on hardware fabrication and circuit debugging"
    ],
    challenges: [
      "Hardware iterations take physical prototype turnaround time and capital",
      "Cross-disciplinary mastery required across software, hardware, and physics"
    ],
    potentialGaps: ["ROS2 motion planning algorithms", "Computer vision integration on edge hardware"],
    idealTraits: {
      "Algorithmic Logic": 86,
      "Technical Mastery": 90,
      "Spatial Reasoning": 92,
      "Stress Resilience": 80,
      "Creativity & Design": 78,
      "Product Empathy": 70,
      "Business Orientation": 68,
      "Communication": 72,
    },
    milestones: [
      { grade: "Grade 9-10", focus: "Arduino & Physics", action: "Build basic obstacle-avoiding robots with Arduino and Ultrasonic sensors." },
      { grade: "Grade 11", focus: "Rotational Mechanics & PCM", action: "Master Kinematics, Dynamics, Electromagnetism in Physics." },
      { grade: "Grade 12", focus: "CAD & Entrance Prep", action: "Learn basic 3D modeling in Fusion360; prepare for JEE Main & Advanced." },
      { grade: "College Yr 1-2", focus: "Circuits & Mechanical Design", action: "Join college robotics / FSAE formula student team; master C++ and SolidWorks." },
      { grade: "College Yr 3-4", focus: "Autonomous Systems", action: "Implement SLAM (Simultaneous Localization and Mapping) and ROS on real robots." },
    ],
  },
];

export function getCareerById(id: string): CareerInfo {
  return CAREER_DATASET.find((c) => c.id === id) || CAREER_DATASET[0];
}
