import React, { useContext } from "react";

import Context from "./context";
import {Redirect, Route} from "react-router-dom";

const PATH = process.env.NODE_ENV === 'production' ? '/inMapPins/' : '/'

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { state } = useContext(Context);

  return (
    <Route
      render={props =>
        !state.isAuth ? <Redirect to={`${PATH}login`} /> : <Component {...props} />
      }
      {...rest}
    />
  );
};

export default ProtectedRoute
