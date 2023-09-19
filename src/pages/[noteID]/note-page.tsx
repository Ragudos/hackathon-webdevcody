import type { Doc } from "../../../convex/_generated/dataModel";

import React from "react";
import toast from "react-hot-toast";

import { NoteContext } from "../[noteID]";

import { NoteHeader } from "./note-header";
import { Heading } from "@/components/ui/heading";
import { EMPTY_BODY_JSON, NOTE_CONSTS } from "@/config/site";

const ReadOnlyNoteEditor = React.lazy(() => import("./editor/read-only-note-editor"));
const NoteEditor = React.lazy(() => import("./editor/note-editor"));

export type ViewMode = "read" | "write";

const NotePage: React.FC = () => {
  const {
    note,
    doesCurrentUserHaveWriteAccess,
    isCurrentUserNoteOwner,
    currentUser
  } = React.useContext(NoteContext);
  const [mode, setMode] = React.useState<ViewMode>("read");
  const [body, setBody] = React.useState(note?.body ?? EMPTY_BODY_JSON);
  const [noteTheme, setNoteTheme] = React.useState<typeof NOTE_CONSTS.theme[number]>(note?.theme ?? "blue");

  React.useEffect(() => {
    if (note?.body) {
      setBody(note?.body);
    }
  }, [note?.body]);

  React.useEffect(() => {
      if (note?.noteTheme && note.noteTheme !== noteTheme) {
        setNoteTheme(note?.noteTheme);
      }
  }, [note?.noteTheme, noteTheme]);

  React.useEffect(() => {
    if (
      mode === "write" &&
      !doesCurrentUserHaveWriteAccess &&
      !isCurrentUserNoteOwner
    ) {
      toast.error(
        "Your write access has been revoked. Please contact the owner of this note.",
      );
      setMode("read");
    }
  }, [
    mode,
    doesCurrentUserHaveWriteAccess,
    isCurrentUserNoteOwner
  ]);

  return (
    <div
      style={{
        backgroundColor: `hsl(var(--${noteTheme}))`,
        color: `hsl(var(--${noteTheme}-foreground))`,
      }}
      className="dark:border shadow-black/20 shadow-lg rounded-lg overflow-hidden"
    >
      <header className="border-b-2">
        <NoteHeader
          noteTheme={noteTheme}
          setMode={setMode}
          note={note as Doc<"notes">}
          doesCurrentUserHaveWriteAccess={doesCurrentUserHaveWriteAccess}
          isCurrentUserNoteOwner={isCurrentUserNoteOwner}
        />
      </header>

      <article className="min-h-[100dvh] p-8">
        {mode === "read" && (
          <React.Fragment>
            <Heading
              typeOfHeading="h1"
              containerStyles="text-start"
              className={!note?.title ? "opacity-60" : undefined}
              descriptionStyles={!note?.description ? "opacity-60" : undefined}
              description={
                note?.description || "Add a description to your note..."
              }
            >
              {note?.title || "Add a title to your note..."}
            </Heading>
            <React.Suspense>
              <ReadOnlyNoteEditor
                noteBody={body}
                mode={mode}
              />
            </React.Suspense>
          </React.Fragment>
        )}

        {mode === "write" && (
          <React.Suspense>
            <NoteEditor
              noteBody={body}
              setBody={setBody}
              user={currentUser as Doc<"users">}
              setMode={setMode}
              note={note as Doc<"notes">}
              isCurrentUserNoteOwner={isCurrentUserNoteOwner}
            />
          </React.Suspense>
        )}
      </article>
    </div>
  );
};

export default NotePage;