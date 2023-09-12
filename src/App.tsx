import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => import("./pages/root"),
  }
], {
  future: {
    // Normalize `useNavigation()`/`useFetcher()` `formMethod` to uppercase
    v7_normalizeFormMethod: true,
  }
});

const App: React.FC = () => <RouterProvider router={router} />;

export default App;