import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Heading } from "../components/ui/heading";
import { Toaster } from "react-hot-toast";
import { Header } from "../components/header";

export const Component: React.FC = () => (
    <React.Fragment>
      <Toaster
        position="top-right"
        toastOptions={{ duration: 5000, }}
      />

      <Header />

      <footer>

      </footer>
    </React.Fragment>
  );

Component.displayName = "RootPage";

export const ErrorBoundary = () => {
  const error = useRouteError() as Error | string;

  return (
    <main className="grid-center screen">
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