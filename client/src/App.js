import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Axios from "axios";
// import { Route, Switch, Link, Redirect } from 'react-router-dom';

import QuestionPage from "./pages/question/question";
import SignUp from "./pages/signup/signup";

import "./App.css";

function App() {
  Axios({
    method: "GET",
    url: "http://localhost:4001/",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    console.log(res.data.message);
  });

const Routing = () => {
  let routes = useRoutes([
    { path: '/', element: <SignUp />},
    { path: '/question', element: <QuestionPage />}
  ])
  return routes;
}

  return (
    <div className="App">
      <Router>
        <Routing />
      </Router>
      
    </div>
  );
}

export default App;
