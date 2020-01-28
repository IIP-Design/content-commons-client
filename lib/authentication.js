
const allowedRolesForRestrictedPages = ['EDITOR', 'TEAM_ADMIN', 'ADMIN'];

export const isRestrictedPage = path => path.indexOf( '/admin/' ) !== -1;

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
