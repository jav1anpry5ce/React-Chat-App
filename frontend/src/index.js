import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import App from "./App";
import { ChatProvider } from "./utils/ChatContext";

ReactDOM.render(
  <ChatProvider>
    <App />
  </ChatProvider>,
  document.getElementById("root")
);

serviceWorkerRegistration.register();
