import React from "react";
import { Toaster } from "react-hot-toast";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter(
	[
		{
			lazy: () => import("./pages/root"),
			children: [
				{
					path: "/",
					lazy: () => import("./pages/index"),
				},
				{
					path: "/profile/*",
					lazy: () => import("./pages/profile"),
				},
				{
					path: "/notes/:noteID",
					lazy: () => import("./pages/notes"),
				},
			],
		},
	],
	{
		future: {
			// Normalize `useNavigation()`/`useFetcher()` `formMethod` to uppercase
			v7_normalizeFormMethod: true,
		},
	},
);

const App: React.FC = () => (
	<React.Fragment>
		<Toaster position="top-right" toastOptions={{ duration: 5000 }} />
		<RouterProvider router={router} />
	</React.Fragment>
);

export default App;
