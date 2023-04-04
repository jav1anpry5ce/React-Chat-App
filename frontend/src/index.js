import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { createRoot } from "react-dom/client";
import "antd/dist/antd.min.css";
import "./index.css";
import { ChatProvider } from "./utils/ChatContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Main, SignUp, Login } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <ChatProvider>
    <RouterProvider router={router} />
  </ChatProvider>
);


serviceWorkerRegistration.register();
