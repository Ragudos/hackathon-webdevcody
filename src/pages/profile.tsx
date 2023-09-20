import type { ViewMode } from "./[noteID]/note-page";
import React from "react";

import { AuthWrapper } from "@/components/auth-wapper";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FALLBACK_IMG } from "@/consts";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { SharedWithUser } from "./profile/shared-with-user";

const EditProfile = React.lazy(() => import("./profile/edit"));

export const Component: React.FC = () => {
	const [mode, setMode] = React.useState<ViewMode>("read");

	const user = useQuery(api.users.getUser);

	return (
		<AuthWrapper>
			<div className="flex flex-col md:flex-row gap-8">
				<div className="md:w-[40%] lg:w-[25%] flex flex-col gap-2">
					<Avatar className="w-40 h-40">
						<AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
						<AvatarImage
							src={user?.image ?? FALLBACK_IMG}
							alt={user?.name + "'s avatar"}
							width={96}
							height={96}
						/>
					</Avatar>

					{mode === "read" && (
						<div className="flex flex-col gap-2 max-w-xs">
							<Heading typeOfHeading="h1">{user?.name}</Heading>
							<div>
								<Button
									title="Edit profile"
									aria-label="Edit Profile"
									size="sm"
									onClick={() => {
										setMode("write");
									}}
								>
									Edit Profile
								</Button>
							</div>
						</div>
					)}

					{mode === "write" && user && (
						<React.Suspense>
							<EditProfile
								currentName={user.name ?? ""}
								id={user._id}
								setToggle={setMode}
							/>
						</React.Suspense>
					)}
				</div>

				<SharedWithUser />
			</div>
		</AuthWrapper>
	);
};

Component.displayName = "ProfilePage";
