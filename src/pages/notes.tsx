import type { Doc, Id } from "convex/_generated/dataModel";

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";

import { AuthWrapper } from "@/components/auth-wapper";
import { useQuery } from "convex/react";
import { Heading } from "@/components/ui/heading";

import useStoreUser from "@/lib/useStoreUser";
import { NoteToolBar } from "./notes/note-toolbar";
import { NoteEditor } from "./notes/note-editors";
import { NoteBodyEditor } from "./notes/note-body-editor";

export type Note = {
  note: Doc<"notes">;
};

export type AllowedUser = {
  user: Doc<"users">;
  accessType: "read" | "write";
}

export const Component = React.memo(() => {
  const { noteID } = useParams();

  const note = useQuery(api.notes.getNote, { noteID: noteID as Id<"notes"> });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!noteID || note === null) {
      navigate("/");
    }
  }, [note, navigate, noteID]);

  return (
    <AuthWrapper>
      {note && !(note instanceof Error) && <NotePage note={note} />}
      {note instanceof Error && <div>{note.message}</div>}
    </AuthWrapper>
  );
});

const NotePage: React.FC<Note> = ({ note }) => {
  const [mode, setMode] = React.useState<"read" | "write">("read");
  const { userID } = useStoreUser();

  const isCurrentUserNoteOwner = React.useMemo(
    () => note.user === userID,
    [note.user, userID],
  );

  const doesUserHaveWriteAccess = React.useMemo(() => {
    if (note.accessType === "invite-only") {
      if (!isCurrentUserNoteOwner) {
        if (note.allowedUsers) {
          for (let idx = 0; idx < note.allowedUsers.length; ++idx) {
            if (
              note.allowedUsers[idx].userID === userID &&
              note.allowedUsers[idx].access === "write"
            ) {
              return true;
            }
          }
          return false;
        }
      } else {
        return true;
      }
    }

    return note.accessType === "anyone-can-write";
  }, [note.allowedUsers, isCurrentUserNoteOwner, note.accessType, userID]);

  const doesUserHaveAccess = React.useMemo(() => {
    if (isCurrentUserNoteOwner) {
      return true;
    }

    if (note.accessType === "invite-only") {
      if (note.allowedUsers) {
        for (let idx = 0; idx < note.allowedUsers.length; ++idx) {
          if (note.allowedUsers[idx].userID === userID) {
            return true;
          }
        }

        return false;
      } else {
        return false;
      }
    }

    return note.accessType === "anyone-can-read";
  }, [note.allowedUsers, isCurrentUserNoteOwner, note.accessType, userID]);

  return (
    <React.Fragment>
      {doesUserHaveAccess && (
        <div
          style={{
            backgroundColor: `hsl(var(--${note.theme}) / 0.9)`,
            color: `hsl(var(--${note.theme}-foreground))`,
          }}
          className="dark:border shadow-black/20 shadow-lg rounded-lg overflow-hidden"
        >
          <header>
            <NoteToolBar
              note={note}
              setMode={setMode}
              doesUserHavePermissionToEdit={doesUserHaveWriteAccess}
              isCurrentUserNoteOwner={isCurrentUserNoteOwner}
            />
          </header>
          <article className="min-h-[100dvh] p-4 md:p-8 border-t">
            {mode === "read" && (
              <React.Fragment>
                <Heading
                  typeOfHeading="h1"
                  containerStyles="text-start"
                  descriptionStyles={!note.description ? "opacity-40" : undefined}
                  description={note.description || "Add a description to your note..."}
                >
                  {note.title}
                </Heading>

                <div className="mt-8 relative">
                  <NoteBodyEditor
                    noteBody={note.body}
                    mode={mode}
                  />
                </div>
              </React.Fragment>
            )}

            {mode === "write" && (
              <NoteEditor
                isWithPermissionToWrite={doesUserHaveWriteAccess}
                note={note}
                setMode={setMode}
              />
            )}
          </article>
        </div>
      )}
    </React.Fragment>
  );
};

Component.displayName = "Note";
