import React from "react";
import { useConvexAuth } from "convex/react";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import * as Popover from "@radix-ui/react-popover";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { FALLBACK_IMG } from "../consts";

export const Header: React.FC = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();

  return (
    <header className="header">
      <div className="container flex-between">
        <div>
          <Link
            to={"/"}
            aria-label={siteConfig.title + " Homepage"}
            title={siteConfig.title + " Homepage"}
          >
            {siteConfig.title}
          </Link>
        </div>
        <nav></nav>

        <div className="flex">
          {!isLoading && (
            <React.Fragment>
              {!isAuthenticated && <SignInButton mode="modal" />}
              {isAuthenticated && <UserDropdown />}
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
    <div className="user-dropdown">
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="icon" aria-label="User Menu">
            <img
              src={user?.imageUrl ?? FALLBACK_IMG}
              alt={`${user?.fullName}'s avatar`}
              width={26}
              height={26}
              className="rounded-full"
            />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="header-popover popover-content" align="end" sideOffset={5}>
            <div className="flex-col">
              <div className="flex-between">
                <span>{user?.username}</span>
                <Avatar>
                  <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
                  <AvatarImage
                    src={user?.imageUrl ?? FALLBACK_IMG}
                    alt={`${user?.fullName}'s avatar`}
                    width={26}
                    height={26}
                    className="rounded-full"
                  />
                </Avatar>
              </div>
              <hr />

              <div className="flex-col">
                <div>

                </div>
              </div>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};