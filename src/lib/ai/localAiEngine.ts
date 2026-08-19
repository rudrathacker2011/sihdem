/**
 * Local AI Career Intelligence Engine
 * Provides rich, context-aware career guidance without requiring an external API key.
 */

interface KnowledgeTopic {
  keywords: string[];
  response: (query: string, userContext?: any) => string;
}

const CAREER_KNOWLEDGE_BASE: KnowledgeTopic[] = [
  // ── PCM & Engineering ──
  {
    keywords: ["pcm", "engineering", "jee", "iit", "nit", "btech", "software", "cs", "computer science"],
    response: () => `### 🚀 Engineering & Tech Pathways for PCM Students in India

1. **Top Career Tracks:**
   - **Software Engineering & AI/ML:** Huge demand in India & globally. Entry salaries ₹8–25 LPA (product companies/startups).
   - **Data Science & Analytics:** Strong math/logic focus. Average ₹10–28 LPA.
   - **Robotics & IoT / Electronics:** Embedded systems, EV tech, semiconductor focus (India's chip initiative).
   - **Aerospace & Defense:** ISRO, DRDO, private aerospace startups (Skyroot, Agnikul).

2. **Key Entrance Exams:**
   - **JEE Main & Advanced:** For IITs, NITs, IIITs, GFTIs.
   - **BITSAT:** For BITS Pilani, Goa, Hyderabad.
   - **State CETs / Private:** MHT-CET, KCET, WBJEE, VITEEE, MET, COMEDK.

3. **Recommended Next Steps:**
   - Focus on Physics & Math fundamentals.
   - Start practicing coding (Python/C++) early.
   - Take the **Discovery Assessment** on Aptivate to check your exact Aptitude vs Interest fit!`,
  },

  // ── PCB & Medical / Healthcare ──
  {
    keywords: ["pcb", "medical", "neet", "doctor", "mbbs", "bds", "biotech", "pharmacy", "healthcare"],
    response: () => `### 🩺 Healthcare & Medical Pathways for PCB Students in India

1. **Top Career Tracks:**
   - **MBBS / Clinical Medicine:** 5.5 years + MD/MS specialization. High prestige and lifelong impact.
   - **Biotechnology & Bioinformatics:** Vaccine research, genomics, pharmaceutical tech.
   - **BDS & Dental Surgery:** Aesthetic dentistry, maxillofacial surgery.
   - **B.Pharm & Clinical Research:** Pharmaceutical production, drug trials.
   - **Allied Healthcare:** Radiology, Physiotherapy, Nursing, Healthcare Informatics.

2. **Key Entrance Exams:**
   - **NEET-UG:** Single gateway for MBBS, BDS, AYUSH across all medical colleges in India (including AIIMS & JIPMER).
   - **CUET-UG:** For B.Sc Biotechnology, Microbiology, Nutrition in central universities.

3. **Preparation Strategy:**
   - Master NCERT Biology line-by-line (85%+ questions directly sourced).
   - Daily Physics numerical practice (key score differentiator).`,
  },

  // ── Commerce & Finance / Management ──
  {
    keywords: ["commerce", "finance", "ca", "chartered", "cfa", "mba", "cat", "ipmat", "banking", "stock", "investment"],
    response: () => `### 💼 Commerce, Finance & Management Pathways

1. **Top Career Tracks:**
   - **Chartered Accountancy (CA):** ICAI foundation ➔ Inter ➔ Articleship ➔ Final. High ROI and corporate demand.
   - **Investment Banking & Equity Research:** CFA / Financial modeling. Entry ₹12–35 LPA.
   - **Management Consulting:** Strategic problem solving with top firms (Bain, BCG, McKinsey).
   - **Corporate Law / Fintech:** NLS, NLU pathways + financial tech compliance.

2. **Entrance Exams to Target:**
   - **IPMAT:** 5-Year Integrated BBA+MBA at IIM Indore, Rohtak, Ranchi, Bodh Gaya, Jammu (after 12th).
   - **CUET-UG:** For SRCC, Hindu College, St. Xavier's, Loyola for B.Com (Hons) and BMS.
   - **CAT / XAT (Post-Grad):** Gateway to top IIMs, XLRI, FMS Delhi.

3. **Action Items:**
   - Build strong command over Accountancy and Quantitative Aptitude.
   - Read financial news (Mint, Economic Times) daily to build commercial awareness.`,
  },

  // ── Arts, Humanities & Design ──
  {
    keywords: ["arts", "humanities", "design", "nid", "nift", "uceed", "upsc", "civil services", "ias", "journalism", "psychology", "law", "clat"],
    response: () => `### 🎨 Design, Law, Civil Services & Humanities Pathways

1. **Top Career Tracks:**
   - **UI/UX & Product Design:** High-paying tech design roles (₹8–24 LPA).
   - **Corporate & IP Law:** 5-Year Integrated B.A. LL.B from National Law Universities.
   - **Civil Services (UPSC IAS/IPS/IFS):** Administrative leadership and policy design.
   - **Applied Psychology & Cognitive Science:** Corporate HR, clinical therapy, AI behavioral research.

2. **Key Entrance Exams:**
   - **UCEED & NID DAT:** For IIT Bombay/Delhi Design, NID Ahmedabad.
   - **CLAT & AILET:** For NLSIU Bangalore, NALSAR Hyderabad, NLU Delhi.
   - **NIFT Entrance:** For fashion tech and lifestyle design.
   - **CUET-UG:** For top DU colleges (Miranda House, St. Stephen's, LSR).`,
  },

  // ── Study Strategy & Exams ──
  {
    keywords: ["prepare", "preparation", "strategy", "study", "timetable", "tips", "how to crack", "score"],
    response: () => `### 🎯 High-Yield Exam & Preparation Framework

1. **The 3-Phase Mastery Cycle:**
   - **Phase 1 (Concepts):** Clear theory using standard textbooks (NCERT first, then reference books).
   - **Phase 2 (PYQ Analysis):** Solve past 10 years' papers chapter-wise to identify recurring themes.
   - **Phase 3 (Full Mock Tests):** Simulate real exam timing (9 AM – 12 PM) and rigorously analyze every mistake.

2. **Time Management Formula:**
   - **Active Recall:** Testing yourself beats passive reading 3x.
   - **Spaced Repetition:** Review notes at 1 day, 3 days, 7 days, and 21 days.
   - **Formula/Concept Flashcards:** Keep daily revision sheets for quick 15-minute brushups.

3. Explore your **GPS Roadmap** tab in Aptivate for month-wise milestones!`,
  },

  // ── Top Colleges in India ──
  {
    keywords: ["colleges", "best college", "university", "institute", "nirf", "top 10"],
    response: () => `### 🏫 Top Higher Education Institutes in India

- **Engineering & Technology:** IIT Madras, IIT Delhi, IIT Bombay, IIT Kanpur, IIT Kharagpur, BITS Pilani, IIIT Hyderabad, NIT Trichy.
- **Management & Business:** IIM Ahmedabad, IIM Bangalore, IIM Calcutta, IIM Lucknow, FMS Delhi, XLRI Jamshedpur.
- **Medicine & Healthcare:** AIIMS New Delhi, CMC Vellore, PGIMER Chandigarh, JIPMER Puducherry, KGMU Lucknow.
- **Law:** NLSIU Bangalore, NLU Delhi, NALSAR Hyderabad, WBNUJS Kolkata.
- **Design & Creative:** NID Ahmedabad, IIT Bombay IDC, NIFT New Delhi.

*Tip: Check the **Career Explorer** on Aptivate to see college tier alignments for each specific career path.*`,
  },

  // ── Salaries & Market Demand ──
  {
    keywords: ["salary", "package", "highest paying", "lpa", "money", "demand", "scope"],
    response: () => `### 💰 High-Growth Career Salaries in India (2025–2030 Outlook)

1. **AI / ML & Cloud Architecture:** Entry: ₹12–25 LPA | Mid: ₹30–65 LPA
2. **Quantitative Finance & Algo Trading:** Entry: ₹25–60 LPA | Mid: ₹70 LPA – ₹1.5 Cr
3. **Product Management:** Entry: ₹14–24 LPA | Mid: ₹35–65 LPA
4. **Corporate M&A Law:** Entry: ₹15–22 LPA | Mid: ₹35–70 LPA
5. **Specialist Surgeons / Radiologists:** Entry: ₹15–28 LPA | Mid: ₹40–90 LPA

*Use the **1v1 Career Battle** feature on your dashboard to compare any two careers side-by-side!*`,
  },
];

/**
 * Generate a smart contextual local response
 */
export function getLocalAiResponse(userMessage: string, userContext?: any): string {
  const lower = userMessage.toLowerCase().trim();

  // Match against knowledge topics
  for (const topic of CAREER_KNOWLEDGE_BASE) {
    if (topic.keywords.some((kw) => lower.includes(kw))) {
      return topic.response(userMessage, userContext);
    }
  }

  // Personalized or General fallback
  if (lower.length < 5) {
    return "Hi there! 👋 How can I help you today? You can ask me about career options after 10th/12th, stream selection (PCM, PCB, Commerce, Arts), entrance exams (JEE, NEET, CAT, CUET), top colleges, or salary insights!";
  }

  return `### 💡 Career Guidance & Recommendations

Thanks for asking! Here are key insights tailored to your question:

1. **Core Career Strategy:**
   - In modern India, the best career matches combine your **Natural Aptitude (35%)**, **Core Interests (25%)**, and **Market Demand (40%)**.
   - Build T-shaped skills: have deep expertise in one primary discipline (e.g., Computer Science, Law, Finance) plus broad skills in communication and data literacy.

2. **Actionable Recommendations for You:**
   - **Take the Discovery Assessment:** Visit the **Assessment** tab to get your 8-dimensional psychometric score.
   - **Inspect the Compatibility Matrix:** Browse 60+ Indian career tracks with detailed entrance exams and college matches.
   - **Simulate Scenarios:** Try the **What-If Studio** to test different academic and skill outcomes live.

Ask me specific questions like:
- *"What are the best careers after 12th PCM?"*
- *"How do I prepare for JEE Mains?"*
- *"Compare Software Engineer vs Product Manager"*
- *"What are top high-paying commerce careers?"*`;
}
