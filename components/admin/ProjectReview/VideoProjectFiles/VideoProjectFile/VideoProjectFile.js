import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Embed, Grid } from 'semantic-ui-react';
import moment from 'moment'; // already being used so import here

import {
  formatBytes,
  getStreamData,
  getYouTubeId,
  getVimeoId,
  secondsToHMS,
} from 'lib/utils';

const VideoProjectFile = ( { file, thumbnail } ) => {
  const [thumbnailProps, setThumbnailProps] = useState( { signedUrl: '', alt: '' } );

  useEffect( () => {
    if ( thumbnail && thumbnail.image ) {
      const { signedUrl } = thumbnail.image;
      const alt = file && file.language ? `a thumbnail image for this file in ${file.language.displayName}` : '';

      setThumbnailProps( { signedUrl, alt } );
    }
  }, [file, thumbnail] );

  if ( !file || Object.keys( file ).length === 0 ) return null;

  const {
    createdAt,
    dimensions: { height, width },
    duration,
    filename,
    filesize,
    quality,
    stream,
    use: { name: videoType },
    videoBurnedInStatus,
  } = file;

  const youTubeUrl = getStreamData( stream, 'youtube', 'url' );
  const vimeoUrl = getStreamData( stream, 'vimeo', 'url' );

  return (
    <Grid.Row className="project_unit_files">
      <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } className="file_embed_thumbnail">
        { youTubeUrl && (
          <Embed
            id={ getYouTubeId( youTubeUrl ) }
            placeholder={ thumbnailProps.signedUrl }
            source="youtube"
          />
        ) }
        { !youTubeUrl && vimeoUrl && (
          <Embed
            id={ getVimeoId( vimeoUrl ) }
            placeholder={ thumbnailProps.signedUrl }
            source="vimeo"
          />
        ) }
        { !youTubeUrl && !vimeoUrl && thumbnailProps.signedUrl && (
          <figure className="thumbnail overlay">
            <img
              className="thumbnail-image"
              src={ thumbnailProps.signedUrl }
              alt={ thumbnailProps.alt }
            />
          </figure>
        ) }
      </Grid.Column>

      <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } className="file_meta">
        <p>
          <b className="label">File Name:</b>
          { ` ${filename}` }
        </p>
        <p>
          <b className="label">Filesize:</b>
          { ` ${formatBytes( filesize )}` }
        </p>
        <p>
          <b className="label">Dimensions:</b>
          { ` ${width} x ${height}` }
        </p>
        <p>
          <b className="label">Uploaded:</b>
          { ' ' }
          <time dateTime={ createdAt }>{ `${moment( createdAt ).format( 'LL' )}` }</time>
        </p>
        <p>
          <b className="label">Duration:</b>
          { ` ${secondsToHMS( duration )}` }
        </p>
        <p>
          <b className="label">On-Screen Text:</b>
          { ` ${videoBurnedInStatus === 'SUBTITLED' ? 'Yes' : 'No'}` }
        </p>
        <p>
          <b className="label">Video Type:</b>
          { ` ${videoType}` }
        </p>
        <p>
          <b className="label">Quality:</b>
          { ` ${quality}` }
        </p>
        <p>
          <b className="label">
            { ` ${youTubeUrl ? 'YouTube' : 'Vimeo'} URL:` }
          </b>
          { ` ${youTubeUrl || vimeoUrl}` }
        </p>
      </Grid.Column>
    </Grid.Row>
  );
};

VideoProjectFile.propTypes = {
  file: PropTypes.object,
  thumbnail: PropTypes.oneOfType( [
    PropTypes.object,
    PropTypes.bool,
  ] ),
};

VideoProjectFile.defaultProps = {
  file: {},
  thumbnail: {},
};

export default VideoProjectFile;
