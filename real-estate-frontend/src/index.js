// App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import AuthenticatedRoute from "./authenticatedRoute";
import ReactDOM from "react-dom";

// core components
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";
import UserProfile from "views/UserProfile/UserProfile";

import LoginPage from "views/Login/login";
import LogoutPage from "views/Logout/logout";
import AuthContext from "./context/AuthContext";

const isLoggedInVal = localStorage.getItem("lgn");
const isLoggedInData = isLoggedInVal && isLoggedInVal === "true" ? true : false;

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInData); // Initial login state

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login: handleLogin, logout: handleLogout }}
    >
      <Router>
        <Switch>
          <Route path="/login" render={(props) => <LoginPage {...props} />} />
          <AuthenticatedRoute
            path="/"
            component={Admin}
            isAuthenticated={isLoggedIn}
          />
          <Redirect from="/" to="/dashboard" />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
