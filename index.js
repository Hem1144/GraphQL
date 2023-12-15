import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import db from "./_db.js";

//! types
import { typeDefs } from "./schema/schema.js";

//! resolvers function
const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    reviews() {
      return db.reviews;
    },
    authors() {
      return db.authors;
    },
    //! first param parent, second args, third context
    review(_, args) {
      return db.reviews.find((review) => review.id === args.id);
    },
  },
};

//* Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 5000 },
});

console.log(`🚀  Server ready at: 5000`);
