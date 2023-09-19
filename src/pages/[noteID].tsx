import type { Id, Doc } from "../../convex/_generated/dataModel";

import React from "react";
import toast from "react-hot-toast";

import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

import { useNavigate, useParams } from "react-router-dom";

import { AuthWrapper } from "@/components/auth-wapper";
import { RotatingLoader } from "@/components/rotating-loader";

const BackButton = React.lazy(() => import("@/components/back-button"));
const NotePage = React.lazy(() => import("./[noteID]/note-page"));

interface NoteContextType {
  note: Doc<"notes"> | null,
  isCurrentUserNoteOwner: boolean,
  doesCurrentUserHaveWriteAccess: boolean
}

export const NoteContext = React.createContext<NoteContextType>({
  note: null,
  isCurrentUserNoteOwner: false,
  doesCurrentUserHaveWriteAccess: false
});

const NoteContextProvider: React.FC<{ children: React.ReactNode, noteID: Id<"notes"> }> = ({
  noteID,
  children
}) => {
  const foundNote = useQuery(api.notes.getNote, { noteID });

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!noteID) {
      toast.error("Please provide a note ID.");
      navigate("/", { replace: true });
    } else if (foundNote === "You have no permission to read this note.") {
      toast.error(foundNote);
      navigate("/", { replace: true });
    } else if (foundNote === null) {
      toast.error("Either this note does not exist or you are not authorized to view it.");
      navigate("/", { replace: true });
    }
  }, [noteID, foundNote, navigate]);

  if (foundNote === "You have no permission to read this note." || foundNote === null) {
    return null;
  }

  if (!foundNote) {
    return null;
  }

  if (!foundNote.note) {
    return (
      <div>
        This note does not exist.
        <React.Suspense>
          <BackButton />
        </React.Suspense>
      </div>
    );
  }

  const data = {
    note: foundNote.note,
    doesCurrentUserHaveWriteAccess: foundNote.doesUserHaveWriteAccess,
    isCurrentUserNoteOwner: foundNote.isCurrentUserNoteOwner
  } satisfies NoteContextType;

  return (
    <NoteContext.Provider value={data}>
      {children}
    </NoteContext.Provider>
  );
};

export const Component: React.FC = () => {
  const { noteID } = useParams();

  return (
    <AuthWrapper>
      <NoteContextProvider noteID={noteID as Id<"notes">}>
        <React.Suspense
          fallback={
            <div className="h-[80dvh]">
              <RotatingLoader />
            </div>
          }
        >
          <NotePage />
        </React.Suspense>
      </NoteContextProvider>
    </AuthWrapper>
  );
};

Component.displayName = "NotePageWrapper";