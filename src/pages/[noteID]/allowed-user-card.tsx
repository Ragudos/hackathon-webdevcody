import type { Doc, Id } from "../../../convex/_generated/dataModel";
import type { ViewMode } from "./note-page";

import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type AllowedUserProps = {
	onAccessChange: (
		_userID: Id<"users">,
		value: "read" | "write" | "remove",
	) => void,
	accessType: "read" | "write",
	user: Doc<"users">
}

export const AllowedUserCard: React.FC<AllowedUserProps> = React.memo(
	({ accessType, user, onAccessChange }) => {
		const [accessTypeState, setAccessTypeState] = React.useState<
			ViewMode
		>(accessType);

		return (
			<div className="flex justify-between items-center gap-4">
				<div className="flex gap-4 items-center">
					<Avatar className="w-8 h-8">
						<AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
						<AvatarImage
							src={user.image}
							alt={`${user.name}'s avatar`}
							width={20}
							height={20}
						/>
					</Avatar>
					<span>{user.name}</span>
				</div>
				<div className="flex gap-1">
					<label htmlFor="select-access" className="sr-only">
						Access
					</label>
					<select
						id="select-access"
						value={accessTypeState}
						onChange={(e) => {
							setAccessTypeState(e.target.value as ViewMode);
							onAccessChange(user._id, e.target.value as ViewMode);
						}}
						className="border bg-background px-2 py-1 text-sm rounded-lg focus:outline focus:outline-1"
					>
						<option value="read">Read</option>
						<option value="write">Write</option>
					</select>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onAccessChange(user._id, "remove")}
					>
						Remove Access
					</Button>
				</div>
			</div>
		);
	},
);
