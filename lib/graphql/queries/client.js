import gql from 'graphql-tag';

/*----------------------------------------
 Apollo Client Cache Queries
 -----------------------------------------*/
export const UPDATED_PROJECTS_CACHE_QUERY = gql`
  {
    updatedProjects @client
  }
`;

export const ADD_UPDATED_PROJECTS_CACHE_MUTATION = gql`
  mutation addUpdatedProject($id: String!) {
    addUpdatedProject(id: $id) @client
  }
`;

export const REMOVE_UPDATED_PROJECTS_CACHE_MUTATION = gql`
  mutation removeUpdatedProject($id: String!) {
    removeUpdatedProject(id: $id) @client
  }
`;
