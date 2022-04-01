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

const ADD_SOCRE = gql`
  mutation enterAnswer($earningpoints: String!, $userid: String!) {
    enterAnswer(earningpoints: $earningpoints, userid: $userid) {
      earningpoints
    }
  }
`;

function Question() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setshowAnswer] = useState(false);
  const [final, setFinal] = useState(false);
  const [answerCorrect, setAnswerCorrect] = useState(null);

  const [userData, setUserData] = useState("");

  const [seconds, setSeconds] = useState(15);
  const [isRunning, setisRunning] = useState(true);

  const { setAuth } = useContext(AuthContext);

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

  const ADD_SCORE = gql`
    mutation enterAnswer($earningpoints: String!, $userid: String) {
      enterAnswer(earningpoints: $earningpoints, userid: $userid) {
        earningpoints
      }
    }
  `;

  const [addAnswer, { load }] = useMutation(ADD_SOCRE, {
    update(proxy, result) {
      // console.log(result);
    },
    variables: {
      earningpoints: "100",
      userid: userData.userData,
    },
  });

  useEffect(() => {
    if (isRunning) {
      const time = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
        if (seconds === 0 && seconds >= -1) {
          if (currentQuestion >= 4) {
            setFinal(true);
            setisRunning(false);
            clearInterval(time);
          } else {
            setCurrentQuestion((currentQuestion) => currentQuestion + 1);
            setSeconds(15);
          }
        }
      }, 1000);
      return () => window.clearInterval(time);
    }
  });

  const HomeRoute = () => {
    navigate('/');
  }

  // a function to close the modal
  // const modalOff = () => {
  //   setFinal(false)
  // }

  const checkAnswer = async (isCorrect) => {
    if (isCorrect) {
      setAnswerCorrect(true);
      setUserData(location.state.userid);
      addAnswer();
      setScore(score + 100);
    } else {
      setAnswerCorrect(false);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < Quest.length) {
      setSeconds(15);
      setCurrentQuestion(nextQuestion);
      setshowAnswer(true);
    } else {
      setFinal(true);
      setisRunning(false);
    }
  };

  return (
    <>
      {loading ? (
        <h2>fetching data!</h2>
      ) : (
        <div>
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
                  {Quest[currentQuestion].description}
                </DialogContent>
                <DialogActions>
                  {Quest[currentQuestion].answer.map((answers) => {
                    return (
                      <Button
                        variant="contained"
                        className="answerButton"
                        value={answers.id}
                        onClick={() => checkAnswer(answers.isCorrect)}
                        key={answers.id}
                      >
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
