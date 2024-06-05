import { gql } from 'apollo-server-koa';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    cpfCnpj: String!
    token: String
  }

  type Account {
    id: ID!
    accountNumber: String!
    userId: ID!
    balance: Float!
  }

  type Transaction {
    id: ID!
    sender: ID!
    receiver: ID!
    amount: Float!
  }

  type Query {
    currentUser: User
  }

  type Mutation {
    signUp(name: String!, cpfCnpj: String!, password: String!): User
    login(cpfCnpj: String!, password: String!): User
    createTransaction(receiver: String!, amount: Float!): Transaction
  }
`;