import logoDOS from 'static/images/dos_seal.svg';
import logoShareAmerica from 'static/images/logo_shareamerica.svg';

const dosOwners = [
  'GPA Video',
  'GPA Media Strategy',
  'GPA Editorial & Design',
  'U.S. Missions',
];

/**
 * Return DOS seal logo source string or null
 * @param string team (via GraphQL) or owner (via elastic) name
 * @returns {string}
 */
export const displayDOSLogo = teamOrOwnerName => {
  if ( dosOwners.includes( teamOrOwnerName ) ) {
    return logoDOS;
  }

  if ( teamOrOwnerName === 'ShareAmerica' ) {
    return logoShareAmerica;
  }

  return null;
};
