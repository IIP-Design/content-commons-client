/**
 *
 * VideoSupportFiles
 *
 */
import React from 'react';
import { bool, func, object } from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Grid, Checkbox } from 'semantic-ui-react';

import './VideoSupportFiles.scss';

const VideoSupportFiles = props => {
  const { disableRightClick, toggleDisableRightClick } = props;
  const { error, loading, project } = props.data;

  if ( loading ) return 'Loading the project...';
  if ( error ) return `Error! ${error.message}`;

  if ( !project || !Object.keys( project ).length ) return null;

  const {
    srts,
    thumbnails,
    additionalFiles
  } = project;

  return (
    <section className="section section--project_support-files project_support-files">
      <Grid stackable>
        <h3>SUPPORT FILES</h3>
        <Grid.Row>
          <Grid.Column mobile={ 16 } computer={ 5 }>
            <section className="files section">
              <p className="label">SRT files</p>
              { srts.map( srt => (
                <p key={ srt.id } className="file">
                  <span className="label">{ srt.language.displayName }:</span> { srt.filename }
                </p>
              ) ) }
            </section>
          </Grid.Column>

          <Grid.Column mobile={ 16 } computer={ 9 }>
            <Grid stackable>
              <Grid.Column mobile={ 16 } computer={ 8 }>
                <section className="thumbnails section">
                  <p className="label">Thumbnail files</p>
                  <Grid columns="three">
                    { thumbnails.map( file => (
                      <Grid.Column key={ file.id }>
                        <img className="thumbnails_img" src={ file.url } alt="Project Thumbnail Small" />
                        <p>{ file.language.displayName }</p>
                      </Grid.Column>
                    ) ) }
                  </Grid>
                  <Checkbox
                    label="Disable right-click to protect your images"
                    checked={ disableRightClick }
                    onClick={ toggleDisableRightClick }
                  />
                </section>
              </Grid.Column>

              <Grid.Column mobile={ 16 } computer={ 8 }>
                <section className="addtl_files section">
                  <p className="label">Additional files</p>
                  { additionalFiles.map( file => (
                    <p key={ file.id }><span className="label">{ file.language.displayName }:</span> { file.filename }</p>
                  ) ) }
                </section>
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </section>
  );
};

VideoSupportFiles.propTypes = {
  data: object,
  disableRightClick: bool,
  toggleDisableRightClick: func
};

const VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY = gql`
  query VideoProjectReviewSupportFiles($id: ID!) {
    project: videoProject(id: $id) {
      srts: supportFiles(
        where: {filetype: "srt"},
        orderBy: filename_ASC
      ) {
        id
        filename
        language {
          displayName
        }
      }
      thumbnails: supportFiles(
        where: {
          OR:  [
            { filetype: "jpg" },
            { filetype: "png" }
          ]
        },
        orderBy: filename_ASC
      ) {
        id
        url
        language {
          displayName
        }
      }
      additionalFiles: supportFiles(
        where: {
            NOT: [
              { filetype: "srt" },
              { filetype: "jpg" },
              { filetype: "png" }
            ]
          },
        orderBy: filename_ASC
      ) {
        id
        filename
        language {
          displayName
        }
      }
    }
  }
`;

export default graphql( VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY, {
  options: props => ( {
    variables: {
      id: props.id
    },
  } )
} )( VideoSupportFiles );

export { VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY };
