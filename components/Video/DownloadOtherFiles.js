import React, { Fragment } from 'react';
import { Item } from 'semantic-ui-react';
import { array, string } from 'prop-types';
import downloadIcon from 'static/icons/icon_download.svg';
import { maybeGetUrlToProdS3 } from '../../lib/utils';


const DownloadOtherFiles = ( { instructions, units } ) => {
  const renderFormItem = ( unit, i ) => {
    const { fileName, fileType, srcUrl } = unit.other[i];
    const { language } = unit;
    return (
      <Item.Group key={ `fs_${i}` } className="download-item">
        <Item as="a" href={ maybeGetUrlToProdS3( srcUrl ) } download={ fileName }>
          <Item.Image size="mini" src={ downloadIcon } className="download-icon" />
          <Item.Content>
            <Item.Header className="download-header">
              { `Download ${language.display_name} ${fileType} file` }
            </Item.Header>
            <span className="item_hover">
              { `Download ${language.display_name} ${fileType} file` }
            </span>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  };

  const renderFormItems = () => {
    const otherFiles = units
      .filter( ( unit, i ) => (
        unit.other[i] && unit.other[i].srcUrl
      ) )
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
  units: array,
  instructions: string
};

export default DownloadOtherFiles;
