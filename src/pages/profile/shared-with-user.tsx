import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";

import { Heading } from "@/components/ui/heading";

const SharedNoteCard = React.lazy(() => import("./shared-note-card"));

export const SharedWithUser: React.FC = React.memo(
  () => {
    const sharedWithUser = useQuery(api.notes.getAllNotesSharedWithUser);

    return (
      <React.Fragment>
        {sharedWithUser && (
          <React.Fragment>
            <div className="w-[0.1rem] h-full hidden md:block" />
            <hr className="mb-4 md:hidden" />
            <section className="md:w-[75%] lg:w-[60%]">
              <Heading typeOfHeading="h2">Shared with me</Heading>

              {sharedWithUser.notesWithWriteAccess.length > 0 && (
                <div className="mt-8 flex flex-col gap-2">
                  <Heading typeOfHeading="h3">Write access</Heading>

                  <div className="grid lg:grid-cols-2 gap-x-4 gap-y-2">
                    {sharedWithUser.notesWithWriteAccess.map((n) => (
                      <React.Suspense>
                        <SharedNoteCard key={n._id} n={n} />
                      </React.Suspense>
                    ))}
                  </div>
                </div>
              )}

              {sharedWithUser.notesWithReadAccess.length > 0 && (
                <div className="flex flex-col gap-2 mt-8">
                  <Heading typeOfHeading="h3">Read access</Heading>
                  <div className="grid lg:grid-cols-2 gap-x-4 gap-y-2">
                    {sharedWithUser.notesWithReadAccess.map((n) => (
                      <React.Suspense>
                        <SharedNoteCard key={n._id} n={n} />
                      </React.Suspense>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
);

SharedWithUser.displayName = "SharedWithUser";