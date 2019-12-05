import gql from 'graphql-tag';

/*----------------------------------------
 Fragments
 -----------------------------------------*/
export const VIDEO_PROJECT_DETAILS_FRAGMENT = gql`
  fragment videoProjectDetails on VideoProject {
    id
    createdAt
    updatedAt
    publishedAt
    author {
      id
      firstName
      lastName
    }
    team {
      id
      name
    }
    projectTitle
    descPublic
    descInternal
    status
    visibility
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

export const LANGUAGE_DETAILS_FRAGMENT = gql`
  fragment languageDetails on Language {
    id
    locale
    languageCode
    displayName
    textDirection
    nativeName
  }
`;

export const IMAGE_DETAILS_FRAGMENT = gql`
  fragment imageDetails on ImageFile {
    id
    createdAt
    updatedAt
    filename
    filetype
    filesize
    url
    signedUrl
    alt
    use {
      id
      name
    }
    language {
      ...languageDetails
    }
  }
  ${LANGUAGE_DETAILS_FRAGMENT}
`;

export const VIDEO_FILE_DETAILS_FRAGMENT = gql`
  fragment videoFileDetails on VideoFile {
    id
    createdAt
    updatedAt
    filename
    filetype
    filesize
    duration
    videoBurnedInStatus
    quality
    dimensions {
      id
      width
      height
    }
    url
    signedUrl
    language {
      ...languageDetails
    }
    use {
      id
      name
    }
    stream {
      id
      site
      url
    }
  }
  ${LANGUAGE_DETAILS_FRAGMENT}
`;

export const UNIT_DETAILS_FRAGMENT = gql`
  fragment unitDetails on VideoUnit {
    id
    createdAt
    updatedAt
    title
    descPublic
    files {
      ...videoFileDetails
    }
    language {
      ...languageDetails
    }
    thumbnails {
      id
      size
      image {
        ...imageDetails
      }
    }
    tags {
      id
      translations {
        id
        name
        language {
          ...languageDetails
        }
      }
    }
  }
  ${LANGUAGE_DETAILS_FRAGMENT}
  ${IMAGE_DETAILS_FRAGMENT}
  ${VIDEO_FILE_DETAILS_FRAGMENT}
`;

export const SUPPORT_FILE_DETAILS_FRAGMENT = gql`
  fragment supportFileDetails on SupportFile {
    id
    createdAt
    updatedAt
    filename
    filetype
    filesize
    url
    signedUrl
    language {
      ...languageDetails
    }
    use {
      id
      name
    }
  }
  ${LANGUAGE_DETAILS_FRAGMENT}
`;

/*----------------------------------------
  Mutations
 -----------------------------------------*/
export const CREATE_VIDEO_PROJECT_MUTATION = gql`
  mutation CREATE_VIDEO_PROJECT_MUTATION($data: VideoProjectCreateInput!) {
    createVideoProject(data: $data) {
      id
      projectTitle
    }
  }
`;

export const UPDATE_VIDEO_PROJECT_MUTATION = gql`
  mutation UPDATE_VIDEO_PROJECT_MUTATION(
    $data: VideoProjectUpdateInput!
    $where: VideoProjectWhereUniqueInput!
  ) {
    updateVideoProject(data: $data, where: $where) {
      ...videoProjectDetails
      thumbnails {
        id
        language {
          id
          displayName
          locale
        }
      }
      units {
        id
        language {
          id
          displayName
        }
      }
    }
  }
  ${VIDEO_PROJECT_DETAILS_FRAGMENT}
`;

export const DELETE_VIDEO_PROJECT_MUTATION = gql`
  mutation DELETE_VIDEO_PROJECT_MUTATION($id: ID!) {
    deleteVideoProject(id: $id) {
      id
    }
  }
`;

export const DELETE_VIDEO_PROJECTS_MUTATION = gql`
  mutation DeleteManyVideoProjects($where: VideoProjectWhereInput) {
    deleteProjects: deleteManyVideoProjects(where: $where) {
      count
    }
  }
`;


export const CREATE_VIDEO_FILE_MUTATION = gql`
  mutation CREATE_VIDEO_FILE_MUTATION($data: VideoFileCreateInput!) {
    createVideoFile(data: $data) {
      ...videoFileDetails 
    }
  }
  ${VIDEO_FILE_DETAILS_FRAGMENT}
`;

export const DELETE_VIDEO_FILE_MUTATION = gql`
  mutation DELETE_VIDEO_FILE_MUTATION($id: ID!) {
    deleteVideoFile(id: $id) {
      id
    }
  }
`;

export const UPDATE_VIDEO_FILE_MUTATION = gql`
  mutation UPDATE_VIDEO_FILE_MUTATION(
    $data: VideoFileUpdateInput!
    $where: VideoFileWhereUniqueInput!
  ) {
    updateVideoFile(data: $data, where: $where) {
      id
    }
  }
`;

export const UPDATE_VIDEO_UNIT_MUTATION = gql`
  mutation UPDATE_VIDEO_UNIT_MUTATION(
    $data: VideoUnitUpdateInput!
    $where: VideoUnitWhereUniqueInput!
  ) {
    updateVideoUnit(data: $data, where: $where) {
      id
      thumbnails {
        id
        size
        image {
          id
          url
          signedUrl
        }
      }
    }
  }
`;

export const DELETE_MANY_VIDEO_UNITS_MUTATION = gql`
  mutation DELETE_MANY_VIDEO_UNITS_MUTATION($where: VideoUnitWhereInput!) {
    deleteManyVideoUnits(where: $where) {
      count
    }
  }
`;

export const PUBLISH_VIDEO_PROJECT_MUTATION = gql`
  mutation PUBLISH_VIDEO_PROJECT_MUTATION($id: ID!) {
    publishVideoProject(id: $id) {
      id
      status
    }
  }
`;

export const UNPUBLISH_VIDEO_PROJECT_MUTATION = gql`
  mutation UNPUBLISH_VIDEO_PROJECT_MUTATION($id: ID!) {
    unpublishVideoProject(id: $id) {
      id
    }
  }
`;

export const VIDEO_UNIT_ADD_TAG_MUTATION = gql`
  mutation VIDEO_UNIT_ADD_TAG_MUTATION($id: ID!, $tagId: ID!) {
    updateVideoUnit(
      data: { tags: { connect: { id: $tagId } } }
      where: { id: $id }
    ) {
      id
      tags {
        id
      }
    }
  }
`;

/*----------------------------------------
  Queries
 -----------------------------------------*/
export const VIDEO_PROJECT_FORM_QUERY = gql`
  query VIDEO_PROJECT_FORM_QUERY($id: ID!) {
    projectForm: videoProject(id: $id) {
      ...videoProjectDetails
    }
  }
  ${VIDEO_PROJECT_DETAILS_FRAGMENT}
`;

export const VIDEO_PROJECT_FILES_QUERY = gql`
  query VIDEO_PROJECT_FILES_QUERY($id: ID!) {
    projectFiles: videoProject(id: $id) {
      id
      supportFiles {
        ...supportFileDetails
      }
      thumbnails {
        ...imageDetails
      }
    }
  }
  ${SUPPORT_FILE_DETAILS_FRAGMENT}
  ${IMAGE_DETAILS_FRAGMENT}
`;

export const VIDEO_PROJECT_UNITS_QUERY = gql`
  query VIDEO_PROJECT_UNITS_QUERY($id: ID!) {
    projectUnits: videoProject(id: $id) {
      id
      units {
        ...unitDetails
      }
    }
  }
  ${UNIT_DETAILS_FRAGMENT}
`;

export const VIDEO_PROJECT_QUERY = gql`
  query VIDEO_PROJECT_QUERY($id: ID!) {
    project: videoProject(id: $id) {
      ...videoProjectDetails
      supportFiles {
        ...supportFileDetails
      }
      thumbnails {
        ...imageDetails
      }
      units {
        ...unitDetails
      }
    }
  }
  ${LANGUAGE_DETAILS_FRAGMENT}
  ${SUPPORT_FILE_DETAILS_FRAGMENT}
  ${IMAGE_DETAILS_FRAGMENT}
  ${VIDEO_PROJECT_DETAILS_FRAGMENT}
  ${UNIT_DETAILS_FRAGMENT}
`;

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

export const TEAM_VIDEO_PROJECTS_COUNT_QUERY = gql`
  query VideoProjectsCountByTeam( $team: String!, $searchTerm: String ) {
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
    }
  }
`;
