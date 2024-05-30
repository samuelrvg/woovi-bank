import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($cpf: String!, $password: String!) {
    login(cpf: $cpf, password: $password) {
      name
      cpf
      token
    }
  }
`;