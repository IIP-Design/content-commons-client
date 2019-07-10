import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Item, Loader } from 'semantic-ui-react';
import { getS3Url } from 'lib/utils';
import ApolloError from 'components/errors/ApolloError';

import downloadIcon from 'static/icons/icon_download.svg';

const DownloadOtherFiles = props => {
  const { data, instructions, isPreview } = props;
  const { error, loading, project } = data;

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
          content="Loading other file(s)..."
        />
      </div>
    );
  }

  if ( error ) return <ApolloError error={ error } />;
  if ( !project || !Object.keys( project ).length ) return null;

  const { files } = project;

  const renderFormItem = file => {
    const {
      id, filename, filetype, url,
      language: { displayName }
    } = file;

    return (
      <Item.Group key={ `fs_${id}` } className={ `download-item${isPreview ? ' preview' : ''}` }>
        <Item
          as={ isPreview ? 'span' : 'a' }
          href={ isPreview ? null : getS3Url( url ) }
          download={ isPreview ? null : filename }
        >
          <Item.Image size="mini" src={ downloadIcon } className="download-icon" />
          <Item.Content>
            <Item.Header className="download-header">
              { `Download ${displayName} ${filetype} file` }
            </Item.Header>
            <span className="item_hover">
              { `Download ${displayName} ${filetype} file` }
              { isPreview
                && (
                  <span className="preview-text">
                    The link will be active after publishing.
                  </span>
                ) }
            </span>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  };

  const renderFormItems = () => {
    const otherFiles = files
      .filter( file => file && file.url )
      .map( file => renderFormItem( file ) );
    return otherFiles.length ? otherFiles : 'There are no other files available for download at this time';
  };

  return (
    <Fragment>
      <p className="form-group_instructions">{ instructions }</p>
      { files && renderFormItems( files ) }
    </Fragment>
  );
};

DownloadOtherFiles.propTypes = {
  data: PropTypes.object,
  instructions: PropTypes.string,
  isPreview: PropTypes.bool
};

const VIDEO_PROJECT_PREVIEW_OTHER_FILES_QUERY = gql`
  query VideoProjectPreviewOtherfiles($id: ID!) {
    project: videoProject(id: $id) {
      id
      files: supportFiles(
        where: {
          filetype_not: "application/x-subrip"
        },
        orderBy: filename_ASC
      ) {
        id
        filename
        filetype
        url
        language {
          id
          displayName
        }
      }
    }
  }
`;

export default graphql( VIDEO_PROJECT_PREVIEW_OTHER_FILES_QUERY, {
  options: props => ( {
    variables: {
      id: props.id
    },
  } )
} )( DownloadOtherFiles );

export { VIDEO_PROJECT_PREVIEW_OTHER_FILES_QUERY };
