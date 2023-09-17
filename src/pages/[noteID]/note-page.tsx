import type { Doc } from "../../../convex/_generated/dataModel";

import React from "react";
import toast from "react-hot-toast";

import { NoteContext } from "../[noteID]";

import { NoteHeader } from "./note-header";
import { Heading } from "@/components/ui/heading";

const ReadOnlyNoteEditor = React.lazy(() => import("./editor/read-only-note-editor"));

export type ViewMode = "read" | "write";

const NotePage: React.FC = () => {
  const {
    note,
    doesCurrentUserHaveWriteAccess,
    isCurrentUserNoteOwner
  } = React.useContext(NoteContext);

  const [mode, setMode] = React.useState<ViewMode>("read");

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
        backgroundColor: `hsl(var(--${note?.noteTheme}))`,
        color: `hsl(var(--${note?.noteTheme}-foreground))`,
      }}
      className="dark:border shadow-black/20 shadow-lg rounded-lg overflow-hidden"
    >
      <header>
        <NoteHeader
          setMode={setMode}
          note={note as Doc<"notes">}
          doesCurrentUserHaveWriteAccess={doesCurrentUserHaveWriteAccess}
          isCurrentUserNoteOwner={isCurrentUserNoteOwner}
        />
      </header>

      <article className="min-h-[100dvh]">
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
                noteBody={note?.body as string}
                mode={mode}
              />
            </React.Suspense>
          </React.Fragment>
        )}
      </article>
    </div>
  );
};

export default NotePage;