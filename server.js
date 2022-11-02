import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import fetch from 'node-fetch';

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
    firstName: String!
    lastName: String!
    fullName: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allMovies: [Movie!]!
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    movie(id: String!): Movie
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
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
    async allMovies() {
      const response = await fetch('https://yts.mx/api/v2/list_movies.json');
      const json = await response.json();
      return json.data.movies;
    },
    async movie(_, { id }) {
      const response = await fetch(
        `https://yts.mx/api/v2/movie_details.json?movie_id=${id}`
      );
      const json = await response.json();
      return json.data.movie;
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