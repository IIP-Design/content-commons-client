import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import DownloadItem from './DownloadItem';
import { maybeGetUrlToProdS3 } from 'lib/utils';

const DownloadOtherFiles = ( { instructions, units } ) => {
  const unitsWithOtherFiles = units.filter( ( unit, i ) => unit.other[i] && unit.other[i].srcUrl );

  return (
    <Fragment>
      <p className="form-group_instructions">{ instructions }</p>
      { ( !unitsWithOtherFiles || unitsWithOtherFiles.length < 1 ) && 'There are no other files available for download at this time' }
      { unitsWithOtherFiles && unitsWithOtherFiles.length > 0 && unitsWithOtherFiles.map( ( unit, i ) => {
        const { fileName, fileType, srcUrl } = unit.other[i];
        const { language } = unit;

        return (
          <DownloadItem
            download={ fileName }
            header={ `Download ${language.display_name} ${fileType} file` }
            hover={ `Download ${language.display_name} ${fileType} file` }
            key={ srcUrl }
            url={ maybeGetUrlToProdS3( srcUrl ) }
          />
        );
      } ) }
    </Fragment>
  );
};

DownloadOtherFiles.propTypes = {
  units: PropTypes.array,
  instructions: PropTypes.string,
};

export default DownloadOtherFiles;
