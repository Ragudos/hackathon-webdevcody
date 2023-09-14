import React from "react";
import { Outlet, isRouteErrorResponse, useRouteError } from "react-router-dom";

import { Heading } from "../components/ui/heading";
import { Header } from "../components/header";

export const Component: React.FC = () => (
	<React.Fragment>
		<Header />
		<main className="container py-12">
			<Outlet />
		</main>
		<footer className="container"></footer>
	</React.Fragment>
);

Component.displayName = "RootPage";

export const ErrorBoundary = () => {
	const error = useRouteError() as Error | string;

	return (
		<React.Fragment>
			<Header />
			<main className="grid place-items-center h-screen text-center">
				<div className="flex flex-col gap-8">
					{isRouteErrorResponse(error) ? (
						<Heading typeOfHeading="h1" description={error.statusText}>
							{error.status}
						</Heading>
					) : (
						<Heading typeOfHeading="h1">
							{error instanceof Error ? error.message : error}
						</Heading>
					)}
				</div>
			</main>
		</React.Fragment>
	);
};

ErrorBoundary.displayName = "RootPageErrorBoundary";
