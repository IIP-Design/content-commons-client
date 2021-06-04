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

/*----------------------------------------
 Queries
 -----------------------------------------*/
export const PLAYBOOK_QUERY = gql`
 query Playbook($id: ID!) {
   playbook: playbook(id: $id) {
     ...playbookDetails 
   }
 }
 ${PLAYBOOK_DETAILS_FRAGMENT} 
`;
