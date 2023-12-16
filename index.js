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
    game(_, args) {
      return db.games.find((game) => game.id === args.id);
    },
    reviews() {
      return db.reviews;
    },
    //! first param parent, second args, third context
    review(_, args) {
      return db.reviews.find((review) => review.id === args.id);
    },
    authors() {
      return db.authors;
    },
    author(_, args) {
      return db.authors.find((author) => author.id === args.id);
    },
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter((r) => r.game_id === parent.id);
    },
  },

  Author: {
    reviews(parent) {
      return db.reviews.filter((r) => r.author_id === parent.id);
    },
  },

  Review: {
    author(parent) {
      return db.authors.find((a) => a.id === parent.author_id);
    },
    game(parent) {
      return db.games.find((g) => g.id === parent.game_id);
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

//! Review query
// query ReviewQuery($id: ID!){
//   review(id: $id) {
//     content
//     rating
//   }
// }

//! GameQuery
// query GameQuery($id: ID!){
//   game(id: $id) {
//     title
//     reviews {
//       rating
//       content
//     }
//   }
// }

//! ReviewQuery
// query ReviewQuery($id: ID!){
//   review(id: $id) {
//     rating
//     game {
//       title
//       platform
//       reviews {
//         rating
//       }
//     },
//   }
// }
