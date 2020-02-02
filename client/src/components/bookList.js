import React from 'react';
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';

const getBooksQuery = gql`
  {
    books {
      name
      genre
      id
    }
  }
`

const BookList = (props) => {

  const displayBooks = () => {
    var data = props.data;
    if(data.loading){
      return(<div>Loading Books...</div>);
    }
    else{
      return(
        data.books.map(book => {
          return(
            <li key={book.id}>{book.name}</li>
          )
        })
      )
    }
  }

  return(
    <div id="book-list">
      <ul>
        {displayBooks()}
      </ul>
    </div>
  )
}

// Bind query to component
export default graphql(getBooksQuery)(BookList);