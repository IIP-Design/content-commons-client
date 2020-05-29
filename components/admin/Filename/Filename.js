import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { truncateAndReplaceStr } from 'lib/utils';
import styles from './Filename.module.scss';

/**
 * Displays either the full file name or a truncated name
 * (if the filename < filenameLength ) with the full file name in a tooltip
 */
const Filename = ( { children: filename, filenameLength, numCharsBeforeBreak, numCharsAfterBreak } ) => {
  const truncatedFilename
    = filename && filename.length > filenameLength
      ? truncateAndReplaceStr( filename, numCharsBeforeBreak, numCharsAfterBreak )
      : filename;

  return (
    <div className={ styles.filename }>
      { filename !== truncatedFilename
        ? (
          <Fragment>
            <span
              tooltip={ filename }
              aria-hidden="true"
              tabIndex={ 0 }
            >
              { truncatedFilename }
            </span>
            <VisuallyHidden el="span">{ filename }</VisuallyHidden>
          </Fragment>
        )
        : <span>{ filename }</span> }
    </div>
  );
};

Filename.defaultProps = {
  filenameLength: 25,
  numCharsBeforeBreak: 20,
  numCharsAfterBreak: 8,
};

Filename.propTypes = {
  /**
   * Filename to display; expecting a string
   */
  children: PropTypes.string.isRequired,
  /**
   * Length of filename before truncating is used
   */
  filenameLength: PropTypes.number,
  /**
   * Number of characters to display from start of string
   */
  numCharsBeforeBreak: PropTypes.number,
  /**
   * Number of characters to display from end of string
   */
  numCharsAfterBreak: PropTypes.number,
};

export default Filename;
