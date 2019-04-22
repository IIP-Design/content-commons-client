/**
 *
 * VideoProjectData
 *
 */
import React from 'react';
import { object } from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Icon, Loader } from 'semantic-ui-react';

import './VideoProjectData.scss';

const VideoProjectData = props => {
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
          content="Loading project data..."
        />
      </div>
    );
  }

  if ( error ) {
    return (
      <div className="video-project-data error">
        <p>
          <Icon color="red" name="exclamation triangle" />
          <span>Loading error...</span>
        </p>
      </div>
    );
  }

  if ( !project || !Object.keys( project ).length ) return null;

  const {
    projectTitle,
    author,
    team,
    visibility,
    categories,
    tags,
    descPublic,
    descInternal
  } = project;

  return (
    <section className="section section--project_data">
      <h3 className="uppercase">Project Data</h3>
      <section className="project-data_meta section">
        <p><b className="label">Video Title:</b> { projectTitle }</p>
        <p><b className="label">Author:</b> { author && `${author.firstName} ${author.lastName}` }</p>
        <p><b className="label">Team:</b> { team.name }</p>
        <p><b className="label">Privacy Setting:</b> { visibility }</p>
      </section>

      <section className="project-data_taxonomy section">
        <p>
          <b className="label">Categories: </b>
          { ( categories && categories.length ) && categories
            .map( category => category.translations.name )
            .join( ', ' ) }
        </p>
        <p>
          <b className="label">Tags: </b>
          { ( tags && tags.length ) && tags
            .map( tag => tag.translations.name )
            .join( ', ' ) }
        </p>
      </section>

      <section className="project-data_description section">
        <p><b className="label">Public Description:</b> { descPublic }</p>
        <p><b className="label">Internal Description:</b> { descInternal }</p>
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
      author {
        id
        firstName
        lastName
      }
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
