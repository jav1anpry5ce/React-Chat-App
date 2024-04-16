import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { createRoot } from "react-dom/client";
import "antd/dist/antd.min.css";
import "./index.css";
import { UserProvider } from "./context/UserContextProvider";
import { ChatProvider } from "./context/ChatContextProvider";
import { MessageProvider } from "./context/MessageContextProvider";
import { CallProvider } from "./context/CallContextProvider";
import { MainProvider } from "./context/MainContextProvider";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { App, SignUp, Login } from "./pages";

const router = createHashRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/login",
    element: <Login />
  }
]);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <UserProvider>
    <ChatProvider>
      <MessageProvider>
        <CallProvider>
          <MainProvider>
            <RouterProvider router={router} />
          </MainProvider>
        </CallProvider>
      </MessageProvider>
    </ChatProvider>
  </UserProvider>
);


serviceWorkerRegistration.register();
