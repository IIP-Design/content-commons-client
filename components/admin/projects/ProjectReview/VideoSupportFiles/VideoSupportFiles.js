/**
 *
 * VideoSupportFiles
 *
 */
import React from 'react';
import { func, object, string } from 'prop-types';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import orderBy from 'lodash/orderBy';
import { Checkbox } from 'semantic-ui-react';

import './VideoSupportFiles.scss';

class VideoSupportFiles extends React.PureComponent {
  state = {};

  componentDidMount = () => {
    this.setState( {
      protectImages: this.props.data.project.protectImages
    } );
  }

  componentDidUpdate = prevProps => {
    const { project } = this.props.data;
    const { project: prevProject } = prevProps.data;
    if ( project.protectImages !== prevProject.protectImages ) {
      this.setState( {
        protectImages: project.protectImages
      } );
    }
  }

  handleUpdateProtectImages = () => {
    const { id, updateProtectImages } = this.props;
    updateProtectImages( {
      variables: {
        data: { protectImages: !this.state.protectImages },
        where: { id }
      }
    } );
  }

  render() {
    const { error, loading, project } = this.props.data;

    if ( loading ) return 'Loading the project...';
    if ( error ) return `Error! ${error.message}`;

    if ( !project || !Object.keys( project ).length ) return null;

    const { srts, additionalFiles } = project;
    const additionalFilesSorted = orderBy( additionalFiles, ['filetype'] );

    return (
      <section className="section section--project_support-files project_support-files">
        <h3>SUPPORT FILES</h3>
        <section className="files section">
          <p className="label">SRT files</p>
          { srts.map( srt => (
            <p key={ srt.id } className="file">
              <span className="label">{ srt.language.displayName }:</span> { srt.filename }
            </p>
          ) ) }
        </section>

        <section className="addtl_files section">
          <p className="label">Additional files</p>
          { additionalFilesSorted.map( file => (
            <p key={ file.id }><span className="label">{ file.language.displayName }:</span> { file.filename }</p>
          ) ) }
        </section>

        <Checkbox
          label="Disable right-click to protect your images"
          checked={ this.state.protectImages }
          onClick={ this.handleUpdateProtectImages }
        />
      </section>
    );
  }
}

VideoSupportFiles.propTypes = {
  id: string,
  data: object,
  updateProtectImages: func
};

const VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY = gql`
  query VideoProjectReviewSupportFiles($id: ID!) {
    project: videoProject(id: $id) {
      id
      protectImages
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
      additionalFiles: supportFiles(
        where: {filetype_not: "srt"},
        orderBy: filename_ASC
      ) {
        id
        filename
        filetype
        language {
          displayName
        }
      }
    }
  }
`;

const UPDATE_PROTECT_IMAGES_MUTATION = gql`
  mutation UpdateProtectImages($data: VideoProjectUpdateInput!
  $where: VideoProjectWhereUniqueInput!) {
    updateVideoProject(data: $data, where: $where) {
      id
      protectImages
    }
  }
`;

const supportFilesQuery = graphql( VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY, {
  options: props => ( {
    variables: {
      id: props.id
    },
  } )
} );

const updateProtectImagesMutation = graphql(
  UPDATE_PROTECT_IMAGES_MUTATION,
  { name: 'updateProtectImages' }
);

export default compose(
  updateProtectImagesMutation,
  supportFilesQuery
)( VideoSupportFiles );

export {
  VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
  UPDATE_PROTECT_IMAGES_MUTATION
};
