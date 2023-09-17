import { useConvexAuth } from "convex/react";
import React from "react";
import { Navigate } from "react-router-dom";

export const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { isLoading, isAuthenticated } = useConvexAuth();

	if (!isLoading && isAuthenticated) {
		return children;
	}

	if (!isLoading && !isAuthenticated) {
		return <Navigate to="/" />;
	}

	return null;
};
