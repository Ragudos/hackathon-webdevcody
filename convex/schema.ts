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

export const noteTable = {
	title: v.string(),
	category,
	description: v.optional(v.string()),
	body: v.optional(v.string()),
	theme,
	user: v.id("users"),
	allowedUsers: v.optional(
		v.array(
			v.object({
				userID: v.id("users"),
				access: v.union(v.literal("write"), v.literal("read")),
			}),
		),
	),
};

export default defineSchema({
	users: defineTable({
		tokenIdentifier: v.string(),
		name: v.optional(v.string()),
	}).index("by_token", ["tokenIdentifier"]),

	notes: defineTable(noteTable)
		.index("by_title", ["title"])
		.index("by_user", ["user"])
		.searchIndex("search_title", {
			searchField: "title",
			filterFields: ["category"],
		}),

	messages: defineTable({
		senderID: v.id("users"),
		receiverIDs: v.array(v.id("users")),
		room: v.optional(v.id("notes")),
		content: v.string(),
	}),
});
