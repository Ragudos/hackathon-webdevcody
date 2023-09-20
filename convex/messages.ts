import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";


export const getMessages = query({
  args: {
    receiverID: v.union(
      v.id("users"),
      v.id("chatRooms"),
      v.id("notes")
    )
  },
  handler: async (ctx, { receiverID }) => {
    const user = await getUser(ctx, {});

    if (!user) {
      return null;
    }


    return {
      currentUser: user,
      messageData: await ctx.db.query("messages")
        .withIndex("by_receiver", (q) =>
          q.eq("receiverID", receiverID)).order("asc").collect()
    };
  }
});

export const sendMessage = mutation({
  args: {
    content: v.string(),
    receiverID: v.union(
      v.id("users"),
      v.id("chatRooms"),
      v.id("notes")
    )
  },
  handler: async (ctx, { content, receiverID }) => {
    const user = await getUser(ctx, {});

    if (!user) {
      return null;
    }

    await ctx.db.insert("messages", {
      sender: {
        id: user._id,
        name: user.name,
        image: user.image
      },
      receiverID,
      content,
      type: "group_message"
    });
  }
});

export const deleteMessage = mutation({
  args: { messageID: v.id("messages"), senderID: v.id("users") },
  handler: async (ctx, { messageID, senderID }) => {
    const user = await getUser(ctx, {});

    if (!user) {
      return null;
    }

    if (senderID !== user._id) {
      return null;
    }

    await ctx.db.delete(messageID);
  }
});