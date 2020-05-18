import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import DownloadItem from './DownloadItem';
import { maybeGetUrlToProdS3 } from 'lib/utils';

const DownloadCaption = ( { instructions, item } ) => {
  const [srts, setSrts] = useState( [] );

  useEffect( () => {
    const supportFiles = item?.supportFiles
      ? item.supportFiles.filter( file => file.supportFileType === 'srt' || file.supportFileType === 'vtt' )
      : [];

    if ( item?.units ) {
      item.units.forEach( unit => {
        if ( !unit.srt || !unit.srt.srcUrl ) return;
        if ( supportFiles.find( file => file.srcUrl === unit.srt.srcUrl ) ) return;
        supportFiles.push( {
          ...unit.srt,
          language: unit.language,
        } );
      } );
    }

    setSrts( supportFiles );
  }, [item] );

  return (
    <div>
      { instructions && <div className="form-group_instructions">{ instructions }</div> }
      { srts.length < 1 && 'There are no caption files available for download at this time' }
      { srts.length > 0 && srts.map( srt => {
        const lang = srt?.language?.display_name ? srt.language.display_name : ''; // eslint-disable-line camelcase
        const src = srt?.srcUrl ? srt.srcUrl : '';

        return (
          <DownloadItem
            download={ `${lang}_${src.includes( '.vtt' ) ? 'VTT' : 'SRT'}` }
            header={ `Download ${lang} ${src.includes( '.vtt' ) ? 'VTT' : 'SRT'}` }
            hover={ `Download ${lang} ${src.includes( '.vtt' ) ? 'VTT' : 'SRT'}` }
            key={ src }
            url={ maybeGetUrlToProdS3( src ) }
          />
        );
      } ) }
    </div>
  );
};

DownloadCaption.propTypes = {
  item: PropTypes.object,
  instructions: PropTypes.string,
};

export default DownloadCaption;
