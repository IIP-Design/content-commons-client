import intersection from 'lodash/intersection';

const allowedRolesForRestrictedPages = [
  'EDITOR', 'TEAM_ADMIN', 'ADMIN',
];

export const isRestrictedPage = ( { query, pathname } ) => {
  try {
    if ( pathname.startsWith( '/documentation' ) ) return false;

    const restrictedPaths = [
      'admin', 'document', 'package',
    ];

    // Check to see if path is restricted
    const restricted = restrictedPaths.some( path => pathname.includes( `/${path}` ) );

    const { postTypes } = query;

    // Check to see if there are any restricted query postTypes, i.e. document or package
    let _postTypes = [];

    if ( query.postTypes ) {
      _postTypes = typeof postTypes === 'string' ? [postTypes] : postTypes;
    }

    return restricted || !!intersection( restrictedPaths, _postTypes )?.length;
  } catch {
    return true;
  }
};

/**
 * Checks for valid permissions
 * @param {array} permissions user permissions
 * @param {array} allowed allowed roles to access restricted pages
 */
export const hasPermissionsToAccessPage = permissions => {
  if ( !Array.isArray( permissions ) ) {
    return false;
  }

  return permissions.some( permission => allowedRolesForRestrictedPages.includes( permission ) );
};
