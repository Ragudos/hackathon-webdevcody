import React from "react";

import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListNode, ListItemNode } from "@lexical/list";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState } from "lexical";
import { cn } from "@/lib/utils";

type Props = {
  noteBody: string | undefined,
  mode: "read" | "write",
  setState?: (state: EditorState) => void,
  styles?: string,
  placeholderStyles?: string
}

const theme = {};

const onError = (error: Error) => {
  console.error(error);
};

export const NoteBodyEditor: React.FC<Props> = React.memo(({ noteBody, mode, setState, styles, placeholderStyles }) => {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    editorState: noteBody,
    editable: mode === "write",
    nodes: [HeadingNode, ListNode, ListItemNode]
  };

  const onChange = React.useCallback((state: EditorState) => {
    if (setState) {
      setState(state);
    }
  }, [setState]);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ListPlugin />
      <OnChangePlugin onChange={onChange} />
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className={cn(
              "relative z-10 min-h-[10rem] focus:outline-none focus:ring-0",
              styles
            )}
            id="note-body"
          />
        }
        placeholder={
          <div className={cn(
            "select-none z-0 opacity-60 absolute top-0 left-0",
            placeholderStyles
          )}>Add a body to your note...</div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />

      <HistoryPlugin />
    </LexicalComposer>
  );
});

NoteBodyEditor.displayName = "NoteBodyEditor";