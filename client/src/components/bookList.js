import React, { useState } from 'react';
import { graphql } from 'react-apollo';
import { getBooksQuery } from '../queries/queries';

// components
import BookDetails from './bookDetails';

const BookList = (props) => {

  const [selectedBook, setSelectedBook] = useState(null);

  const displayBooks = () => {
    var data = props.data;
    if(data.loading){
      return(<div>Loading Books...</div>);
    }
    else{
      return(
        data.books.map(book => {
          return(
            <li key={book.id} onClick={ (e) => {setSelectedBook(book.id)} } >{book.name}</li>
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
      <BookDetails bookId={selectedBook}/>
    </div>
  )
}

// Bind query to component
export default graphql(getBooksQuery)(BookList);