import type { Doc } from "convex/_generated/dataModel";
import type { ViewMode } from "../note-page";

import React from "react";

import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { getInitialConfig } from "./config";
import { EMPTY_BODY_JSON } from "@/config/site";

type Props = {
  doesCurrentUserHaveWriteAccess: boolean,
  setMode: React.Dispatch<React.SetStateAction<ViewMode>>,
  note: Doc<"notes">,
  mode: ViewMode
}

const NoteEditor: React.FC<Props> = React.memo(
  ({
    doesCurrentUserHaveWriteAccess,
    setMode,
    mode,
    note
  }) => {
    const [title, setTitle] = React.useState(note.title);
    const [description, setDescription] = React.useState(note.description);
    const [body, setBody] = React.useState(note.body);

    return (
      <LexicalComposer initialConfig={getInitialConfig({ mode, noteBody: note.body ?? EMPTY_BODY_JSON })}>

      </LexicalComposer>
    );
  } 
);

NoteEditor.displayName = "NoteEditor";
export default NoteEditor;