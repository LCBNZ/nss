import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/Auth";

// const ProtectedRoute = (props) => {
//   const { user } = useContext(Auth.Context);
//
//   //
//   if (!user) return <Redirect to="/login" />;

//   return <Route {...props} />;
// };

// export default ProtectedRoute;

export default function ProtectedRoute({ component: Component, ...rest }) {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}
