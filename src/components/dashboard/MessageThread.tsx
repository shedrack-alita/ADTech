"use client";

import { useActionState, useRef, useEffect } from "react";
import { sendMessageAction } from "@/lib/actions/learning";
import { initialActionState } from "@/lib/actions/types";
import { Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { cn, formatDateTime } from "@/lib/utils";

interface ThreadMessage {
  id: string;
  body: string;
  createdAt: Date | string;
  senderId: string;
  sender: { name: string };
}

export function MessageThread({
  enrollmentId,
  messages,
  currentUserId,
}: {
  enrollmentId: string;
  messages: ThreadMessage[];
  currentUserId: string;
}) {
  const [state, formAction] = useActionState(sendMessageAction, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-brand-slate">
            No messages yet — say hello to your instructor.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.senderId === currentUserId;
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                  mine ? "bg-brand-teal text-white" : "bg-brand-mist text-brand-navy"
                )}
              >
                {!mine && (
                  <p className="mb-0.5 text-xs font-semibold text-brand-navy/60">
                    {m.sender.name}
                  </p>
                )}
                <p className="whitespace-pre-line">{m.body}</p>
                <p
                  className={cn(
                    "mt-1 text-[10px]",
                    mine ? "text-white/70" : "text-brand-slate"
                  )}
                >
                  {formatDateTime(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        ref={formRef}
        action={async (formData) => {
          await formAction(formData);
          formRef.current?.reset();
        }}
        className="flex items-end gap-2 border-t border-brand-navy/10 p-3"
      >
        <input type="hidden" name="enrollmentId" value={enrollmentId} />
        <Textarea
          name="body"
          rows={1}
          placeholder="Write a message..."
          required
          className="min-h-0 flex-1"
        />
        <SubmitButton className="w-auto px-5">Send</SubmitButton>
      </form>
      {state.error && <p className="px-3 pb-2 text-xs text-red-600">{state.error}</p>}
    </div>
  );
}
