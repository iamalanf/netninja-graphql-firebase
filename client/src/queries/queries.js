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