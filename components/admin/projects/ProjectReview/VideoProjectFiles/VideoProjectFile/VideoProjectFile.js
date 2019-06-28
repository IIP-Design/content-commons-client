import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import {
  formatBytes,
  formatDate,
  getS3Url,
  getStreamData,
  secondsToHMS
} from 'lib/utils';

const VideoProjectFile = props => {
  const { file, thumbnail } = props;

  if ( Object.keys( file ).length === 0 ) return;

  const {
    createdAt,
    dimensions: { height, width },
    duration,
    filename,
    filesize,
    language,
    quality,
    stream,
    use: { name: videoType },
    videoBurnedInStatus
  } = file;

  const youTubeUrl = getStreamData( stream, 'youtube', 'url' );
  const vimeoUrl = getStreamData( stream, 'vimeo', 'url' );

  return (
    <Grid.Row className="project_unit_files">
      <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } className="file_meta">
        { Object.keys( thumbnail ).length > 0
          ? (
            <img
              src={ getS3Url( thumbnail.image.url ) }
              alt={ thumbnail.image.alt }
            />
          )
          : null }
      </Grid.Column>

      <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } className="file_info">
        <p><b className="label">File Name:</b> { filename }</p>
        <p><b className="label">Filesize:</b> { formatBytes( filesize ) }</p>
        <p><b className="label">Dimensions:</b> { `${width} x ${height}` }</p>
        <p><b className="label">Uploaded:</b> <time dateTime={ createdAt }>{ `${formatDate( createdAt, language.locale )}` }</time>
        </p>
        <p><b className="label">Duration:</b> { secondsToHMS( duration ) }</p>
        <p><b className="label">Subtitles & Captions:</b> { `${videoBurnedInStatus}${videoBurnedInStatus === 'CLEAN' ? ' - No Captions' : ''}` }</p>
        <p><b className="label">Video Type:</b> { videoType }</p>
        <p><b className="label">Quality:</b> { quality }</p>
        <p><b className="label">{ youTubeUrl ? 'YouTube' : 'Vimeo' } URL:</b> { youTubeUrl || vimeoUrl }</p>
      </Grid.Column>
    </Grid.Row>
  );
};

VideoProjectFile.propTypes = {
  file: PropTypes.object,
  thumbnail: PropTypes.object
};

VideoProjectFile.defaultProps = {
  file: {},
  thumbnail: {}
};

export default VideoProjectFile;
