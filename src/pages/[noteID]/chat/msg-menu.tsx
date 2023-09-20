import type { Id } from "../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React from "react";

type Props = {
  messageID: Id<"messages">,
  senderID: Id<"users">
}

const MessageMenu: React.FC<Props> = React.memo(
  ({ messageID, senderID }) => {
    const [toggle, setToggle] = React.useState(false);
    const deleteMessage = useMutation(api.messages.deleteMessage);
    const [, startTransition] = React.useTransition();

    return (
      <DropdownMenu open={toggle} onOpenChange={(state) => setToggle(state)}>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full p-1 w-auto h-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="center" alignOffset={5} className="p-1 animate-slidedown">
          <div className="p-1 flex flex-col">
            <Button
              title="Delete message"
              aria-label="Delete message"
              onClick={() => {
                startTransition(() => {
                  setToggle(false);
                  void deleteMessage({
                    messageID: messageID,
                    senderID: senderID
                  });
                });
              }}
            >
              Remove message
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

MessageMenu.displayName = "MessageMenu";
export default MessageMenu;