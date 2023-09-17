import type { Doc, Id } from "convex/_generated/dataModel";

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { AuthWrapper } from "@/components/auth-wapper";
import { Heading } from "@/components/ui/heading";

import { NoteToolBar } from "./notes/note-toolbar";
import { NoteEditor } from "./notes/note-editors";
import { NoteBodyEditor } from "./notes/note-body-editor";

export type Note = {
	note: Doc<"notes">;
};

type NotePageProps = {
	isCurrentUserNoteOwner: boolean;
	doesUserHaveWriteAccess: boolean;
};

export type AllowedUser = {
	user: Doc<"users">;
	accessType: "read" | "write";
};

const EMPTY_BODY_JSON =
	"{\"root\":{\"children\":[{\"children\":[],\"direction\":null,\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":null,\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}";

export const Component: React.FC = () => {
	const { noteID } = useParams();

	const note = useQuery(api.notes.getNote, { noteID: noteID as Id<"notes"> });
	const navigate = useNavigate();

	React.useEffect(() => {
		if (
			!noteID ||
			note === null ||
			note === "You have no permission to read this note."
		) {
			if (note === "You have no permission to read this note.") {
				toast.error(note);
			}
			navigate("/");
		}
	}, [note, navigate, noteID]);

	return (
		<AuthWrapper>
			{note && note !== "You have no permission to read this note." && (
				<NotePage
					note={note.note}
					isCurrentUserNoteOwner={note.isCurrentUserNoteOwner}
					doesUserHaveWriteAccess={note.doesUserHaveWriteAccess}
				/>
			)}
		</AuthWrapper>
	);
};

const NotePage: React.FC<Note & NotePageProps> = ({
	note,
	isCurrentUserNoteOwner,
	doesUserHaveWriteAccess,
}) => {
	const [mode, setMode] = React.useState<"read" | "write">("read");
	const [body, setBody] = React.useState(note.body ?? EMPTY_BODY_JSON);

	React.useEffect(() => {
		if (
			mode === "write" &&
			!doesUserHaveWriteAccess &&
			!isCurrentUserNoteOwner
		) {
			toast.error(
				"Your write access has been revoked. Please contact the owner of this note.",
			);
			setMode("read");
		}
	}, [mode, doesUserHaveWriteAccess, isCurrentUserNoteOwner]);

	React.useEffect(() => {
		setBody(note.body ?? EMPTY_BODY_JSON);
	}, [note.body]);

	return (
		<div
			style={{
				backgroundColor: `hsl(var(--${note.noteTheme}))`,
				color: `hsl(var(--${note.noteTheme}-foreground))`,
			}}
			className="dark:border shadow-black/20 shadow-lg rounded-lg overflow-hidden"
		>
			<header>
				<NoteToolBar
					note={note}
					setMode={setMode}
					doesUserHavePermissionToEdit={doesUserHaveWriteAccess}
					isCurrentUserNoteOwner={isCurrentUserNoteOwner}
				/>
			</header>
			<article className="min-h-[100dvh] p-4 md:p-8 border-t">
				{mode === "read" && (
					<React.Fragment>
						<div
							style={{
								color: `hsl(var(--${note.noteTheme}-foreground))`,
							}}
						>
							<Heading
								typeOfHeading="h1"
								containerStyles="text-start"
								className={!note.title ? "opacity-60" : undefined}
								descriptionStyles={!note.description ? "opacity-60" : undefined}
								description={
									note.description || "Add a description to your note..."
								}
							>
								{note.title || "Add a title to your note..."}
							</Heading>
						</div>

						<div
							className="mt-8 relative"
							style={{
								color: `hsl(var(--${note.noteTheme}-foreground))`,
							}}
						>
							<NoteBodyEditor noteBody={body} mode={mode} />
						</div>
					</React.Fragment>
				)}

				{mode === "write" && (
					<NoteEditor
						isWithPermissionToWrite={doesUserHaveWriteAccess}
						note={note}
						setMode={setMode}
						setBody={setBody}
						body={body}
					/>
				)}
			</article>
		</div>
	);
};

Component.displayName = "Note";
