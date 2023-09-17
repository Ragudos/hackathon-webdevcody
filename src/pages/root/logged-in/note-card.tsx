import type { Doc } from "../../../../convex/_generated/dataModel";

import React from "react";

import { Link } from "react-router-dom";

import DeleteNoteBtn from "@/components/delete-note-btn";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

type Props = {
  note: Doc<"notes">
}

export const NoteCard: React.FC<Props> = React.memo(
  ({ note }) => (
    <div
      style={{
        backgroundColor: `hsl(var(--${note.noteTheme}))`,
        color: `hsl(var(--${note.noteTheme}-foreground))`,
      }}
      className="overflow-auto break-words whitespace-pre-wrap p-4 shadow-md shadow-black/20 dark:border border-border rounded-lg"
    >
      <div className="flex justify-between text-xs mb-1">
        <time
          className="select-none"
          dateTime={new Date(note._creationTime).toISOString()}
        >
          {new Date(note._creationTime).toDateString()}
        </time>

        <div className="flex gap-2">
          <DeleteNoteBtn noteID={note._id} />

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-auto w-auto"
          >
            <Link
              to={`/notes/${note._id}`}
              aria-label="Open Note"
              title="Open Note"
              replace
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </Link>
          </Button>
        </div>
      </div>

      <Heading
        typeOfHeading="h4"
        containerStyles="text-start"
        className={!note.title ? "opacity-60" : undefined}
        description={note.description || "Add a descrption to your note..."}
        descriptionStyles={
          note.description
            ? "opacity-90 text-sm lg:text-sm"
            : "opacity-60 text-sm lg:text-sm"
        }
      >
        {note.title || "Add a title to your note..."}
      </Heading>
    </div>
  )
);

NoteCard.displayName = "CreateCard";