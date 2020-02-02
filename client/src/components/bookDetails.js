import React from 'react';
import { graphql } from 'react-apollo';
import { getBookQuery } from '../queries/queries';

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
                                    <li key={x.id}>{x.name}</li>
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
        <div id="book-details">
            {displayBookDetails()}
        </div>
    )
}

export default graphql(getBookQuery, {
    options: (props) => { return{
        variables: {
            id: props.bookId
        }
    }}
})(BookDetails);