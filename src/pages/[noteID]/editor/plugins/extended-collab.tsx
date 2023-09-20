import React from "react";

import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { WebsocketProvider } from "y-websocket";
import { Provider } from "@lexical/yjs";
import * as Y from "yjs";
import type { Doc, Id } from "../../../../../convex/_generated/dataModel";

import { IndexeddbPersistence } from "y-indexeddb";
import { $createParagraphNode, $createTextNode, $getRoot, LexicalEditor } from "lexical";

type Props = {
  noteID: Id<"notes">,
  noteBody: string | undefined;
  user: Doc<"users"> | null | undefined
}

const initialEditorState = (_editor: LexicalEditor) => {
  const root = $getRoot();
  const paragraph = $createParagraphNode();
  const text = $createTextNode("Try typing!");
  paragraph.append(text);
  root.append(paragraph);
};

export const ExtendedCollabPlugin: React.FC<Props> = React.memo(
  ({ noteID, noteBody, user }) => (
    <CollaborationPlugin
      id={noteID}
      initialEditorState={noteBody ?? initialEditorState}
      providerFactory={(id, yjsDocMap) => {
        const doc = new Y.Doc();
        yjsDocMap.set(id, doc);

        new IndexeddbPersistence(id, doc);

        const provider = new WebsocketProvider(
          "ws://localhost:1234",
          id,
          doc
        ) as unknown as Provider;
        return provider;
      }}
      username={user?.name}
      shouldBootstrap={true}
    />
  )
);