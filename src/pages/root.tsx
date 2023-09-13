import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

import useStoreUser from "@/lib/useStoreUser";

import { Heading } from "../components/ui/heading";
import { Header } from "../components/header";
import { useUser } from "@clerk/clerk-react";

const LandingPage = React.lazy(() => import("./root/landingpage"));
const LoggedInPage = React.lazy(() => import("./root/logged-in"));

export const Component: React.FC = () => {
  const { isLoading, isAuthenticated } = useStoreUser();
  const { user } = useUser();

  return (
    <React.Fragment>
      <Header />

      <main className="container py-12">
        {!isAuthenticated && !isLoading
          ? <React.Suspense>
            <LandingPage />
          </React.Suspense>
          : <React.Suspense>
            <LoggedInPage
              displayName={user?.username as string}
            />
          </React.Suspense>
        }
      </main>

      <footer className="container">
      </footer>
    </React.Fragment>
  );
};

Component.displayName = "RootPage";

export const ErrorBoundary = () => {
  const error = useRouteError() as Error | string;

  return (
    <main className="grid place-items-center h-screen">
      {isRouteErrorResponse(error)
        ? (
          <Heading
            typeOfHeading="h1"
            description={error.statusText}
          >
            {error.status}
          </Heading>
        ) : (
          <Heading typeOfHeading="h1">{error instanceof Error ? error.message : error}</Heading>
        )}
    </main>
  );
};

ErrorBoundary.displayName = "RootPageErrorBoundary";