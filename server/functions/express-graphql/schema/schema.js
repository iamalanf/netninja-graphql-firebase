const admin = require("firebase-admin");
const graphql = require("graphql");
const _ = require("lodash");

const serviceAccount = require("./firebase_key.json");

// Get the following from firebase console > project settings > service accounts > download json key
// See README for more details
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://fir-netninja-graphql.firebaseio.com" // emulator
  databaseURL: "https://us-central1-firebase-netninja-graphql.cloudfunctions.net/graphiql" // production
});

let db = admin.firestore();

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return db
          .collection("authors")
          .doc(parent.authorId)
          .get()
          .then(doc => {
            if (!doc.exists) {
              console.log("No matching doc found when finding book author");
              return;
            }
            let result = doc.data();
            result.id = doc.id;
            return result;
          })
          .catch(err => {
            console.log("Error getting", err);
            return;
          });
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return db
          .collection("books")
          .where("authorId", "==", parent.id)
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
              console.log("No matching books found for author ID");
              return;
            }
            const res = snapshot.docs.map(doc => {
              let item = doc.data();
              item.id = doc.id;
              return item;
            });
            return res;
          })
          .catch(err => {
            console.log("Error getting", err);
            return;
          });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return db
          .collection("books")
          .doc(args.id)
          .get()
          .then(doc => {
            if (!doc.exists) {
              console.log("No matching doc");
              return;
            }
            let result = doc.data();
            result.id = doc.id;
            return result;
          })
          .catch(err => {
            console.log("Error getting", err);
            return;
          });
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return db
          .collection("authors")
          .doc(args.id)
          .get()
          .then(doc => {
            if (!doc.exists) {
              console.log("No matching doc");
              return;
            }
            let result = doc.data();
            result.id = doc.id;
            return result;
          })
          .catch(err => {
            console.log("Error getting", err);
            return;
          });
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return db
          .collection("books")
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
              console.log("No matching.");
              return;
            }
            const res = snapshot.docs.map(doc => {
              let item = doc.data();
              item.id = doc.id;
              return item;
            });
            return res;
          })
          .catch(err => {
            console.log("Error getting all books", err);
            return;
          });
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return db
          .collection("authors")
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
              console.log("No matching.");
              return;
            }
            const res = snapshot.docs.map(doc => {
              let item = doc.data();
              item.id = doc.id;
              return item;
            });
            return res;
          })
          .catch(err => {
            console.log("Error getting", err);
            return;
          });
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        let author = {
          name: args.name,
          age: args.age
        };
        return db
          .collection("authors")
          .add(author)
          .then(resultingDoc => {
            if (resultingDoc.exists) {
              console.log("Document already exists when adding author!");
              return;
            }
            author.id = resultingDoc.id;
            return author;
          })
          .catch(err => {
            console.log("Error adding author", err);
            return;
          });
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let book = {
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        };
        return db
          .collection("books")
          .add(book)
          .then(resultingDoc => {
            if (resultingDoc.exists) {
              console.log("Document already exists when adding book!");
              return;
            }
            book.id = resultingDoc.id;
            return book;
          })
          .catch(err => {
            console.log("Error adding book", err);
            return;
          });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
