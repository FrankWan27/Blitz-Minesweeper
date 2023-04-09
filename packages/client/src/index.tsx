import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <meta name="viewport" content="width=740px; user-scalable=yes;" />
    <App />
  </>
);
