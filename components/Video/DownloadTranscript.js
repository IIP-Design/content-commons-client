import React from 'react';
import PropTypes from 'prop-types';

import DownloadItem from './DownloadItem';
import { maybeGetUrlToProdS3 } from 'lib/utils';

const DownloadTranscript = ( { instructions, item } ) => {
  const renderFormItem = file => (
    <DownloadItem
      download={ `${file.language.display_name}_Transcript` }
      header={ `Download ${file.language.display_name} Transcript` }
      hover={ `Download ${file.language.display_name} Transcript` }
      key={ file.srcUrl }
      url={ maybeGetUrlToProdS3( file.srcUrl ) }
    />
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
