import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { maybeGetUrlToProdS3 } from 'lib/utils';

import DownloadItemContent from 'components/download/DownloadItem/DownloadItemContent';

const DownloadTranscript = ( { item } ) => {
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
      { transcripts.length < 1
        && <p className="download-item__noContent">There are no transcripts available for download at this time</p> }
      { transcripts.length > 0 && transcripts.map( trans => {
        const lang = trans?.language?.display_name ? trans.language.display_name : ''; // eslint-disable-line camelcase
        const src = trans?.srcUrl ? trans.srcUrl : '';

        return (
          <DownloadItemContent
            key={ src }
            srcUrl={ maybeGetUrlToProdS3( src ) }
            hoverText={ `Download ${lang} Transcript` }
          >
            <div className="item-content">
              <p className="item-content__title">
                <strong>
                  { `Download ${lang} Transcript` }
                </strong>
              </p>
            </div>
          </DownloadItemContent>
        );
      } ) }
    </div>
  );
};

DownloadTranscript.propTypes = {
  item: PropTypes.object,
};

export default DownloadTranscript;
