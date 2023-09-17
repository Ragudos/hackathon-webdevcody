import React from "react";

import { NOTE_CONSTS } from "@/config/site";

import { cn } from "@/lib/utils";

import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heading } from "@/components/ui/heading";

import { CreateNote } from "./create-note";

type Props = {
  search: string,
  category: typeof NOTE_CONSTS.categories[number] | undefined,
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  setCategory: React.Dispatch<React.SetStateAction<typeof NOTE_CONSTS.categories[number] | undefined>>
}

export const Header: React.FC<Props> = React.memo(
  ({ search, category, setCategory, setSearch }) => {
    const onChange = React.useCallback(
      (value: string) => {
        setSearch(value);
      },
      [setSearch]
    );

    return (
      <header className="flex flex-col">
        <Heading typeOfHeading="h1">My Notes</Heading>

        <div className="flex justify-between gap-2 items-center">
          <div className="flex items-center gap-2 flex-1">
            <CreateNote />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2"
                aria-label="Search Filter"
                title="Search Filter"
              >
                <span className="sr-only sm:not-sr-only">Filters</span>
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
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
                </svg>
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Find your notes faster</DialogTitle>
                <DialogDescription>
                  This listens to your selection realtime. You can close this
                  upon finishing your filter.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2">
                <SearchBar
                  placeholder="Search for your notes..."
                  value={search}
                  onChange={onChange}
                />

                <section className="flex flex-wrap gap-4 py-4">
                  <Heading className="sr-only" typeOfHeading="h5">Filter by categories</Heading>
                  <div>
                    <Heading typeOfHeading="h5">Category</Heading>
                    <div className="flex flex-col gap-1 mt-1">
                      {NOTE_CONSTS.categories.map((c) => (
                        <Button
                          key={c}
                          variant="link"
                          className={cn(
                            "dark:font-light h-auto p-1 justify-start hover:no-underline opacity-50 hover:opacity-70",
                            {
                              "opacity-100 hover:opacity-90": c === category,
                            },
                          )}
                          onClick={() => {
                            setCategory((current) => current === c ? undefined : c);
                          }}
                        >
                          {c}
                        </Button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>
    );
  }
);

Header.displayName = "NoteCardHeader";