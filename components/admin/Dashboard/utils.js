import { getProjectsType } from 'lib/graphql/util';
import {
  DELETE_GRAPHIC_PROJECT_MUTATION,
  TEAM_GRAPHIC_PROJECTS_QUERY,
  TEAM_GRAPHIC_PROJECTS_COUNT_QUERY,
  GRAPHIC_PROJECT_IMAGE_FILES_QUERY,
  UNPUBLISH_GRAPHIC_PROJECT_MUTATION,
  UPDATE_GRAPHIC_STATUS_MUTATION,
  GRAPHIC_PROJECTS_META_QUERY,
} from 'lib/graphql/queries/graphic';
import {
  DELETE_PACKAGE_MUTATION,
  PACKAGE_FILES_QUERY,
  TEAM_PACKAGES_COUNT_QUERY,
  TEAM_PACKAGES_QUERY,
  UNPUBLISH_PACKAGE_MUTATION,
  UPDATE_PACKAGE_STATUS_MUTATION,
  PACKAGES_META_QUERY,
} from 'lib/graphql/queries/package';
import {
  DELETE_VIDEO_PROJECT_MUTATION,
  TEAM_VIDEO_PROJECTS_COUNT_QUERY,
  TEAM_VIDEO_PROJECTS_QUERY,
  UNPUBLISH_VIDEO_PROJECT_MUTATION,
  UPDATE_VIDEO_STATUS_MUTATION,
  VIDEO_PROJECT_FILES_QUERY,
  VIDEO_PROJECTS_META_QUERY,
} from 'lib/graphql/queries/video';
import { TEAM_PLAYBOOKS_QUERY, TEAM_PLAYBOOKS_COUNT_QUERY } from 'lib/graphql/queries/playbook';

/**
 * Returns the project type based off of the content type available to a team
 *
 * @param {Object} team team data received from GraphQL
 */
export const getContentTypesFromTeam = team => {
  const contentTypes = team?.contentTypes ? team.contentTypes : '';

  const type = getProjectsType( contentTypes );

  return type || null;
};

/**
 * Returns the expected queries depending on what content types a team has access to
 *
 * @param {Object} team team data received from GraphQL
 * @returns {Object} list of relevant queries
 */
export const setQueries = team => {
  const queries = {};

  switch ( getContentTypesFromTeam( team ) ) {
    case 'graphicProjects':
      queries.content = TEAM_GRAPHIC_PROJECTS_QUERY;
      queries.count = TEAM_GRAPHIC_PROJECTS_COUNT_QUERY;
      queries.files = GRAPHIC_PROJECT_IMAGE_FILES_QUERY;
      queries.metaContent = GRAPHIC_PROJECTS_META_QUERY;
      queries.remove = DELETE_GRAPHIC_PROJECT_MUTATION;
      queries.status = UPDATE_GRAPHIC_STATUS_MUTATION;
      queries.unpublish = UNPUBLISH_GRAPHIC_PROJECT_MUTATION;

      return queries;
    case 'videoProjects':
      queries.content = TEAM_VIDEO_PROJECTS_QUERY;
      queries.count = TEAM_VIDEO_PROJECTS_COUNT_QUERY;
      queries.files = VIDEO_PROJECT_FILES_QUERY;
      queries.metaContent = VIDEO_PROJECTS_META_QUERY;
      queries.remove = DELETE_VIDEO_PROJECT_MUTATION;
      queries.status = UPDATE_VIDEO_STATUS_MUTATION;
      queries.unpublish = UNPUBLISH_VIDEO_PROJECT_MUTATION;

      return queries;
    case 'packages':
      queries.content = TEAM_PACKAGES_QUERY;
      queries.count = TEAM_PACKAGES_COUNT_QUERY;
      queries.files = PACKAGE_FILES_QUERY;
      queries.metaContent = PACKAGES_META_QUERY;
      queries.remove = DELETE_PACKAGE_MUTATION;
      queries.status = UPDATE_PACKAGE_STATUS_MUTATION;
      queries.unpublish = UNPUBLISH_PACKAGE_MUTATION;

      return queries;

    case 'playbooks':
      queries.content = TEAM_PLAYBOOKS_QUERY;
      queries.count = TEAM_PLAYBOOKS_COUNT_QUERY;
      // The following queries are placeholders and for the wrong content type
      // As such, these operations will not work properly
      queries.files = PACKAGE_FILES_QUERY;
      queries.metaContent = PACKAGES_META_QUERY;
      queries.remove = DELETE_PACKAGE_MUTATION;
      queries.status = UPDATE_PACKAGE_STATUS_MUTATION;
      queries.unpublish = UNPUBLISH_PACKAGE_MUTATION;

      return queries;
    default:
      return queries;
  }
};
