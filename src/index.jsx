import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./assets/Styles/index.css";
import App from "./App";
import { AuthLogin } from "./AuthComponents/AuthLogin";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <AuthLogin>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthLogin>,
  document.getElementById("root")
);
