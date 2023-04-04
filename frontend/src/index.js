import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { createRoot } from "react-dom/client";
import "antd/dist/antd.min.css";
import "./index.css";
import { ChatProvider } from "./utils/ChatContext";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { App, SignUp, Login } from "./pages";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
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
