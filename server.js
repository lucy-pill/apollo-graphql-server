import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

let tweets = [
  {
    id: '1',
    text: 'first',
    userId: '2',
  },
  {
    id: '2',
    text: 'second',
    userId: '1',
  },
];

let users = [
  {
    id: '1',
    firstName: 'pill sang',
    lastName: 'sung',
  },
  {
    id: '2',
    firstName: 'pill won',
    lastName: 'sung',
  },
];

const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    fullName: String!
  }
  """
  Tweet object represent a resource for a Tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    tweet(_, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allTweets() {
      return tweets;
    },
    allUsers() {
      return users;
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const user = users.find((user) => user.id === userId);
      if (user) {
        const newTweet = {
          id: (parseInt(tweets.at(-1)['id']) + 1).toString(),
          text,
          userId,
        };
        tweets.push(newTweet);
        return newTweet;
      } else {
        return { id: '', text: '', userId: '' };
      }
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) {
        return false;
      } else {
        tweets = tweets.filter((tweet) => tweet.id !== id);
        return true;
      }
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
