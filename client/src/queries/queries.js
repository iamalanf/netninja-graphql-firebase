import { gql } from 'apollo-boost';

export const getAuthorsQuery = gql`
  {
    authors {
      name
      id
    }
  }
`

export const getBooksQuery = gql`
  {
    books {
      name
      genre
      id
    }
  }
`

// Mutations
export const addBookMutation = gql`
    mutation {
        addBook(name: "", genre: "", authorId: ""){
            name
            id
        }
    }
`