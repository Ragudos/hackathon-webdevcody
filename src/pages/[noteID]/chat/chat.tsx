import type { Id } from "../../../../convex/_generated/dataModel";
import React from "react";
import { Button } from "@/components/ui/button";
import { RotatingLoader } from "@/components/rotating-loader";

const MessageForm = React.lazy(() => import("./msg-form"));
const DisplayMessages = React.lazy(() => import("./display-msgs"));

type Props = {
  receiverID: Id<"notes">
}

const Chat: React.FC<Props> = React.memo(
  ({
    receiverID
  }) => {
    const [toggle, setToggle] = React.useState(false);
    const [latestLength, setLatestLength] = React.useState(0);

    return (
      <React.Fragment>
        <Button
          size="sm"
          variant="ghost"
          className="relative rounded-none gap-2 mb-2"
          title="Open Messages"
          aria-label="Open Messages"
          onClick={() => {
            setToggle((p) => {
              setLatestLength(0);
              return !p;
            });
          }}
        >
          Messages
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>

          {latestLength > 0 && !toggle && (
            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-300 dark:bg-red-800">
              {latestLength}
            </div>
          )}
        </Button>


        {toggle && (
          <div className="flex flex-col p-1 border rounded-lg">
            <React.Suspense fallback={<RotatingLoader />}>
              <div className="p-1">
                <DisplayMessages
                  receiverID={receiverID}
                  setLatestLength={setLatestLength}
                />
              </div>
              <MessageForm
                receiverID={receiverID}
              />
            </React.Suspense>
          </div>
        )}
      </React.Fragment>
    );
  }
);

Chat.displayName = "Chat";
export default Chat;