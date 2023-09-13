import React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SearchBar } from "@/components/search-bar";
import { Heading } from "@/components/ui/heading";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

type Props = {
  displayName: string,
}

type NoteThemes = "green" | "pink" | "blue" | "orange" | "purple" | "slate";
type NoteCategories = "education" | "work" | "story" | "personal";

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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
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
              <label htmlFor="note-title">Title</label>
              <Input required minLength={3} placeholder="A title of your note..." id="note-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="note-description">Description</label>
              <Input placeholder="A description of your note..." id="note-description" value={description} onChange={(e) => setDescription(e.target.value)} />
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
                <label htmlFor="note-category" className="flex items-center gap-2">
                  Category
                </label>
                <select
                  className="py-1 px-2 rounded-lg w-full focus:outline focus:outline-1 bg-background border"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NoteCategories)}
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

const LoggedInPage: React.FC<Props> = ({
  displayName
}) => {
  const [search, setSearch] = React.useState("");
  const notes = useQuery(api.notes.getNotes, { title: search });

  const onChange = React.useCallback((value: string) => {
    setSearch(value);
  }, []);

  return (
    <React.Fragment>
      <section className="grid gap-8">
        <header className="flex flex-col">
          <Heading typeOfHeading="h1">
            My Notes
          </Heading>
          <div className="items-center flex gap-2">
            <CreateNote />
            <SearchBar
              placeholder="Search for your notes..."
              onChange={onChange}
              value={search}
            />
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-4">
          {notes && notes.map((note) => (
            <div
              key={note._id}
              style={{ backgroundColor: `hsl(var(--${note.theme}))`, color: `hsl(var(--${note.theme}-foreground))` }}
            >
              <div>
                {note.title}
              </div>
              <hr />
              {note.description && (
                <div>{note.description}</div>
              )}
              {!note.description && (
                <div className="opacity-50">
                  Add a description...
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </React.Fragment>
  );
};

export default LoggedInPage;