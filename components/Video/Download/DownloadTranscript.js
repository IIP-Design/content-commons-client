import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import DownloadItem from './DownloadItem';
import { maybeGetUrlToProdS3 } from 'lib/utils';

const DownloadTranscript = ( { instructions, item } ) => {
  const [transcripts, setTranscripts] = useState( [] );

  useEffect( () => {
    const supportFiles = item?.supportFiles
      ? item.supportFiles.filter( f => f.supportFileType === 'transcript' )
      : [];

    if ( item?.units ) {
      item.units.forEach( unit => {
        if ( !unit.transcript || !unit.transcript.srcUrl ) return;
        if ( supportFiles.find( file => file.srcUrl === unit.transcript.srcUrl ) ) return;
        supportFiles.push( {
          ...unit.transcript,
          language: unit.language,
        } );
      } );
    }

    setTranscripts( supportFiles );
  }, [item] );

  return (
    <div>
      { instructions && <div className="form-group_instructions">{ instructions }</div> }
      { transcripts.length < 1 && 'There are no transcripts available for download at this time' }
      { transcripts.length > 0 && transcripts.map( trans => {
        const lang = trans?.language?.display_name ? trans.language.display_name : ''; // eslint-disable-line camelcase
        const src = trans?.srcUrl ? trans.srcUrl : '';

        return (
          <DownloadItem
            download={ `${lang}_Transcript` }
            header={ `Download ${lang} Transcript` }
            hover={ `Download ${lang} Transcript` }
            key={ src }
            url={ maybeGetUrlToProdS3( src ) }
          />
        );
      } ) }
    </div>
  );
};

DownloadTranscript.propTypes = {
  item: PropTypes.object,
  instructions: PropTypes.string,
};

export default DownloadTranscript;
