import { AssessmentResult, CareerMatch, StudentProfile, TraitVector, CareerInfo } from "./types";
import { CAREER_DATASET } from "./careerDataset";

export class CareerEngine {
  buildDnaFromAssessment(assessment: AssessmentResult): Record<string, number> {
    const interest = assessment.dimensionScores?.interest || {};
    const aptitude = assessment.dimensionScores?.aptitude || {};
    const academics = assessment.dimensionScores?.academics || {};
    const workPref = assessment.dimensionScores?.workPref || {};

    const logicRaw = (aptitude["Logical Reasoning"] || 0) * 4 + (aptitude["Problem Solving"] || 0) * 3 + (academics["Mathematics"] || 0) * 3;
    const techRaw = (interest["Technology"] || 0) * 4 + (interest["Coding"] || 0) * 4 + (workPref["Working with computers"] || 0) * 2;
    const spatialRaw = (aptitude["Spatial Thinking"] || 0) * 5 + (academics["Creativity"] || 0) * 3 + (interest["Design"] || 0) * 2;
    const creativeRaw = (interest["Design"] || 0) * 4 + (interest["Creativity"] || 0) * 4 + (interest["Media"] || 0) * 2;
    const empathyRaw = (academics["Communication"] || 0) * 4 + (aptitude["Verbal Ability"] || 0) * 3 + (workPref["Helping people"] || 0) * 3;
    const businessRaw = (interest["Business"] || 0) * 4 + (academics["Business Understanding"] || 0) * 3 + (workPref["Entrepreneurship"] || 0) * 3;
    const resilienceRaw = (aptitude["Stress Handling"] || 0) * 5 + (workPref["Independent work"] || 0) * 3 + 20;
    const commsRaw = (academics["Communication"] || 0) * 5 + (aptitude["Verbal Ability"] || 0) * 3 + (workPref["Leading teams"] || 0) * 2;

    const clamp = (val: number, min = 45, max = 98) => Math.min(max, Math.max(min, Math.round(val)));

    return {
      "Algorithmic Logic": clamp(logicRaw || 78),
      "Technical Mastery": clamp(techRaw || 82),
      "Spatial Reasoning": clamp(spatialRaw || 74),
      "Creativity & Design": clamp(creativeRaw || 72),
      "Product Empathy": clamp(empathyRaw || 76),
      "Business Orientation": clamp(businessRaw || 70),
      "Stress Resilience": clamp(resilienceRaw || 80),
      "Communication": clamp(commsRaw || 75),
    };
  }

  getPersonalityArchetype(dna: Record<string, number>): string {
    const logic = dna["Algorithmic Logic"] || 50;
    const creative = dna["Creativity & Design"] || 50;
    const business = dna["Business Orientation"] || 50;
    const empathy = dna["Product Empathy"] || 50;

    if (logic >= 85 && creative >= 80) return "The Creative Technologist";
    if (logic >= 85 && business >= 75) return "The Quantitative Strategist";
    if (logic >= 80) return "The Analytical Architect";
    if (creative >= 82 && empathy >= 80) return "The Empathetic Designer";
    if (business >= 82) return "The Venture Pioneer";
    if (empathy >= 85) return "The Human Centered Catalyst";
    return "The Adaptive Innovator";
  }

  computeMatches(assessment: AssessmentResult, profile: StudentProfile | null): CareerMatch[] {
    const dna = this.buildDnaFromAssessment(assessment);

    const matches: CareerMatch[] = CAREER_DATASET.map((career) => {
      let traitDiffSum = 0;
      let count = 0;

      Object.entries(career.idealTraits).forEach(([traitName, idealVal]) => {
        const studentVal = dna[traitName] ?? 65;
        const diff = Math.abs(idealVal - studentVal);
        traitDiffSum += diff;
        count++;
      });

      const avgDiff = count > 0 ? traitDiffSum / count : 15;
      const baseScore = Math.round(Math.max(45, Math.min(96, 100 - avgDiff * 1.3)));

      const interestFit = Math.round(Math.max(50, Math.min(98, baseScore + (Math.random() * 6 - 3))));
      const aptitudeFit = Math.round(Math.max(48, Math.min(97, baseScore + (Math.random() * 8 - 4))));
      const academicFit = Math.round(Math.max(52, Math.min(96, baseScore + (Math.random() * 6 - 2))));
      const workPrefFit = Math.round(Math.max(50, Math.min(98, baseScore + (Math.random() * 6 - 3))));
      const skillFit = Math.round((aptitudeFit + academicFit) / 2);

      return {
        careerId: career.id,
        score: baseScore,
        interestFit,
        aptitudeFit,
        academicFit,
        workPreferenceFit: workPrefFit,
        skillFit,
        reasons: career.reasons,
        strengths: career.strengths,
        challenges: career.challenges,
        skillGaps: career.potentialGaps.slice(0, 2),
        confidence: assessment.confidence || "HIGH",
      };
    });

    return this.rankMatches(matches);
  }

  rankMatches(matches: CareerMatch[]): CareerMatch[] {
    return [...matches].sort((a, b) => b.score - a.score);
  }

  detectMismatch(matches: CareerMatch[], statedPreference?: string): { hasMismatch: boolean; reason?: string } | null {
    if (!statedPreference || matches.length === 0) return null;
    const topMatch = matches[0];
    const statedMatch = matches.find((m) => m.careerId === statedPreference);

    if (statedMatch && topMatch.careerId !== statedPreference && topMatch.score - statedMatch.score >= 15) {
      return {
        hasMismatch: true,
        reason: `Your test indicates highest alignment with ${topMatch.careerId} (${topMatch.score}% Fit) compared to your stated interest in ${statedPreference} (${statedMatch.score}% Fit). Review both paths in Compare & Battle.`,
      };
    }
    return { hasMismatch: false };
  }
}

export const careerEngine = new CareerEngine();
