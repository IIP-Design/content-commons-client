export const isRestrictedPage = path => path.indexOf( '/admin/' ) !== -1;

/**
   *  Checks for valid permissions
   * @param {array} permissions user permissions
   * @param {array} allowed allowed roles to access restricted pages
   */
export const hasPermissionsToAccessPage = ( permissions, allowed ) => {
  if ( !Array.isArray( permissions ) || !Array.isArray( allowed ) ) {
    return false;
  }
  return permissions.some( permission => allowed.includes( permission ) );
};
