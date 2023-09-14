import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import toast from "react-hot-toast";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = {
  noteID: Id<"notes">,
  text?: string,
  className?: string,
  iconStyles?: string
}

export const DeleteNoteBtn: React.FC<Props> = ({
  noteID,
  text,
  className,
  iconStyles
}) => {
  const deleteNote = useMutation(api.notes.deleteNotes);

  const handleDelete = () => {
    const response = deleteNote({ noteIDs: noteID });
    if (response === null || response instanceof Error) {
      toast.error("Failed to delete note.");
    } else {
      toast.success("The note has been deleted.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button aria-label="Delete Note" title="Delete Note" className={cn(
          "gap-2 h-auto w-auto hover:text-inherit hover:bg-accent/20",
          className
        )} size="icon" variant="ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cn(
            "w-5 h-5",
            iconStyles
          )}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          {text}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>This action cannot be undone. This will
          permanently delete this note, and all corresponding data related with this note
          &#40;e.g. messages&#41;.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={handleDelete}>
            <Button variant="destructive">
              Delete Anyway
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};