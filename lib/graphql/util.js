import { getLangTaxonomies } from 'lib/utils';

/**
 * Returns content type string matching prop from graphql query data object
 * @param {string[]} types array of content types in a given project
 * @returns {string|null}
 */
export const getProjectsType = types => {
  let projectsType;

  if ( types.includes( 'GRAPHIC' ) ) projectsType = 'graphicProjects';
  if ( types.includes( 'VIDEO' ) ) projectsType = 'videoProjects';
  if ( types.includes( 'PACKAGE' ) ) projectsType = 'packages';

  return projectsType || null;
};

/**
 * Returns GraphQL query or queries object (includes projects count query), dynamically set by content type
 *
 * @param {Object} team team authenticated user associated with, contains viewable content types
 * @param {Object} queryObject object w/ projects query & conditional projects count query
 * @return {Object} with queries as each of it's properties
 */
export const setProjectsQueries = ( team, queryObject ) => {
  const graphqlService = {};

  const { contentTypes } = team;

  const query = queryObject[getProjectsType( contentTypes )];
  const countQuery = queryObject[`${getProjectsType( contentTypes )}Count`];

  graphqlService.projectsQuery = query;

  if ( countQuery ) {
    graphqlService.projectsCount = countQuery;

    return graphqlService;
  }

  return graphqlService.projectsQuery;
};

/**
 * Returns project title property based on content type.
 *
 * @param {Object} project GraphQL data object
 * @returns {string}
 */
export const setProjectTitle = project => {
  let title;

  switch ( project.__typename ) {
    case 'VideoProject':
      title = project.projectTitle;
      break;
    case 'DocumentFile':
    case 'GraphicProject':
    case 'Package':
      title = project.title;
      break;
    default:
      title = '';
  }

  return title;
};

/**
 * Shapes the data returned from GraphQL query
 *
 * @param {Object} project individual project data returned from the GraphQL query
 */
const normalizeTypesData = project => {
  const thumbnail = () => {
    if ( !project.thumbnails ) return {};

    return {
      signedUrl: project.thumbnails && project.thumbnails.length ? project.thumbnails[0].signedUrl : '',
      alt: project.thumbnails && project.thumbnails.length ? project.thumbnails[0].alt : ''
    };
  };

  const normalizedTypeData = {
    __typename: project.__typename,
    id: project.id,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    projectTitle: setProjectTitle( project ),
    author: `${project.author ? project.author.firstName : ''} ${project.author ? project.author.lastName : ''}`,
    team: project.team ? project.team.name : '',
    status: project.status || '',
    visibility: project.visibility,
    thumbnail: thumbnail(),
    categories: getLangTaxonomies( project.categories )
  };

  return normalizedTypeData;
};

/**
 * Initiates the transformation of GraphQL data into a more useful format.
 *
 * @param {Object} data Project data returned from GraphQL query
 * @param {string} type Project type
 */
export const normalizeDashboardData = ( data, type ) => {
  const normalizedProjects = [];

  if ( data && type ) {
    const projectType = getProjectsType( type.toUpperCase() );

    if ( data?.[projectType] ) {
      data[projectType].forEach( item => normalizedProjects.push( normalizeTypesData( item ) ) );
    }
  }

  return normalizedProjects;
};
