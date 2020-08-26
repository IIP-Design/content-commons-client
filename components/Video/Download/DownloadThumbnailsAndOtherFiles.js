import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getCount, getFileDownloadUrl, getFileNameFromUrl } from 'lib/utils';

import DownloadItemContent from 'components/download/DownloadItem/DownloadItemContent';

const DownloadThumbnailsAndOtherFiles = ( { item } ) => {
  const [otherFiles, setOtherFiles] = useState( [] );

  useEffect( () => {
    let thumbnails = [];

    if ( item?.units ) {
      thumbnails = item.units.reduce( ( acc, unit ) => {
        if ( unit?.thumbnail && unit?.language ) {
          acc.push( {
            thumbnail: unit.thumbnail,
            language: unit.language,
          } );
        }

        return acc;
      }, [] );
    }

    const supportFiles = item?.supportFiles
      ? item.supportFiles.filter( file => file.supportFileType !== 'srt' && file.supportFileType !== 'vtt' )
      : [];

    const allFiles = [...thumbnails, ...supportFiles];

    setOtherFiles( allFiles );
  }, [item] );

  const renderFormItem = file => {
    const lang = file?.language?.display_name || ''; // eslint-disable-line camelcase
    const src = file?.thumbnail || file?.srcUrl || '';
    const filename = getFileNameFromUrl( src ) || `${lang}-other-file`;
    const fileType = file.supportFileType ? `${file.supportFileType} file` : 'Thumbnail';

    return (
      <DownloadItemContent
        key={ `${lang}-${src}` }
        srcUrl={ getFileDownloadUrl( src, filename ) }
        hoverText={ `Download ${lang} ${fileType}` }
      >
        <div className="item-content">
          <p className="item-content__title">
            <strong>
              { `Download ${lang} ${fileType}` }
            </strong>
          </p>
        </div>
      </DownloadItemContent>
    );
  };

  return getCount( otherFiles )
    ? otherFiles.map( renderFormItem )
    : <p className="download-item__noContent">There are no other files available for download at this time.</p>;
};

DownloadThumbnailsAndOtherFiles.propTypes = {
  item: PropTypes.object,
};

export default DownloadThumbnailsAndOtherFiles;
