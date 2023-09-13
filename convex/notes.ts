import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { category, theme } from "./schema";

export const getNotes = query({
  args: { title: v.optional(v.string()), },
  handler: async (ctx, { title }) => {
    const user = await getUser(ctx, {});

    if (!user) {
      return null;
    }

    if (title) {
      return ctx.db.query("notes")
        .withSearchIndex("search_title", (q) =>
          q.search("title", title)).filter((q) =>
            q.eq(q.field("user"), user._id)).collect();
    } else {
      return ctx.db.query("notes").filter((q) =>
        q.eq(q.field("user"), user._id)).order("asc").collect();
    }
  }
});

export const writeNotes = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    theme: theme,
    category: category
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
        user: user._id
      });
    } catch (error) {
      return error;
    }
  }
});