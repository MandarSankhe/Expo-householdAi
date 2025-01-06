const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    createdDate: String!
  }

  type Question {
    id: ID!
    email: String! # Use email instead of userId
    householdSize: String!
    specialDiet: [String!]!
    mostCookedCuisine: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getUsers: [User!]!
    getQuestions(email: String!): [Question!]! # Query by email
  }

  type Mutation {
    registerUser(username: String!, email: String!): User!
    addQuestion(
      email: String! # Use email instead of userId
      householdSize: String!
      specialDiet: [String!]!
      mostCookedCuisine: [String!]!
    ): Question!
  }
`;
