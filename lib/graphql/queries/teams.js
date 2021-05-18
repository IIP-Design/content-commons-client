import { gql } from '@apollo/client';

import { GRAPHIC_PROJECT_FRAGMENT } from './graphic';
import { PACKAGE_DETAILS_FRAGMENT } from './package';
import { VIDEO_PROJECT_DETAILS_FRAGMENT } from './video';

/*----------------------------------------
  Queries
 -----------------------------------------*/
// Fetches currently logged in user
export const TEAM_PROJECTS_QUERY = gql`
  query TEAM_PROJECTS_QUERY(
    $team: ID!
    $first: Int
    $skip: Int
  ) {
    teamProjects(
      id: $team
      first: $first
      skip: $skip
    ) {
      graphics {
        ...graphicProjectDetails
      }
      packages {
        ...packageDetails
      }
      videos {
        ...videoProjectDetails
      }
    }
  }
  ${GRAPHIC_PROJECT_FRAGMENT}
  ${PACKAGE_DETAILS_FRAGMENT}
  ${VIDEO_PROJECT_DETAILS_FRAGMENT}
`;
