import React from 'react';
import PropTypes from 'prop-types';
import { Item } from 'semantic-ui-react';

import { maybeGetUrlToProdS3 } from 'lib/utils';
import downloadIcon from 'static/icons/icon_download.svg';

const DownloadCaption = ( { instructions, item } ) => {
  const renderFormItem = ( file, i ) => {
    const downloadFileText = `Download ${file.language.display_name} ${file.srcUrl.includes( '.vtt' ) ? 'VTT' : 'SRT'}`;

    return (
      <Item.Group key={ `fs_${i}` } className="download-item">
        <Item
          as="a"
          href={ maybeGetUrlToProdS3( file.srcUrl ) }
          download={ `${file.language.display_name}_${file.srcUrl.includes( '.vtt' ) ? 'VTT' : 'SRT'}` }
        >
          <Item.Image size="mini" src={ downloadIcon } className="download-icon" />
          <Item.Content>
            <Item.Header className="download-header">{ downloadFileText }</Item.Header>
            <span className="item_hover">{ downloadFileText }</span>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  };

  const renderFormItems = formItem => {
    const files = formItem.supportFiles.filter( f => f.supportFileType === 'srt' || f.supportFileType === 'vtt' );

    formItem.units.forEach( unit => {
      if ( !unit.srt || !unit.srt.srcUrl ) return;
      if ( files.find( f => f.srcUrl === unit.srt.srcUrl ) ) return;
      files.push( {
        ...unit.srt,
        language: unit.language,
      } );
    } );

    const srts = files.map( ( file, i ) => renderFormItem( file, i ) );

    return srts.length ? srts : 'There are no caption files available for download at this time';
  };

  return (
    <div>
      <div className="form-group_instructions">{ instructions }</div>
      { item && renderFormItems( item ) }
    </div>
  );
};

DownloadCaption.propTypes = {
  item: PropTypes.object,
  instructions: PropTypes.string,
};

export default DownloadCaption;
