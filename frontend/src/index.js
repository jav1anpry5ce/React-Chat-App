import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { createRoot } from "react-dom/client";
import "antd/dist/antd.min.css";
import "./index.css";
import App from "./App";
import { ChatProvider } from "./utils/ChatContext";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <ChatProvider>
    <App />
  </ChatProvider>
);


serviceWorkerRegistration.register();
