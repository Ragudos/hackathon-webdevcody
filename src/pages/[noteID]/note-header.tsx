import type { Doc } from "../../../convex/_generated/dataModel";
import type { ViewMode } from "./note-page";

import React from "react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const DeleteNoteBtn = React.lazy(() => import("@/components/delete-note-btn"));
const EditButton = React.lazy(() => import("@/components/edit-button"));
const ShareButton = React.lazy(() => import("./share-access"));

type Props = {
  setMode: React.Dispatch<React.SetStateAction<ViewMode>>,
  doesCurrentUserHaveWriteAccess: boolean,
  isCurrentUserNoteOwner: boolean,
  note: Doc<"notes">
}

export const NoteHeader: React.FC<Props> = React.memo(
  ({ note, doesCurrentUserHaveWriteAccess, isCurrentUserNoteOwner, setMode }) => {
    const [toggle, setToggle] = React.useState(false);

    return (
      <nav className="flex justify-between">
        <ul className="flex items-center">
          <li>
            <DropdownMenu
              open={toggle}
              onOpenChange={(state) => setToggle(state)}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-none"
                  size="sm"
                >
                  Note
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent alignOffset={5} align="start" asChild>
                <div className="max-w-xs flex flex-col items-center shadow-md shadow-black/20">
                  {!isCurrentUserNoteOwner && !doesCurrentUserHaveWriteAccess && (
                    <div className="text-sm opacity-60 p-1">
                      You have no access to change anything in this note.
                    </div>
                  )}

                  {isCurrentUserNoteOwner && (
                    <React.Suspense>
                      <DeleteNoteBtn
                        iconStyles="w-4 h-4"
                        text="Delete"
                        noteID={note._id}
                        className="justify-start w-full p-1"
                      />
                      <hr className="bg-foreground/50" />
                    </React.Suspense>
                  )}

                  {doesCurrentUserHaveWriteAccess && (
                    <React.Suspense>
                      <EditButton
                        setMode={setMode}
                        setOpen={setToggle}
                      />
                    </React.Suspense>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>

        {isCurrentUserNoteOwner && (
          <React.Suspense>
            <ShareButton note={note} />
          </React.Suspense>
        )}

      </nav>
    );
  }
);

NoteHeader.displayName = "NoteHeader";