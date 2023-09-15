import type { Doc } from "../../convex/_generated/dataModel";
import React from "react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

type Props = {
	onResultClick: (_user: Doc<"users">) => void;
};

export const SearchUser: React.FC<Props> = React.memo(({ onResultClick }) => {
	const [name, setName] = React.useState("");
	const users = useQuery(api.users.searchUser, { name });

	return (
		<div className="relative flex flex-col gap-1">
			<label htmlFor="search-user-input" className="sr-only">
				Search who to give access to
			</label>
			<Input
				id="search-user-input"
				type="text"
				placeholder="Type in a username"
				value={name}
				onChange={(e) => setName(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						setName("");
					}
				}}
				autoComplete="off"
			/>

			<section className="z-10 rounded-lg max-h-[15rem] overflow-y-auto bg-background absolute top-[110%] left-0 w-full">
				<h2 className="sr-only">Section of Searched Users</h2>

				{users && (
					<div className="rounded-lg flex flex-col shadow-md shadow-black/20 dark:border">
						{users.length > 0 && (
							<React.Fragment>
								{users.map((user) => (
									<Button
										key={user._id}
										type="button"
										onClick={() => {
											onResultClick(user);
											setName("");
										}}
										variant="ghost"
										className="p-0 w-full block h-auto hover:bg-accent/20 rounded-none"
									>
										<div className="p-2 overflow-auto break-words whitespace-pre-wrap flex gap-4 items-center">
											<Avatar className="w-8 h-8">
												<AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
												<AvatarImage
													src={user.image}
													alt={`${user.name}'s avatar`}
													width={20}
													height={20}
												/>
											</Avatar>
											<span>{user.name}</span>
										</div>
										<hr className="bg-foreground/50 w-full" />
									</Button>
								))}
							</React.Fragment>
						)}

						{users.length <= 0 && (
							<div className="text-center p-2">
								No users were found with that name.
							</div>
						)}
					</div>
				)}
			</section>
		</div>
	);
});

SearchUser.displayName = "SearchUser";
