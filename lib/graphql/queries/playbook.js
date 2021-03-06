import { gql } from '@apollo/client';

import { SUPPORT_FILE_DETAILS_FRAGMENT } from './common';

/*----------------------------------------
 Fragments
 -----------------------------------------*/
export const PLAYBOOK_DETAILS_FRAGMENT = gql`
  fragment playbookDetails on Playbook {
    id
    createdAt
    updatedAt
    publishedAt
    initialPublishedAt
    type
    assetPath
    author {
      id
      firstName
      lastName
    }
    team {
      id
      name
    }
    title
    desc
    status
    visibility
    policy {
      id
      name
      theme
    }
    categories {
      id
      translations(
        where: { language: { locale: "en-us" } }
        orderBy: name_ASC
      ) {
        id
        language {
          locale
        }
        name
      }
    }
    tags {
      id
      translations(
        where: { language: { locale: "en-us" } }
        orderBy: name_ASC
      ) {
        id
        name
      }
    }
    content {
      id
      rawText
      html
      markdown
    }
  }
`;

/*----------------------------------------
Mutations
-----------------------------------------*/
export const CREATE_PLAYBOOK_MUTATION = gql`
  mutation CREATE_PLAYBOOK_MUTATION($data: PlaybookCreateInput!) {
    createPlaybook(data: $data) {
      id 
    }
  }
`;

// Return complete tree to enable auto cache update
export const UPDATE_PLAYBOOK_MUTATION = gql`
  mutation UPDATE_PLAYBOOK_MUTATION(
    $data: PlaybookUpdateInput!
    $where: PlaybookWhereUniqueInput!
  ) {
    # return all data to trigger auto cache update
    updatePlaybook(data: $data, where: $where) {  
      ...playbookDetails
      supportFiles {
        ...supportFileDetails
      }
    } 
  }
  ${PLAYBOOK_DETAILS_FRAGMENT}
  ${SUPPORT_FILE_DETAILS_FRAGMENT}
`;

export const DELETE_PLAYBOOK_MUTATION = gql`
  mutation DELETE_PLAYBOOK_MUTATION($id: ID!) {
    deletePlaybook(id: $id) {
      id
    }
  }
`;

export const PUBLISH_PLAYBOOK_MUTATION = gql`
  mutation PUBLISH_PLAYBOOK_MUTATION($id: ID!) {
    publishPlaybook(id: $id) {
      id
      status
    }
  }
`;

export const UNPUBLISH_PLAYBOOK_MUTATION = gql`
  mutation UNPUBLISH_PLAYBOOK_MUTATION($id: ID!) {
    unpublishPlaybook(id: $id) {
      id
    }
  }
`;

export const UPDATE_PLAYBOOK_STATUS_MUTATION = gql`
  mutation UPDATE_PLAYBOOK_STATUS_MUTATION( 
    $data: PlaybookUpdateInput!
    $where: PlaybookWhereUniqueInput!
  ) {
    updatePlaybook(data: $data, where: $where) {  
        id
        title
        updatedAt
        publishedAt
        status
      } 
    }
`;

/*----------------------------------------
 Queries
 -----------------------------------------*/
export const PLAYBOOK_QUERY = gql`
  query PLAYBOOK_QUERY($id: ID!) {
    playbook: playbook(id: $id) {
      ...playbookDetails
      supportFiles {
        ...supportFileDetails
      }
    }
  }
  ${PLAYBOOK_DETAILS_FRAGMENT}
  ${SUPPORT_FILE_DETAILS_FRAGMENT}
`;

export const TEAM_PLAYBOOKS_QUERY = gql`
  query TEAM_PLAYBOOKS_QUERY(
    $team: TeamWhereInput!
    $first: Int,
    $skip: Int,
    $searchTerm: String,
    $orderBy: PlaybookOrderByInput,
  ) {
    playbooks(
      first: $first,
      skip: $skip,
      orderBy: $orderBy,
      where: {
        AND: [
          { team: $team },
          {
            OR: [
              { title_contains: $searchTerm },
              { desc_contains: $searchTerm },
              {
                categories_some: {
                  translations_some: { name_contains: $searchTerm }
                }
              },
              {
                author: {
                  OR: [
                    { firstName_contains: $searchTerm },
                    { lastName_contains: $searchTerm },
                    { email_contains: $searchTerm }
                  ]
                }
              }
            ]
          }
        ]
      }
    ) {
      ...playbookDetails
    }
  }
  ${PLAYBOOK_DETAILS_FRAGMENT}
`;

export const TEAM_PLAYBOOKS_COUNT_QUERY = gql`
  query TEAM_PLAYBOOKS_COUNT_QUERY($team: TeamWhereInput!, $searchTerm: String) {
    playbooks(
      where: {
        AND: [
          { team: $team },
          {
            OR: [
              { title_contains: $searchTerm },
              { desc_contains: $searchTerm },
              {
                categories_some: {
                  translations_some: { name_contains: $searchTerm }
                }
              },
              {
                author: {
                  OR: [
                    { firstName_contains: $searchTerm },
                    { lastName_contains: $searchTerm },
                    { email_contains: $searchTerm }
                  ]
                }
              }
            ]
          }
        ]
      }
    ) {
      id
    }
  }
`;

export const PLAYBOOKS_META_QUERY = gql`
  query PLAYBOOKS_META_QUERY {
    playbooks {
      id
      publishedAt
      status
    }
  }
`;

export const PLAYBOOK_FILES_QUERY = gql`
  query PLAYBOOK_FILES_QUERY($id: ID!) {
    playbook(id: $id) {
      id
      assetPath
      supportFiles {
       ...supportFileDetails
     }
    }
  }
  ${SUPPORT_FILE_DETAILS_FRAGMENT}
`;
