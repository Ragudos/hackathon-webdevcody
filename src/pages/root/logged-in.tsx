import React from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { SearchBar } from "@/components/search-bar";
import { Heading } from "@/components/ui/heading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type NoteThemes = "green" | "pink" | "blue" | "orange" | "purple" | "slate";
type NoteCategories = "education" | "work" | "story" | "personal";

const CATEGORIES = ["education", "work", "story", "personal"];
const MAX_TITLE_LENGTH = 48;
const MAX_DESCRIPTION_LENGTH = 200;

const CreateNote: React.FC = () => {
  const [toggle, setToggle] = React.useState(false);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [theme, setTheme] = React.useState<NoteThemes>("green");
  const [category, setCategory] = React.useState<NoteCategories>("education");

  const addNote = useMutation(api.notes.writeNotes);

  const handleCreation = (e: React.FormEvent) => {
    e.preventDefault();
    setToggle(false);

    const loadingToast = toast.loading("Adding a new note titled, " + title);

    const response = addNote({ title, description, theme, category });
    setTitle("");
    setDescription("");

    toast.dismiss(loadingToast);

    if (response && !(response instanceof Error)) {
      toast.success("Your note has been created successfully.");
    } else {
      toast.error("Failed to create a new note.");
    }
  };

  return (
    <Dialog open={toggle} onOpenChange={(state) => setToggle(state)}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
          </svg>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a new note</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreation} action="">
          <div className="flex flex-col gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="note-title" className="flex justify-between">
                Title
                <span>{title.length} / {MAX_TITLE_LENGTH}</span>
              </label>
              <Input
                autoComplete="off"
                required
                minLength={3}
                maxLength={MAX_TITLE_LENGTH}
                placeholder="A title of your note..."
                id="note-title"
                value={title}
                onChange={(e) => {
                  if (title.length <= MAX_TITLE_LENGTH) {
                    setTitle(e.target.value);
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="note-description" className="flex justify-between">
                Description
                <span>{description.length} / {MAX_DESCRIPTION_LENGTH}</span>
              </label>
              <Textarea
                autoComplete="off"
                placeholder="A description of your note..."
                id="note-description"
                maxLength={MAX_DESCRIPTION_LENGTH}
                className="min-h-[5rem]"
                value={description}
                onChange={(e) => {
                  if (description.length <= MAX_DESCRIPTION_LENGTH) {
                    setDescription(e.target.value);
                  }
                }}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="note-theme" className="flex items-center gap-2">
                  Theme
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: `hsl(var(--${theme}))`,
                    }}
                  />
                </label>
                <select
                  className="py-1 px-2 rounded-lg w-full focus:outline focus:outline-1 bg-background border"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as NoteThemes)}
                >
                  <option disabled>Select a theme</option>
                  <option value="green">green</option>
                  <option value="pink">pink</option>
                  <option value="blue">blue</option>
                  <option value="orange">orange</option>
                  <option value="purple">purple</option>
                  <option value="slate">slate</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="note-category"
                  className="flex items-center gap-2"
                >
                  Category
                </label>
                <select
                  className="py-1 px-2 rounded-lg w-full focus:outline focus:outline-1 bg-background border"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as NoteCategories)
                  }
                >
                  <option disabled>Select a category</option>
                  <option value="education">education</option>
                  <option value="work">work</option>
                  <option value="story">story</option>
                  <option value="personal">personal</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={title.length <= 2}>
              Add Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const LoggedInPage: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<NoteCategories>();
  const notes = useQuery(api.notes.getNotes, { title: search, category });

  const onChange = React.useCallback((value: string) => {
    setSearch(value);
  }, []);

  return (
    <React.Fragment>
      <section className="grid gap-8">
        <header className="flex flex-col">
          <Heading typeOfHeading="h1">My Notes</Heading>
          <div className="flex justify-between gap-2 items-center">
            <div className="items-center flex gap-2 flex-1">
              <CreateNote />
              <SearchBar
                placeholder="Search for your notes..."
                onChange={onChange}
                value={search}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="gap-2" aria-label="Search Filter" title="Search Filters">
                  <span className="sr-only md:not-sr-only">Filters</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Find your notes faster</DialogTitle>
                  <DialogDescription>This will automatically filter your notes upon choosing.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-wrap gap-4 py-4">
                  <section>
                    <Heading typeOfHeading="h5">Category</Heading>
                    <div className="flex flex-col gap-1 mt-1">
                      {CATEGORIES.map((c) => (
                        <Button
                          variant="link"
                          className={cn(
                            "font-light h-auto p-1 justify-start hover:no-underline opacity-50 hover:opacity-70",
                            { "opacity-100 hover:opacity-90": c === category }
                          )}
                          key={c}
                          onClick={() => {
                            setCategory((current) => {
                              if (current === c) {
                                return undefined;
                              } else {
                                return c as NoteCategories;
                              }
                            });
                          }}
                        >
                          {c}
                        </Button>
                      ))}
                    </div>
                  </section>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-4">
          {notes &&
            notes.map((note) => (
              <div
                key={note._id}
                style={{
                  backgroundColor: `hsl(var(--${note.theme}))`,
                  color: `hsl(var(--${note.theme}-foreground))`,
                }}
                className="group overflow-auto break-words whitespace-pre-wrap p-4 shadow-md shadow-black/20 dark:border border-border rounded-lg"
              >
                <div className="text-end text-xs mb-1">
                  
                  <time className="select-none group-hover:opacity-0" dateTime={new Date(note._creationTime).toISOString()}>
                    {new Date(note._creationTime).toDateString()}
                  </time>
                </div>
                <Heading
                  typeOfHeading="h4"
                  containerStyles="text-start"
                  description={note.description || "Add a descrption to your note..."}
                  descriptionStyles={note.description ? "opacity-90 text-sm lg:text-sm" : "opacity-50 text-sm lg:text-sm"}
                >
                  {note.title}
                </Heading>
              </div>
            ))}
        </div>
      </section>
    </React.Fragment>
  );
};

export default LoggedInPage;
