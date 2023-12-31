import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const noteTheme = v.union(
	v.literal("green"),
	v.literal("pink"),
	v.literal("blue"),
	v.literal("orange"),
	v.literal("purple"),
	v.literal("slate"),
);

export const category = v.union(
	v.literal("education"),
	v.literal("work"),
	v.literal("story"),
	v.literal("personal"),
);

export const allowedUsers = v.optional(
	v.array(
		v.object({
			userID: v.id("users"),
			access: v.union(v.literal("write"), v.literal("read")),
		}),
	),
);

export const noteTable = {
	title: v.optional(v.string()),
	category,
	description: v.optional(v.string()),
	body: v.optional(v.string()),
	noteTheme: noteTheme,
	theme: v.optional(noteTheme),
	user: v.id("users"),
	allowedUsers,
	accessType: v.union(
		v.literal("invite-only"),
		v.literal("anyone-can-read"),
		v.literal("anyone-can-write"),
	),
};

export default defineSchema({
	users: defineTable({
		tokenIdentifier: v.string(),
		name: v.optional(v.string()),
		image: v.optional(v.string()),
		nameFromAuth: v.optional(v.string())
	})
		.index("by_token", ["tokenIdentifier"])
		.index("by_name", ["name"])
		.searchIndex("search_name", {
			searchField: "name",
		}),

	notes: defineTable(noteTable)
		.index("by_title", ["title"])
		.index("by_category", ["category"])
		.index("by_user", ["user"])
		.index("by_user_and_category", ["user", "category"])
		.index("by_user_and_title", ["user", "title"])
		.index("by_user_category_and_title", ["user", "category", "title"])
		.index("shared_with_user", ["allowedUsers"]),

	chatRooms: defineTable({
		users: v.array(v.object({
			userID: v.id("users"),
			role: v.union(
				v.literal("owner"),
				v.literal("admin"),
				v.literal("member")
			)
		})),
		ownerID: v.id("users"),
		noteID: v.optional(v.id("notes"))
	})
		.index("by_note_id_and_owner_id", ["noteID", "ownerID"]),

	messages: defineTable({
		sender: v.object({
			name: v.optional(v.string()),
			image: v.optional(v.string()),
			id: v.id("users")
		}),
		type: v.union(v.literal("private_message"), v.literal("group_message")),
		receiverID: v.union(v.id("users"), v.id("chatRooms"), v.id("notes")),
		content: v.string(),
	})
		.index("by_type", ["type"])
		.index("by_receiver", ["receiverID"])
		.index("by_receiver_and_sender", ["type", "receiverID", "sender"])
		.searchIndex("content", {
			searchField: "content",
			filterFields: ["receiverID", "_creationTime", "type"],
		}),

	notifications: defineTable({
		receiverID: v.id("users"),
		senderID: v.id("users"),
		title: v.string(),
		isRead: v.boolean(),
		message: v.string(),
		linkToNotif: v.optional(v.string())
	}).index("by_receiver_sender", ["receiverID", "senderID"])
});
