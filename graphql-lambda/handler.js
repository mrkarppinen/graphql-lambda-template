const { ApolloServer, gql } = require('apollo-server-lambda');
const db = require('./database/db');

const typeDefs = gql`
  type User {
    id: String
    name: String
    message: [Message]
  }

  type Message {
    content: String,
    userid: String,
    id: String
  }


  type Query {
    user(id: String!): User
    users: [User]
  }

  type Mutation {
    addMessage(userId: String!, content: String!): Message
    removeMessage(messageId: String!): Message
  }

`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    user: async (root, args) => await db.findUser(args.id),
    users: () => db.getUsers()
  },
  Mutation: {
    addMessage: (root, args) => db.createMessage(args.userId, args.content),
    removeMessage: (root, args) => db.removeMessage(args.messageId)
  },
  User: {
    message: (user) => db.findMessages(user.id)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphql = server.createHandler();

