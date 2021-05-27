import { gql } from '@apollo/client';

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