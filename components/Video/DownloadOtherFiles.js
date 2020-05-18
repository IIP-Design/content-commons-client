import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import DownloadItem from './DownloadItem';
import { maybeGetUrlToProdS3 } from 'lib/utils';

const DownloadOtherFiles = ( { instructions, units } ) => {
  const renderFormItem = ( unit, i ) => {
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
  };

  const renderFormItems = () => {
    const otherFiles = units
      .filter( ( unit, i ) => unit.other[i] && unit.other[i].srcUrl )
      .map( ( unit, i ) => renderFormItem( unit, i ) );

    return otherFiles.length ? otherFiles : 'There are no other files available for download at this time';
  };

  return (
    <Fragment>
      <p className="form-group_instructions">{ instructions }</p>
      { units && renderFormItems( units ) }
    </Fragment>
  );
};

DownloadOtherFiles.propTypes = {
  units: PropTypes.array,
  instructions: PropTypes.string,
};

export default DownloadOtherFiles;
