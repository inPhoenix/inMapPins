import { GraphQLClient } from "graphql-request";
import { useState, useEffect } from "react";

export const BASE_URL = "https://ingeopins.herokuapp.com/graphql"

export const useClient = () => {
  const [idToken, setIdToken] = useState("");

  useEffect(() => {
    const token = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().id_token;
    setIdToken(token);
  }, []);

  return new GraphQLClient(BASE_URL, {
    headers: { authorization: idToken },
    mode: 'cors'
  });
};
