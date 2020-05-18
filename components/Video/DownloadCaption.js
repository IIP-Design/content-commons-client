import React from 'react';
import PropTypes from 'prop-types';

import DownloadItem from './DownloadItem';
import { maybeGetUrlToProdS3 } from 'lib/utils';

const DownloadCaption = ( { instructions, item } ) => {
  const renderFormItem = ( file, i ) => {
    const downloadFileText = `Download ${file.language.display_name} ${file.srcUrl.includes( '.vtt' ) ? 'VTT' : 'SRT'}`;

    return (
      <DownloadItem
        download={ `${file.language.display_name}_${file.srcUrl.includes( '.vtt' ) ? 'VTT' : 'SRT'}` }
        header={ downloadFileText }
        hover={ downloadFileText }
        key={ i }
        url={ maybeGetUrlToProdS3( file.srcUrl ) }
      />
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
