import "./styles/normalize.css";
import "./styles/globals.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ThemeContextProvider } from "./components/theme.tsx";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import App from "./App.tsx";

const secret = import.meta.env.VITE_CONVEX_URL;
const clerkSecret = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!secret && !clerkSecret) {
	throw new Error("Missing necessary environment variables!");
}

const convex = new ConvexReactClient(secret);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ClerkProvider publishableKey={clerkSecret}>
			<ConvexProviderWithClerk useAuth={useAuth} client={convex}>
				<ThemeContextProvider>
					<App />
				</ThemeContextProvider>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	</React.StrictMode>,
);
