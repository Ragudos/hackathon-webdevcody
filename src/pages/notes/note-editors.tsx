import React from "react";
import toast from "react-hot-toast";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { Note } from "../notes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NoteBodyEditor } from "./note-body-editor";
import { EditorState } from "lexical";

type Props = {
	isWithPermissionToWrite: boolean;
	setMode: React.Dispatch<React.SetStateAction<"read" | "write">>;
	setBody: React.Dispatch<React.SetStateAction<string>>;
	body: string;
} & Note;

const HEARTBEAT = 2000;

export const NoteEditor: React.FC<Props> = React.memo(
	({ note, setMode, body, setBody }) => {
		const [isSaving, setIsSaving] = React.useState(false);

		const [title, setTitle] = React.useState(note.title);
		const [description, setDescription] = React.useState(note.description);

		const updateNote = useMutation(api.notes.updateNote);

		const setState = React.useCallback(
			(state: EditorState) => {
				setBody(JSON.stringify(state));
			},
			[setBody],
		);

		React.useEffect(() => {
			setTitle(note.title);
		}, [note.title]);

		React.useEffect(() => {
			setDescription(note.description);
		}, [note.description]);

		React.useEffect(() => {
			const timeout = setTimeout(async () => {
				if (
					title !== note.title ||
					description !== note.description ||
					body !== note.body
				) {
					setIsSaving(true);
					const response = await updateNote({
						title,
						description,
						body,
						noteID: note._id,
					});
					setIsSaving(false);

					if (response === null) {
						toast.error("Something went wrong with updating this note.");
					}
				}
			}, HEARTBEAT);
			return () => {
				clearTimeout(timeout);
			};
		}, [
			note._id,
			note.title,
			note.description,
			note.body,
			body,
			title,
			description,
			updateNote,
		]);

		return (
			<React.Fragment>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<label htmlFor="title-input" className="text-2xl font-bold">
							Title
						</label>
						<Input
							placeholder="Enter your note title..."
							type="text"
							value={title}
							className="placeholder:text-black/60 font-heading text-xl h-12"
							onChange={(e) => setTitle(e.target.value)}
							aria-label="Note Title"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label htmlFor="description-input" className="text-xl font-bold">
							Description
						</label>
						<Textarea
							placeholder="Enter your note description..."
							className="placeholder:text-black/60 text-lg min-h-[10rem]"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							aria-label="Note Description"
						/>
					</div>
				</div>

				<div className="mt-8 flex flex-col gap-1">
					<label htmlFor="note-body" className="text-lg font-bold">
						Body
					</label>
					<div className="border border-border focus-within:outline-border focus-within:outline focus-within:outline-1 focus-within:ring-1 focus-within:outline-offset-2 focus-within:ring-transparent rounded-lg">
						<NoteBodyEditor
							noteBody={body}
							mode={"write"}
							setState={setState}
							styles="p-2"
							placeholderStyles="p-2"
						/>
					</div>
				</div>

				<div className="mt-8 flex justify-end gap-4">
					{isSaving && (
						<div className="flex gap-2 items-center">
							Saving...
							<span className="w-4 h-4 border border-r-black animate-spin rounded-full" />
						</div>
					)}

					{!isSaving && (
						<div className="flex gap-1 items-center">
							Saved!
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
									d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					)}
					<Button
						type="button"
						size="sm"
						variant="secondary"
						onClick={async () => {
							if (!title) {
								toast("Title must not be empty.");
								return;
							}

							if (
								note.title !== title ||
								note.description !== description ||
								note.body !== body
							) {
								const response = await updateNote({
									title,
									description,
									body,
									noteID: note._id,
								});
								if (response === null) {
									toast.error("Something went wrong with updating this note.");
								}
							}
							setMode("read");
						}}
					>
						Back to Read Mode
					</Button>
				</div>
			</React.Fragment>
		);
	},
);

NoteEditor.displayName = "NoteEditor";
