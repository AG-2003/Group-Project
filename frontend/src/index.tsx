import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Quill } from "react-quill";
import { ReceivedRequestsProvider, useReceivedRequests } from "./context/RecievedRequestsContext";
import { ChatContextProvider } from './context/ChatContext';

const Size = Quill.import("attributors/style/size");
Size.whitelist = ["10px", "12px", "14px", "16px", "18px", "20px"]; // Add your font sizes
Quill.register(Size, true);

const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "georgia",
  "impact",
  "tahoma",
  "times new roman",
  "verdana",
];
Quill.register(Font, true);

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        backgroundColor: "#fff",
      },
    },
  },
  colors: {
    purple: {
      50: '#f2e7fe', // Lighter shade
      100: '#dbb2ff',
      200: '#bb86fc', // Primary light shade
      500: '#6200ea', // Primary dark shade
      700: '#3700b3', // Darker shade
    },
  }
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <Router>
        <ChatContextProvider>
          <ReceivedRequestsProvider>
            <App />
          </ReceivedRequestsProvider>
        </ChatContextProvider>

      </Router>
    </React.StrictMode>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
