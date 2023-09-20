import type { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  receiverID: Id<"chatRooms"> | Id<"users"> | Id<"notes">
}

const MessageForm: React.FC<Props> = React.memo(
  ({ receiverID }) => {
    const [transition, startTransition] = React.useTransition();

    const [message, setMessage] = React.useState("");
    const sendMessage = useMutation(api.messages.sendMessage);

    const sendMsg = (e: React.FormEvent) => {
      e.preventDefault();

      startTransition(() => {
        void sendMessage({
          receiverID,
          content: message
        });
        setMessage("");
      });
    };

    return (
      <form
        action=""
        onSubmit={sendMsg}
        className="rounded-lg border focus-within:outline flex focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-black dark:focus-within:outline-white"
      >
        <Input
          type="text"
          className="outline-0 border-0 ring-0"
          required
          minLength={1}
          autoCorrect="on"
          placeholder="Type your message..."
          disabled={transition}
          value={message}
          onChange={(e) => {
            if (!transition) {
              setMessage(e.target.value);
            }
          }}
        />

        <div>
          <Button
            size="sm"
            className="gap-2 h-full"
            type="submit"
            disabled={transition}
          >
            <span className="text-xs hidden md:block">Send</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </Button>
        </div>
      </form>
    );
  }
);

MessageForm.displayName = "MessageForm";
export default MessageForm;