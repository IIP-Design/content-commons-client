import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import DownloadItem from './DownloadItem';
import { getFileDownloadUrl, getFileNameFromUrl } from 'lib/utils';

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
        const lang = srt?.language?.display_name || ''; // eslint-disable-line camelcase
        const src = srt?.srcUrl || '';
        const isVtt = srt?.supportFileType === 'vtt';
        const filename = getFileNameFromUrl( src ) || `${lang}-caption-file.${isVtt ? 'vtt' : 'srt'}`;

        return (
          <DownloadItem
            download={ `${lang}_${isVtt ? 'VTT' : 'SRT'}` }
            header={ `Download ${lang} ${isVtt ? 'VTT' : 'SRT'}` }
            hover={ `Download ${lang} ${isVtt ? 'VTT' : 'SRT'}` }
            key={ src }
            url={ getFileDownloadUrl( src, filename ) }
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
