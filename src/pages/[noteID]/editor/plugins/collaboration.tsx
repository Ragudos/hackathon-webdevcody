import React from "react";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebsocketProvider } from "y-websocket";
import { Provider } from "@lexical/yjs";
import * as Y from "yjs";
import { EditorState } from "lexical";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

type Props = {
  noteID: Id<"notes">,
  user: Doc<"users"> | null | undefined,
  setBody: React.Dispatch<React.SetStateAction<string>>
}

export const ExtendedCollaborationPlugin: React.FC<Props> = React.memo(
  ({ noteID, user, setBody }) => {

    const onChange = React.useCallback(
      (editorState: EditorState) => {
        editorState.read(() => {
          setBody(JSON.stringify(editorState));
        });
      },
      [setBody]
    );

    return (
      <React.Fragment>
        <OnChangePlugin onChange={onChange} />
        <CollaborationPlugin
          id={noteID}
          providerFactory={(id, yjsDocMap) => {
            const doc = new Y.Doc();
            yjsDocMap.set(id, doc);

            const indexeddbProvider = new IndexeddbPersistence(id, doc);

            indexeddbProvider.whenSynced.then(() => {
              console.log("SYNCED");
            });

            const provider = new WebsocketProvider(
              "ws://localhost:1234",
              id,
              doc,
              {
                resyncInterval: 1000,
                disableBc: true
              }
            ) as unknown as Provider;
            return provider;
          }}
          shouldBootstrap={true}
          username={user?.name}
        />
      </React.Fragment>
    );
  }
);