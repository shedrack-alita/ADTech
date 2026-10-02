import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { InstructorMessagesList } from "@/components/dashboard/InstructorMessagesList";
import { Card, CardBody } from "@/components/ui/Card";

export default async function InstructorMessagesPage() {
  const user = await requireRole("instructor", "admin");

  const myCourses = await db.query.courses.findMany({
    where: user.role === "admin" ? undefined : eq(courses.instructorId, user.id),
    with: {
      enrollments: {
        with: {
          user: true,
          messages: {
            orderBy: (messages, { asc }) => [asc(messages.createdAt)],
            with: { sender: true },
          },
        },
      },
    },
  });

  const conversations = myCourses.flatMap((course) =>
    course.enrollments.map((enrollment) => ({
      enrollmentId: enrollment.id,
      studentName: enrollment.user.name,
      courseTitle: course.title,
      messages: enrollment.messages,
    }))
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Messages</h1>
      <p className="mt-1 text-sm text-brand-slate">
        Conversations with students across your courses.
      </p>

      <div className="mt-6">
        {conversations.length === 0 ? (
          <Card>
            <CardBody className="text-center text-brand-slate">
              No conversations yet.
            </CardBody>
          </Card>
        ) : (
          <InstructorMessagesList conversations={conversations} currentUserId={user.id} />
        )}
      </div>
    </div>
  );
}
