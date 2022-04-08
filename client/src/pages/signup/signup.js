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

// Mutation/Update query for signing up the user to the database
const SIGNUP_USER = gql`
  mutation signup($email: String!) {
    signUp(email: $email) {
      id
      email
    }
  }
`;

function SignUp({user}) {

  // Navigate is used to redirect the page with data
  const navigate = useNavigate();

  // This state's default is (true) to defined to show the SignUp Form
  const [showForm, setshowForm] = useState(true);

  // Tihs state defines the email that the user will input
  const [useEmail, setEmail] = useState("");

  // This state is used to store the data that will be used to sent
  const [ userData, setUserData ] = useState({});

  // adding user by mutation query
  const [addUser, { loading }] = useMutation(SIGNUP_USER, {
    update(proxy, result) {
      setUserData(result.data.signUp.id); // as the results are an array/json format this is being derived to get the data
      console.log(userData);
    },
    variables: {
      email: useEmail, // get the user input email and run it on the mutation
    },
  });

  // function that will do once submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    addUser();
    setshowForm(false)
  };

  const enterQuestion = async (e) => {
    // redirect to url/question and also pass on the data
    navigate('/question', {state: {userid: userData } } )
  }

  return (
    <>
    {/* if statement that checks the showForm state if its true will show the content */}
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
        // if the statement is false will show this content
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
