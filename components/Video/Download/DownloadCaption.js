import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getFileDownloadUrl, getFileNameFromUrl } from 'lib/utils';

import DownloadItemContent from 'components/download/DownloadItem/DownloadItemContent';

const DownloadCaption = ( { item } ) => {
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
      { srts.length < 1
        && <p className="download-item__noContent">There are no caption files available for download at this time</p>}

      { srts.length > 0 && srts.map( srt => {
        const lang = srt?.language?.display_name || ''; // eslint-disable-line camelcase
        const isVtt = srt?.supportFileType === 'vtt';
        const src = srt?.srcUrl || '';
        const filename = getFileNameFromUrl( src ) || `${lang}-caption-file.${isVtt ? 'vtt' : 'srt'}`;

        return (
          <DownloadItemContent
            key={ src }
            srcUrl={ getFileDownloadUrl( src, filename ) }
            hoverText={ `Download ${lang} ${isVtt ? 'VTT' : 'SRT'}` }
          >
            <div className="item-content">
              <p className="item-content__title">
                <strong>
                  { `Download ${lang} ${isVtt ? 'VTT' : 'SRT'}` }
                </strong>
              </p>
            </div>
          </DownloadItemContent>
        );
      } ) }
    </div>
  );
};

DownloadCaption.propTypes = {
  item: PropTypes.object,
};

export default DownloadCaption;
