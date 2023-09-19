import type { EditorThemeClasses } from "lexical/LexicalEditor";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import type { ViewMode } from "../note-page";

import toast from "react-hot-toast";

import { ListItemNode, ListNode } from "@lexical/list";

type Params = {
  mode: ViewMode,
  noteBody: string
}

const theme = {
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through"
  },
} as EditorThemeClasses;

const onError = (error: Error) => {
  console.error(error);
  toast.error(`The editor responded with the error: ${error.message}`);
};

export const getInitialConfig = ({
  mode,
  noteBody
}: Params) => ({
    namespace: mode === "read" ? "ReadOnlyNoteEditor": "NoteEditor",
    theme,
    onError,
    editorState: noteBody,
    editable: mode === "write",
    nodes: [ListNode, ListItemNode]
  } satisfies InitialConfigType);