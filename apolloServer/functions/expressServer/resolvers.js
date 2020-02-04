const admin = require("firebase-admin");
const _ = require("lodash");

const serviceAccount = require("./firebase_key.json");

// Get the following from firebase console > project settings > service accounts > download json key
// See README for more details
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://fir-netninja-graphql.firebaseio.com" // emulator
  databaseURL: "https://us-central1-firebase-netninja-graphql.cloudfunctions.net/graphiql" // production
});

let db = admin.firestore();

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.

module.exports = {
    Query: {
      book: async (bookId) => {
          results = await db.collection("book")
            .doc(bookId)
            .get()
            .then(doc => {
                if (!doc.exists){
                    console.log("No matching book found with ID: ", bookId);
                    return;
                }
                let result = doc.data();
                result.id = doc.id;
                return result;
            })
            .catch(err => {
                console.log("Error getting book. BookID:", bookID, "err: ", err);
                return;
            });
        return results;
      },
      author: async (authorId) => {
        results = await db.collection("author")
            .doc(authorId)
            .get()
            .then(doc => {
                if (!doc.exists){
                    console.log("No matching author found with ID: ", authorId);
                    return
                }
                let result = doc.data();
                result.id = doc.id;
                return result;
            })
            .catch(err =>{
                console.log("Error getting author. AuthorID: ", authorId, "err: ", err);
                return;
            })
        return results;
      },
      books: async () => {
        const results = await db.collection("books")
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log("No matching.");
                    return;
                }
                let res = snapshot.docs.map(doc => {
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
        return results;
      },
      authors: async () => {
          const results = await db.collection("authors")
            .get()
            .then(snapshot => {
                if(snapshot.empty){
                    console.log("No matching authors found");
                    return;
                }
                let res = snapshot.docs.map(doc => {
                    let item = doc.data();
                    item.id = doc.id;
                    return item;
                });
                return res;
            })
            .catch(err => {
                console.log("Error getting all authors", err);
                return;
            });
        return results;
      }
    },
    Mutation: {
        addBook : async (_, {name, genre, authorId}) => {
            let bookToAdd = {
                name: name,
                genre: genre,
                authorId: authorId
            };
            console.log("ADDDING BOOK. ", bookToAdd);
            const results = await db.collection("books") // TODO: would like collection names to be constant to avoid error
                .add(bookToAdd)
                .then(resultingDoc => {
                    if(resultingDoc.exists) {
                        console.log("Document already exists when adding book!")
                        return;
                    }
                    bookToAdd.id = resultingDoc.id;
                    return bookToAdd;
                })
                .catch(err => {
                    console.log("Error adding book. Err: ", err);
                    return;
                });
            return results
        },
        addAuthor : async (_, {name, age}) => {
            let authorToAdd = {
                name: name,
                age: age,
            };
            const results = await db.collection("authors")
                .add(authorToAdd)
                .then(resultingDoc => {
                    if(resultingDoc.exists) {
                        console.log("Document already exists when adding author!")
                        return;
                    }
                    authorToAdd.id = resultingDoc.id;
                    return authorToAdd;
                })
                .catch(err => {
                    console.log("Error adding book. Err: ", err);
                    return;
                });
            return results
        }
    },
    Book: {
        author: async ({authorId}) => {
            const results = await db.collection("authors")
                .doc(authorId)
                .get()
                .then(doc => {
                    if(!doc.exists){
                        console.log("No author found for ID: ", authorId);
                        return;
                    }
                    let result = doc.data();
                    result.id = doc.id;
                    return result;
                })
                .catch(err => {
                    console.log("Error getting author. AuthorID: ", authorId, "err: ", err);
                    return;
                });
            return results;
        }
    },
    Author: {
        books: async ({id}) => {
            const authorId = id;
            const results = await db.collection("books")
                .where("authorId", "==", authorId)
                .get()
                .then(snapshot => {
                    if(snapshot.empty){
                        console.log("No matching books found for author ID: ", authorID);
                        return;
                    }
                    let res = snapshot.docs.map(doc => {
                        let item = doc.data();
                        item.id = doc.id;
                        return item;
                    });
                    return res;
                })
                .catch(err => {
                    console.log("Error getting books for author. Author ID: ", authorID, ". err: ", err);
                    return;
                });
            return results;
        }
    }
  };