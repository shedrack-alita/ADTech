import { desc } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { Card, CardBody } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";

export default async function AdminInquiriesPage() {
  await requireRole("admin");
  const allInquiries = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Contact inquiries</h1>
      <p className="mt-1 text-sm text-brand-slate">Messages submitted through the contact form.</p>

      <div className="mt-6 space-y-3">
        {allInquiries.map((inquiry) => (
          <Card key={inquiry.id}>
            <CardBody>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-brand-navy">{inquiry.subject}</p>
                <span className="text-xs text-brand-slate">{formatDateTime(inquiry.createdAt)}</span>
              </div>
              <p className="mt-1 text-xs text-brand-slate">
                {inquiry.name} · {inquiry.email} {inquiry.phone ? `· ${inquiry.phone}` : ""}
              </p>
              <p className="mt-2 text-sm text-brand-navy/80">{inquiry.message}</p>
            </CardBody>
          </Card>
        ))}
        {allInquiries.length === 0 && (
          <p className="text-brand-slate">No inquiries yet.</p>
        )}
      </div>
    </div>
  );
}
