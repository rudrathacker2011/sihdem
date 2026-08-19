import { Badge, LeaderboardEntry, SimulationScenario } from "./types";
import { storageService } from "./storageService";

export const INITIAL_BADGES: Badge[] = [
  {
    id: "first_assessment",
    title: "Self-Discovery Pioneer",
    description: "Completed the full 7-step situational career discovery assessment.",
    icon: "🧭",
    category: "assessment",
    unlocked: true,
    unlockedAt: "Today",
  },
  {
    id: "what_if_explorer",
    title: "Quantum Strategist",
    description: "Simulated 3 different future skill trajectories in the What-If Simulator.",
    icon: "🎛️",
    category: "learning",
    unlocked: true,
    unlockedAt: "Today",
  },
  {
    id: "battle_master",
    title: "Decision Arena Gladiator",
    description: "Compared two competitive careers in 1v1 Compare & Battle.",
    icon: "⚔️",
    category: "simulation",
    unlocked: false,
  },
  {
    id: "simulation_ace",
    title: "Virtual Apprentice",
    description: "Completed your first Day-in-the-Life career simulation scenario.",
    icon: "🎮",
    category: "simulation",
    unlocked: false,
  },
  {
    id: "streak_3",
    title: "Dedicated Scholar",
    description: "Maintained a 3-day exploration and roadmap milestone streak.",
    icon: "🔥",
    category: "streak",
    unlocked: true,
    unlockedAt: "Yesterday",
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", rank: 1, name: "Aarav Sharma", avatar: "👨‍💻", grade: "Grade 11 (PCM)", xp: 1450, streak: 8, badgesCount: 6, topCareer: "Software & Systems Engineer" },
  { id: "2", rank: 2, name: "Priya Patel", avatar: "👩‍🔬", grade: "Grade 12 (PCB)", xp: 1320, streak: 6, badgesCount: 5, topCareer: "Medical Specialist" },
  { id: "3", rank: 3, name: "Rohan Mehta", avatar: "📊", grade: "Grade 11 (Commerce)", xp: 1180, streak: 5, badgesCount: 4, topCareer: "Financial Analyst" },
  { id: "4", rank: 4, name: "You (Current Student)", avatar: "🚀", grade: "Grade 11", xp: 850, streak: 3, badgesCount: 3, topCareer: "AI & Data Scientist", isCurrentUser: true },
  { id: "5", rank: 5, name: "Ananya Iyer", avatar: "🎨", grade: "Grade 10", xp: 760, streak: 2, badgesCount: 3, topCareer: "Product & UI/UX Designer" },
  { id: "6", rank: 6, name: "Kabir Verma", avatar: "⚙️", grade: "Grade 12 (PCM)", xp: 690, streak: 2, badgesCount: 2, topCareer: "Robotics Engineer" },
];

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: "software_outage",
    title: "Critical Server Crash at Midnight",
    role: "Junior Backend Engineer",
    careerId: "software-engineer",
    emoji: "💻",
    difficulty: "Beginner",
    estimatedMinutes: 5,
    description: "A sudden traffic spike causes database connection pools to saturate right during a festive flash sale.",
    xpReward: 150,
    steps: [
      {
        id: 1,
        situation: "Alerts go off on your phone at 11:45 PM: P99 latency exceeded 4500ms and users see 504 Gateway Timeouts.",
        question: "What is your immediate first step?",
        options: [
          {
            id: "opt_1",
            text: "Check Grafana telemetry logs to pinpoint CPU saturation and slow database queries",
            traitImpact: { "Algorithmic Logic": 5, "Technical Mastery": 5 },
            feedback: "Excellent! Diagnosing root telemetry before making changes prevents worsening the outage.",
            points: 50,
          },
          {
            id: "opt_2",
            text: "Immediately reboot all servers without reading error logs",
            traitImpact: { "Stress Resilience": -2 },
            feedback: "Rebooting without investigation clears stack traces and causes cold cache stampedes.",
            points: 15,
          },
          {
            id: "opt_3",
            text: "Enable rate limiting on incoming API traffic while spinning up read-replicas",
            traitImpact: { "Technical Mastery": 4, "Stress Resilience": 4 },
            feedback: "Great triage! Throttling traffic stabilizes the core database while capacity recovers.",
            points: 45,
          },
        ],
      },
      {
        id: 2,
        situation: "You discover an unindexed database query scanning 5 million rows on every search request.",
        question: "How do you permanently resolve this?",
        options: [
          {
            id: "opt_4",
            text: "Add a composite B-Tree index on (user_id, status) and deploy a Redis cache layer",
            traitImpact: { "Technical Mastery": 5, "Algorithmic Logic": 5 },
            feedback: "Spot on! Database indexing and Redis caching drops query execution from 3.2s to 4ms.",
            points: 50,
          },
          {
            id: "opt_5",
            text: "Ask marketing to stop running customer ads",
            traitImpact: { "Business Orientation": -3 },
            feedback: "Engineering must support business growth rather than restricting customer demand.",
            points: 10,
          },
        ],
      },
    ],
  },
  {
    id: "product_redesign",
    title: "High Drop-off on Checkout Screen",
    role: "Lead UI/UX Designer",
    careerId: "product-designer",
    emoji: "🎨",
    difficulty: "Beginner",
    estimatedMinutes: 5,
    description: "Analytics show 42% of mobile shoppers abandon cart at the payment details step.",
    xpReward: 150,
    steps: [
      {
        id: 1,
        situation: "Session replays show users struggling with a 14-field form with confusing field labels.",
        question: "What UX intervention do you prioritize?",
        options: [
          {
            id: "opt_ux1",
            text: "Redesign into a 1-click UPI & biometric checkout with progressive auto-fill",
            traitImpact: { "Creativity & Design": 5, "Product Empathy": 5 },
            feedback: "Brilliant! Frictionless UPI flows are proven to increase Indian checkout conversions by 35%.",
            points: 50,
          },
          {
            id: "opt_ux2",
            text: "Make all form error messages flash in bright red modal popups",
            traitImpact: { "Product Empathy": -3 },
            feedback: "Aggressive modals increase cognitive anxiety and drive users away.",
            points: 15,
          },
        ],
      },
    ],
  },
];
