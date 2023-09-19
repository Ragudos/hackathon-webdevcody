import React from "react";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebsocketProvider } from "y-websocket";
import { Provider } from "@lexical/yjs";
import * as Y from "yjs";

type Props = {
  noteID: Id<"notes">,
  user: Doc<"users"> | null | undefined,
}

export const ExtendedCollaborationPlugin: React.FC<Props> = React.memo(
  ({ noteID, user }) => (
    <React.Fragment>
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
  )
);