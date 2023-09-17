import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";

import React from "react";
import toast from "react-hot-toast";

import { NOTE_CONSTS } from "@/config/site";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const CreateNote: React.FC = React.memo(
  () => {
    const [toggle, setToggle] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [theme, setTheme] = React.useState<typeof NOTE_CONSTS.theme[number]>("blue");
    const [category, setCategory] = React.useState<typeof NOTE_CONSTS.categories[number]>("education");

    const addNote = useMutation(api.notes.writeNotes);

    const handleCreation = async (e: React.FormEvent) => {
      e.preventDefault();
      setToggle(false);

      const loadingToast = toast.loading("Adding a new note title, " + title);

      try {
        const response = await addNote({
          title,
          description,
          noteTheme: theme,
          category
        });

        toast.dismiss(loadingToast);

        if (response === "success") {
          toast.success("Your note has been created successfully.");
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Failed to create a new note.");
      }
    };

    return (
      <Dialog open={toggle} onOpenChange={(state) => setToggle(state)}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Add a new note
            </DialogTitle>
            <DialogDescription>
              You will be able to write the body after creation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreation} action="">
            <div className="flex flex-col gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="note-title" className="flex justify-between">
                  Title* &#40;A minimum of 3 characters&#41;
                  <span>
                    {title.length} / {NOTE_CONSTS.maxTitleLength}
                  </span>
                </label>
                <Input
                  autoComplete="off"
                  required
                  minLength={3}
                  maxLength={NOTE_CONSTS.maxTitleLength}
                  placeholder="A title of your note..."
                  id="note-title"
                  value={title}
                  onChange={(e) => {
                    if (title.length <= NOTE_CONSTS.maxTitleLength) {
                      setTitle(e.target.value);
                    }
                  }}
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="note-description"
                  className="flex justify-between"
                >
                  Description
                  <span>
                    {description.length} / {NOTE_CONSTS.maxDescriptionLength}
                  </span>
                </label>
                <Textarea
                  autoComplete="off"
                  placeholder="A description of your note..."
                  id="note-description"
                  maxLength={NOTE_CONSTS.maxDescriptionLength}
                  className="min-h-[5rem]"
                  value={description}
                  onChange={(e) => {
                    if (description.length <= NOTE_CONSTS.maxDescriptionLength) {
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
                    onChange={(e) => setTheme(e.target.value as typeof NOTE_CONSTS.theme[number])}
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
                      setCategory(e.target.value as typeof NOTE_CONSTS.categories[number])
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
  }
);

CreateNote.displayName = "CreateNote";