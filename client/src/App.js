import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

// Components
import BookList from './components/bookList';


// Apollo client setup
const client = new ApolloClient({
  uri: 'http://localhost:5001/firebase-netninja-graphql/us-central1/graphiql',
})

function App() {
  return (
    <ApolloProvider client = { client }>
      <div className="App">
        <h1>My Reading List</h1>
        <BookList/>
      </div>
    </ApolloProvider>
  );
}

export default App;
