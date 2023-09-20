import React from "react";
import { useConvexAuth } from "convex/react";
import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";
import { siteConfig } from "@/config/site";
import { FALLBACK_IMG } from "@/consts";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ThemeContext, Themes } from "./theme";
import { Notification } from "@/pages/root/logged-in/notification";

const ThemeSelect: React.FC = () => {
	const { theme, changeTheme } = React.useContext(ThemeContext);
	return (
		<label
			htmlFor="theme-select"
			className="py-1 px-2 flex gap-2 items-center focus-visible:outline focus-visible:outline-2"
		>
			{theme === "system" && (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-4 h-4"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
					/>
				</svg>
			)}
			{theme === "dark" && (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-4 h-4"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
					/>
				</svg>
			)}
			{theme === "light" && (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-4 h-4"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
					/>
				</svg>
			)}
			<select
				id="theme-select"
				className="bg-background focus:outline-none p-1"
				defaultValue={theme}
				onChange={(e) => changeTheme(e.target.value as Themes)}
			>
				<option value="system">system</option>
				<option value="dark">dark</option>
				<option value="light">light</option>
			</select>
		</label>
	);
};

export const Header: React.FC = () => {
	const { isLoading, isAuthenticated } = useConvexAuth();

	return (
		<header className="sticky top-0 py-2 z-20 bg-background/50 backdrop-blur-md border-b-[1px]">
			<div className="container flex justify-between">
				<div>
					<NavLink
						to={"/"}
						aria-label={siteConfig.title + " Homepage"}
						title={siteConfig.title + " Homepage"}
						className="text-2xl"
					>
						{siteConfig.title}
					</NavLink>
				</div>
				<nav></nav>

				<div className="flex gap-2">
					{!isLoading && (
						<React.Fragment>
							{!isAuthenticated && (
								<React.Fragment>
									<ThemeSelect />
									<Button asChild>
										<SignInButton mode="modal" />
									</Button>
								</React.Fragment>
							)}
							{isAuthenticated && 
								<React.Fragment>
									<Notification />
									<UserDropdown />
								</React.Fragment>
							}
						</React.Fragment>
					)}
				</div>
			</div>
		</header>
	);
};

const UserDropdown: React.FC = () => {
	const { user } = useUser();

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="p-1">
					<Avatar className="w-8 h-8">
						<AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
						<AvatarImage
							src={user?.imageUrl ?? FALLBACK_IMG}
							alt={user?.username + "'s avatar"}
							width={24}
							height={24}
						/>
					</Avatar>
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-auto p-0" asChild alignOffset={10}>
				<div className="flex flex-col shadow-md shadow-black/20 dark:border">
					<div className="flex justify-center gap-8 items-center">
						<Button
							asChild
							variant="ghost"
							className="px-8 w-full rounded-none "
						>
							<NavLink
								to="/profile"
								aria-label="Go to profile"
								className="flex gap-2 aria-[current='page']:bg-accent/20"
							>
								Profile
							</NavLink>
						</Button>
					</div>

					<hr />

					<div className="flex justify-center gap-8 items-center">
						<ThemeSelect />
					</div>

					<hr />

					<div className="flex justify-center gap-8 items-center">
						<Button
							asChild
							variant="ghost"
							className="px-8 w-full rounded-none active:opacity-80"
						>
							<SignOutButton />
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
