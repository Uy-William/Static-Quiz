import React, { useState, useEffect, useContext } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import AuthContext from "../auth/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material/";

import HomeIcon from '@mui/icons-material/Home';

import "./question.css";

// Mutation Query to input the each earning points the user answered correctly
const ADD_SCORE = gql`
  mutation enterAnswer($earningpoints: String!, $userid: String) {
    enterAnswer(earningpoints: $earningpoints, userid: $userid) {
      earningpoints
    }
  }
`;

function Question() {

  // Use Location to get the data that was been sent on the SignUp
  const location = useLocation();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0); // to know what Quiz number is currently default (0) as it is calling in an array
  const [score, setScore] = useState(0); // Scoring board to know what is the current score the user has answered correctly
  const [showAnswer, setshowAnswer] = useState(false); // will show the content of the answerCorrect state
  const [final, setFinal] = useState(false); // Will show the content once the quiz is finished
  const [answerCorrect, setAnswerCorrect] = useState(null); // will show if the user answered correct or wrong on the question that was selected

  const [userData, setUserData] = useState(""); // using this state to store the data that was been sent

  const [seconds, setSeconds] = useState(15); // The Timer Countdown default (15) for 15s
  const [isRunning, setisRunning] = useState(true); // Checks if the Timer is still running or not

  // Query that fetches all the question and its correlated answers
  const QUESTION_API = gql`
    {
      questions {
        id
        description
        answer {
          id
          option
          isCorrect
        }
      }
    }
  `;

  // Run and fetch the data on the query
  const { loading, data: { questions: Quest } = {} } = useQuery(QUESTION_API);

  // Will run the mutation query to add the data to the database
  const [addAnswer, { load }] = useMutation(ADD_SCORE, {
    update(proxy, result) {
      // console.log(result);
    },
    variables: {
      // default value 100
      earningpoints: "100",
      // calling the fetched data that was sent using the location
      userid: userData.userData,
    },
  });

  // function that will run the Timer Counter once run
  useEffect(() => {
    // Checks if Counter is running
    if (isRunning) {
      const time = setInterval(() => {
        // will deduct 1 on the value of seconds
        setSeconds((seconds) => seconds - 1);
        // if statement once the score is equal to 0 or below -1
        if (seconds === 0 && seconds >= -1) {
          // checks if the currentQuestion is greater that 4
          if (currentQuestion >= 4) {
            // will show the final result
            setFinal(true);
            // will stop the timer counter from showing
            setisRunning(false);
            // clear the timer from continue to count
            clearInterval(time);
          } else {
            // if the currentquestion is below 4 and the time runs out
            // will add the currentQuestion 1 to go to the next question
            setCurrentQuestion((currentQuestion) => currentQuestion + 1);
            //set the timer to 15
            setSeconds(15);
          }
        }
        // for the setInterval that has an interval of 1s
      }, 1000);

      // return the clearInterval every second on the time
      return () => window.clearInterval(time);
    }
  });

  // will redirect to the signup page
  const HomeRoute = () => {
    navigate('/');
  }

  // a function to close the modal
  // const modalOff = () => {
  //   setFinal(false)
  // }

  // checks if the user answered is correct or not
  const checkAnswer = async (isCorrect) => {
    // if answer is true/correct
    if (isCorrect) {
      // show the message that the user picked the correct answer
      setAnswerCorrect(true);
      // fetched the data that was sent and set it on the UserData state
      setUserData(location.state.userid);
      console.log(location.state);
      // will run the query that will add the user and its score/points
      addAnswer();
      // add 100 points to the current score
      setScore(score + 100);
    } else {
       // show the message that the user picked the wrong answer
      setAnswerCorrect(false);
    }

    // a variable that will add the currentQuestion value of 1
    const nextQuestion = currentQuestion + 1;
    // checks if the nextquestion if greater than the total questions
    if (nextQuestion < Quest.length) {
      // set the timer to 15 seconds
      setSeconds(15);
      // set the value of the currentQuestion with the nextQuestion value
      setCurrentQuestion(nextQuestion);
      // set the value to true to show if right or wrong of the answer that the user picked
      setshowAnswer(true);
    } else {
      // if the question has reached the end
      // will show the final results of the user score
      setFinal(true);
      // will conceal the timer countdown
      setisRunning(false);
    }
  };

  return (
    <>
    {/* checks if the fetched query was able to retrieve the data */}
      {loading ? (
        <h2>fetching data!</h2>
      ) : (
        <div>
          {/* checks if the final results should be shown or not */}
          {final ? (
            <Dialog
              open={final}
              // onClose={modalOff} once clicks at the background outside the modal will close the modal
            >
              <DialogTitle>{"Congratulations!"}</DialogTitle>
              <DialogContent>
                <p>
                  You have finished on taking the quiz, and your final score is.
                </p>
                <h3 className="scoreStyle">{score} / 500</h3>
              </DialogContent>
              <DialogActions>
                {/* a button that will redirect/return to the homepage/signup */}
                <Button onClick={HomeRoute}>
                  <HomeIcon />
                  Home
                </Button>
              </DialogActions>
            </Dialog>
          ) : (
            <>
              <Dialog
                open={!final}
                // onClose={modalOff} once clicks at the background outside the modal will close the modal
              >
                <DialogTitle>
                  Question: {currentQuestion + 1} / {Quest.length} | {seconds}s
                  Left
                  {showAnswer ? (
                    <p
                      style={
                        answerCorrect ? { color: "green" } : { color: "red" }
                      }
                    >
                      | {answerCorrect ? "Correct!" : "Wrong!"}
                    </p>
                  ) : (
                    <></>
                  )}
                </DialogTitle>
                <DialogContent>
                  {/* fetch a specific data by determine using the currentQuestion */}
                  {Quest[currentQuestion].description}
                </DialogContent>
                <DialogActions>
                  {/* fetch the related data with the currentQuestion */}
                  {Quest[currentQuestion].answer.map((answers) => {
                    return (
                      // the map feature will showcase the data of the answer
                      <Button
                        variant="contained"
                        className="answerButton"
                        value={answers.id}
                        // once clicked it will call the checkAnswer function with the variable of the answer
                        onClick={() => checkAnswer(answers.isCorrect)}
                        key={answers.id}
                      >
                        {/* will show the options/answers of the question */}
                        {answers.option}
                      </Button>
                    );
                  })}
                </DialogActions>
              </Dialog>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Question;
