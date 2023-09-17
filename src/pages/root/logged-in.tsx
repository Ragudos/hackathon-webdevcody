import React from "react";

import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";

import { NOTE_CONSTS } from "@/config/site";

import { Header } from "./logged-in/header";
import { NoteCard } from "./logged-in/note-card";

const NoNote = React.lazy(() => import("./logged-in/no-notes"));

const LoggedInPage: React.FC = () => {
	const [search, setSearch] = React.useState("");
	const [category, setCategory] = React.useState<typeof NOTE_CONSTS.categories[number]>();

	const notes = useQuery(api.notes.getNotes, { title: search, category });

	return (
		<React.Fragment>
			<section className="grid gap-8">
				<Header
					search={search}
					category={category}
					setCategory={setCategory}
					setSearch={setSearch}
				/>
				<div className="grid lg:grid-cols-2 gap-4">
					{notes && notes.length > 0 &&
						notes.map((note) => <NoteCard note={note} key={note._id} />)}
				
					{notes && notes.length <= 0 && (
						<React.Suspense>
							<NoNote
								search={search}
								categoryChosen={category}
							/>
						</React.Suspense>
					)}
				</div>
			</section>
		</React.Fragment>
	);
};

export default LoggedInPage;
