import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";


export const Notification: React.FC = React.memo(
  () => {
    const notifications = useQuery(api.notification.getNotification);
    const deleteNotification = useMutation(api.notification.deleteNotification);
    const updateNotification = useMutation(api.notification.updateNotification);
    const [, startTransition] = React.useTransition();

    const [toggle, setToggle] = React.useState(false);

    const amountOfUnreadNotif = React.useMemo(() => {
      if (!notifications) {
        return 0;
      }

      let amount = 0;

      for (let idx = 0; idx < notifications.length; ++idx) {
        if (!notifications[idx].isRead) {
          amount += 1;
        }
      }

      return amount;
    }, [notifications]);

    const sortedNotifs = React.useMemo(() => notifications?.sort((a, b) => {
      if (a.isRead && !b.isRead) {
        return 1;
      }

      if (!a.isRead && b.isRead) {
        return -1;
      }

      if (!a.isRead && !b.isRead) {
        if (a._creationTime > b._creationTime) {
          return -1;
        }

        if (a._creationTime < b._creationTime) {
          return 1;
        }
      }

      return 0;
    }), [notifications]);

    return (
      <Popover open={toggle} onOpenChange={(state) => setToggle(state)}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            title="Notifications"
            aria-label="Notifications"
            className="relative"
          >
            {amountOfUnreadNotif <= 0 && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            )}

            {amountOfUnreadNotif >= 1 && (
              <React.Fragment>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
                </svg>

                <div
                  className="text-xs w-4 h-4 absolute top-0 right-0 rounded-full bg-red-300 dark:bg-red-800"
                >
                  {amountOfUnreadNotif}
                </div>
              </React.Fragment>
            )}

          </Button>
        </PopoverTrigger>

        <PopoverContent asChild className="p-0 animate-slidedown" alignOffset={5} align="end">
          <div className="p-2 w-auto flex flex-col gap-2 max-h-[15rem] overflow-y-auto rounded-lg shadow-md shadow-black/20">
            {sortedNotifs?.map((n, idx) => (
              <React.Fragment key={n._id}>
                {idx !== 0 && (
                  <hr className="bg-foreground/50" />
                )}
                <div
                  className={cn(
                    "w-96 flex gap-2 relative p-4 rounded-lg",
                    { "bg-foreground/10": !n.isRead },
                  )}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-auto w-auto p-1 hover:opacity-80"
                    title="Delete Notification"
                    aria-label="Delete Notification"
                    onClick={() => {
                      startTransition(() => {
                        void deleteNotification({ notificationID: n._id });
                      });
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="font-heading text-lg">{n.title}</div>
                      <div className="text-sm opacity-80">{n.message}</div>
                    </div>

                    <time className="text-xs opacity-60" dateTime={new Date(n._creationTime).toISOString()}>
                      {new Date(n._creationTime).toDateString()}
                    </time>

                    {!n.isRead && (
                      <Button
                      size="sm"
                      className="py-1 px-2 h-auto mt-1"
                      onClick={() => {
                        startTransition(() => {
                          void updateNotification({
                            notificationID: n._id,
                            isRead: true
                          });

                          setToggle(false);
                        });
                      }}
                    >
                      Mark as read
                    </Button>
                    )}

                    {n.linkToNotif && (
                      <Button
                        size="sm"
                        className="py-1 px-2 h-auto mt-1"
                        variant="outline"
                        asChild
                      >
                        <Link
                          to={n.linkToNotif}
                          title="Go to link"
                          aria-label="Go to link"
                          onClick={() => {
                            startTransition(() => {
                              void updateNotification({
                                notificationID: n._id,
                                isRead: true
                              });
                              setToggle(false);
                            });
                          }}
                        >
                          Go to link
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}

            {notifications && notifications.length <= 0 && (
              <div className="text-center text-sm">You have no notification as of this moment.</div>
            )}
          </div>
        </PopoverContent>
      </Popover >
    );
  }
);