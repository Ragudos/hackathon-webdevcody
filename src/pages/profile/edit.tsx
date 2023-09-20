import type { ViewMode } from "../[noteID]/note-page";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";

import { useMutation } from "convex/react";

import React from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  id: Id<"users">,
  currentName: string,
  setToggle: React.Dispatch<React.SetStateAction<ViewMode>>
}

const EditProfile: React.FC<Props> = React.memo(
  ({ id, setToggle, currentName }) => {
    const updateUserInfo = useMutation(api.users.updateUserName);
    const [transition, startTransition] = React.useTransition();
    const [name, setName] = React.useState(currentName);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name) {
        toast.error("Name is required.");
      }

      startTransition(() => {
        void updateUserInfo({
          userID: id,
          newName: name
        });

        setToggle("read");
      });
    };

    return (
      <form className="flex flex-col gap-4" action="" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="name-input">Username*</label>
          <Input
            type="text"
            placeholder="Enter your name..."
            required
            minLength={1}
            onChange={(e) => {
              if (!transition) {
                setName(e.target.value);
              }
            }}
            value={name}
            disabled={transition}
          />
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            title="Save changes"
            aria-label="Save changes"
            type="submit"
            disabled={transition || name.length === 0}
          >
            Save
          </Button>

          <Button
            size="sm"
            variant="secondary"
            aria-label="Cancel"
            onClick={() => {
              setToggle("read");
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }
);

EditProfile.displayName = "EditProfile";
export default EditProfile;