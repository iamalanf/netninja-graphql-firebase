import React from 'react';
import { graphql } from 'react-apollo';
import { getBookQuery } from '../queries/queries';
import styled from 'styled-components';

const StyledBookDetails = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 40%;
  height: 100%;
  background: #AD1457;
  padding: 30px;
  overflow: auto;}
  color: #fff;
`

const StyledRelatedBookItem = styled.li`
  display: inline-block;
  margin: 12px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid white;
  box-shadow: 1px 2px 3px rgba(0,0,0,0.3);
  cursor: pointer;
  color: white;   
`
// TODO: inerit from book item but change colour

const BookDetails = (props) => {

    const displayBookDetails = () => {
        const {book} = props.data;
        if(book){
            return(
                <div>
                    <h2>{book.name}</h2>
                    <p>{book.genre}</p>
                    <p>{book.author.name}</p>
                    <p>All books by this author:</p>
                    <ul className="other-books">
                        {
                            book.author.books.map(x => {
                                return(
                                    <StyledRelatedBookItem key={x.id}>{x.name}</StyledRelatedBookItem>
                                )
                            })
                        }
                    </ul>
                </div>
            )
        }
        else{
            return(<div>No book selected...</div>)
        }
    }

    return(
        <StyledBookDetails>
            {displayBookDetails()}
        </StyledBookDetails>
    )
}

export default graphql(getBookQuery, {
    options: (props) => { return{
        variables: {
            id: props.bookId
        }
    }}
})(BookDetails);