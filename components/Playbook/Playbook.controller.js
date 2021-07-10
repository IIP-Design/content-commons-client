/* ---- Policy priority badge helpers. ---- */

/**
 * Check a color value against a list that require dark text for proper contrast.
 * @param {string} color A hex value for the background color.
 * @returns {bool} Whether or not the provided background color requires dark foreground text.
 */
const needsDarkText = color => {
  // List of valid background colors that require a dark foreground color.
  const lightBackgrounds = [
    '#94bfa2',
    '#fff1d2',
    '#a3e4e8',
    '#f9c642',
    '#fff1d2',
  ];

  return lightBackgrounds.includes( color );
};

/**
 * Returns the color scheme for a policy priority badge depending on it's theme value.
 * @param {string} theme The theme value for a given policy priority, expected to be a hex string.
 * @returns {Object} The style object with relevant backgroundColor and color properties.
 */
export const getBadgeStyle = theme => {
  const blue = '#112e51';
  const lightBlue = '#0071bc';

  return ( {
    backgroundColor: theme || lightBlue,
    color: needsDarkText( theme ) ? blue : 'white',
  } );
};
