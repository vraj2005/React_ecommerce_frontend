import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; // Add Redux Provider
import store from "./redux/store"; // Import the Redux store
import "bootstrap/dist/js/bootstrap.bundle.min";
import "select2/dist/js/select2.min.js";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}> {/* Wrap App with Provider */}
    <App />
  </Provider>
);

reportWebVitals();