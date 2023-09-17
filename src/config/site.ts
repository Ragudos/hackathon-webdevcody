import { category, noteTheme } from "convex/schema";

export const EMPTY_BODY_JSON =
	"{\"root\":{\"children\":[{\"children\":[],\"direction\":null,\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":null,\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}";

export const NOTE_CONSTS = {
	categories: ["education", "work", "story", "personal"] as typeof category.type[],
	theme: ["blue", "green", "orange", "pink", "purple", "slate"] as typeof noteTheme.type[],
	maxTitleLength: 48,
	maxDescriptionLength: 200
};

export const siteConfig = {
	title: "ChatNote",
	description: "Message people while collaborating realtime!",
};
