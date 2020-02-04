import React, { useState } from 'react';
import { graphql } from 'react-apollo';
import { getBooksQuery } from '../queries/queries';
import styled from 'styled-components';
// components
import BookDetails from './bookDetails';

const StyledDiv = styled.div`
  padding: 0;
  width: 50%;
`

const StyledBookItem = styled.li`
  display: inline-block;
  margin: 12px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #880E4F;
  box-shadow: 1px 2px 3px rgba(0,0,0,0.3);
  cursor: pointer;
  color: #880E4F;
`

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
            <StyledBookItem key={book.id} onClick={ (e) => {setSelectedBook(book.id)} } >{book.name}</StyledBookItem>
          )
        })
      )
    }
  }

  return(
    <StyledDiv>
      <ul>
        {displayBooks()}
      </ul>
      <BookDetails bookId={selectedBook}/>
    </StyledDiv>
  )
}

// Bind query to component
export default graphql(getBooksQuery)(BookList);