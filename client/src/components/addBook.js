import React from 'react';
import { graphql } from 'react-apollo';
import { getAuthorsQuery } from '../queries/queries';


const AddBook = (props) => {

    const displayAuthors = () => {
        var data = props.data;
        if(data.loading){
            return(
                <option disabled>Loading Authors...</option>
            )
        }
        else{
            return(
                data.authors.map(author => {
                    return(
                      <option key={author.id} value={author.id}>{author.name}</option>
                    )
                })
            )
        }
    }
    
    
    return(
        <form id="add-book">

            <div className="input-field">
                <label>Book name:</label>
                <input type="text"/>
            </div>

            <div className="input-field">
                <label>Genre:</label>
                <input type="text"/>
            </div>

            <div className="input-field">
                <label>Author:</label>
                <select>
                    <option>Select author</option>
                    {displayAuthors()}
                </select>
            </div>

            <button>+</button>

        </form>
    )
}

export default graphql(getAuthorsQuery)(AddBook);