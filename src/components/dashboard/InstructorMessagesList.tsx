"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MessageThread } from "./MessageThread";
import { Card } from "@/components/ui/Card";

interface ThreadMessage {
  id: string;
  body: string;
  createdAt: Date | string;
  senderId: string;
  sender: { name: string };
}

interface ConversationItem {
  enrollmentId: string;
  studentName: string;
  courseTitle: string;
  messages: ThreadMessage[];
}

export function InstructorMessagesList({
  conversations,
  currentUserId,
}: {
  conversations: ConversationItem[];
  currentUserId: string;
}) {
  const [openId, setOpenId] = useState<string | null>(conversations[0]?.enrollmentId ?? null);

  return (
    <div className="space-y-3">
      {conversations.map((c) => {
        const isOpen = openId === c.enrollmentId;
        return (
          <Card key={c.enrollmentId} className="overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : c.enrollmentId)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div>
                <p className="font-semibold text-brand-navy">{c.studentName}</p>
                <p className="text-xs text-brand-slate">{c.courseTitle}</p>
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-brand-slate" />
              ) : (
                <ChevronDown className="h-4 w-4 text-brand-slate" />
              )}
            </button>
            {isOpen && (
              <div className="h-96 border-t border-brand-navy/10">
                <MessageThread
                  enrollmentId={c.enrollmentId}
                  messages={c.messages}
                  currentUserId={currentUserId}
                />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
