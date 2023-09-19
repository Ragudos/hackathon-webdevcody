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
import { $getSelection, $isRangeSelection, EditorState, TextNode } from "lexical";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import TextFormatPlugin from "./plugins/text-format";
import { RGB } from "@/consts";
import { TextColorPlugin } from "./plugins/text-color";
import { BackgroundColorPlugin } from "./plugins/background-color";

type Props = {
  note: Doc<"notes">,
  user?: Doc<"users">,
  mode: ViewMode,
  setBody: React.Dispatch<React.SetStateAction<string>>
}


// TODO: REUSE LOGIC
const BodyEditor: React.FC<Props> = React.memo(
  ({
    mode,
    note,
    user,
    setBody
  }) => {
    const [activeFormatInCode, setActiveFormatInCode] = React.useState(0);
    const [activeTextColor, setActiveTextColor] = React.useState<RGB>();
    const [activeBgColor, setActiveBgColor] = React.useState<RGB>();

    const onChange = React.useCallback(
      (editorState: EditorState) => {
        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setActiveFormatInCode(selection.format);

            if (!selection.style) {
              setActiveTextColor([0, 0, 0]);
              setActiveBgColor(undefined);
            }

            selection.getNodes().forEach((node) => {
              if (node instanceof TextNode) {
                const nodeStyle = node.getStyle();
                const prevBackground = nodeStyle.split("background-color: ");
                if (prevBackground[0]) {
                  const prevColor = prevBackground[0].split("color: ")[1];
                  const prevColorArr = [];
                  let str = "";
                  for (let idx = 4; idx < prevColor.length; ++idx) {
                    const item = +prevColor[idx];
                    if (!isNaN(item)) {
                      str += item;
                    }

                    if (str && isNaN(item)) {
                      prevColorArr.push(+str);
                      str = "";
                    }
                  }
                  setActiveTextColor(prevColorArr as RGB ?? [0, 0, 0]);
                } else {
                  setActiveTextColor([0, 0, 0]);
                }
                const prevBg = prevBackground[1];
                const prevBgArr = [];
                  let str = "";
                  for (let idx = 4; prevBg && idx < prevBg.length; ++idx) {
                    const item = +prevBg[idx];
                    if (!isNaN(item)) {
                      str += item;
                    }

                    if (str && isNaN(item)) {
                      prevBgArr.push(+str);
                      str = "";
                    }
                  }
                setActiveBgColor(prevBgArr.length === 3 ? prevBgArr as RGB : undefined);
              }
            });
          }
          setBody(JSON.stringify(editorState));
        });
      },
      [setBody]
    );

    return (
      <LexicalComposer initialConfig={getInitialConfig({ mode, noteBody: note.body ?? EMPTY_BODY_JSON })}>
        <HistoryPlugin />
        <ListPlugin />

        <section className="border-b-[1px] p-1 flex flex-wrap gap-1">
          <h5 className="sr-only">Rich Text Toolbar</h5>
          <TextFormatPlugin
            activeFormat={activeFormatInCode}
          />

          <div className="h-6 my-auto w-[0.1rem] bg-black" />

          <TextColorPlugin
            activeTextColor={activeTextColor}
            setActiveTextColor={setActiveTextColor}
          />
          <BackgroundColorPlugin
            activeBgColor={activeBgColor}
            setActiveBgColor={setActiveBgColor}
          />
        </section>

        <OnChangePlugin onChange={onChange} />
        <ExtendedCollaborationPlugin
          noteID={note._id}
          user={user}
        />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                autoFocus
                className="p-1 relative min-h-[10rem] z-10 focus:outline-none focus:ring-0"
                id="note-body"
              />
            }
            placeholder={
              <div
                className="select-none z-0 opacity-60 absolute top-0 left-0 p-1"
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