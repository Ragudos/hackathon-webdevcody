import type { Doc, Id } from "../../../convex/_generated/dataModel";

import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

import React from "react";
import toast from "react-hot-toast";

import { AllowedUserCard } from "./allowed-user-card";

import { SearchUser } from "@/components/search-user";
import { Heading } from "@/components/ui/heading";

type AllowedUserID = {
	userID: Id<"users">;
	access: "write" | "read";
};

const ListOfUsersWithAccess: React.FC<{ note: Doc<"notes"> }> = React.memo(({ note }) => {
	const allowedUsers = useQuery(api.notes.getUsersWithAccess, {
		users: note.allowedUsers,
	});

	const [, startTransition] = React.useTransition();

	const updateAllowedUsers = useMutation(api.notes.updateAllowedUsers);
	const sendNotification = useMutation(api.notification.sendNotification);

	const handleInviteUser = React.useCallback(
		(user: Doc<"users">) => {
			for (
				let idx = 0;
				note.allowedUsers && idx < note.allowedUsers.length;
				++idx
			) {
				if (note.allowedUsers[idx].userID === user._id) {
					toast.error("This user has already been invited.");
					return;
				}
			}
			const obj = { userID: user._id, access: "read" as "read" | "write" };
			startTransition(() => {
				if (note.allowedUsers) {
					void updateAllowedUsers({
						users: note.allowedUsers.concat([obj]),
						noteID: note._id,
					});
					void sendNotification({
						linkToNotif: `${location.origin}/notes/${note._id}`,
						receiverID: user._id,
						title: "You have been invited!",
						message: "Hello, come and read my note!"
					});
					toast.success("Successfully invited this user");
				} else {
					void updateAllowedUsers({ users: [obj], noteID: note._id });
					void sendNotification({
						linkToNotif: `${location.origin}/notes/${note._id}`,
						receiverID: user._id,
						title: "You have been invited!",
						message: "Hello, come and read my note!"
					});
					toast.success("Successfully invited this user");
				}
			});
		},
		[note, updateAllowedUsers, sendNotification],
	);

	const onAccessChange = React.useCallback(
		async (userID: Id<"users">, value: "read" | "write" | "remove") => {
			if (value === "remove") {
				const newAllowedUsers = new Array<AllowedUserID>();
				for (
					let idx = 0;
					note.allowedUsers && idx < note.allowedUsers.length;
					++idx
				) {
					if (note.allowedUsers[idx].userID !== userID) {
						newAllowedUsers.push(note.allowedUsers[idx]);
					}
				}
				startTransition(() => {
					void updateAllowedUsers({
						users: newAllowedUsers,
						noteID: note._id,
					});
					void sendNotification({
						receiverID: userID,
						title: `Your access on note ${note._id} has been revoked.`,
						message: "Sorry, I removed you access :("
					});
					toast.success("Successfully revoked access to this user.");
				});
			}

			if (value === "read") {
				const newAllowedUsers = new Array<AllowedUserID>();
				for (
					let idx = 0;
					note.allowedUsers && idx < note.allowedUsers.length;
					++idx
				) {
					if (note.allowedUsers[idx].userID !== userID) {
						newAllowedUsers.push(note.allowedUsers[idx]);
					} else {
						newAllowedUsers.push({
							userID,
							access: "read",
						});
					}
				}
				startTransition(() => {
					void updateAllowedUsers({
						users: newAllowedUsers,
						noteID: note._id,
					});
					toast.success(
						"Successfully changed the access of this user to read-only.",
					);
					void sendNotification({
						receiverID: userID,
						title: `Your access on note ${note._id} has been changed to read-only.`,
						message: "Sorry, let's just read my note together."
					});
				});
			}

			if (value === "write") {
				const newAllowedUsers = new Array<AllowedUserID>();
				for (
					let idx = 0;
					note.allowedUsers && idx < note.allowedUsers.length;
					++idx
				) {
					if (note.allowedUsers[idx].userID !== userID) {
						newAllowedUsers.push(note.allowedUsers[idx]);
					} else {
						newAllowedUsers.push({
							userID,
							access: "write",
						});
					}
				}
				startTransition(() => {
					void updateAllowedUsers({
						users: newAllowedUsers,
						noteID: note._id,
					});

					toast.success(
						"Successfully changed the access of this user to edit this note.",
					);
					void sendNotification({
						linkToNotif: `${location.origin}/notes/${note._id}`,
						receiverID: userID,
						title: "You have been invited!",
						message: "Hello, let's edit my note together!"
					});
				});
			}
		},
		[note._id, note.allowedUsers, sendNotification, updateAllowedUsers],
	);

	return (
		<React.Fragment>
			<SearchUser onResultClick={handleInviteUser} />

			<section className="overflow-y-auto max-h-[15rem] mt-4">
				{allowedUsers && allowedUsers.length > 0 && (
					<React.Fragment>
						<Heading typeOfHeading="h6">Users with access</Heading>
						<div className="mt-4 flex flex-col gap-4">
							{allowedUsers.map((accessObj) => (
								<AllowedUserCard
									key={accessObj.user._id}
									accessType={accessObj.accessType}
									user={accessObj.user}
									onAccessChange={onAccessChange}
								/>
							))}
						</div>
					</React.Fragment>
				)}
			</section>
		</React.Fragment>
	);
});

ListOfUsersWithAccess.displayName = "ListOfUsersWithAccess";
export default ListOfUsersWithAccess;