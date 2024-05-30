// AuthenticatedRoute.js
import React from "react";
import { Route, Redirect } from "react-router-dom";

const AuthenticatedRoute = ({
  component: Component,
  isAuthenticated,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      return isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      );
    }}
  />
);

export default AuthenticatedRoute;
