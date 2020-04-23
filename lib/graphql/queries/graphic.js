import gql from 'graphql-tag';
import {
  IMAGE_DETAILS_FRAGMENT,
  LANGUAGE_DETAILS_FRAGMENT,
  CATEGORY_DETAILS_FRAGMENT,
  TAG_DETAILS_FRAGMENT,
  SUPPORT_FILE_DETAILS_FRAGMENT
} from './common';

/*----------------------------------------
 Fragments
 -----------------------------------------*/
const GRAPHIC_PROJECT_FRAGMENT = gql`
  fragment graphicProjectDetails on GraphicProject {
    id
    createdAt
    updatedAt
    publishedAt
    type
    title
    copyright
    alt
    descPublic
    descInternal
    assetPath
    author {
      id
      firstName
      lastName
      email
    }
    team {
      id
      name
      contentTypes
    }
    status
    visibility
    images {
      ...imageDetails
    }
    categories {
      ...categoryDetails
    }
    tags {
      ...tagDetails
    }
  }
  ${LANGUAGE_DETAILS_FRAGMENT}
  ${IMAGE_DETAILS_FRAGMENT}
  ${CATEGORY_DETAILS_FRAGMENT}
  ${TAG_DETAILS_FRAGMENT}
`;

/*----------------------------------------
 Mutations
 -----------------------------------------*/
export const CREATE_GRAPHIC_PROJECT_MUTATION = gql`
  mutation CreateGraphicProject($data: GraphicProjectCreateInput!) {
    createGraphicProject(data: $data) {
      id
      title
    }
  }
`;

export const UPDATE_GRAPHIC_PROJECT_MUTATION = gql`
  mutation UpdateGraphicProject(
    $data: GraphicProjectUpdateInput!
    $where: GraphicProjectWhereUniqueInput!
  ) {
    updateGraphicProject(data: $data, where: $where) {
      ...graphicProjectDetails
      supportFiles {
        ...supportFileDetails
      }
    }
  }
  ${GRAPHIC_PROJECT_FRAGMENT}
  ${SUPPORT_FILE_DETAILS_FRAGMENT}
`;

export const DELETE_GRAPHIC_PROJECT_MUTATION = gql`
  mutation DeleteGraphicProject($id: ID!) {
    deleteGraphicProject(id: $id) {
      id
    }
  }
  ${GRAPHIC_PROJECT_FRAGMENT}
`;

/*----------------------------------------
 Queries
 -----------------------------------------*/
export const GRAPHIC_PROJECTS_QUERY = gql`
  query GraphicProjects {
    graphicProjects {
      ...graphicProjectDetails
      supportFiles {
        ...supportFileDetails
      }
    }
  }
  ${GRAPHIC_PROJECT_FRAGMENT}
  ${SUPPORT_FILE_DETAILS_FRAGMENT}
`;

export const GRAPHIC_PROJECT_QUERY = gql`
  query GraphicProject($id: ID!) {
    graphicProject(id: $id) {
      ...graphicProjectDetails
      supportFiles {
        ...supportFileDetails
      }
    }
  }
  ${GRAPHIC_PROJECT_FRAGMENT}
  ${SUPPORT_FILE_DETAILS_FRAGMENT}
`;

export const GRAPHIC_PROJECT_SUPPORT_FILES_QUERY = gql`
  query GraphicProjectSupportFiles($id: ID!) {
    graphicProject(id: $id) {
      id
      title
      type
      assetPath
      supportFiles(orderBy: updatedAt_DESC) {
        ...supportFileDetails
      }
    }
  }
  ${SUPPORT_FILE_DETAILS_FRAGMENT}
`;

export const TEAM_GRAPHIC_PROJECTS_QUERY = gql`
  query TeamGraphicProjectsQuery(
    $team: String!,
    $searchTerm: String,
    $first: Int,
    $skip: Int,
    $orderBy: GraphicProjectOrderByInput
  ){
    graphicProjects(
      first: $first,
      skip: $skip,
      orderBy: $orderBy,
      where: {
        AND: [
          { team: { name: $team } },
          {
            OR: [
              { title_contains: $searchTerm },
              { descPublic_contains: $searchTerm },
              { descInternal_contains: $searchTerm },
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
      ...graphicProjectDetails
      supportFiles {
        ...supportFileDetails
      }
    }
  }
  ${GRAPHIC_PROJECT_FRAGMENT}
  ${SUPPORT_FILE_DETAILS_FRAGMENT}
`;

export const TEAM_GRAPHIC_PROJECTS_COUNT_QUERY = gql`
  query GraphicProjectsCountByTeam( $team: String!, $searchTerm: String ) {
    graphicProjects(
      where: {
        AND: [
          { team: { name: $team } },
          {
            OR: [
              { title_contains: $searchTerm },
              { descPublic_contains: $searchTerm },
              { descInternal_contains: $searchTerm },
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
