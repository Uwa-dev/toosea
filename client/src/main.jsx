import { createRoot } from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import {Suspense} from "react";
import Load from "./components/reuse/Load.jsx";
import { mainRouter } from "./router/mainRouter.jsx";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store, { persistor } from "./utils/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HelmetProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        {/* <RouterProvider router={mainRouter} />  */}
        <Suspense fallback={<Load />}>
          <RouterProvider router={mainRouter} />
        </Suspense>
      </HelmetProvider>
    </PersistGate>
  </Provider>
);
