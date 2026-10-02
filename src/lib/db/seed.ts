/**
 * Seed script — populates the database with demo data so the site isn't
 * empty on first run. Safe to re-run: it skips creating rows that already
 * exist (matched by email / slug).
 *
 * Usage: npm run db:seed
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "./index";
import {
  certificates,
  coachingBookings,
  companies,
  courses,
  enrollments,
  jobs,
  lessonProgress,
  lessons,
  modules,
  users,
} from "./schema";
import { COURSE_IMAGES } from "../images";
import { generateCertificateNumber, slugify } from "../utils";

const DEMO_PASSWORD = "Password123!";

async function upsertUser(input: {
  name: string;
  email: string;
  role: "learner" | "instructor" | "company_admin" | "admin";
  companyId?: string | null;
}) {
  const email = input.email.toLowerCase();
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) return existing;

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const [user] = await db
    .insert(users)
    .values({
      name: input.name,
      email,
      passwordHash,
      role: input.role,
      companyId: input.companyId ?? null,
    })
    .returning();
  return user;
}

async function upsertCourse(input: {
  title: string;
  summary: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  durationWeeks: number;
  priceNaira: number;
  isFree?: boolean;
  thumbnailUrl?: string;
  instructorId: string;
  modules: { title: string; lessons: Omit<typeof lessons.$inferInsert, "moduleId" | "id">[] }[];
}) {
  const slug = slugify(input.title);
  const [existing] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  if (existing) {
    if (!existing.thumbnailUrl && input.thumbnailUrl) {
      await db.update(courses).set({ thumbnailUrl: input.thumbnailUrl }).where(eq(courses.id, existing.id));
    }
    return existing;
  }

  const [course] = await db
    .insert(courses)
    .values({
      slug,
      title: input.title,
      summary: input.summary,
      description: input.description,
      category: input.category,
      level: input.level,
      durationWeeks: input.durationWeeks,
      priceNaira: input.isFree ? 0 : input.priceNaira,
      isFree: !!input.isFree,
      thumbnailUrl: input.thumbnailUrl ?? null,
      instructorId: input.instructorId,
      published: true,
    })
    .returning();

  for (const [mi, mod] of input.modules.entries()) {
    const [insertedModule] = await db
      .insert(modules)
      .values({ courseId: course.id, title: mod.title, position: mi })
      .returning();

    for (const [li, lesson] of mod.lessons.entries()) {
      await db.insert(lessons).values({ ...lesson, moduleId: insertedModule.id, position: li });
    }
  }

  return course;
}

async function main() {
  console.log("Seeding database...");

  const admin = await upsertUser({
    name: "Amplify Admin",
    email: "admin@amplifydigitaltech.com",
    role: "admin",
  });

  const instructor = await upsertUser({
    name: "Tunde Bakare",
    email: "instructor@amplifydigitaltech.com",
    role: "instructor",
  });

  const course1 = await upsertCourse({
    title: "Hybrid Coding & Programming School",
    thumbnailUrl: COURSE_IMAGES.coding,
    summary: "Learn to code with hands-on projects and real-world applications.",
    category: "Coding & Programming",
    level: "beginner",
    durationWeeks: 12,
    priceNaira: 75000,
    instructorId: instructor.id,
    description:
      "A practical, project-based introduction to modern web development. You'll learn HTML, CSS, JavaScript and Git, then build and deploy your own portfolio project.",
    modules: [
      {
        title: "Foundations of Programming",
        lessons: [
          {
            title: "HTML & CSS Basics",
            type: "video",
            content: "An introduction to structuring and styling web pages.",
            durationMinutes: 40,
          },
          {
            title: "JavaScript Fundamentals",
            type: "video",
            content: "Variables, functions, loops and DOM manipulation.",
            durationMinutes: 50,
          },
          {
            title: "Version Control with Git",
            type: "reading",
            content: "Why we use Git, and the essential commands you'll use every day.",
            durationMinutes: 25,
          },
        ],
      },
      {
        title: "Build Your First Project",
        lessons: [
          {
            title: "Plan your portfolio site",
            type: "reading",
            content: "Sketch the pages and features your portfolio site will have.",
            durationMinutes: 20,
          },
          {
            title: "Submit your portfolio project",
            type: "assignment",
            content: "Build a simple personal portfolio site and share a link to it (GitHub Pages, Vercel, Netlify, or similar).",
            durationMinutes: 180,
          },
        ],
      },
    ],
  });

  const course2 = await upsertCourse({
    title: "Digital Literacy Awareness",
    thumbnailUrl: COURSE_IMAGES.literacy,
    summary: "Building digital confidence for students, professionals and communities.",
    category: "Digital Literacy",
    level: "beginner",
    durationWeeks: 4,
    priceNaira: 0,
    isFree: true,
    instructorId: instructor.id,
    description:
      "A friendly, no-jargon introduction to using computers and the internet safely and confidently — for anyone starting their digital journey.",
    modules: [
      {
        title: "Getting Comfortable Online",
        lessons: [
          {
            title: "Using email and cloud storage",
            type: "reading",
            content: "How to send email professionally and store files in the cloud.",
            durationMinutes: 20,
          },
          {
            title: "Staying safe online",
            type: "reading",
            content: "Passwords, phishing, and protecting your personal information.",
            durationMinutes: 20,
          },
        ],
      },
    ],
  });

  const course3 = await upsertCourse({
    title: "Tech Career Pathfinding",
    thumbnailUrl: COURSE_IMAGES.career,
    summary: "Discover the right tech career path and prepare for opportunities.",
    category: "Career Coaching",
    level: "beginner",
    durationWeeks: 3,
    priceNaira: 20000,
    instructorId: instructor.id,
    description:
      "A structured program to help you identify the tech role that fits you, build a learning plan, and prepare your CV and portfolio for applications.",
    modules: [
      {
        title: "Finding Your Path",
        lessons: [
          {
            title: "Mapping tech career tracks",
            type: "reading",
            content: "An overview of common tech roles and what each one actually does day-to-day.",
            durationMinutes: 30,
          },
          {
            title: "Build your career action plan",
            type: "assignment",
            content: "Write a 90-day learning and application plan for the track you've chosen.",
            durationMinutes: 60,
          },
        ],
      },
    ],
  });

  const course4 = await upsertCourse({
    title: "IoT & Embedded Systems",
    thumbnailUrl: COURSE_IMAGES.iot,
    summary: "Learn to design smart connected devices and embedded solutions.",
    category: "Robotics & IoT",
    level: "intermediate",
    durationWeeks: 8,
    priceNaira: 90000,
    instructorId: instructor.id,
    description:
      "Hands-on training in microcontrollers, sensors and connectivity — design and build your own IoT device from scratch.",
    modules: [
      {
        title: "Embedded Fundamentals",
        lessons: [
          {
            title: "Microcontrollers 101",
            type: "video",
            content: "What a microcontroller is, and how to choose one for your project.",
            durationMinutes: 35,
          },
          {
            title: "Sensors and actuators",
            type: "reading",
            content: "Reading sensor data and controlling actuators from code.",
            durationMinutes: 30,
          },
        ],
      },
    ],
  });

  const course5 = await upsertCourse({
    title: "Robotics & Automation",
    thumbnailUrl: COURSE_IMAGES.robotics,
    summary: "Build and program robots, and learn industrial automation for modern systems.",
    category: "Robotics & IoT",
    level: "intermediate",
    durationWeeks: 10,
    priceNaira: 95000,
    instructorId: instructor.id,
    description:
      "From your first line-following robot to real automation and control engineering concepts used in industry.",
    modules: [
      {
        title: "Robotics Basics",
        lessons: [
          {
            title: "Building your first robot",
            type: "video",
            content: "Chassis, motors and wiring — the essentials.",
            durationMinutes: 45,
          },
          {
            title: "Programming robot behaviour",
            type: "assignment",
            content: "Program your robot to follow a line and avoid obstacles. Submit a short video of it working.",
            durationMinutes: 120,
          },
        ],
      },
    ],
  });

  console.log("Courses ready:", [course1, course2, course3, course4, course5].map((c) => c.title));

  // --- Demo company -----------------------------------------------------
  const [existingCompany] = await db
    .select()
    .from(companies)
    .where(eq(companies.contactEmail, "hr@northstartech.ng"))
    .limit(1);

  const company =
    existingCompany ??
    (
      await db
        .insert(companies)
        .values({
          name: "Northstar Technologies Ltd",
          industry: "Fintech",
          contactEmail: "hr@northstartech.ng",
          contactPhone: "+2348012345678",
          address: "Lagos, Nigeria",
        })
        .returning()
    )[0];

  await upsertUser({
    name: "Adaeze Okafor",
    email: "hr@northstartech.ng",
    role: "company_admin",
    companyId: company.id,
  });

  const staffMember = await upsertUser({
    name: "Emeka Johnson",
    email: "emeka@northstartech.ng",
    role: "learner",
    companyId: company.id,
  });

  // --- Demo learner with progress + certificate --------------------------
  const learner = await upsertUser({
    name: "Grace Adebayo",
    email: "learner@amplifydigitaltech.com",
    role: "learner",
  });

  const [existingEnrollment] = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.userId, learner.id))
    .limit(1);

  if (!existingEnrollment) {
    const [enrollment] = await db
      .insert(enrollments)
      .values({
        userId: learner.id,
        courseId: course2.id,
        status: "completed",
        progressPercent: 100,
        completedAt: new Date(),
      })
      .returning();

    const course2Lessons = await db
      .select({ id: lessons.id })
      .from(lessons)
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .where(eq(modules.courseId, course2.id));

    for (const lesson of course2Lessons) {
      await db.insert(lessonProgress).values({
        enrollmentId: enrollment.id,
        lessonId: lesson.id,
        completed: true,
        completedAt: new Date(),
      });
    }

    await db.insert(certificates).values({
      enrollmentId: enrollment.id,
      certificateNumber: generateCertificateNumber(),
    });

    // Also enroll them (in progress) in the coding course.
    await db.insert(enrollments).values({
      userId: learner.id,
      courseId: course1.id,
      progressPercent: 20,
    });
  }

  // Staff member enrolled by their company
  const [existingStaffEnrollment] = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.userId, staffMember.id))
    .limit(1);

  if (!existingStaffEnrollment) {
    await db.insert(enrollments).values({
      userId: staffMember.id,
      courseId: course4.id,
      companyId: company.id,
    });
  }

  // Demo coaching booking
  const [existingBooking] = await db
    .select()
    .from(coachingBookings)
    .where(eq(coachingBookings.userId, learner.id))
    .limit(1);

  if (!existingBooking) {
    await db.insert(coachingBookings).values({
      userId: learner.id,
      topic: "Choosing between frontend and backend development",
      preferredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: "confirmed",
      priceNaira: 15000,
    });
  }

  // --- Jobs ---------------------------------------------------------------
  const [existingJob] = await db.select().from(jobs).where(eq(jobs.title, "Junior Frontend Developer")).limit(1);
  if (!existingJob) {
    await db.insert(jobs).values([
      {
        title: "Junior Frontend Developer",
        companyName: "Northstar Technologies Ltd",
        description:
          "We're hiring a junior frontend developer to join our product team, building customer-facing features with React.",
        location: "Lagos, Nigeria (Hybrid)",
        type: "full_time",
        requiredCourseId: course1.id,
      },
      {
        title: "IoT Graduate Trainee",
        companyName: "Amplify Digital Technologies",
        description:
          "A graduate trainee role for recent IoT & Embedded Systems certificate holders, working on client hardware projects.",
        location: "Ibadan, Nigeria",
        type: "internship",
        requiredCourseId: course4.id,
      },
      {
        title: "Digital Skills Community Facilitator",
        companyName: "Amplify Digital Technologies",
        description:
          "Help run our digital literacy workshops in local communities. Open to all — no specific certificate required.",
        location: "Ibadan, Nigeria",
        type: "part_time",
      },
    ]);
  }

  console.log("\nSeed complete. Demo accounts (password: %s):", DEMO_PASSWORD);
  console.log("  Admin:            admin@amplifydigitaltech.com");
  console.log("  Instructor:       instructor@amplifydigitaltech.com");
  console.log("  Learner:          learner@amplifydigitaltech.com");
  console.log("  Company admin:    hr@northstartech.ng");
  console.log("  Company staff:    emeka@northstartech.ng");
  console.log("\nAdmin id:", admin.id);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
