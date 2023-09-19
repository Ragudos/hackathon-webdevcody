import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { allowedUsers, category, noteTheme } from "./schema";
import { Doc } from "./_generated/dataModel";

const EMPTY_BODY_JSON =
	"{\"root\":{\"children\":[{\"children\":[],\"direction\":null,\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":null,\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}";

export const getNote = query({
	args: { noteID: v.id("notes") },
	handler: async (ctx, { noteID }) => {
		const user = await getUser(ctx, {});

		if (!user) {
			return null;
		}

		const note = await ctx.db.get(noteID);

		if (!note) {
			return undefined;
		}

		if (note.user !== user._id) {
			if (note.accessType === "invite-only") {
				if (!note.allowedUsers) {
					return "You have no permission to read this note.";
				}

				for (let idx = 0; idx < note.allowedUsers.length; ++idx) {
					if (note.allowedUsers[idx].userID === user._id) {
						return {
							note: note,
							isCurrentUserNoteOwner: false,
							doesUserHaveWriteAccess:
								note.allowedUsers[idx].access === "write",
							currentUser: user
						};
					}
				}
				return "You have no permission to read this note.";
			}

			return {
				note: note,
				isCurrentUserNoteOwner: false,
				doesUserHaveWriteAccess: note.accessType === "anyone-can-write",
				currentUser: user
			};
		} else {
			return {
				note: note,
				isCurrentUserNoteOwner: true,
				doesUserHaveWriteAccess: true,
				currentUser: user
			};
		}
	},
});

export const getNotes = query({
	args: { title: v.optional(v.string()), category: v.optional(category) },
	handler: async (ctx, { title, category }) => {
		const user = await getUser(ctx, {});

		if (!user) {
			return null;
		}

		if (title) {
			if (!category) {
				return ctx.db
					.query("notes")
					.withIndex("by_user_and_title", (q) =>
						q.eq("user", user._id).eq("title", title),
					)
					.collect();
			} else {
				return ctx.db
					.query("notes")
					.withIndex("by_user_category_and_title", (q) =>
						q.eq("user", user._id).eq("category", category).eq("title", title),
					)
					.collect();
			}
		} else {
			if (!category) {
				return ctx.db
					.query("notes")
					.withIndex("by_user", (q) => q.eq("user", user._id))
					.collect();
			} else {
				return ctx.db
					.query("notes")
					.withIndex("by_user_and_category", (q) =>
						q.eq("user", user._id).eq("category", category),
					)
					.order("desc")
					.collect();
			}
		}
	},
});

export const getAllNotesSharedWithUser = query({
	handler: async (ctx) => {
		const user = await getUser(ctx, {});

		if (!user) {
			return null;
		}

		const notes = await ctx.db
			.query("notes")
			.withIndex("shared_with_user", (q) =>
				q.eq("user", user._id).eq("allowedUsers", [
					{ userID: user._id, access: "read" },
					{ userID: user._id, access: "write" },
				]),
			)
			.collect();

		return notes;
	},
});

export const writeNotes = mutation({
	args: {
		title: v.string(),
		description: v.optional(v.string()),
		noteTheme: noteTheme,
		category: category,
	},
	handler: async (ctx, { title, description, noteTheme, category }) => {
		const user = await getUser(ctx, {});

		if (!user) {
			return null;
		}

		await ctx.db.insert("notes", {
			title,
			noteTheme,

			category,
			description,
			user: user._id,
			body: EMPTY_BODY_JSON,
			accessType: "invite-only",
			allowedUsers: [],
		});
		return "success";
	},
});

export const updateNote = mutation({
	args: {
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		body: v.optional(v.string()),
		noteID: v.id("notes"),
	},
	handler: async (ctx, { title, description, body, noteID }) => {
		const user = await getUser(ctx, {});

		if (!user) {
			return null;
		}

		const note = await ctx.db.get(noteID);

		if (!note) {
			return null;
		}

		if (note.user !== user._id) {
			let num = 0;
			for (
				let idx = 0;
				note.allowedUsers && idx < note.allowedUsers.length;
				++idx
			) {
				if (
					note.allowedUsers[idx].userID === user._id &&
					note.allowedUsers[idx].access === "write"
				) {
					num += 1;
					break;
				}
			}

			if (num === 0) {
				return null;
			}
		}

		await ctx.db.patch(noteID, { title, description, body, });
		return "success";
	},
});

export const updateNoteTheme = mutation({
	args: { noteTheme: noteTheme, noteID: v.id("notes") },
	handler: async (ctx, { noteTheme, noteID }) => {
		const user = await getUser(ctx, {});

		if (!user) {
			return null;
		}

		const note = await ctx.db.get(noteID);

		if (!note) {
			return null;
		}

		await ctx.db.patch(noteID, { noteTheme });
	}
});

export const deleteNotes = mutation({
	args: { noteIDs: v.union(v.array(v.id("notes")), v.id("notes")) },
	handler: async (ctx, { noteIDs }) => {
		try {
			const user = await getUser(ctx, {});

			if (!user) {
				return null;
			}

			if (typeof noteIDs === "string") {
				const messages = await ctx.db
					.query("messages")
					.withIndex("by_receiver", (q) => q.eq("receiverID", noteIDs))
					.collect();
				for await (const msg of messages) {
					ctx.db.delete(msg._id);
				}
				await ctx.db.delete(noteIDs);
			} else {
				for await (const id of noteIDs) {
					const messages = await ctx.db
						.query("messages")
						.withIndex("by_receiver", (q) => q.eq("receiverID", id))
						.collect();
					for await (const msg of messages) {
						ctx.db.delete(msg._id);
					}
					ctx.db.delete(id);
				}
			}
		} catch (error) {
			return error;
		}
	},
});

export const getUsersWithAccess = query({
	args: { users: allowedUsers },
	handler: async (ctx, { users }) => {
		const user = await getUser(ctx, {});

		if (!user || !users) {
			return null;
		}

		const foundUsers = new Array<{
			user: Doc<"users">;
			accessType: "write" | "read";
		}>();

		for await (const user of users) {
			const foundUser = await ctx.db.get(user.userID);
			if (foundUser) {
				foundUsers.push({
					user: foundUser,
					accessType: user.access,
				});
			}
		}

		return foundUsers;
	},
});

export const updateAllowedUsers = mutation({
	args: { users: allowedUsers, noteID: v.id("notes") },
	handler: async (ctx, { users, noteID }) => {
		try {
			const user = await getUser(ctx, {});

			if (!user || !users) {
				return null;
			}

			await ctx.db.patch(noteID, { allowedUsers: users });

			return "success";
		} catch (error) {
			return error;
		}
	},
});
