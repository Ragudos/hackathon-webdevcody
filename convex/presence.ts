import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";

export const LIST_LIMIT = 20;

export const updatePresence = mutation({
  args: {
    roomID: v.union(v.id("chatRooms"), v.id("notes")),
    userID: v.id("users"),
    data: v.any()
  },
  handler: async (ctx, { roomID, userID, data }) => {
    const user = await getUser(ctx, {});

    if (!user) {
      return null;
    }

    const existing = await ctx.db.query("presence")
      .withIndex("by_user_room", (q) =>
        q.eq("userID", userID).eq("roomID", roomID))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { data, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("presence", {
        userID,
        data,
        roomID,
        updatedAt: Date.now()
      });
    }
  }
});

export const onHeartbeat = mutation({
  args: { roomID: v.union(v.id("chatRooms"), v.id("notes")) },
  handler: async (ctx, { roomID }) => {
    const user = await getUser(ctx, {});

    if (!user) {
      return null;
    }

    const presence = await ctx.db.query("presence")
      .withIndex("by_user_room", (q) =>
        q.eq("userID", user._id).eq("roomID", roomID))
      .unique();

    if (presence) {
      await ctx.db.patch(presence?._id, { updatedAt: Date.now() });
    }
  }
});

export const getPresence = query({
  args: { roomID: v.union(v.id("chatRooms"), v.id("notes")) },
  handler: async (ctx, { roomID }) => {
    const user = await getUser(ctx, {});

    if (!user) {
      return null;
    }

    return ctx.db.query("presence")
      .withIndex("by_room_updated", (q) =>
        q.eq("roomID", roomID))
      .filter((q) =>
        q.not(q.eq(q.field("userID"), user._id)))
      .order("desc")
      .take(LIST_LIMIT);
  }
});