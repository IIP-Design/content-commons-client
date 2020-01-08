import logoDOS from 'static/images/dos_seal.svg';

const dosOwners = [
  'GPA Video',
  'GPA Media Strategy',
  'U.S. Missions',
];

export const displayDOSLogo = teamOrOwnerName => {
  if ( dosOwners.includes( teamOrOwnerName ) ) {
    return logoDOS;
  }
  return null;
};
