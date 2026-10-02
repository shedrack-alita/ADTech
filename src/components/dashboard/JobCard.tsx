"use client";

import { useActionState } from "react";
import { Briefcase, CheckCircle2, MapPin } from "lucide-react";
import { applyToJobAction } from "@/lib/actions/jobs";
import { initialActionState } from "@/lib/actions/types";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { FieldGroup, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";

const typeLabel: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
};

interface JobCardProps {
  job: {
    id: string;
    title: string;
    companyName: string;
    description: string;
    location: string;
    type: string;
    requiredCourse: { title: string } | null;
  };
  eligible: boolean;
  alreadyApplied: boolean;
}

export function JobCard({ job, eligible, alreadyApplied }: JobCardProps) {
  const [state, formAction] = useActionState(applyToJobAction, initialActionState);
  const applied = alreadyApplied || !!state.success;

  return (
    <Card>
      <CardBody>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-brand-navy">{job.title}</h3>
            <p className="text-sm text-brand-slate">{job.companyName}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-brand-slate">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {job.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" /> {typeLabel[job.type]}
              </span>
              {job.requiredCourse && (
                <Badge tone={eligible ? "green" : "amber"}>
                  Requires: {job.requiredCourse.title} certificate
                </Badge>
              )}
            </div>
          </div>
          {applied && (
            <Badge tone="green" className="shrink-0">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Applied
            </Badge>
          )}
        </div>

        <p className="mt-3 text-sm text-brand-navy/80">{job.description}</p>

        {!applied && (
          <div className="mt-4">
            {eligible ? (
              <form action={formAction}>
                <input type="hidden" name="jobId" value={job.id} />
                <FormMessage error={state.error} />
                <FieldGroup>
                  <Textarea name="coverNote" rows={2} placeholder="Optional note to the employer" />
                </FieldGroup>
                <SubmitButton size="sm" className="w-auto px-6">
                  Apply now
                </SubmitButton>
              </form>
            ) : (
              <p className="text-sm text-amber-700">
                Complete &ldquo;{job.requiredCourse?.title}&rdquo; and earn its certificate to
                unlock this application.
              </p>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
