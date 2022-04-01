import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useNavigate } from 'react-router-dom' ;
import {
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

import AuthContext from "../auth/AuthProvider";
import "./signup.css";

const SIGNUP_USER = gql`
  mutation signup($email: String!) {
    signUp(email: $email) {
      id
      email
    }
  }
`;

function SignUp({user}) {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [showForm, setshowForm] = useState(true);
  const [useEmail, setEmail] = useState("");
  const [ userData, setUserData ] = useState({});

  const [addUser, { loading }] = useMutation(SIGNUP_USER, {
    update(proxy, result) {
      setUserData(result.data.signUp.id);
    },
    variables: {
      email: useEmail,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    addUser();
    setshowForm(false)
  };

  const enterQuestion = async (e) => {
    navigate('/question', {state: {userid: userData } } )
  }

  return (
    <>
      {showForm ? (
        <div className="SignUpDiv">
          <form className="SignUpForm" onSubmit={handleSubmit}>
            <Grid container direction="column" justifyContent="space-between">
              <TextField
                required
                type="email"
                id="standard-required"
                onChange={(e) => setEmail(e.target.value)}
                value={useEmail}
                label="Email Address"
                variant="standard"
              />
              <Button
                variant="contained"
                color="success"
                size="small"
                type="submit"
              >
                Enter
              </Button>
            </Grid>
          </form>
        </div>
      ) : (
        <Dialog open={!showForm}>
          <DialogTitle>Ready to take the Quiz?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              The Quiz contains <b>5 Questions</b>  with <b>4 options</b>  with <b>1 correct answer</b>
              <br />
              You will be given a <b>15 seconds</b> to answer each question.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={enterQuestion}>Enter</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default SignUp;
