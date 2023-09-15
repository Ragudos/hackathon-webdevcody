import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteNoteBtn } from "@/components/delete-note-btn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Note } from "../notes";
import { Button } from "@/components/ui/button";
import { ListOfUsersWithAccess } from "./list-of-users-with-access";

type ToolBarProps = {
  setMode: React.Dispatch<React.SetStateAction<"read" | "write">>;
  doesUserHavePermissionToEdit: boolean;
  isCurrentUserNoteOwner: boolean;
} & Note;

export const NoteToolBar: React.FC<ToolBarProps> = React.memo(({
  note,
  doesUserHavePermissionToEdit,
  isCurrentUserNoteOwner,
}) => (
  <nav className="flex justify-between">
    <ul className="flex items-center">
      <li>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-none hover:text-inherit hover:bg-accent/20"
              size="sm"
            >
              File
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent alignOffset={2} align="start" asChild>
            <div className="flex flex-col items-center shadow-md shadow-black/20">
              <DeleteNoteBtn
                iconStyles="w-4 h-4"
                className="justify-start w-full p-1"
                noteID={note._id}
                text="Delete"
              />
              <hr className="bg-foreground/50 w-full" />
              {doesUserHavePermissionToEdit && (
                <Button
                  variant="ghost"
                  className="justify-start w-full gap-2 p-1 hover:text-inherit hover:bg-accent/20"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                  </svg>
                  Edit
                </Button>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    </ul>

    {isCurrentUserNoteOwner && (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="gap-2 hover:text-inherit hover:bg-accent/20 rounded-none"
            size="sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Share
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Access With Others</DialogTitle>
            <DialogDescription>
              Give access to other people to either read or edit your note.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <ListOfUsersWithAccess note={note} />

            <div></div>
          </div>
        </DialogContent>
      </Dialog>
    )}
  </nav>
));

NoteToolBar.displayName = "NoteToolbar";