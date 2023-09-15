import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const theme = v.union(
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
	title: v.string(),
	category,
	description: v.optional(v.string()),
	body: v.optional(v.string()),
	theme,
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
		.index("shared_with_user", ["user", "allowedUsers"]),

	messages: defineTable({
		senderID: v.id("users"),
		type: v.union(v.literal("private_message"), v.literal("group_message")),
		receiverID: v.union(v.id("users"), v.id("notes")),
		content: v.string(),
	})
		.index("by_type", ["type"])
		.index("by_receiver", ["receiverID"])
		.searchIndex("content", {
			searchField: "content",
			filterFields: ["receiverID", "_creationTime", "type"],
		}),
});
