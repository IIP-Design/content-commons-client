/**
 *
 * VideoProjectData
 *
 */
import React from 'react';
import { object } from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import './VideoProjectData.scss';

const VideoProjectData = props => {
  const { error, loading, project } = props.data;

  if ( loading ) return 'Loading the project...';
  if ( error ) return `Error! ${error.message}`;

  if ( !project || !Object.keys( project ).length ) return null;

  const {
    projectTitle,
    author,
    owner,
    visibility,
    categories,
    tags,
    descPublic,
    descInternal
  } = project;

  return (
    <section className="section section--project_data">
      <h3>PROJECT DATA</h3>
      <section className="project-data_meta section">
        <p><span className="label">Video Title:</span> { projectTitle }</p>
        <p><span className="label">Author:</span> { author }</p>
        <p><span className="label">Owner:</span> { owner }</p>
        <p><span className="label">Privacy Setting:</span> { visibility }</p>
      </section>

      { ( categories.length && tags.length )
        ? (
          <section className="project-data_taxonomy section">
            <p>
              <span className="label">Categories: </span>
              { categories
                .map( category => category.translations.name )
                .join( ', ' ) }
            </p>
            <p>
              <span className="label">Tags: </span>
              { tags
                .map( tag => tag.translations.name )
                .join( ', ' ) }
            </p>
          </section>
        ) : null }

      <section className="project-data_description section">
        <p><span className="label">Public Description:</span> { descPublic }</p>
        <p><span className="label">Internal Description:</span> { descInternal }</p>
      </section>
    </section>
  );
};

VideoProjectData.propTypes = {
  data: object
};

const VIDEO_PROJECT_REVIEW_DATA_QUERY = gql`
  query VideoProjectReviewData($id: ID!) {
    project: videoProject(id: $id) {
      id
      projectTitle
      author
      team {
        name
      }
      visibility
      descPublic
      descInternal
      categories {
        translations {
          name
        }
      }
      tags {
        translations {
          name
        }
      }
    }
  }
`;

export default graphql( VIDEO_PROJECT_REVIEW_DATA_QUERY, {
  options: props => ( {
    variables: {
      id: props.id
    },
  } )
} )( VideoProjectData );

export { VIDEO_PROJECT_REVIEW_DATA_QUERY };
