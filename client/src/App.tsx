import { lazy } from "react";
import "./App.css";
import AppRoute from "./routes/AppRoutes";

const ToastContainer = lazy(() =>
  import("react-toastify").then((m) => ({ default: m.ToastContainer })),
);

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <AppRoute />
    </>
  );
}

export default App;
