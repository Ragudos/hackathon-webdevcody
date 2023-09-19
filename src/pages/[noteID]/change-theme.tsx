import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NOTE_CONSTS } from "@/config/site";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import React from "react";

type Props = {
  noteTheme: typeof NOTE_CONSTS.theme[number],
  noteID: Id<"notes">
}

const ChangeTheme: React.FC<Props> = React.memo(
  ({ noteTheme, noteID }) => {
    const [toggle, setToggle] = React.useState(false);

    const [, startTransition] = React.useTransition();

    const updateTheme = useMutation(api.notes.updateNoteTheme);

    return (
      <Popover open={toggle} onOpenChange={(state) => setToggle(state)}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-none"
            size="sm"
            type="button"
            title="Toggle Change Note Theme"
            aria-label="Toggle Change Note Theme"
          >
            Change Note Theme
          </Button>
        </PopoverTrigger>

        <PopoverContent asChild className="animate-slidedown" alignOffset={5} align="start">
          <section className="p-1 rounded-lg shadow-black/20 shadow-md">
            <Heading typeOfHeading="h5">Change note theme</Heading>
            <hr className="mb-2 h-1" />

            <div className="flex">
              {NOTE_CONSTS.theme.map((t) => (
                <Button key={t}
                  className="relative h-14 rounded-none p-0 group"
                  onClick={() => {
                    startTransition(() => {
                      void updateTheme({ noteID, noteTheme: t });
                    });
                    setToggle(false);
                  }}
                  style={{
                    backgroundColor: `hsl(var(--${t}))`,
                    width: `${100 / NOTE_CONSTS.theme.length}%`
                  }}
                >
                  <span
                    className={cn(
                      "group-hover:bg-black/20 absolute w-full justify-center items-center flex h-full",
                      { "bg-black/40 backdrop-blur-sm group-hover:bg-black/30": t === noteTheme }
                    )}
                  >
                    {t === noteTheme && (
                      <CheckIcon className="w-4 h-4" />
                    )}
                  </span>
                </Button>
              ))}
            </div>
          </section>
        </PopoverContent>
      </Popover>
    );
  }
);

ChangeTheme.displayName = "ChangeTheme";
export default ChangeTheme;