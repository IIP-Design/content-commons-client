/**
 *
 * VideoProjectFiles
 *
 */
import React from 'react';
import { object, string } from 'prop-types';
import Router from 'next/router';
import { graphql } from 'react-apollo';
import {
  Button, Grid, Icon, Loader
} from 'semantic-ui-react';

import { VIDEO_PROJECT_PREVIEW_QUERY } from 'components/admin/projects/ProjectEdit/PreviewProjectContent/PreviewProjectContent';

import {
  formatBytes,
  formatDate,
  getPathToS3Bucket,
  getPluralStringOrNot,
  getStreamData,
  secondsToHMS
} from 'lib/utils';

import './VideoProjectFiles.scss';


const VideoProjectFiles = props => {
  const { error, loading, project } = props.data;

  if ( loading ) {
    return (
      <div style={ {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      } }
      >
        <Loader
          active
          inline="centered"
          style={ { marginBottom: '1em' } }
          content="Loading project file(s)..."
        />
      </div>
    );
  }

  if ( error ) {
    return (
      <div className="video-project-files error">
        <p>
          <Icon color="red" name="exclamation triangle" />
          <span>Loading error...</span>
        </p>
      </div>
    );
  }

  if ( !project || !Object.keys( project ).length ) return null;

  const { units } = project;

  if ( !units || ( units && units.length === 0 ) ) return null;

  const getTag = ( tag, unit ) => (
    tag.translations.find( t => (
      t.language.locale === unit.language.locale
    ) ).name
  );

  const getTags = ( tags, unit ) => (
    tags.reduce( ( acc, curr ) => (
      `${acc ? `${acc}, ` : ''}${getTag( curr, unit )}`
    ), '' )
  );

  const handleEdit = () => {
    const { id } = props;
    Router.push( {
      pathname: '/admin/project',
      query: {
        id,
        content: 'video',
        action: 'edit'
      }
    }, `/admin/project/video/${id}/edit` );
  };

  return (
    <section className="section section--project_files project_files layout">
      <h3 className="project_files_headline uppercase">
        { `${getPluralStringOrNot( units, 'Video' )} in Project` }
      </h3>
      { units.map( unit => {
        const { files, tags, thumbnails } = unit;
        if ( !files || ( files && !files.length ) ) return;

        const youTubeUrl = getStreamData( files[0].stream, 'youtube', 'url' );
        const vimeoUrl = getStreamData( files[0].stream, 'vimeo', 'url' );

        return (
          <div key={ unit.id } className="project_file">
            <Grid>
              <Grid.Row
                className={
                  `project_file_header ${files[0].language.textDirection}`
                }
              >
                <Grid.Column floated="left" mobile={ 8 }>
                  <h4 className="title">{ unit.title }</h4>
                </Grid.Column>
                <Grid.Column floated="right" mobile={ 8 } className="project_file_edit">
                  <Button
                    className="project_button project_button--edit"
                    content="Edit"
                    onClick={ handleEdit }
                  />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row className="project_file_meta language">
                <Grid.Column width={ 16 }>
                  <p><b className="label">Language:</b> { files[0].language.displayName }</p>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row className="project_file_meta description">
                <Grid.Column computer={ 8 }>
                  <p className="public_description">
                    <b className="label">Public Description:</b>
                    <span
                      className={
                        `content ${unit.language.textDirection}`
                      }
                      style={
                        unit.language.textDirection === 'RTL'
                          ? { display: 'block' }
                          : {}
                      }
                    >
                      { ' ' }
                      { unit.descPublic || project.descPublic }
                    </span>
                  </p>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row className="project_file_meta tags">
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 }>
                  <p><b className="label">Additional Keywords:</b>
                    { ` ${( tags && tags.length > 0 )
                      ? getTags( tags, unit )
                      : ''}` }
                  </p>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row className="project_file_meta file-count">
                <Grid.Column width={ 16 }>
                  <p><b className="label">Files:</b> { files.length } </p>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row className="project_file_contents">
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } className="file_meta">
                  { ( thumbnails && thumbnails.length > 0 )
                    ? (
                      <img
                        src={ `${getPathToS3Bucket()}/${thumbnails[0].image.url}` }
                        alt={ thumbnails[0].image.alt }
                      />
                    )
                    : null }
                </Grid.Column>

                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } className="file_info">
                  <p><b className="label">File Name:</b> { files[0].filename }</p>
                  <p><b className="label">Filesize:</b> { formatBytes( files[0].filesize ) }</p>
                  <p><b className="label">Dimensions:</b> { `${files[0].dimensions.width} x ${files[0].dimensions.height}` }</p>
                  <p><b className="label">Uploaded:</b> { `${formatDate( files[0].createdAt, files[0].language.locale )}` }
                  </p>
                  <p><b className="label">Duration:</b> { secondsToHMS( files[0].duration ) }</p>
                  <p><b className="label">Subtitles & Captions:</b> { `${files[0].videoBurnedInStatus}${files[0].videoBurnedInStatus === 'CLEAN' ? ' - No Captions' : ''}` }</p>
                  <p><b className="label">Video Type:</b> { files[0].use.name }</p>
                  <p><b className="label">Quality:</b> { files[0].quality }</p>
                  <p><b className="label">{ youTubeUrl ? 'YouTube' : 'Vimeo' } URL:</b> { youTubeUrl || vimeoUrl }</p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        );
      } ) }
    </section>
  );
};

VideoProjectFiles.propTypes = {
  id: string,
  data: object
};

export default graphql( VIDEO_PROJECT_PREVIEW_QUERY, {
  options: props => ( {
    variables: { id: props.id },
  } )
} )( VideoProjectFiles );
