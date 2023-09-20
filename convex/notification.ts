import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";


export const getNotification = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUser(ctx, {});

		if (!user) {
			return null;
		}

    return ctx.db.query("notifications")
    .withIndex("by_receiver_sender", (q) => 
    q.eq("receiverID", user._id)).collect();
  }
});

export const sendNotification = mutation({
  args: { receiverID: v.id("users"), title: v.string(), message: v.any(), linkToNotif: v.optional(v.string()) },
  handler: async (ctx, { receiverID, title, message, linkToNotif  }) => {
    const user = await getUser(ctx, {});

		if (!user) {
			return null;
		}
    await ctx.db.insert("notifications", { linkToNotif, senderID: user._id, receiverID, title, isRead: false, message: `From ${user.name}: ${message}` });

    return "success";
  },
});

export const updateNotification = mutation({
  args: { notificationID: v.id("notifications"), isRead: v.boolean() },
  handler: async (ctx, { notificationID, isRead }) => {
    const user = await getUser(ctx, {});

		if (!user) {
			return null;
		}

    await ctx.db.patch(notificationID, { isRead });
    return "success";
  }
});

export const deleteNotification = mutation({
  args: { notificationID: v.id("notifications") },
  handler: async (ctx, { notificationID }) => {
    const user = await getUser(ctx, {});

		if (!user) {
			return null;
		}

    await ctx.db.delete(notificationID);
  }
});