import { Doc } from "convex/_generated/dataModel";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SharedNoteCard: React.FC<{ n: Doc<"notes"> }> = ({
  n
}) => (
  <div
    style={{
      backgroundColor: `hsl(var(--${n.noteTheme}))`,
      color: `hsl(var(--${n.noteTheme}-foreground))`
    }}
    className="flex items-center p-4 justify-between gap-4 rounded-lg shadow-black/20 shadow-md dark:border"
  >
    <div className="flex flex-col gap-4 flex-1">
      <div
        className={cn(
          "flex flex-col gap-1",
          { "opacity-60": !n.title }
        )}
      >
        <div className="font-heading text-2xl">{n.title || "No title..."}</div>
        <p className={!n.description ? "opacity-60" : undefined}>{n.description || "No description..."}</p>
      </div>
      <time className="text-xs opacity-80" dateTime={new Date(n._creationTime).toDateString()}>
        {new Date(n._creationTime).toDateString()}
      </time>
    </div>
    <div className="flex items-center">
      <Button size="sm" variant="outline" asChild>
        <Link
          title="View Note"
          aria-label="View Note"
          to={`${location.origin}/notes/${n._id}`}
        >
          View Note
        </Link>
      </Button>
    </div>
  </div>
);

export default SharedNoteCard;