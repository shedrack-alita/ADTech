import type {
  certificates,
  coachingBookings,
  companies,
  courses,
  enrollments,
  jobApplications,
  jobs,
  lessonProgress,
  lessons,
  messages,
  modules,
  payments,
  submissions,
  users,
} from "./schema";

export type Company = typeof companies.$inferSelect;
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type LessonProgress = typeof lessonProgress.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type CoachingBooking = typeof coachingBookings.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type JobApplication = typeof jobApplications.$inferSelect;
