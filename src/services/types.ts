export type AssessmentConfidence = "HIGH" | "MODERATE" | "LOW";

export interface TraitVector {
  [trait: string]: number;
}

export interface DimensionScores {
  interest: Record<string, number>;
  aptitude: Record<string, number>;
  academics: Record<string, number>;
  workPref: Record<string, number>;
}

export interface CareerMatch {
  careerId: string;
  score: number;
  interestFit: number;
  aptitudeFit: number;
  academicFit: number;
  workPreferenceFit: number;
  skillFit: number;
  reasons: string[];
  strengths: string[];
  challenges: string[];
  skillGaps: string[];
  confidence: AssessmentConfidence;
}

export interface CareerInfo {
  id: string;
  title: string;
  category: string;
  family: string;
  emoji: string;
  shortDescription: string;
  fullDescription: string;
  averageSalary: string;
  salaryRange: { entry: string; mid: string; senior: string };
  futureDemand: "Very High" | "High" | "Moderate" | "Emerging";
  competitionLevel: "High" | "Moderate" | "Low";
  stressLevel: "Low" | "Medium" | "High" | "Demanding";
  workLifeBalance: "High" | "Moderate" | "Challenging";
  keySkills: string[];
  requiredDegrees: string[];
  recommendedExams: string[];
  reasons: string[];
  strengths: string[];
  challenges: string[];
  potentialGaps: string[];
  idealTraits: Record<string, number>;
  milestones: { grade: string; focus: string; action: string }[];
}

export interface AssessmentResult {
  id: string;
  date: string;
  dimensionScores: DimensionScores;
  confidence: AssessmentConfidence;
  selectedOptionIds: string[];
}

export interface StudentProfile {
  name: string;
  grade: string;
  stream: string;
  favSubject: string;
  statedPreference?: string;
  targetCity?: string;
  interests?: string[];
  skills?: string[];
}

export interface AnalysisOutput {
  assessment: AssessmentResult;
  matches: CareerMatch[];
  mismatch: { hasMismatch: boolean; reason?: string } | null;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  grade: string;
  xp: number;
  streak: number;
  badgesCount: number;
  topCareer: string;
  isCurrentUser?: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "assessment" | "learning" | "simulation" | "streak";
  unlocked: boolean;
  unlockedAt?: string;
}

export interface SimulationScenario {
  id: string;
  title: string;
  role: string;
  careerId: string;
  emoji: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  description: string;
  xpReward: number;
  steps: {
    id: number;
    situation: string;
    question: string;
    options: {
      id: string;
      text: string;
      traitImpact: Record<string, number>;
      feedback: string;
      points: number;
    }[];
  }[];
}
