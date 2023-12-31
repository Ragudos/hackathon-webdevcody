import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Insert or update the user in a Convex table then return the document's ID.
 *
 * The `UserIdentity.tokenIdentifier` string is a stable and unique value we use
 * to look up identities.
 *
 * Keep in mind that `UserIdentity` has a number of optional fields, the
 * presence of which depends on the identity provider chosen. It's up to the
 * application developer to determine which ones are available and to decide
 * which of those need to be persisted. For Clerk the fields are determined
 * by the JWT token's Claims config.
 */
export const store = mutation({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Called storeUser without authentication present");
		}

		// Check if we've already stored this identity before.
		const user = await ctx.db
			.query("users")
			.withIndex("by_token", (q) =>
				q.eq("tokenIdentifier", identity.tokenIdentifier),
			)
			.unique();
		if (user !== null) {
			// If we've seen this identity before but the name has changed, patch the value.
			if (user.nameFromAuth !== identity.name) {
				await ctx.db.patch(user._id, { nameFromAuth: identity.name });
			}

			if (user.image !== identity.pictureUrl) {
				await ctx.db.patch(user._id, { image: identity.pictureUrl });
			}
			return user._id;
		}
		// If it's a new identity, create a new `User`.
		return await ctx.db.insert("users", {
			name: identity.name!,
			nameFromAuth: identity.name!,
			image: identity.pictureUrl,
			tokenIdentifier: identity.tokenIdentifier,
		});
	},
});

export const getUser = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			return null;
		}

		return await ctx.db
			.query("users")
			.withIndex("by_token", (q) =>
				q.eq("tokenIdentifier", identity.tokenIdentifier),
			)
			.unique();
	},
});

export const searchUser = query({
	args: { name: v.optional(v.string()) },
	handler: async (ctx, { name }) => {
		const user = await getUser(ctx, {});

		if (!user) {
			return null;
		}

		if (!name) {
			return null;
		}

		return ctx.db
			.query("users")
			.withSearchIndex("search_name", (q) => q.search("name", name))
			.filter((q) =>
				q.not(q.eq(q.field("tokenIdentifier"), user.tokenIdentifier)),
			)
			.collect();
	},
});

export const updateUserName = mutation({
	args: { userID: v.id("users"), newName: v.string() },
	handler: async (ctx, { userID, newName }) => {
		const user = await getUser(ctx, {});

		if (!user || user._id !== userID) {
			return null;
		}

		await ctx.db.patch(userID, { name: newName });
	}
});