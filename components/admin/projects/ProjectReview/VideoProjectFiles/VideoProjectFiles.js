/**
 *
 * VideoProjectFiles
 *
 */

import React from 'react';
import { object, string } from 'prop-types';
import Router from 'next/router';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Grid, Button } from 'semantic-ui-react';

import { formatBytes, formatDate, millisToMinutesAndSeconds } from 'lib/utils';

import './VideoProjectFiles.scss';

const VideoProjectFiles = props => {
  const { error, loading, project } = props.data;

  if ( loading ) return 'Loading the project...';
  if ( error ) return `Error! ${error.message}`;

  if ( !project || !Object.keys( project ).length ) return null;

  const { videos } = project;

  const handleEdit = () => {
    const { id } = props;
    Router.push( {
      pathname: `/admin/project/video/${id}/edit`
    } );
  };

  return (
    <section className="section section--project_files project_files">
      <h3 className="project_files_headline">VIDEOS IN PROJECT</h3>
      { videos.map( video => (
        <div key={ video.title } className="project_file">
          <Grid>
            <Grid.Row
              className={
                `project_file_header ${video.files[0].language.textDirection}`
              }
            >
              <Grid.Column floated="left" mobile={ 8 }>
                <h3 className="title">{ video.title }</h3>
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
                <img src={ video.thumbnails[0].image.url } alt={ video.thumbnails[0].image.alt } />
                <p><span className="label">File Name:</span> { video.files[0].filename }</p>
                <p><span className="label">Filesize:</span> { formatBytes( video.files[0].filesize ) }</p>
                <p><span className="label">Dimensions:</span> { `${video.files[0].dimensions.width} x ${video.files[0].dimensions.height}` }</p>
                <p><span className="label">Uploaded:</span> { formatDate( video.files[0].createdAt ) }</p>
                <p><span className="label">Duration:</span> { millisToMinutesAndSeconds( video.files[0].duration ) }</p>
              </Grid.Column>

              <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } className="file_info">
                <p><span className="label">Language:</span> { video.files[0].language.displayName }</p>
                <p><span className="label">Subtitles & Captions:</span> { video.files[0].videoBurnedInStatus }</p>
                <p><span className="label">Video Type:</span> { video.video_type }</p>
                <p><span className="label">Quality:</span> { video.files[0].quality }</p>
                <p
                  className={
                    `public_description ${video.files[0].language.textDirection}`
                  }
                >
                  <span className="label">Public Description:</span>
                  <span>{ video.descPublic }</span>
                </p>
                <p><span className="label">YouTube URL:</span> { video.files[0].stream.url }</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      ) ) }
    </section>
  );
};

VideoProjectFiles.propTypes = {
  id: string,
  data: object
};

const VIDEO_PROJECT_REVIEW_PROJECT_FILES_QUERY = gql`
  query VideoProjectReviewProjectFiles($id: ID!) {
    project: videoProject(id: $id) {
      id
      videos: units {
        id
        title
        descPublic
        thumbnails {
          image {
            alt
            url
          }
        }
        files {
          createdAt
          duration
          filename
          filesize
          videoBurnedInStatus
          quality
          stream {
            site
            url
          }
          dimensions {
            height
            width
          }
          language {
            displayName
            textDirection
          }
        }
      }
    }
  }
`;

export default graphql( VIDEO_PROJECT_REVIEW_PROJECT_FILES_QUERY, {
  options: props => ( {
    variables: {
      id: props.id
    },
  } )
} )( VideoProjectFiles );

export { VIDEO_PROJECT_REVIEW_PROJECT_FILES_QUERY };
