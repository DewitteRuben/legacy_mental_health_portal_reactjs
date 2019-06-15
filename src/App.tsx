import { library } from "@fortawesome/fontawesome-svg-core";
import { faUsers, faChartBar, faSync } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { ConnectedRouter } from "connected-react-router";
import React from "react";
import { Provider } from "react-redux";
import { Route, Switch, Redirect } from "react-router"; // react-router v4/v5
import "./App.css";
import {
  HomePage,
  Dashboard,
  Clients,
  RegisterClient,
  DetailClient
} from "./pages";
import { NavBar, SideNav } from "./components";
import store, { history } from "./store";
import { getJWTToken } from "./services/localStorage";
library.add(faUsers, faChartBar, faSync);

const isAuthenticated = () => {
  const token = getJWTToken();
  return token && token.length;
};

const ProtectedRoute = ({ ...props }) => {
  if (isAuthenticated()) {
    return <Route {...props} />;
  } else {
    return <Redirect to="/" />;
  }
};

function App() {
  const token = getJWTToken();
  const loggedIn = token && token.length ? true : false;

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        {" "}
        {/* place ConnectedRouter under Provider */}
        <>
          {" "}
          {/* your usual react-router v4/v5 routing */}
          <Route exact={true} path="/" render={() => <HomePage />} />
          <NavBar loggedIn={loggedIn} />
          <div style={mainPage}>
            <SideNav />
            <Switch>
              <ProtectedRoute
                exact={true}
                path="/clients/register"
                render={() => <RegisterClient />}
              />
              <ProtectedRoute
                exact={true}
                path="/clients/:userId"
                render={() => <DetailClient />}
              />
              <ProtectedRoute
                exact={true}
                path="/clients"
                render={() => <Clients />}
              />
              <Route render={() => <div>Miss</div>} />
            </Switch>
          </div>
        </>
      </ConnectedRouter>
    </Provider>
  );
}

const mainPage = {
  display: "flex",
  height: "100%",
  flex: 1
};

export default App;
