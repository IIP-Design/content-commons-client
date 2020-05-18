import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import DownloadItem from './DownloadItem';
import { maybeGetUrlToProdS3 } from 'lib/utils';

const DownloadThumbnail = ( { instructions, units } ) => {
  const renderFormItem = ( unit, i ) => (
    <DownloadItem
      download={ `${unit.language.display_name}_thumbnail` }
      header={ `Download ${unit.language.display_name} Thumbnail` }
      hover={ `Download ${unit.language.display_name} Thumbnail` }
      key={ i }
      url={ maybeGetUrlToProdS3( unit.thumbnail ) }
    />
  );

  const renderFormItems = () => {
    const thumbnail = units
      .filter( unit => unit.thumbnail )
      .map( ( unit, i ) => renderFormItem( unit, i ) );

    return thumbnail.length ? thumbnail : 'There are no thumbnails available for download at this time';
  };

  return (
    <Fragment>
      <p className="form-group_instructions">{ instructions }</p>
      { units && renderFormItems( units ) }
    </Fragment>
  );
};

DownloadThumbnail.propTypes = {
  units: PropTypes.array,
  instructions: PropTypes.string,
};

export default DownloadThumbnail;
