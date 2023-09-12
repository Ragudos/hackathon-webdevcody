import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"])
});