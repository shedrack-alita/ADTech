import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { Card, CardBody } from "@/components/ui/Card";

export default async function ProfilePage() {
  const sessionUser = await requireUser();
  const [user] = await db.select().from(users).where(eq(users.id, sessionUser.id)).limit(1);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-brand-navy">Your profile</h1>
      <p className="mt-1 text-sm text-brand-slate">
        Keep your details up to date.
      </p>
      <Card className="mt-6">
        <CardBody>
          <ProfileForm user={user} />
        </CardBody>
      </Card>
    </div>
  );
}
