
const allowedRolesForRestrictedPages = ['EDITOR', 'TEAM_ADMIN', 'ADMIN'];

export const isRestrictedPage = path => {
  const restrictedPaths = ['/admin', '/document', '/package'];
  const restricted = restrictedPaths.some( _path => path.includes( _path ) );

  return restricted;
};

/**
   *  Checks for valid permissions
   * @param {array} permissions user permissions
   * @param {array} allowed allowed roles to access restricted pages
   */
export const hasPermissionsToAccessPage = permissions => {
  if ( !Array.isArray( permissions ) ) {
    return false;
  }
  return permissions.some( permission => allowedRolesForRestrictedPages.includes( permission ) );
};
