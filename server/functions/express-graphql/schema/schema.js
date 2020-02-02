const admin = require('firebase-admin');

const graphql = require('graphql');
// const Book = require('../models/book');
// const Author = require('../models/Author');
const _ = require('lodash');


const serviceAccount = require('../../firebase_key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-netninja-graphql.firebaseio.com"
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
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        // author: {
        //     type: AuthorType,
        //     resolve(parent, args){
        //         var query =  db.collection('authors').doc(parent.authorId).get();
        //         query
        //             .then(snapshot => {
        //                 if (snapshot.empty) {
        //                     console.log('No matching.');
        //                     return;
        //                 }  
        //                 var res = snapshot.data();//.map(doc => doc.data());
        //                 console.log('isArray: ', Array.isArray(res));
        //                 console.log('Return: ', res);
        //                 return res;
        //             })
        //             .catch(err => {
        //                 console.log('Error getting', err);
        //                 return;
        //         });
        //         // return Author.findById(parent.authorId);
        //     }
        // }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        // id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                var query =  db.collection('books').doc(parent.id).get();
                query
                    .then(snapshot => {
                        if (snapshot.empty) {
                            console.log('No matching.');
                            return;
                        }  
                        var res = snapshot.docs.map(doc => doc.data());
                        console.log('isArray: ', Array.isArray(res));
                        console.log('Return: ', res);
                        return res;
                    })
                    .catch(err => {
                        console.log('Error getting', err);
                        return;
                });
                // return Book.find({ authorId: parent.id });
            }
        }
    })
});

// const testBook = {
//     id: 34,
//     name: "24242424",
//     genre: "532523465437",
// };

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // book: {
        //     type: BookType,
        //     args: { name: { type: GraphQLString } },
        //     resolve(parent, args){
        //         return db.collection("books").where("name", "==", args.name).get().then(snapshot => 
        //             {
        //                 if (snapshot.empty) {
        //                     console.log('No matching.');
        //                     return;
        //                 }
        //                 // return testBook;
        //                 // console.log("SNAPSHOT = ", snapshot);
        //                 var res = {};
        //                 console.log("SNAPSHOT : ", snapshot);
        //                 var res = snapshot.forEach((doc) => { 
        //                     var item = doc.data();
        //                     item.id = doc.id;
        //                     console.log(item);
        //                     res = testBook;
        //                 });
        //                 console.log(">>>", res);
        //                 return res;
        //             })
        //             .catch(err => {
        //                 console.log('Error getting', err);
        //                 return;
        //             });
        //             // https://stackoverflow.com/questions/57737574/how-to-query-firestore-for-graphql-resolver
        //     }
        // },


        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return db.collection('books').doc(args.id).get().then(doc =>
                    {
                        if (!doc.exists) {
                            console.log('No matching doc.');
                            return;
                        }
                        result = doc.data();
                        result.id = doc.id;
                        return result;
                    })
                    .catch(err => {
                        console.log('Error getting', err);
                        return;
                });
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                var query = db.collection('author').doc(args.id).get();
                query
                    .then(snapshot => {
                        if (snapshot.empty) {
                            console.log('No matching.');
                            return;
                        }  
                        var res = snapshot.data();
                        delete Object.assign(res, {["author"]: res["authorId"] })["authorId"];

                        console.log('isArray: ', Array.isArray(res));
                        console.log('Return: ', res);

                        let book = {
                            name: res.name,
                            genre: res.genre,
                            authorId: res.authorId
                        };
                        return book;
                    })
                    .catch(err => {
                        console.log('Error getting', err);
                        return;
                });
                // return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                var query = db.collection('books').get();
                query
                    .then(snapshot => {
                        if (snapshot.empty) {
                            console.log('No matching.');
                            return;
                        }  
                        var res = snapshot.docs.map(doc => doc.data());
                        console.log('isArray: ', Array.isArray(res));
                        console.log('Return: ', res);
                        return res;
                    })
                    .catch(err => {
                        console.log('Error getting', err);
                        return;
                    });
                // return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                var query = db.collection('authors').get();
                query
                    .then(snapshot => {
                        if (snapshot.empty) {
                            console.log('No matching.');
                            return;
                        }  
                        var res = snapshot.docs.map(doc => doc.data());
                        console.log('isArray: ', Array.isArray(res));
                        console.log('Return: ', res);
                        return res;
                    })
                    .catch(err => {
                        console.log('Error getting', err);
                        return;
                });
                // return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args){
                // let author = new Author({
                //     name: args.name,
                //     age: args.age
                // });
                let author = {
                    name: args.name,
                    age: args.age
                };
                db.collection('authors').add(author);
                return author;//.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                // authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                // let book = new Book({
                //     name: args.name,
                //     genre: args.genre,
                //     authorId: args.authorId
                // });
                let book = {
                    name: args.name,
                    genre: args.genre,
                    // authorId: args.authorId
                };
                db.collection('books').add(book); //TODO: could return docID
                return book;//.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});