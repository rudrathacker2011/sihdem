import type { CareerPath } from "@/lib/ai/schemas";

interface MentorLike {
  id: string;
  name: string;
  fieldSpecialization: string[];
  bio: string | null;
  organization: string | null;
}

/**
 * Scores a mentor against a student's career paths using tag-overlap heuristic.
 * Higher score = better match.
 */
export function scoreMentor(paths: CareerPath[], mentor: MentorLike): number {
  const tags = new Set(
    paths
      .flatMap((p) => [p.title, ...p.companies])
      .map((s) => s.toLowerCase())
  );

  return mentor.fieldSpecialization.filter((f) =>
    tags.has(f.toLowerCase())
  ).length;
}

/**
 * Returns top-N ranked mentors for a set of career paths.
 */
export function rankMentors(
  paths: CareerPath[],
  mentors: MentorLike[],
  topN = 3
): Array<{ mentor: MentorLike; score: number }> {
  return mentors
    .map((m) => ({ mentor: m, score: scoreMentor(paths, m) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
