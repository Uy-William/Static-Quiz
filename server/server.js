const express = require('express');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const {graphqlHTTP} = require('express-graphql');

const app = express();
const PORT = process.env.PORT || 4001;

const graphqlSchema = require('./graphql/schema');

// app.use(bodyParser.json());

app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  app.use(
    '/graphql',
    graphqlHTTP({
      schema: graphqlSchema,
      graphiql: true
    })
  );

app.get("/", (req, res) => {
    // res.send({ message: "We did it!" });
  });

  const mongoUserName = "adminUser";
  const mongoPassword = "testing123";
  const mongoCluster = "Eigital-Assessment";
  const mongoDb = "eigitalData";
  
  mongoose
    .connect(
      `mongodb+srv://${mongoUserName}:${mongoPassword}@${mongoCluster}.sdytp.mongodb.net/${mongoDb}?retryWrites=true&w=majority`
    )
    .then(result => {
        app.listen(PORT);
    })
    .catch(err => console.log(err));