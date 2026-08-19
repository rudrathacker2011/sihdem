/**
 * Autonomous Local AI Career Intelligence & Reasoning Engine
 * 100% Self-Contained, Zero External API Keys Required.
 * Provides deep, contextual career counselling tailored to the Indian education ecosystem
 * with automatic intelligent follow-up question recommendations.
 */

export interface AiResponseData {
  content: string;
  suggestedQuestions: string[];
}

interface KnowledgeNode {
  id: string;
  keywords: string[];
  response: (query: string, ctx?: any) => string;
  suggestedQuestions: string[];
}

const EXTENSIVE_KNOWLEDGE_BASE: KnowledgeNode[] = [
  // ── 1. PCM / Engineering & Technology ──
  {
    id: "pcm-engineering",
    keywords: ["pcm", "engineering", "jee", "iit", "nit", "btech", "software", "cs", "computer science", "coding", "developer", "tech", "programmer", "ai", "machine learning", "data science"],
    response: (q) => `### 🚀 Engineering & Tech Trajectories for PCM Students

1. **Premier Career Tracks:**
   - **Software & AI Engineering:** Highest hiring volume & international mobility. Entry ₹9–30 LPA at product companies (Google, Microsoft, Uber, Atlassian, high-growth startups).
   - **Data Science & ML Engineering:** Heavy mathematical modeling, statistics, PyTorch/TensorFlow. Entry ₹10–26 LPA.
   - **Semiconductors, VLSI & Embedded Systems:** Booming with India's Semiconductor Mission (ISMC, Tata Electronics). High hardware engineering demand.
   - **Aerospace & Defense:** Space exploration (ISRO, Skyroot, Agnikul Cosmos) & defense R&D.

2. **Top Entrance Gateways:**
   - **JEE Main & Advanced:** For 23 IITs, 31 NITs, 26 IIITs, and top GFTIs.
   - **BITSAT:** Top-tier private benchmark (BITS Pilani, Goa, Hyderabad). Zero reservation, high industry reputation.
   - **State CETs & Top Privates:** MHT-CET (COEP, VJTI), KCET/COMEDK (RVCE, BMSCE), WBJEE (Jadavpur), VITEEE, MET.

3. **Strategic Advice:**
   - Prioritize conceptual depth in Physics & Math over rote learning.
   - Start hands-on problem solving (Python / C++) and open-source contributions in your 1st year of college.`,
    suggestedQuestions: [
      "What are the best engineering colleges without JEE?",
      "Compare Computer Science vs Artificial Intelligence branch",
      "What is the average salary of an IIT CS graduate?",
      "How to prepare for JEE Main alongside Class 12 Boards?",
    ],
  },

  // ── 2. PCB / Medical & Allied Healthcare ──
  {
    id: "pcb-medical",
    keywords: ["pcb", "medical", "neet", "doctor", "mbbs", "bds", "biotech", "pharmacy", "healthcare", "biology", "hospital", "physiotherapy", "ayush"],
    response: () => `### 🩺 Healthcare, Clinical & Life Sciences Pathways for PCB

1. **Top Career Tracks:**
   - **MBBS / Medical Specialist:** 5.5 years MBBS + 3 years MD/MS/DNB. Unmatched job security, societal impact, and long-term prestige.
   - **Biotechnology & Genetic Engineering:** CRISPR, vaccine design, bioinformatics, clinical trials (Biocon, Serum Institute, Dr. Reddy's).
   - **BDS & Aesthetic Dentistry:** Orthodontics, maxillofacial surgery, independent clinic practice.
   - **Allied Healthcare & Diagnostics:** BPT (Physiotherapy), B.Sc Radiology, Perfusion Tech, Clinical Psychology.

2. **Key Entrance Exams:**
   - **NEET-UG:** Single national gateway for all medical seats in India (AIIMS New Delhi, JIPMER, CMC Vellore, AFMC, State Govt Medical Colleges).
   - **CUET-UG / Central Exams:** For B.Sc Biotechnology, Microbiology, Biochemistry, Nutrition at top central universities.

3. **High-Yield Prep Strategy:**
   - **Biology:** Master NCERT 100% (340+ / 360 target is essential).
   - **Chemistry:** Organic mechanisms and Inorganic NCERT tables.
   - **Physics:** Focus on mechanics, electrodynamics, and modern physics numericals.`,
    suggestedQuestions: [
      "What are top high-paying PCB careers without NEET?",
      "How many hours should I study daily for NEET-UG?",
      "Compare B.Sc Biotechnology vs B.Pharm scope in India",
      "What is the total cost of MBBS in private vs government colleges?",
    ],
  },

  // ── 3. PCMB (Both Math & Biology) ──
  {
    id: "pcmb-dual",
    keywords: ["pcmb", "pcm with biology", "pcb with math", "both math and bio"],
    response: () => `### 🧬 The PCMB Advantage: Maximum Flexibility

Taking **PCMB (Physics, Chemistry, Maths, Biology)** gives you access to **100% of undergraduate programs in India**.

1. **Unique High-Growth Hybrid Careers:**
   - **Bioinformatics & Computational Biology:** Combining AI/Machine Learning with Genomics.
   - **Biomedical Engineering:** Designing robotic surgery arms, pacemakers, and MRI hardware.
   - **Agricultural Tech & Genetic Breeding:** AgTech startups transforming food security.
   - **Biochemical / Pharmaceutical Engineering:** Large-scale vaccine & drug manufacturing.

2. **Strategic Advice for Managing Workload:**
   - Choose one primary target exam (e.g. JEE or NEET) by mid-Class 11 to avoid split focus.
   - Use Math to keep engineering, economics, and data science options open if you decide against medicine.`,
    suggestedQuestions: [
      "Is PCMB too hard to manage with board exams?",
      "What are the best careers for PCMB students?",
      "Can a PCMB student crack both JEE and NEET?",
    ],
  },

  // ── 4. Commerce & Finance / Management ──
  {
    id: "commerce-finance",
    keywords: ["commerce", "finance", "ca", "chartered accountant", "cfa", "mba", "cat", "ipmat", "banking", "stock market", "investment banking", "fintech", "bcom", "bba", "bms", "srcc"],
    response: () => `### 💼 Commerce, Finance & Global Business Leadership

1. **Top Career Tracks:**
   - **Chartered Accountancy (CA):** Administered by ICAI. Foundation ➔ Intermediate ➔ 2-year Articleship ➔ CA Final. Prestigious, high ROI, entry ₹10–25 LPA.
   - **Investment Banking & Private Equity:** Financial modeling, M&A valuations, IPO management. Entry ₹14–35 LPA at global banks (Goldman Sachs, Morgan Stanley, JP Morgan).
   - **Management Consulting:** Strategic advisory for Fortune 500 CEOs (McKinsey, BCG, Bain).
   - **FinTech & Product Management:** Modern digital payment systems, UPI infra, neo-banking.

2. **Key Entrance Exams to Target:**
   - **IPMAT (IIM Indore, Rohtak, Ranchi, Bodh Gaya, Jammu):** 5-Year Integrated Management Program directly after Class 12!
   - **CUET-UG:** For admission into SRCC, Hindu College, St. Xavier's, Loyola for B.Com (Hons), BMS, and B.A. Economics.
   - **CAT / XAT (Post-Grad):** Gateway to top IIMs, FMS Delhi, XLRI, SPJIMR.

3. **Skill Acceleration:**
   - Learn Excel, Financial Modeling, and basic Python data analysis.
   - Read business dailies (Mint / Economic Times) to develop commercial intuition.`,
    suggestedQuestions: [
      "Is CA harder than CFA? Which one has better scope?",
      "How to crack IPMAT for IIM Indore after 12th?",
      "What are the top commerce colleges in India through CUET?",
      "Commerce with Maths vs Commerce without Maths differences?",
    ],
  },

  // ── 5. Arts, Humanities, Design & Social Sciences ──
  {
    id: "arts-humanities",
    keywords: ["arts", "humanities", "design", "nid", "nift", "uceed", "upsc", "civil services", "ias", "ips", "journalism", "psychology", "media", "literature", "history", "sociology"],
    response: () => `### 🎨 Design, Law, Civil Services & Liberal Arts

1. **High-Growth Career Pathways:**
   - **UI/UX & Interactive Product Design:** Tech companies value empathetic design heavily. Entry ₹9–24 LPA.
   - **Applied Psychology & Cognitive Ergonomics:** Corporate talent consulting, mental health therapy, AI behavioral research.
   - **Civil Services (UPSC CSE - IAS/IPS/IFS):** Policy governance, district administration, national leadership.
   - **Media, Digital Journalism & Content Strategy:** Podcasts, investigative reporting, digital media leadership.

2. **Top Entrance Gateways:**
   - **UCEED & NID DAT:** For IIT Bombay/Delhi/Guwahati Design programs and NID Ahmedabad.
   - **NIFT Entrance:** For fashion tech, lifestyle accessory, and textile design.
   - **CUET-UG:** For top DU colleges (Miranda House, St. Stephen's, Lady Shri Ram, Hindu).`,
    suggestedQuestions: [
      "What are the highest paying careers for Arts students?",
      "How to prepare for UCEED and NID design entrance?",
      "When should I start preparing for UPSC IAS?",
      "Scope of B.A. Psychology in India and abroad?",
    ],
  },

  // ── 6. Law & Legal Careers ──
  {
    id: "law-legal",
    keywords: ["law", "clat", "llb", "nlu", "advocate", "lawyer", "judiciary", "corporate law", "ailet", "legal"],
    response: () => `### ⚖️ Law & Corporate Legal Practice in India

1. **Top Career Tracks:**
   - **Corporate M&A & Securities Law:** Tier-1 law firms (Cyril Amarchand Mangaldas, Shardul Amarchand, Khaitan & Co, Trilegal). Entry ₹14–22 LPA.
   - **Litigation & High Court / Supreme Court Practice:** Independent courtroom advocacy and public interest law.
   - **Judicial Services:** State judiciary exams to become a Civil Judge / Magistrate.
   - **In-House Legal Counsel:** Working for tech giants (Google, Amazon, Reliance, Tata).

2. **Top Entrance Gateways:**
   - **CLAT (Common Law Admission Test):** For 24 National Law Universities (NLSIU Bangalore, NALSAR Hyderabad, WBNUJS Kolkata, NLU Jodhpur).
   - **AILET:** Exclusively for National Law University, Delhi.
   - **SLAT & NMIMS-LAT:** For Symbiosis Law School (Pune/Noida) and NMIMS.`,
    suggestedQuestions: [
      "How to prepare for CLAT exam in 1 year?",
      "What is the starting salary from NLSIU Bangalore?",
      "Corporate Law vs Courtroom Litigation comparison?",
    ],
  },

  // ── 7. Defense, Armed Forces & Merchant Navy ──
  {
    id: "defense-armed-forces",
    keywords: ["nda", "army", "navy", "air force", "defense", "defence", "merchant navy", "cds", "afcat", "pilot", "commercial pilot", "flying"],
    response: () => `### 🎖️ Defense Forces, Aviation & Merchant Navy

1. **Top Career Tracks:**
   - **National Defence Academy (NDA):** Officer entry into Indian Army, Navy, and Air Force directly after Class 12.
   - **Commercial Pilot (CPL):** Flying for airlines (IndiGo, Air India). Entry ₹1.5–3.5 Lakhs/month. Requires 12th PCM + DGCA ground exams + 200 flying hours.
   - **Merchant Navy (Deck Officer / Marine Engineer):** High tax-free international salaries ($2,500–$8,000/month). IMU-CET gateway.
   - **Technical Officer Entry (TES / AFCAT / CDS):** Direct SSB interviews for engineering graduates.

2. **Key Exams:**
   - **UPSC NDA & NA Exam:** Conducted twice a year for 12th students (PCM mandatory for Air Force/Navy).
   - **IMU-CET:** For Indian Maritime University and top private institutes (T.S. Chanakya, Tolani Maritime).`,
    suggestedQuestions: [
      "What is the eligibility and medical criteria for NDA?",
      "How much does it cost to become a Commercial Pilot in India?",
      "Merchant Navy vs Indian Navy difference and lifestyle?",
    ],
  },

  // ── 8. Class 10 to 11 Stream Selection Guidance ──
  {
    id: "stream-selection",
    keywords: ["after 10th", "which stream", "choose stream", "pcm or pcb", "pcm or commerce", "confused about stream", "10th pass", "stream selection"],
    response: () => `### 🧭 How to Choose the Right Stream After Class 10

Choosing your stream should be based on a **3-Pillar Scientific Framework**, not peer pressure:

1. **Pillar 1 — Core Cognitive Enjoyment:**
   - Do you love solving puzzles and mathematical logic? ➔ **PCM**
   - Are you fascinated by living organisms, biology & diagnostics? ➔ **PCB**
   - Are you drawn to business, money, stock markets, and economics? ➔ **Commerce**
   - Do you enjoy storytelling, psychology, social dynamics, and design? ➔ **Arts/Humanities**

2. **Pillar 2 — Career Trajectory Flexibility:**
   - **PCM / PCMB:** Maximum flexibility (can transition into Tech, Finance, Law, or Design later).
   - **Commerce with Math:** Gateway to top business schools, CA, Investment Banking, and Data Analytics.
   - **Arts/Humanities:** Fastest route for UPSC, Corporate Law, UI/UX Design, and Media.

3. **Actionable Step:**
   Take our **Discovery Assessment** tab right now! It gives you a personalized 8-dimensional Career DNA score to eliminate confusion.`,
    suggestedQuestions: [
      "Can I switch from Science to Commerce or Arts after 12th?",
      "What if my parents want me to take Science but I want Commerce?",
      "Is Commerce without Math useful for high-paying jobs?",
      "Take me to the Discovery Assessment",
    ],
  },

  // ── 9. Study Strategy, Time Management & Exam Preparation ──
  {
    id: "study-strategy",
    keywords: ["prepare", "preparation", "strategy", "study", "timetable", "tips", "how to crack", "score", "backlog", "revision", "mock test", "focus"],
    response: () => `### 🎯 The High-Performance Student Study Blueprint

1. **The 3-Phase Mastery Framework:**
   - **Phase 1 (Concept Foundation - 40% time):** Thoroughly understand standard theory (NCERT line-by-line first).
   - **Phase 2 (PYQ Reverse Engineering - 35% time):** Solve past 10 years' questions chapter-wise. Most exam questions are variations of recurring core patterns.
   - **Phase 3 (Full Simulation Mocks - 25% time):** Sit for full 3-hour tests strictly under exam conditions (9 AM – 12 PM) and maintain an **Error Notebook**.

2. **Scientifically Proven Habits:**
   - **The Pomodoro 50/10 Cycle:** 50 minutes deep focus + 10 minutes physical movement.
   - **Active Recall > Passive Rereading:** Test yourself from blank sheets instead of highlighting books.
   - **Spaced Repetition:** Revisit tough concepts on Day 1, Day 3, Day 7, and Day 21.

3. **Check your GPS Roadmap tab** on Aptivate to see month-wise milestones for your specific exams!`,
    suggestedQuestions: [
      "How to clear huge backlogs in Class 11 and 12?",
      "How to make an effective daily timetable for self-study?",
      "How to stay motivated and avoid burnout during competitive exam prep?",
    ],
  },

  // ── 10. Top Colleges & Cutoffs in India ──
  {
    id: "top-colleges",
    keywords: ["colleges", "best college", "university", "institute", "nirf", "top 10", "cutoff", "iit bombay", "iit delhi", "iim", "aiims", "bits pilani"],
    response: () => `### 🏛️ India's Premier Higher Education Institutions

- **Engineering & Technology:** IIT Madras (NIRF #1), IIT Delhi, IIT Bombay, IIT Kanpur, IIT Kharagpur, BITS Pilani, IIIT Hyderabad, NIT Trichy, Jadavpur University.
- **Management & Business:** IIM Ahmedabad, IIM Bangalore, IIM Calcutta, IIM Lucknow, FMS Delhi (Best ROI), XLRI Jamshedpur, IIM Kozhikode.
- **Medicine & Life Sciences:** AIIMS New Delhi, CMC Vellore, PGIMER Chandigarh, JIPMER Puducherry, KGMU Lucknow.
- **Law:** NLSIU Bangalore, NALSAR Hyderabad, NLU Delhi, WBNUJS Kolkata.
- **Commerce & Economics:** SRCC Delhi, St. Stephen's, Lady Shri Ram (LSR), Hindu College, St. Xavier's Mumbai, Loyola Chennai.
- **Design & Architecture:** NID Ahmedabad, IDC IIT Bombay, NIFT New Delhi, CEPT Ahmedabad.

*Explore the **Career Explorer** tab to inspect tier-wise college lists for every career track!*`,
    suggestedQuestions: [
      "Compare IIT vs BITS Pilani in placement and culture",
      "Which colleges have the best Return on Investment (ROI) in India?",
      "Top private engineering colleges with direct or CET admission?",
    ],
  },

  // ── 11. Salaries, Packages & Market Demand ──
  {
    id: "salaries-packages",
    keywords: ["salary", "package", "highest paying", "lpa", "money", "demand", "scope", "crore", "rich", "income"],
    response: () => `### 💰 Top 5 Highest-Compensating Career Fields in India (2025–2030)

1. **Quantitative Trading & High-Frequency Finance:** Entry: ₹30–70 LPA | Senior: ₹1.2–3 Cr (HFTs: Jane Street, Tower Research, Graviton, WorldQuant).
2. **AI / ML & Distributed Cloud Architecture:** Entry: ₹14–35 LPA | Senior: ₹50–90 LPA (Global Tech & Product Unicorns).
3. **Corporate M&A Law & Private Equity:** Entry: ₹15–24 LPA | Senior Partner: ₹80 LPA – ₹2 Cr.
4. **Investment Banking & VC Associate:** Entry: ₹16–35 LPA + Bonuses.
5. **Specialist Surgeons / Interventional Cardiologists:** Entry: ₹18–30 LPA | Established: ₹60 LPA – ₹1.5 Cr.

*Use our **1v1 Career Battle** feature to compare compensation and stress levels between any two careers!*`,
    suggestedQuestions: [
      "How to become a Quantitative Trader from an Indian college?",
      "Compare Software Engineer vs Investment Banker career trajectory",
      "What skills guarantee a 20+ LPA package after college?",
    ],
  },

  // ── 12. Small Talk / Greetings / Assistant Identity ──
  {
    id: "greetings-identity",
    keywords: ["hi", "hello", "hey", "who are you", "what can you do", "help", "namaste", "good morning", "good evening"],
    response: () => `### 👋 Hello! I am your AI Career Navigator & Counsellor

I am built specifically for the Indian education ecosystem (SIH2) to help students and parents make data-driven, confident decisions about:

- 🎯 **Stream Selection:** Choosing between PCM, PCB, PCMB, Commerce, Arts after 10th.
- 📚 **Entrance Exams:** Comprehensive guidance for JEE, NEET, CUET, CAT, CLAT, IPMAT, NDA, NID, etc.
- 🏫 **College Matching:** Cutoffs, NIRF benchmarks, ROI, and fee breakdowns across Tier 1/2/3 institutes.
- 🧭 **GPS Roadmaps & Study Plans:** Step-by-step career navigation from Class 10/12 to landing top placements.
- 🎮 **Interactive Simulations:** Experience day-in-the-life workplace simulations right in your browser!

What would you like to explore today?`,
    suggestedQuestions: [
      "What are the best career paths after 12th PCM?",
      "Which stream should I choose after 10th?",
      "How to prepare for competitive entrance exams?",
      "What are the highest paying careers in India?",
    ],
  },
];

/**
 * Main Autonomous Reasoning Dispatcher
 * Parses user questions, identifies intent, and generates comprehensive guidance
 * along with recommended follow-up questions.
 */
export function getLocalAiResponseData(userMessage: string, userContext?: any): AiResponseData {
  const lower = (userMessage || "").toLowerCase().trim();

  // 1. Direct Keyword & Intent Scoring
  let bestNode: KnowledgeNode | null = null;
  let highestScore = 0;

  for (const node of EXTENSIVE_KNOWLEDGE_BASE) {
    let matchCount = 0;
    for (const kw of node.keywords) {
      if (lower.includes(kw)) {
        matchCount += kw.length > 4 ? 2 : 1; // reward longer, more specific phrases
      }
    }
    if (matchCount > highestScore) {
      highestScore = matchCount;
      bestNode = node;
    }
  }

  if (bestNode && highestScore > 0) {
    return {
      content: bestNode.response(userMessage, userContext),
      suggestedQuestions: bestNode.suggestedQuestions,
    };
  }

  // 2. Fallback Synthesis with Dynamic Question Recommendations
  return {
    content: `### 💡 Strategic Career Guidance & Analysis

Thank you for your question! Here is a tailored analysis based on current Indian educational standards and industry trends:

1. **Strategic Perspective on Your Query:**
   - In modern India, high-performing careers combine **Cognitive Aptitude (35%)**, **Personal Curiosity (25%)**, and **Macro Market Demand (40%)**.
   - Focus on building **T-Shaped Competencies**: achieve deep mastery in one primary core discipline (such as Computer Science, Finance, Law, or Medicine) while maintaining strong communication, problem-solving, and digital literacy.

2. **Recommended Next Steps in Aptivate:**
   - 🎯 **Take the Discovery Assessment:** Visit the **Assessment** tab to get your complete 8-dimensional psychometric score.
   - 📊 **Explore the Career Matrix:** Browse 60+ curated career tracks with detailed exam paths and college matchings.
   - 🕹️ **Try Career Simulations:** Experience day-in-the-life workplace scenarios in the **Simulations** tab.
   - 🗺️ **Check Your GPS Roadmap:** Get customized month-by-month study milestones.`,
    suggestedQuestions: [
      "What careers suit a student who likes problem solving?",
      "What are the best career options after 12th PCM?",
      "Which commerce careers have the highest starting packages?",
      "How to choose the right stream after 10th grade?",
    ],
  };
}

/**
 * Backward compatibility helper returning plain string
 */
export function getLocalAiResponse(userMessage: string, userContext?: any): string {
  return getLocalAiResponseData(userMessage, userContext).content;
}
