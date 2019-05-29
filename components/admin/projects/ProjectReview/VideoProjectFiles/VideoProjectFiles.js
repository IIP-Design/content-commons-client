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
  getPluralStringOrNot,
  getStreamData,
  millisToMinutesAndSeconds
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

  if ( !units || ( units && !units.length ) ) return null;

  const handleEdit = () => {
    const { id } = props;
    Router.push( {
      pathname: `/admin/project/video/${id}/edit`
    } );
  };

  return (
    <section className="section section--project_files project_files layout">
      <h3 className="project_files_headline uppercase">
        { `${getPluralStringOrNot( units, 'Video' )} in Project` }
      </h3>
      { units.map( unit => {
        const { files, thumbnails } = unit;
        if ( !files || ( files && !files.length ) ) return;

        const youTubeUrl = getStreamData( files[0].stream, 'youtube', 'url' );
        const vimeoUrl = getStreamData( files[0].stream, 'vimeo', 'url' );

        return (
          <div key={ unit.title } className="project_file">
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

              <Grid.Row className="project_file_contents">
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } className="file_meta">
                  { ( thumbnails && thumbnails.length )
                    ? (
                      <img
                        src={ thumbnails[0].image.url }
                        alt={ thumbnails[0].image.alt }
                      />
                    )
                    : null }
                  <p><b className="label">File Name:</b> { files[0].filename }</p>
                  <p><b className="label">Filesize:</b> { formatBytes( files[0].filesize ) }</p>
                  <p><b className="label">Dimensions:</b> { `${files[0].dimensions.width} x ${files[0].dimensions.height}` }</p>
                  <p><b className="label">Uploaded:</b> { formatDate( files[0].createdAt ) }</p>
                  <p><b className="label">Duration:</b> { millisToMinutesAndSeconds( files[0].duration, 0 ) }</p>
                </Grid.Column>

                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } className="file_info">
                  <p><b className="label">Language:</b> { files[0].language.displayName }</p>
                  <p><b className="label">Subtitles & Captions:</b> { files[0].videoBurnedInStatus }</p>
                  <p><b className="label">Video Type:</b> { files[0].use.name }</p>
                  <p><b className="label">Quality:</b> { files[0].quality }</p>
                  <p
                    className={
                      `public_description ${files[0].language.textDirection}`
                    }
                  >
                    <b className="label">Public Description:</b>
                    <span>{ unit.descPublic }</span>
                  </p>
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
    variables: {
      id: props.id,
      isReviewPage: true
    },
  } )
} )( VideoProjectFiles );
