import type { Doc } from "../../../../convex/_generated/dataModel";
import type { ViewMode } from "../note-page";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import React from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import BodyEditor from "./body-editor";

type Props = {
  isCurrentUserNoteOwner: boolean,
  setMode: React.Dispatch<React.SetStateAction<ViewMode>>,
  note: Doc<"notes">,
  user: Doc<"users">,
  noteBody: string,
  setBody: React.Dispatch<React.SetStateAction<string>>
}

const NoteEditor: React.FC<Props> = React.memo(
  ({
    setMode,
    note,
    user,
    isCurrentUserNoteOwner,
    noteBody,
    setBody
  }) => {
    const [transition, startTransition] = React.useTransition();
    const [title, setTitle] = React.useState(note.title ?? "");
    const [description, setDescription] = React.useState(note.description ?? "");

    const updateNote = useMutation(api.notes.updateNote);

    React.useEffect(() => {
      const timer = setInterval(() => {
        if (
          title !== note.title ||
          description !== note.description ||
          noteBody !== note.body
        ) {
          startTransition(() => {
            void updateNote({
              description,
              title,
              body: noteBody,
              noteID: note._id
            });
          });
        }
      }, 2000);
      return () => {
        clearInterval(timer);
      };
    }, [note, title, description, noteBody, updateNote]);

    return (
      <React.Fragment>
        <div className="flex flex-col gap-4">
          {isCurrentUserNoteOwner && (
            <React.Fragment>
              <div className="flex flex-col gap-1">
                <label htmlFor="title-input" className="text-2xl font-bold">
                  Title
                </label>
                <Input
                  placeholder="Enter your note title..."
                  type="text"
                  value={title}
                  className="placeholder:text-black/60 font-heading text-xl h-12"
                  onChange={(e) => setTitle(e.target.value)}
                  aria-label="Note Title"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="description-input" className="text-xl font-bold">
                  Description
                </label>
                <Textarea
                  placeholder="Enter your note description..."
                  className="placeholder:text-black/60 text-lg min-h-[10rem]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  aria-label="Note Description"
                />
              </div>

            </React.Fragment>
          )}

          <div className="mt-8 flex flex-col gap-1">
            <label htmlFor="note-noteBody" className="text-lg font-bold">
              Body
            </label>
            <div className="border border-border focus-within:outline-border focus-within:outline focus-within:outline-1 focus-within:ring-1 focus-within:outline-offset-2 focus-within:ring-transparent rounded-lg">
              <BodyEditor
                note={note}
                mode={"write"}
                user={user}
                setBody={setBody}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            {transition && (
              <div className="flex gap-2 items-center">
                Saving...
                <span className="w-4 h-4 border border-r-black animate-spin rounded-full" />
              </div>
            )}

            {!transition && (
              <div className="flex gap-1 items-center">
                Saved!
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
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            )}

            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                if (
                  title !== note.title ||
                  description !== note.description ||
                  noteBody !== note.body
                ) {
                  startTransition(() => {
                    void updateNote({
                      description,
                      title,
                      body: noteBody,
                      noteID: note._id
                    });
                    setMode("read");
                  });
                } else {
                  setMode("read");
                }
              }}
            >
              Back to Read Mode
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
);

NoteEditor.displayName = "NoteEditor";
export default NoteEditor;