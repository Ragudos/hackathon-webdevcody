import type { Doc } from "../../../convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ListOfUsersWithAccess from "./list-of-users-with-access";

type Props = {
  note: Doc<"notes">
}

const ShareAccess: React.FC<Props> = ({
  note
}) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="ghost"
        className="gap-2 rounded-none"
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
    </div>
  </DialogContent>
  </Dialog >
);

export default ShareAccess;