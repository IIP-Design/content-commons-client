import React from 'react';
import PropTypes from 'prop-types';
import { Item } from 'semantic-ui-react';

import { maybeGetUrlToProdS3 } from 'lib/utils';

import downloadIcon from 'static/icons/icon_download.svg';

const DownloadTranscript = ( { instructions, item } ) => {
  const renderFormItem = ( file, i ) => (
    <Item.Group key={ `fs_${i}` } className="download-item">
      <Item as="a" href={ maybeGetUrlToProdS3( file.srcUrl ) } download={ `${file.language.display_name}_Transcript` }>
        <Item.Image size="mini" src={ downloadIcon } className="download-icon" />
        <Item.Content>
          <Item.Header className="download-header">{ `Download ${file.language.display_name} Transcript` }</Item.Header>
          <span className="item_hover">{ `Download ${file.language.display_name} Transcript` }</span>
        </Item.Content>
      </Item>
    </Item.Group>
  );

  const renderFormItems = formItem => {
    const files = formItem.supportFiles.filter( f => f.supportFileType === 'transcript' );

    formItem.units.forEach( unit => {
      if ( !unit.transcript || !unit.transcript.srcUrl ) return;
      if ( files.find( f => f.srcUrl === unit.transcript.srcUrl ) ) return;
      files.push( {
        ...unit.transcript,
        language: unit.language,
      } );
    } );
    const transcripts = files.map( ( file, i ) => renderFormItem( file, i ) );

    return transcripts.length ? transcripts : 'There are no transcripts available for download at this time';
  };

  return (
    <div>
      <div className="form-group_instructions">{ instructions }</div>
      { renderFormItems( item ) }
    </div>
  );
};

DownloadTranscript.propTypes = {
  item: PropTypes.object,
  instructions: PropTypes.string,
};

export default DownloadTranscript;
