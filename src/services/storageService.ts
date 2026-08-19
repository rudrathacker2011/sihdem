import { AnalysisOutput, AssessmentResult, StudentProfile } from "./types";

const KEYS = {
  PROFILE: "ai_career_profile",
  ASSESSMENT: "ai_career_assessment_result",
  ANALYSIS_OUTPUT: "ai_career_analysis_output",
  COMPLETED_TASKS: "ai_career_completed_tasks",
  XP: "ai_career_xp",
  UNLOCKED_BADGES: "ai_career_badges",
  BOOKMARKS: "ai_career_bookmarks",
};

class StorageService {
  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  saveProfile(profile: StudentProfile): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  }

  getProfile(): StudentProfile | null {
    if (!this.isBrowser()) return null;
    const raw = localStorage.getItem(KEYS.PROFILE);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  saveAssessmentResult(result: AssessmentResult): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.ASSESSMENT, JSON.stringify(result));
  }

  getAssessmentResult(): AssessmentResult | null {
    if (!this.isBrowser()) return null;
    const raw = localStorage.getItem(KEYS.ASSESSMENT);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  saveAnalysisOutput(output: AnalysisOutput): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.ANALYSIS_OUTPUT, JSON.stringify(output));
  }

  getAnalysisOutput(): AnalysisOutput | null {
    if (!this.isBrowser()) return null;
    const raw = localStorage.getItem(KEYS.ANALYSIS_OUTPUT);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  toggleTaskCompletion(taskId: string): string[] {
    if (!this.isBrowser()) return [];
    const tasks = this.getCompletedTasks();
    const index = tasks.indexOf(taskId);
    let updated: string[];
    if (index >= 0) {
      updated = tasks.filter((t) => t !== taskId);
    } else {
      updated = [...tasks, taskId];
    }
    localStorage.setItem(KEYS.COMPLETED_TASKS, JSON.stringify(updated));
    return updated;
  }

  getCompletedTasks(): string[] {
    if (!this.isBrowser()) return [];
    const raw = localStorage.getItem(KEYS.COMPLETED_TASKS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  addXP(amount: number): number {
    if (!this.isBrowser()) return amount;
    const current = this.getXP();
    const updated = current + amount;
    localStorage.setItem(KEYS.XP, updated.toString());
    return updated;
  }

  getXP(): number {
    if (!this.isBrowser()) return 450;
    const raw = localStorage.getItem(KEYS.XP);
    if (!raw) return 450;
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? 450 : parsed;
  }

  clearSession(): void {
    if (!this.isBrowser()) return;
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  }
}

export const storageService = new StorageService();
