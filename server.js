import { ApolloServer, gql } from "apollo-server-express";

const server = new ApolloServer({})

server.listen().then(({url}) => {
  console.log((`Running on ${url}`))
})