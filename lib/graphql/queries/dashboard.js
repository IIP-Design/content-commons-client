import gql from 'graphql-tag';

/*----------------------------------------
  Queries
 -----------------------------------------*/
export const TEAM_VIDEO_PROJECTS_QUERY = gql`
  query VideoProjectsByTeam(
    $team: String!, $searchTerm: String
  ) {
    videoProjects(
      where: {
        AND: [
          { team: { name: $team } },
          {
            OR: [
              { projectTitle_contains: $searchTerm },
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
      createdAt
      updatedAt
      team {
        id
        name
        organization
      }
      author {
        id
        firstName
        lastName
      }
      projectTitle
      status
      visibility
      thumbnails {
        id
        url
        signedUrl
        alt
      }
      categories {
        id
        translations {
          id
          name
          language {
            id
            locale
          }
        }
      }
    }
  }
`;

export const TEAM_PACKAGES_QUERY = gql`
  query TeamPackagesQuery(
    $team: String!, $searchTerm: String
  ){
    packages(
      where: {
        AND: [
          { team: { name: $team } },
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
      createdAt
      updatedAt
      title
      team {
        id
        name
        organization
      }
      author {
        id
        firstName
        lastName
      }
      status
      visibility
      categories {
        id
        translations {
          id
          name
          language {
            id
            locale
          }
        }
      }
      tags {
        id
        translations {
          id
          name
          language {
            id
            locale
          }
        }
      }
    }
  }
`;

export const DASHBOARD_PROJECTS_QUERY = gql`
  query DashboardProjectsQuery(
    $team: String!, $searchTerm: String
  ) {
    documentFiles(
      where: {
        AND: [
          { team: { name: $team } },
          {
            OR: [
              { filename_contains: $searchTerm },
              {
                content: {
                  OR: [
                    { rawText_contains: $searchTerm },
                    { html_contains: $searchTerm },
                    { markdown_contains: $searchTerm },
                  ]
                }
              },
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
      createdAt
      updatedAt
      team {
        id
        name
        organization
      }
      author {
        id
        firstName
        lastName
      }
      status
      visibility
      categories {
        id
        translations {
          id
          name
          language {
            id
            locale
          }
        }
      }
      tags {
        id
        translations {
          id
          name
          language {
            id
            locale
          }
        }
      }
    }
    packages(
      where: {
        AND: [
          { team: { name: $team } },
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
      createdAt
      updatedAt
      team {
        id
        name
        organization
      }
      author {
        id
        firstName
        lastName
      }
      status
      visibility
      categories {
        id
        translations {
          id
          name
          language {
            id
            locale
          }
        }
      }
      tags {
        id
        translations {
          id
          name
          language {
            id
            locale
          }
        }
      }
    }
    videoProjects(
      where: {
        AND: [
          { team: { name: $team } },
          {
            OR: [
              { projectTitle_contains: $searchTerm },
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
      createdAt
      updatedAt
      team {
        id
        name
        organization
      }
      author {
        id
        firstName
        lastName
      }
      projectTitle
      status
      visibility
      thumbnails {
        id
        url
        signedUrl
        alt
      }
      categories {
        id
        translations {
          id
          name
          language {
            id
            locale
          }
        }
      }
    }
  }
`;
