import { z } from "zod";

export const registerLearnerSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number").optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerCompanySchema = z.object({
  companyName: z.string().min(2, "Enter your company name"),
  industry: z.string().optional().or(z.literal("")),
  contactPhone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  adminName: z.string().min(2, "Enter the admin's full name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional().or(z.literal("")),
  subject: z.string().min(2, "Enter a subject"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

export const bookingSchema = z.object({
  topic: z.string().min(3, "Tell us what you'd like coaching on"),
  preferredDate: z.string().min(1, "Choose a preferred date and time"),
  notes: z.string().optional().or(z.literal("")),
});

export const courseSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(10),
  description: z.string().min(20),
  category: z.string().min(2),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  durationWeeks: z.coerce.number().int().min(1).max(104),
  priceNaira: z.coerce.number().int().min(0),
  isFree: z.coerce.boolean().optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  instructorId: z.string().uuid().optional().or(z.literal("")),
  published: z.coerce.boolean().optional(),
});

export const moduleSchema = z.object({
  title: z.string().min(2),
  position: z.coerce.number().int().min(0),
});

export const lessonSchema = z.object({
  title: z.string().min(2),
  type: z.enum(["video", "reading", "assignment", "quiz"]),
  content: z.string().optional().or(z.literal("")),
  videoUrl: z.string().url().optional().or(z.literal("")),
  durationMinutes: z.coerce.number().int().min(1).max(600),
  position: z.coerce.number().int().min(0),
});

export const submissionSchema = z.object({
  lessonId: z.string().uuid(),
  content: z.string().optional().or(z.literal("")),
  fileUrl: z.string().url().optional().or(z.literal("")),
});

export const reviewSubmissionSchema = z.object({
  submissionId: z.string().uuid(),
  status: z.enum(["reviewed", "approved", "changes_requested"]),
  feedback: z.string().optional().or(z.literal("")),
});

export const messageSchema = z.object({
  enrollmentId: z.string().uuid(),
  body: z.string().min(1, "Write a message before sending"),
});

export const jobSchema = z.object({
  title: z.string().min(2),
  companyName: z.string().min(2),
  description: z.string().min(20),
  location: z.string().min(2),
  type: z.enum(["full_time", "part_time", "contract", "internship"]),
  requiredCourseId: z.string().uuid().optional().or(z.literal("")),
  isActive: z.coerce.boolean().optional(),
});

export const jobApplicationSchema = z.object({
  jobId: z.string().uuid(),
  coverNote: z.string().optional().or(z.literal("")),
});

export const addStaffSchema = z.object({
  name: z.string().min(2, "Enter the staff member's full name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
