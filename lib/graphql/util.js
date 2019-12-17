/**
 * Returns content type string matching prop from graphql query data object
 * @param {Object} team team authenticated user associated with, contains viewable content types
 */
export const getProjectsType = team => {
  let projectsType;
  const { contentTypes } = team;
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

  const query = queryObject[ getProjectsType( team ) ];
  const countQuery = queryObject[ getProjectsTypeCount( team ) ];
  
  graphqlService.projectsQuery = query;

  if ( countQuery ) {
    graphqlService.projectsCount = countQuery;
    return graphqlService;
  }

  return graphqlService.projectsQuery;
};
