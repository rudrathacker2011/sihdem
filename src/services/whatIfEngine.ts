import { CareerMatch } from "./types";
import { CAREER_DATASET } from "./careerDataset";

export interface WhatIfLevers {
  academicEffort: number; // -30% to +30%
  programmingSkill: number; // 0 to 100
  mathematicsSkill: number; // 0 to 100
  communicationSkill: number; // 0 to 100
  designSkill: number; // 0 to 100
  dailyStudyHours: number; // 1 to 10
}

export interface SimulationDiff {
  careerId: string;
  originalScore: number;
  simulatedScore: number;
  diff: number;
  originalRank: number;
  simulatedRank: number;
  rankShift: number;
}

export class WhatIfEngine {
  simulate(baseMatches: CareerMatch[], levers: WhatIfLevers): SimulationDiff[] {
    const scored = baseMatches.map((m, originalIndex) => {
      const career = CAREER_DATASET.find((c) => c.id === m.careerId);
      const isTech = career?.family === "TECH" || career?.family === "ENGINEERING";
      const isCreative = career?.family === "CREATIVE";
      const isBusiness = career?.family === "BUSINESS";
      const isHealth = career?.family === "HEALTHCARE";

      let multiplier = 0;

      // Academic effort lever
      multiplier += (levers.academicEffort / 100) * 12;

      // Skill multipliers
      if (isTech) {
        multiplier += ((levers.programmingSkill - 50) / 50) * 14;
        multiplier += ((levers.mathematicsSkill - 50) / 50) * 10;
      } else if (isCreative) {
        multiplier += ((levers.designSkill - 50) / 50) * 18;
        multiplier += ((levers.communicationSkill - 50) / 50) * 8;
      } else if (isBusiness) {
        multiplier += ((levers.mathematicsSkill - 50) / 50) * 12;
        multiplier += ((levers.communicationSkill - 50) / 50) * 14;
      } else if (isHealth) {
        multiplier += ((levers.mathematicsSkill - 50) / 50) * 8;
        multiplier += (levers.dailyStudyHours >= 6 ? 12 : -5);
      }

      // Study hours impact
      if (levers.dailyStudyHours >= 5) {
        multiplier += (levers.dailyStudyHours - 4) * 2;
      }

      const clampedSim = Math.min(98, Math.max(35, Math.round(m.score + multiplier)));

      return {
        careerId: m.careerId,
        originalScore: m.score,
        simulatedScore: clampedSim,
        diff: clampedSim - m.score,
        originalRank: originalIndex + 1,
        simulatedRank: 0,
        rankShift: 0,
      };
    });

    // Re-rank
    const ranked = [...scored].sort((a, b) => b.simulatedScore - a.simulatedScore);
    ranked.forEach((item, idx) => {
      item.simulatedRank = idx + 1;
      item.rankShift = item.originalRank - item.simulatedRank; // positive means moved up
    });

    return ranked;
  }
}

export const whatIfEngine = new WhatIfEngine();
