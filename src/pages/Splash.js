import React, { useContext } from "react";
import Login from "../components/Auth/Login";
import { Redirect } from "react-router-dom";
import Context from "../context";

const PATH = process.env.NODE_ENV === 'production' ? '/inMapPins/' : '/'

const Splash = () => {
  const { state } = useContext(Context);

  return state.isAuth ? (
    <Redirect to={PATH} />
  ) : (
    <div>
      <Login />
    </div>
  );
};

export default Splash;
