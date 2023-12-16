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

  Mutation: {
    deleteGame(_, args) {
      db.games = db.games.filter((g) => g.id !== args.id);
      return db.games;
    },
    addGame(_, args) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 10000).toString(),
      };
      db.games.push(game);
      return game;
    },
    updateGame(_, args) {
      db.games = db.games.map((g) => {
        if (g.id === args.id) {
          return { ...g, ...args.edits };
        }
        return g;
      });
      return db.games.find((g) => g.id === args.id);
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

//! Delete logic
// mutation DeleteMutation($id: ID!){
// deleteGame(id: $id) {
//   id
//   platform
//   title
// }
// }

//! AddMutation logic
// mutation AddMutation($game: AddGameInput!){
// addGame(game: $game) {
//   id
//   platform
//   title
// }
// }

//* for variables
// {
//   "game":{
//     "title": "My new game",
//     "platform":["switch","ps5"]
//   }
// }

//! UpdateMulation logic
// mutation UpdateMutation($edits: EditGameInput!, $id:ID!){
// updateGame(edits: $edits,id: $id) {
//   platform
//   title
// }
// }

//* for variable
// {
//   "edits":{
//     "title": "New updated Game",
//     "platform":["vbox","chakra"]
//   },
//   "id": "2"
// }
