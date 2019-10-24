import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { Embed, Grid } from 'semantic-ui-react';
import moment from 'moment'; // already benig used so import here
import {
  formatBytes,
  getStreamData,
  getYouTubeId,
  getVimeoId,
  secondsToHMS
} from 'lib/utils';
import withSignedUrl from 'hocs/withSignedUrl/withSignedUrl';


const VideoProjectFile = props => {
  const { file, thumbnail, getSignedUrlGet } = props;

  const [thumbnailProps, setThumbnailProps] = useState( { url: '', alt: '' } );

  const getSignedThumbnail = async tn => {
    try {
      const signedUrl = await getSignedUrlGet( tn.image.url );
      const alt = ( file && file.language ) ? `a thumbnail image for this file in ${file.language.displayName}` : '';
      setThumbnailProps( { url: signedUrl, alt } );
    } catch ( err ) {
      console.log( 'Unable to fetch signed url for thumbnail' );
    }
  };

  useEffect( () => {
    if ( thumbnail && thumbnail.image ) {
      getSignedThumbnail( thumbnail );
    }
  }, [] );

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
    videoBurnedInStatus
  } = file;


  const youTubeUrl = getStreamData( stream, 'youtube', 'url' );
  const vimeoUrl = getStreamData( stream, 'vimeo', 'url' );

  return (
    <Grid.Row className="project_unit_files">
      <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } className="file_embed_thumbnail">
        { youTubeUrl && (
          <Embed
            id={ getYouTubeId( youTubeUrl ) }
            placeholder={ thumbnailProps.url }
            source="youtube"
          />
        ) }
        { ( !youTubeUrl && vimeoUrl ) && (
          <Embed
            id={ getVimeoId( vimeoUrl ) }
            placeholder={ thumbnailProps.url }
            source="vimeo"
          />
        ) }
        { ( !youTubeUrl && !vimeoUrl && thumbnailProps.url ) && (
          <figure className="thumbnail overlay">
            <img
              className="thumbnail-image"
              src={ thumbnailProps.url }
              alt={ thumbnailProps.alt }
            />
          </figure>
        ) }
      </Grid.Column>

      <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } className="file_meta">
        <p><b className="label">File Name:</b> { filename }</p>
        <p><b className="label">Filesize:</b> { formatBytes( filesize ) }</p>
        <p><b className="label">Dimensions:</b> { `${width} x ${height}` }</p>
        <p><b className="label">Uploaded:</b> <time dateTime={ createdAt }>{ `${moment( createdAt ).format( 'LL' )}` }</time>
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
    PropTypes.bool,
  ] ),
  getSignedUrlGet: PropTypes.func
};

VideoProjectFile.defaultProps = {
  file: {},
  thumbnail: {}
};

export default compose( withSignedUrl )( VideoProjectFile );
