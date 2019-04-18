import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash.capitalize';
import { formatBytes } from 'lib/utils';

const SupportFiles = ( { supportFiles } ) => (
  <div>
    <p>Files:</p>
    {
      supportFiles.map( file => {
        const {
          id,
          url,
          filetype,
          filesize,
          language: { displayName },
          use
        } = file;
        return (
          <p key={ id }>
            { use.name } | <a href={ url }>{ filetype }</a> | <a href={ url }>{ capitalize( displayName ) } { formatBytes( filesize ) }</a>
          </p>
        );
      } )
    }
  </div>
);

SupportFiles.propTypes = {
  supportFiles: PropTypes.array
};

export default SupportFiles;
