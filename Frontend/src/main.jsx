import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.jsx";

import { Provider } from "react-redux";
import { store } from "./app/store.js";

import { ReviewProvider } from "./Features/dashboard/Home/components/context/ReviewContext.jsx";

createRoot(document.getElementById("root")).render(
  
    <Provider store={store}>
      <ReviewProvider>
        <App />
      </ReviewProvider>
    </Provider>
 
);