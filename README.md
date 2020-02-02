# README

This is based on the [graphql tutorial](https://www.youtube.com/playlist?list=PL4cUxeGkcC9iK6Qhn-QLcXCXPQUov1U7f) by The Net Ninja, if you looking to learn front end development check him out, a very good teacher!

The Net Ninja tutorial was based on a MongoDB server here instead is a firestore server hosted using Firebase functions.

# Initial Setup

Feel free to play with this project to begin with but I may change the firestore security rules leading to everything failing to write. In which case you will need to initialise your own Firebase project. Code snippets from this repo can be used to get you going quickly. 

## Setting up your Firebase Project

* Create a project folder, do not clone this repo, work from a base

* Make sure you have firebase cli installed
    * If also planning to do a front end would suggest creating a server folder within project folder

* In server folder hit firebase init 
* Create new firebase project with your credentials
* Would suggest only initialising functions to begin with ( I used javascript not typescript to keep things simple )
* Did not set up Firestore here as defaulted to Google Cloud platform not Firebase
* Once Firebase project created go to console > database and create a Firestore. Would suggest public rules to begin with (this is just a demo project but if using in production change this!)
* Copy in the functions code (`index.js`, and code in `express-graphql` folder) from this repo and emulate or deploy..

### Working Locally

To work locally you can emulate firebase functions using the following command:

```
cd server
firebase emulators:start --only functions,firestore
```
or to interact with production db
```
cd server
firebase emulators:start --only functions
```

The url for the function should pop up in the terminal, click to navigate to that url and have fun playing in graphiql!

### Deploying
To deploy all firebase services:
`firebase deploy`
For graphql should only need:
`firebase deploy --only functions`

# Firebase key
Depending on project settings may need firebase key. Go to firebase console > project settings > service accounts > create service account > follow instructions and download json key

I put my key in `functions` folder and added to `.gitignore`. Path in `schema.js` will need to be updated depending on location. 

Would not add key to source control as a file. Would put as secret!




# Example graphiql queries 
Example graphiql queries can be found in `server\example-graphiql-queries\`.

`graphiql_example.json` shows queries
