import React from "react";
import "./index.css";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { Notifications } from "./common";

const queryConfig = {
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
    retry: false,
  },
};

const queryClient = new QueryClient({ defaultOptions: queryConfig });

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Notifications />
      <Router>
        <App />
      </Router>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
