import React, { useContext } from "react";
import { GraphQLClient } from "graphql-request";

import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Context from "../../context";
import { ME_QUERY } from "../../graphql/queries";
import { BASE_URL } from "../../client";

const ID =
  "965981121477-bj23k72m4ub5j9vqaiaplmqdgjnqfk47.apps.googleusercontent.com";

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const onFailure = err => {
    dispatch({ type: "IS_LOGGED_IN", payload: false });
    console.error(err);
  };
  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: idToken },
        mode: 'cors'
      });
      const data = await client.request(ME_QUERY);
      dispatch({ type: "LOGIN_USER", payload: data.me });
      dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn() });
    } catch (error) {
      onFailure(error);
    }
  };

  return (
    <div className={classes.root}>
      <Typography
        component={"h1"}
        variant={"h3"}
        gutterBottom
        noWrap
        style={{ color: "rgb(66, 133, 244)" }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        onFailure={onFailure}
        clientId={ID}
        onSuccess={onSuccess}
        isSignedIn={true}
        buttonText={"Login with Google"}
        theme={"dark"}
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
