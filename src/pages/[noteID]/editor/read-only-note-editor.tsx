import type { ViewMode } from "../note-page";

import React from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";

import { getInitialConfig } from "./config";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { cn } from "@/lib/utils";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

type Props = {
  noteBody: string,
  mode: ViewMode
}

const ReadOnlyNoteEditor: React.FC<Props> = React.memo(
  ({
    noteBody,
    mode
  }) => (
    <div className="mt-8">
      <LexicalComposer initialConfig={getInitialConfig({ mode, noteBody })}>
        <ListPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={cn(
                  "relative z-10 min-h-[10rem] focus:outline-none focus:ring-0"
                )}
                id="note-body"
              />
            }
            placeholder={
              <div
                className={cn(
                  "select-none z-0 opacity-60 absolute top-0 left-0",
                )}
              >
                Add a body to your note...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </LexicalComposer>
    </div>
  )
);

ReadOnlyNoteEditor.displayName = "ReadOnlyNoteEditor";
export default ReadOnlyNoteEditor;