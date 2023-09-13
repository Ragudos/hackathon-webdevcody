import React from "react";
import { Toaster } from "react-hot-toast";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => import("./pages/root"),
  },
  {
    path: "/profile",
    lazy: () => import("./pages/profile")
  }
], {
  future: {
    // Normalize `useNavigation()`/`useFetcher()` `formMethod` to uppercase
    v7_normalizeFormMethod: true,
  }
});

const App: React.FC = () => (
  <React.Fragment>
    <Toaster
      position="top-right"
      toastOptions={{ duration: 5000, }}
    /><RouterProvider router={router} />
  </React.Fragment>
);

export default App;