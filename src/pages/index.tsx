import React from "react";

import useStoreUser from "@/lib/useStoreUser";

const LandingPage = React.lazy(() => import("./root/landingpage"));
const LoggedInPage = React.lazy(() => import("./root/logged-in"));

export const Component: React.FC = () => {
	const { isLoading, isAuthenticated } = useStoreUser();

  return (
    <React.Fragment>
      {!isLoading && (
        <React.Fragment>
          {!isAuthenticated ? (
            <React.Suspense>
              <LandingPage />
            </React.Suspense>
          ) : (
            <React.Suspense>
              <LoggedInPage />
            </React.Suspense>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};