import type { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FALLBACK_IMG } from "@/consts";
import MessageMenu from "./msg-menu";

type Props = {
  receiverID: Id<"chatRooms"> | Id<"users"> | Id<"notes">,
  setLatestLength: React.Dispatch<React.SetStateAction<number>>
}

const SECONDS_IN_A_DAY = 86400;
const DAYS_IN_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DisplayMessages: React.FC<Props> = React.memo(
  ({ receiverID, setLatestLength }) => {
    const messageResponse = useQuery(api.messages.getMessages, { receiverID });
    const [isFirsLoad, setIsFirstLoad] = React.useState(true);

    const latestMsgRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const storedLength = localStorage.getItem("previousMessageLength");
      let prevLength = !storedLength ? 0 : +storedLength;

      if (isNaN(prevLength)) {
        prevLength = 0;
      }

      if (messageResponse && messageResponse.messageData.length !== prevLength) {
        localStorage.setItem("previousMessageLength", `${messageResponse.messageData.length ?? 0}`);
        setLatestLength((messageResponse.messageData.length - prevLength) <= 0 ? 0 : (messageResponse.messageData.length - prevLength));
      }
    }, [messageResponse, setLatestLength]);

    React.useEffect(() => {
      setIsFirstLoad(false);
    }, []);

    React.useLayoutEffect(() => {
      if (!latestMsgRef.current) {
        return;
      }

      latestMsgRef.current.scrollIntoView({
        behavior: isFirsLoad ? "instant" : "smooth",
        block: "end"
      });
    }, [messageResponse, isFirsLoad]);

    return (
      <div className="thin-scroll flex flex-col gap-4 p-4 overflow-y-auto max-h-[20rem]">
        {messageResponse?.messageData.length === 0 && (
          <div className="text-center">
            There are no messages available. Be the first one to send a message.
          </div>
        )}
        
        {messageResponse?.messageData.map((m, idx) => {
          const createdAt = new Date(m._creationTime);
          const dateDiff = (new Date().getTime() / 1000) - (m._creationTime / 1000);

          const hour = createdAt.getHours();
          const time = (hour >= 13 ? hour - 12 : hour) + ":" + createdAt.getMinutes() + (hour >= 12 ? " PM" : " AM");

          return (
            <React.Fragment key={m._id}>
              {dateDiff >= SECONDS_IN_A_DAY && (
                <div className="text-xs opacity-80 text-center">
                  {DAYS_IN_WEEK[new Date(m._creationTime).getDay()]}
                </div>
              )}

              <div
                ref={idx === messageResponse.messageData.length - 1 ? latestMsgRef : undefined}
                className={cn(
                  "flex items-start gap-2",
                  { "justify-end": m.sender.id === messageResponse.currentUser._id }
                )}
              >
                <div className="flex flex-col gap-1 group">
                  <div className={cn(
                    "flex gap-4 items-end",
                    { "justify-end": m.sender.id === messageResponse.currentUser._id }
                  )}>
                    {m.sender.id === messageResponse.currentUser._id && (
                      <MessageMenu
                        messageID={m._id}
                        senderID={m.sender.id}
                      />
                    )}
                    {m.sender.id === messageResponse.currentUser._id && (
                      <div className="relative max-w-[60%] pt-1">
                        <p className="dark:border py-1 px-2 flex items-center rounded-lg bg-accent text-accent-foreground shadow-black/20 shadow-md">
                          {m.content}
                        </p>
                      </div>
                    )}
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{m.sender.name?.charAt(0)}</AvatarFallback>
                      <AvatarImage
                        src={m.sender.image ?? FALLBACK_IMG}
                        alt={m.sender.name + "'s avatar"}
                        width={26}
                        height={26}
                      />
                    </Avatar>

                    {m.sender.id !== messageResponse.currentUser._id && (
                      <div className="relative max-w-[60%] pt-1">
                        <div className="w-full absolute bottom-[105%] min-w-[6rem] left-0 text-xs opacity-60">{m.sender.name}</div>
                        <p className="dark:border py-1 px-2 flex items-center rounded-lg bg-accent text-accent-foreground shadow-black/20 shadow-md">
                          {m.content}
                        </p>
                      </div>
                    )}
                  </div>
                  <time dateTime={createdAt.toISOString()} className={cn(
                    "text-xs opacity-60",
                    {
                      "text-end pr-1": m.sender.id === messageResponse.currentUser._id,
                      "pl-1": m.sender.id !== messageResponse.currentUser._id
                    }
                  )}>
                    {time}
                  </time>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div >
    );
  }
);

DisplayMessages.displayName = "DisplayMessages";
export default DisplayMessages;