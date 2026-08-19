import "dotenv/config";

// Allow Supabase pooler TLS certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, SubscriptionTier, MatchType } from "@prisma/client";

const rawUrl = process.env.DIRECT_URL || process.env.DATABASE_URL || "";
const cleanUrl = rawUrl.split("?")[0];

const pool = new Pool({
  connectionString: cleanUrl,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting complete database seed with pre-defined users, mentors, and assessments...");

  // 1. Clean existing records in dependency order
  await prisma.chatMessage.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.careerPath.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.mentorAssignment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.mentor.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned old application test data");

  // 2. Ensure pgcrypto extension
  await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

  // 3. Create 6 Pre-defined Mentors
  const mentors = await Promise.all([
    prisma.mentor.create({
      data: {
        name: "Dr. Priya Sharma",
        organization: "Google India",
        fieldSpecialization: ["Software Engineering", "AI/ML", "Python", "Data Science"],
        bio: "Senior Staff AI Engineer at Google India. IIT Bombay alumnus (B.Tech CS 2014). Mentored 120+ students on cracking top tech roles and JEE Advanced.",
      },
    }),
    prisma.mentor.create({
      data: {
        name: "Rohit Verma",
        organization: "Goldman Sachs Mumbai",
        fieldSpecialization: ["Finance", "Investment Banking", "CA", "Commerce", "MBA"],
        bio: "Vice President, Quantitative Trading. CA All India Rank 12 & CFA charterholder. Expert on commerce streams, top B-schools (IIM A/B/C), and fintech careers.",
      },
    }),
    prisma.mentor.create({
      data: {
        name: "Dr. Anita Gupta",
        organization: "AIIMS Delhi",
        fieldSpecialization: ["Medicine", "MBBS", "NEET", "Healthcare", "Biology"],
        bio: "Associate Professor of Cardiology, AIIMS New Delhi. Guides NEET toppers and undergraduate medical researchers.",
      },
    }),
    prisma.mentor.create({
      data: {
        name: "Arjun Mehta (IAS)",
        organization: "Ministry of Electronics & IT, GoI",
        fieldSpecialization: ["Civil Services", "UPSC", "Public Policy", "Law", "Governance"],
        bio: "IAS Officer (2018 Batch). AIR 28 in UPSC CSE. Guides aspirants through optional subjects, essay strategy, and interview preparation.",
      },
    }),
    prisma.mentor.create({
      data: {
        name: "Kavya Nair",
        organization: "Studio Nair Design & Architecture",
        fieldSpecialization: ["Design", "Architecture", "UX Design", "NID", "NATA"],
        bio: "Principal Architect & National Design Awardee. NID Ahmedabad & CEPT University alumna. Helps students build design portfolios for NID, UCEED & NATA.",
      },
    }),
    prisma.mentor.create({
      data: {
        name: "Vikram Singh",
        organization: "Tata Motors EV Division",
        fieldSpecialization: ["Engineering", "Mechanical", "Electric Vehicles", "IIT", "Robotics"],
        bio: "Chief Systems Architect for EV Platforms. IIT Delhi (B.Tech Mech 2012). Guides students in core engineering and EV/Robotics career paths.",
      },
    }),
  ]);

  console.log(`✅ Created ${mentors.length} mentors`);

  // 4. Create Pre-defined Supabase Auth Users directly in auth.users
  const authAccounts = [
    {
      id: "a0000000-0000-0000-0000-000000000001",
      email: "admin@test.com",
      password: "password123",
      role: Role.ADMIN,
      tier: SubscriptionTier.PREMIUM,
      name: "Admin User",
    },
    {
      id: "a0000000-0000-0000-0000-000000000002",
      email: "student@test.com",
      password: "password123",
      role: Role.STUDENT,
      tier: SubscriptionTier.FREE,
      name: "Arjun Patel",
    },
    {
      id: "a0000000-0000-0000-0000-000000000003",
      email: "student2@test.com",
      password: "password123",
      role: Role.STUDENT,
      tier: SubscriptionTier.FREE,
      name: "Pooja Sharma",
    },
  ];

  for (const acc of authAccounts) {
    await pool.query(`DELETE FROM auth.identities WHERE email = $1`, [acc.email]);
    await pool.query(`DELETE FROM auth.users WHERE email = $1`, [acc.email]);

    const appMeta = JSON.stringify({ provider: "email", providers: ["email"] });
    const userMeta = JSON.stringify({
      sub: acc.id,
      email: acc.email,
      role: acc.role,
      full_name: acc.name,
      email_verified: true,
      phone_verified: false,
    });
    const idData = JSON.stringify({
      sub: acc.id,
      email: acc.email,
      email_verified: true,
      phone_verified: false,
    });

    await pool.query(
      `
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at,
        phone_change,
        phone_change_token,
        email_change,
        email_change_token_new,
        email_change_token_current,
        email_change_confirm_status,
        confirmation_token,
        recovery_token,
        reauthentication_token,
        is_sso_user,
        is_anonymous
      ) VALUES (
        '00000000-0000-0000-0000-000000000000'::uuid,
        $1::uuid,
        'authenticated',
        'authenticated',
        $2,
        crypt($3, gen_salt('bf', 10)),
        NOW(),
        NOW(),
        $4::jsonb,
        $5::jsonb,
        false,
        NOW(),
        NOW(),
        null,
        null,
        '',
        '',
        '',
        '',
        '',
        0,
        '',
        '',
        '',
        false,
        false
      );
    `,
      [acc.id, acc.email, acc.password, appMeta, userMeta]
    );

    await pool.query(
      `
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        $1::uuid,
        $2::jsonb,
        'email',
        $1,
        NOW(),
        NOW(),
        NOW()
      );
    `,
      [acc.id, idData]
    );
  }

  // 5. Create Prisma User records
  const admin = await prisma.user.create({
    data: {
      supabaseId: authAccounts[0].id,
      email: authAccounts[0].email,
      name: authAccounts[0].name,
      role: Role.ADMIN,
      subscriptionTier: SubscriptionTier.PREMIUM,
      aiTokensUsed: 0,
      aiTokensLimit: 9999,
    },
  });
  console.log(`✅ Created Admin User: ${admin.email} (Role: ADMIN)`);

  const student = await prisma.user.create({
    data: {
      supabaseId: authAccounts[1].id,
      email: authAccounts[1].email,
      name: authAccounts[1].name,
      role: Role.STUDENT,
      subscriptionTier: SubscriptionTier.FREE,
      aiTokensUsed: 2,
      aiTokensLimit: 50,
    },
  });
  console.log(`✅ Created Student User: ${student.email} (Role: STUDENT)`);

  const student2 = await prisma.user.create({
    data: {
      supabaseId: authAccounts[2].id,
      email: authAccounts[2].email,
      name: authAccounts[2].name,
      role: Role.STUDENT,
      subscriptionTier: SubscriptionTier.FREE,
      aiTokensUsed: 0,
      aiTokensLimit: 50,
    },
  });
  console.log(`✅ Created Fresh Student User: ${student2.email} (Pending assessment)`);

  // 6. Create Assessment for Student
  const assessment = await prisma.assessment.create({
    data: {
      userId: student.id,
      education: "12th - Science (PCM)",
      stream: "Science - Physics, Chemistry, Maths (PCM)",
      skills: ["Mathematics", "Physics", "Programming/Coding", "Problem Solving"],
      interests: ["Technology & Computers", "Engineering", "Science & Research"],
      personality: "Analytical - I love solving complex problems",
      goals: "I want to build software products and AI systems, study at a top IIT, and work at a cutting-edge tech startup or research lab in India.",
      recommendation: {
        summary: "Based on your strong foundation in PCM, analytical mindset, and passion for programming, you are primed for high-growth technical careers in the Indian tech ecosystem. Below are 3 curated paths with target exams and matched universities.",
      },
    },
  });

  // 7. Create Detailed Career Paths
  await prisma.careerPath.createMany({
    data: [
      {
        assessmentId: assessment.id,
        title: "Artificial Intelligence & Machine Learning Engineer",
        description: "Design, train, and deploy next-generation AI models for large-scale enterprise and consumer applications in India.",
        steps: [
          { order: 1, title: "Ace 12th Board Exams (90%+ in PCM)", description: "Build deep fundamentals in Calculus, Linear Algebra, and Mechanics." },
          { order: 2, title: "Target JEE Advanced / BITSAT", description: "Aim for Top 1,000 AIR for CSE/AI branches at top IITs or BITS Pilani." },
          { order: 3, title: "Undergraduate (B.Tech in CS / AI)", description: "Master Data Structures, Deep Learning frameworks (PyTorch), and open-source contributions." },
          { order: 4, title: "Industry Internships & Research", description: "Publish research at conferences or intern with top AI research groups." },
        ],
        recommendedExams: ["JEE Main", "JEE Advanced"],
        alternateExams: ["BITSAT", "VITEEE", "UGEE (IIIT Hyderabad)"],
        universities: [
          { name: "IIT Bombay", courses: ["B.Tech Computer Science and Engineering"] },
          { name: "IIIT Hyderabad", courses: ["B.Tech CSE with AI Specialization"] },
          { name: "BITS Pilani", courses: ["B.E. Computer Science"] },
        ],
        competitionLevel: "Very High",
        futureDemand: "High Growth",
        companies: ["Google India", "Microsoft Research", "NVIDIA Bangalore", "Flipkart AI Labs", "Sarvam AI"],
      },
      {
        assessmentId: assessment.id,
        title: "Full Stack & Cloud Systems Architect",
        description: "Architect distributed, resilient web services and mobile backends powering India's multi-million user digital platforms.",
        steps: [
          { order: 1, title: "Focus on Competitive Programming", description: "Solve algorithmic challenges on LeetCode and Codeforces." },
          { order: 2, title: "Clear National Engineering Entrances", description: "Secure admission into top NITs or top state universities." },
          { order: 3, title: "Master Modern Cloud Stacks", description: "Build hands-on expertise with Next.js, Go/Node, PostgreSQL, Docker, and AWS." },
          { order: 4, title: "Product Company Placements", description: "Target Tier-1 tech company recruitment drives or launch startup products." },
        ],
        recommendedExams: ["JEE Main", "MHT CET", "COMEDK"],
        alternateExams: ["WBJEE", "SRMJEEE", "MET (Manipal)"],
        universities: [
          { name: "NIT Trichy", courses: ["B.Tech Information Technology"] },
          { name: "NIT Surathkal", courses: ["B.Tech Computer Engineering"] },
          { name: "DTU Delhi", courses: ["B.Tech Software Engineering"] },
        ],
        competitionLevel: "High",
        futureDemand: "High Growth",
        companies: ["Zomato", "Swiggy", "Razorpay", "PhonePe", "Amazon India"],
      },
      {
        assessmentId: assessment.id,
        title: "Quantitative Analyst & Financial Engineer",
        description: "Apply advanced mathematical models, statistics, and algorithmic trading strategies for high-frequency trading and investment funds.",
        steps: [
          { order: 1, title: "Excellence in Mathematics Olympiad & JEE", description: "Focus on Probability Theory, Statistics, and Stochastic Calculus." },
          { order: 2, title: "B.Tech / B.Stat / B.Math", description: "Pursue Mathematics & Computing at IITs or B.Stat at Indian Statistical Institute." },
          { order: 3, title: "Algorithmic Trading & Finance Skills", description: "Learn C++ for low-latency systems and financial econometrics." },
        ],
        recommendedExams: ["JEE Advanced (Maths & Computing)", "ISI Admission Test"],
        alternateExams: ["CMI Entrance Exam", "CUET (Statistics)"],
        universities: [
          { name: "IIT Delhi", courses: ["B.Tech Mathematics and Computing"] },
          { name: "Indian Statistical Institute (ISI) Kolkata", courses: ["Bachelor of Statistics (Honours)"] },
          { name: "IIT Kanpur", courses: ["BS Mathematics and Scientific Computing"] },
        ],
        competitionLevel: "Very High",
        futureDemand: "Growing",
        companies: ["Tower Research Capital", "Graviton Research", "Goldman Sachs", "DE Shaw", "Morgan Stanley"],
      },
    ],
  });

  console.log(`✅ Created Assessment and 3 Career Paths for ${student.name}`);

  // 8. Assign Mentor to Student (Dr. Priya Sharma from Google)
  await prisma.mentorAssignment.create({
    data: {
      studentId: student.id,
      mentorId: mentors[0].id, // Dr. Priya Sharma
      matchType: MatchType.AUTO,
    },
  });
  console.log(`✅ Assigned Mentor "${mentors[0].name}" to "${student.name}" (AUTO match)`);

  // 9. Create a Chat Session with Initial Conversation
  const chatSession = await prisma.chatSession.create({
    data: {
      userId: student.id,
      mode: "personalized",
    },
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        sessionId: chatSession.id,
        role: "assistant",
        content: "Hello Arjun! 👋 I've reviewed your assessment for Science (PCM). You have great potential for AI/ML Engineering, Full Stack Systems, and Quantitative Finance. How can I help you navigate your JEE preparation and college targets today?",
      },
      {
        sessionId: chatSession.id,
        role: "user",
        content: "What rank in JEE Advanced do I need for Mathematics & Computing at IIT Delhi?",
      },
      {
        sessionId: chatSession.id,
        role: "assistant",
        content: "For IIT Delhi's Mathematics and Computing (MnC) branch, you typically need an All India Rank (AIR) within the top 300-350 in JEE Advanced (General category). It is one of the most sought-after programs alongside Computer Science, especially for careers in High-Frequency Trading (HFT) and AI Research!",
      },
    ],
  });
  console.log(`✅ Created Personalized Chat History for ${student.name}`);

  // 10. Create Sample Payments for Admin Revenue Dashboard
  await prisma.payment.createMany({
    data: [
      {
        userId: student.id,
        razorpayOrderId: "order_test_99812",
        amount: 99900, // ₹999
        currency: "INR",
        status: "paid",
      },
      {
        userId: admin.id,
        razorpayOrderId: "order_test_99813",
        amount: 99900, // ₹999
        currency: "INR",
        status: "paid",
      },
    ],
  });
  console.log(`✅ Created Sample Payment records for Revenue Analytics`);

  console.log("\n========================================================");
  console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("========================================================");
  console.log("📌 Pre-defined Test Users ready for instant Sign In:");
  console.log("   1. Admin:    admin@test.com    (Password: password123)");
  console.log("   2. Student:  student@test.com  (Password: password123)");
  console.log("   3. Student2: student2@test.com (Password: password123)");
  console.log("========================================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
