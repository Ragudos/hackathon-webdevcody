import type { Doc } from "../../../../convex/_generated/dataModel";
import type { ViewMode } from "../note-page";

import React from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";

import { getInitialConfig } from "./config";
import { EMPTY_BODY_JSON } from "@/config/site";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";

import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ExtendedCollaborationPlugin } from "./plugins/collaboration";

type Props = {
  note: Doc<"notes">,
  user?: Doc<"users">,
  mode: ViewMode,
  setBody: React.Dispatch<React.SetStateAction<string>>
}

const BodyEditor: React.FC<Props> = React.memo(
  ({
    mode,
    note,
    user,
    setBody
  }) => {
    const [activeFormatInCode, setActiveFormatInCode] = React.useState(0);

    return (
      <LexicalComposer initialConfig={getInitialConfig({ mode, noteBody: note.body ?? EMPTY_BODY_JSON })}>
        <HistoryPlugin />
        <ListPlugin />

        <section className="border-b-[1px] p-1 flex flex-wrap gap-1">
          <h5 className="sr-only">Rich Text Toolbar</h5>
        </section>

        <ExtendedCollaborationPlugin
          noteID={note._id}
          user={user}
          setBody={setBody}
        />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                autoFocus
                className="relative min-h-[10rem] z-10 focus:outline-none focus:ring-0"
                id="note-body"
              />
            }
            placeholder={
              <div
                className="select-none z-0 opacity-60 absolute top-0 left-0"
              >
                Add a body to your note...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </LexicalComposer>
    );
  }
);

BodyEditor.displayName = "BodyEditor";
export default BodyEditor;