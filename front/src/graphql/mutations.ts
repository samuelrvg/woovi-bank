import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($cpfCnpj: String!, $password: String!) {
    login(cpfCnpj: $cpfCnpj, password: $password) {
      name
      cpfCnpj
      token
    }
  }
`;

export const SIGN_UP_MUTATION = gql`
  mutation SignUp($name: String!, $cpfCnpj: String!, $password: String!) {
    signUp(name: $name, cpfCnpj: $cpfCnpj, password: $password) {
      token
    }
  }
`;