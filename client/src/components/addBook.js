import React, { useState } from 'react';
import { graphql } from 'react-apollo'; // Compose no longer in Apollo 3, was copy of lodash's flowright anyway according to docs and stackE https://stackoverflow.com/questions/57445294/compose-not-exported-from-react-apollo
import { flowRight as compose } from 'lodash';
import { getAuthorsQuery, addBookMutation, getBooksQuery } from '../queries/queries';
import styled from 'styled-components';

const StyledForm = styled.form`
  background: #fff;
  padding: 20px;
  padding-bottom: 50px;
  width: 50%;
  position: fixed;
  left: 0;
  bottom: 0;
  
  .field{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
}

  label{
    text-align: right;
    padding: 6px;
}

 input, select{
    margin: 4px 0;
    padding: 6px;
    box-sizing: border-box;
}

  button{
    color: #fff;
    font-size: 2em;
    background: #AD1457;
    border: 0;
    padding: 0 10px;
    border-radius: 50%;
    cursor: pointer;
    position: absolute;
    bottom: 10px;
    left: 10px;
}
`


const AddBook = (props) => {

  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [authorId, setAuthorId] = useState("");

  const displayAuthors = () => {
      var data = props.getAuthorsQueryName;
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

  const submitForm = (e) => {
    e.preventDefault();
    props.addBookMutationName({
      variables: {
        name: name,
        genre: genre,
        authorId: authorId
      },
      refetchQueries: [{ query: getBooksQuery}]
    });
  }
     
  return(
      <StyledForm id="add-book" onSubmit={ (e) => {submitForm(e)}}>

          <div className="field">
              <label>Book name:</label>
              <input type="text" onChange={ (e) => setName(e.target.value)}/>
          </div>

          <div className="field">
              <label>Genre:</label>
              <input type="text" onChange={ (e) => {setGenre(e.target.value)}} />
          </div>

          <div className="field">
              <label>Author:</label>
              <select onChange = { (e) => {setAuthorId(e.target.value)}}>
                  <option>Select author</option>
                  {displayAuthors()}
              </select>
          </div>

          <button>+</button>

      </StyledForm>
  )
}

export default compose(
  graphql(getAuthorsQuery, {name: "getAuthorsQueryName"}),
  graphql(addBookMutation, {name: "addBookMutationName"})
)(AddBook);