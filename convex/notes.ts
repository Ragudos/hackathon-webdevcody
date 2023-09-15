import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { allowedUsers, category, theme } from "./schema";
import { Doc } from "./_generated/dataModel";

export const getNote = query({
	args: { noteID: v.id("notes") },
	handler: async (ctx, { noteID }) => {
		const user = await getUser(ctx, {});

		if (!user) {
			return null;
		}

		const note = await ctx.db.get(noteID);

		if (!note) {
			return null;
		}

		if (note.user !== user._id) {
			if (note.accessType === "invite-only") {
				if (!note.allowedUsers) {
					return null;
				}

				for (let idx = 0; idx < note.allowedUsers.length; ++idx) {
					if (note.allowedUsers[idx].userID === user._id) {
						return note;
					}
				}
				return null;
			}

			return note;
		} else {
			return note;
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

export const writeNotes = mutation({
	args: {
		title: v.string(),
		description: v.optional(v.string()),
		theme: theme,
		category: category,
	},
	handler: async (ctx, { title, description, theme, category }) => {
		try {
			const user = await getUser(ctx, {});

			if (!user) {
				return null;
			}

			return await ctx.db.insert("notes", {
				title,
				theme,
				category,
				description,
				user: user._id,
				body: "",
				accessType: "invite-only",
				allowedUsers: [],
			});
		} catch (error) {
			return error;
		}
	},
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
		} catch (error) {
			return error;
		}
	},
});