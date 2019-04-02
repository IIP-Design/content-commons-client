/**
 *
 * VideoProjectFiles
 *
 */

import React from 'react';
import { object, string } from 'prop-types';
import Router from 'next/router';
import { graphql } from 'react-apollo';
import { Grid, Button } from 'semantic-ui-react';

import { VIDEO_PROJECT_PREVIEW_QUERY } from 'components/admin/projects/ProjectEdit/PreviewProjectContent/PreviewProjectContent';

import {
  formatBytes, formatDate, millisToMinutesAndSeconds
} from 'lib/utils';

import './VideoProjectFiles.scss';

const VideoProjectFiles = props => {
  const { error, loading, project } = props.data;

  if ( loading ) return 'Loading the project...';
  if ( error ) return `Error! ${error.message}`;

  if ( !project || !Object.keys( project ).length ) return null;

  const { units } = project;

  const handleEdit = () => {
    const { id } = props;
    Router.push( {
      pathname: `/admin/project/unit/${id}/edit`
    } );
  };

  return (
    <section className="section section--project_files project_files">
      <h3 className="project_files_headline">VIDEOS IN PROJECT</h3>
      { units.map( unit => (
        <div key={ unit.title } className="project_file">
          <Grid>
            <Grid.Row
              className={
                `project_file_header ${unit.files[0].language.textDirection}`
              }
            >
              <Grid.Column floated="left" mobile={ 8 }>
                <h3 className="title">{ unit.title }</h3>
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
                <img src={ unit.thumbnails[0].image.url } alt={ unit.thumbnails[0].image.alt } />
                <p><span className="label">File Name:</span> { unit.files[0].filename }</p>
                <p><span className="label">Filesize:</span> { formatBytes( unit.files[0].filesize ) }</p>
                <p><span className="label">Dimensions:</span> { `${unit.files[0].dimensions.width} x ${unit.files[0].dimensions.height}` }</p>
                <p><span className="label">Uploaded:</span> { formatDate( unit.files[0].createdAt ) }</p>
                <p><span className="label">Duration:</span> { millisToMinutesAndSeconds( unit.files[0].duration, 0 ) }</p>
              </Grid.Column>

              <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } className="file_info">
                <p><span className="label">Language:</span> { unit.files[0].language.displayName }</p>
                <p><span className="label">Subtitles & Captions:</span> { unit.files[0].videoBurnedInStatus }</p>
                <p><span className="label">Video Type:</span> { unit.videoType }</p>
                <p><span className="label">Quality:</span> { unit.files[0].quality }</p>
                <p
                  className={
                    `public_description ${unit.files[0].language.textDirection}`
                  }
                >
                  <span className="label">Public Description:</span>
                  <span>{ unit.descPublic }</span>
                </p>
                <p><span className="label">{ unit.files[0].stream.site } URL:</span> { unit.files[0].stream.url }</p>
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

export default graphql( VIDEO_PROJECT_PREVIEW_QUERY, {
  options: props => ( {
    variables: {
      id: props.id,
      isReviewPage: true
    },
  } )
} )( VideoProjectFiles );
