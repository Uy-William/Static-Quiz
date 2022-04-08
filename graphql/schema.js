const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  graphql,
} = require("graphql");
const _ = require('lodash');

// Mongoose Schema
const User = require("../models/user");
const Question = require("../models/question");
const Answer = require("../models/answer");
const UserAnswer = require('../models/useranswer');

// creating a ObjectType to use as reference on Query and Mutation
const UserType = new GraphQLObjectType({
  // 
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
  }),
});

// creating a ObjectType to use as reference on Query and Mutation
const userAnswerType = new GraphQLObjectType({
  name: "UserAnswer",
  fields: () => ({
    id: { type: GraphQLID},
    earningpoints: { type: GraphQLString},
    // like a foreign key this is used to make a connection
    userid: {
      // Checks if there is a relation with the Question table and Answer Table and returns the data
      type: UserType,
      resolve (parent, args ) {
        return User.findById(parent.userid)
      }
    }
  })
})

const QuestionType = new GraphQLObjectType({
  name: "Question",
  fields: () => ({
    id: { type: GraphQLID },
    description: { type: GraphQLString },
    // Can output the correlated answer to the question
    answer: {
        type: new GraphQLList(AnswerType),
        resolve (parent, args){
            // Checks if there is a relation with the Question table and Answer Table and returns the data
            return Answer.find({questionid: parent.id})
        }
    }
  }),
});

const AnswerType = new GraphQLObjectType ({
    name: "Answer",
    fields: () => ({
        id: { type: GraphQLID },
        option: { type: GraphQLString },
        isCorrect: { type: GraphQLBoolean },
        // Can output the correlated question to the answer
        question: {
            type: QuestionType,
            resolve (parent, args) {
              // Checks if there is a relation with the Question table and Answer Table and returns the data
                return Question.findById(parent.questionid);
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
      // Query that will output a single user
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parents, args) {
          // find a specific data
        return User.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
          // Finds all the data on the table
        return User.find({});
      },
    },

    // Query where it could get a single question and could also be used to out it's related answers
    question: {
      type: QuestionType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parents, args) {
          // find a specific data
        return Question.findById(args.id);
      },
    },
    // Query to get all of the Questions
    questions: {
      type: new GraphQLList(QuestionType),
      resolve(parent, args) {
          // Finds all the data on the table
        return Question.find({});
      },
    },
    // Query to get all of the answer
    answer: {
        type: AnswerType,
        args: {
            id: { type: GraphQLID}
        },
        resolve(parent, args) {
            // find a specific data
            return Answer.findById(args.id);
        }
    }
  }),
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        // mutation to add a user to the database
        signUp: {
            type: UserType,
            args: {
              // the valid data that will accept when using mutation and requires to input a value
                email: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parents, args) {
              // gets the User Design Schema and Input the value
                let user = new User({
                    email: args.email
                })
                // will send the data to the mongoDB to be added
                return user.save();
            }
        },
        // mutation to add the user's answer to the database
        enterAnswer: {
          // using userAnswerType as reference
          type: userAnswerType,
          args: {
            // valid variables that it will acccepts
            earningpoints: { type: new GraphQLNonNull(GraphQLString)},
            userid: { type: GraphQLString}
          },
          resolve(parents, args) {
            let userAnswer = new UserAnswer({
              userid: args.userid,
              earningpoints: args.earningpoints
            })
            return userAnswer.save()
          }
        }
    }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
