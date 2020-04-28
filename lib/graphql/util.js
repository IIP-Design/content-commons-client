import { getLangTaxonomies } from 'lib/utils';

/**
 * Returns content type string matching prop from graphql query data object
 * @param {Object} team team authenticated user associated with, contains viewable content types
 */
export const getProjectsType = team => {
  let projectsType;
  const { contentTypes } = team;

  if ( contentTypes.includes( 'GRAPHIC' ) ) projectsType = 'graphicProjects';
  if ( contentTypes.includes( 'VIDEO' ) ) projectsType = 'videoProjects';
  if ( contentTypes.includes( 'PACKAGE' ) ) projectsType = 'packages';

  return projectsType || null;
};

/**
 * Returns string used for setting graphql project count query
 * @param {Object} team team authenticated user associated with, contains viewable content types
 */
const getProjectsTypeCount = team => {
  let projectsTypeCount;
  const { contentTypes } = team;

  if ( contentTypes.includes( 'GRAPHIC' ) ) projectsTypeCount = 'graphicProjectsCount';
  if ( contentTypes.includes( 'VIDEO' ) ) projectsTypeCount = 'videoProjectsCount';
  if ( contentTypes.includes( 'PACKAGE' ) ) projectsTypeCount = 'packagesCount';

  return projectsTypeCount || null;
};

/**
 * Returns graphql query or queries object (includes projects count query), dynamically set by content type
 * @param {Object} team team authenticated user associated with, contains viewable content types
 * @param {Object} queryObject object w/ projects query & conditional projects count query
 */
export const setProjectsQueries = ( team, queryObject ) => {
  const graphqlService = {};

  const query = queryObject[getProjectsType( team )];
  const countQuery = queryObject[getProjectsTypeCount( team )];

  graphqlService.projectsQuery = query;

  if ( countQuery ) {
    graphqlService.projectsCount = countQuery;

    return graphqlService;
  }

  return graphqlService.projectsQuery;
};

/**
 * Returns project title property based on content type
 * @param {Object} type GraphQL data object
 */
export const setProjectTitle = type => {
  let title;

  switch ( type.__typename ) {
  case 'VideoProject':
    title = type.projectTitle;
    break;
  case 'DocumentFile':
  case 'Package':
    title = type.title;
    break;
  default:
    title = '';
  }

  return title;
};

const normalizeTypesData = type => {
  const thumbnail = () => {
    if ( !type.thumbnails ) return {};

    return {
      signedUrl: type.thumbnails && type.thumbnails.length ? type.thumbnails[0].signedUrl : '',
      alt: type.thumbnails && type.thumbnails.length ? type.thumbnails[0].alt : ''
    };
  };

  const normalizedTypeData = Object.create( {}, {
    __typename: { value: type.__typename },
    id: { value: type.id },
    createdAt: { value: type.createdAt },
    updatedAt: { value: type.updatedAt },
    projectTitle: { value: setProjectTitle( type ) },
    author: { value: `${type.author ? type.author.firstName : ''} ${type.author ? type.author.lastName : ''}` },
    team: { value: type.team ? type.team.name : '' },
    status: { value: type.status || '' },
    visibility: { value: type.visibility },
    thumbnail: { value: thumbnail() },
    categories: { value: getLangTaxonomies( type.categories ) }
  } );

  return normalizedTypeData;
};

export const normalizeDashboardData = ( data, type ) => {
  const normalizedProjects = [];

  if ( data?.[type] ) {
    data[type].forEach( item => normalizedProjects.push( normalizeTypesData( item ) ) );
  }

  return normalizedProjects;
};
