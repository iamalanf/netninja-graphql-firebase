import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { createGlobalStyle } from 'styled-components';

// Components
import BookList from './components/bookList';
import AddBook from './components/addBook';


const GlobalStyle = createGlobalStyle`
  body{
    background: #eee;
    font-family: 'Comic Sans MS';
  }

  h1{
    color: #444;
    text-align: center;
    padding: 0px;
    box-sizing: border-box;
    width: 60%;
    height: 100%;
  }
`
// Apollo client setup
const client = new ApolloClient({
  // uri: 'http://localhost:5001/firebase-netninja-graphql/us-central1/graphiql', // emulator
  uri: 'https://us-central1-firebase-netninja-graphql.cloudfunctions.net/graphiqlExpressGraphql', // production express-graphql
  // uri: 'https://us-central1-firebase-netninja-graphql.cloudfunctions.net/graphiqlApollo', // production apollo
})

function App() {
  return (
    <ApolloProvider client = { client }>
      <div className="App">
        <GlobalStyle/>
        <h1>My Reading List</h1>
        <BookList/>
        <AddBook/>
      </div>
    </ApolloProvider>
  );
}

export default App;
