import React, { Fragment } from 'react';
import { Item } from 'semantic-ui-react';
import { array, string } from 'prop-types';
import downloadIcon from 'static/icons/icon_download.svg';
import { maybeGetUrlToProdS3 } from '../../lib/utils';


const DownloadThumbnail = ( { instructions, units } ) => {
  const renderFormItem = ( unit, i ) => (
    <Item.Group key={ `fs_${i}` } className="download-item">
      <Item as="a" href={ maybeGetUrlToProdS3( unit.thumbnail ) } download={ `${unit.language.display_name}_thumbnail` }>
        <Item.Image size="mini" src={ downloadIcon } className="download-icon" />
        <Item.Content>
          <Item.Header className="download-header">
            { `Download ${unit.language.display_name} Thumbnail` }
          </Item.Header>
          <span className="item_hover">
            { `Download ${unit.language.display_name} Thumbnail` }
          </span>
        </Item.Content>
      </Item>
    </Item.Group>
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
  units: array,
  instructions: string
};

export default DownloadThumbnail;
