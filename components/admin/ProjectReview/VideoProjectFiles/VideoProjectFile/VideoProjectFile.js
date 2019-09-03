import React from 'react';
import PropTypes from 'prop-types';
import { Embed, Grid } from 'semantic-ui-react';
import {
  formatBytes,
  formatDate,
  getS3Url,
  getStreamData,
  getYouTubeId,
  getVimeoId,
  secondsToHMS
} from 'lib/utils';

const VideoProjectFile = props => {
  const { file, thumbnail } = props;

  if ( !file || Object.keys( file ).length === 0 ) return null;

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

  let thumbnailUrl = '';
  let thumbnailAlt = `a thumbnail image for this file in ${language.displayName}`;
  if ( thumbnail && thumbnail.image ) {
    thumbnailUrl = getS3Url( thumbnail.image.url );
    thumbnailAlt = thumbnail.image.alt;
  }

  return (
    <Grid.Row className="project_unit_files">
      <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } className="file_embed_thumbnail">
        { youTubeUrl && (
          <Embed
            id={ getYouTubeId( youTubeUrl ) }
            placeholder={ thumbnailUrl }
            source="youtube"
          />
        ) }
        { ( !youTubeUrl && vimeoUrl ) && (
          <Embed
            id={ getVimeoId( vimeoUrl ) }
            placeholder={ thumbnailUrl }
            source="vimeo"
          />
        ) }
        { ( !youTubeUrl && !vimeoUrl && thumbnailUrl ) && (
          <figure className="thumbnail overlay">
            <img
              className="thumbnail-image"
              src={ thumbnailUrl }
              alt={ thumbnailAlt }
            />
          </figure>
        ) }
      </Grid.Column>

      <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } className="file_meta">
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
  thumbnail: PropTypes.oneOfType( [
    PropTypes.object,
    PropTypes.bool
  ] )
};

VideoProjectFile.defaultProps = {
  file: {},
  thumbnail: {}
};

export default VideoProjectFile;
