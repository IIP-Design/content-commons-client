import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Item, Loader } from 'semantic-ui-react';
import { getS3Url } from 'lib/utils';
import ApolloError from 'components/errors/ApolloError';

import downloadIcon from 'static/icons/icon_download.svg';

const DownloadThumbnail = props => {
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
          content="Loading thumbnail(s)..."
        />
      </div>
    );
  }

  if ( error ) return <ApolloError error={ error } />;
  if ( !project || !Object.keys( project ).length ) return null;

  const { thumbnails } = project;

  const renderFormItem = thumbnail => {
    const { id, url, language: { displayName } } = thumbnail;
    return (
      <Item.Group key={ `fs_${id}` } className={ `download-item${isPreview ? ' preview' : ''}` }>
        <Item
          as={ isPreview ? 'span' : 'a' }
          href={ isPreview ? null : getS3Url( url ) }
          download={ isPreview ? null : `${displayName}_thumbnail` }
        >
          <Item.Image size="mini" src={ downloadIcon } className="download-icon" />
          <Item.Content>
            <Item.Header className="download-header">
              { `Download ${displayName} Thumbnail` }
            </Item.Header>
            <span className="item_hover">
              { `Download ${displayName} Thumbnail` }
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
    const t = thumbnails
      .filter( thumbnail => thumbnail && thumbnail.url )
      .map( thumbnail => renderFormItem( thumbnail ) );
    return t.length ? t : 'There are no thumbnails available for download at this time';
  };

  return (
    <Fragment>
      <p className="form-group_instructions">{ instructions }</p>
      { thumbnails && renderFormItems( thumbnails ) }
    </Fragment>
  );
};

DownloadThumbnail.propTypes = {
  data: PropTypes.object,
  instructions: PropTypes.string,
  isPreview: PropTypes.bool
};

const VIDEO_PROJECT_PREVIEW_THUMBNAILS_QUERY = gql`
  query VideoProjectPreviewThumbnails($id: ID!) {
    project: videoProject(id: $id) {
      id
      thumbnails(
        where: {
          OR: [
            { filetype: "image/jpeg" },
            { filetype: "image/png" },
            { filename_ends_with: "jpg" },
            { filename_ends_with: "png" }
          ],
          AND: {
            use: { name: "Thumbnail/Cover Image" }
          }
        },
        orderBy: filename_ASC
      ) {
        id
        url
        language {
          id
          displayName
        }
      }
    }
  }
`;

export default graphql( VIDEO_PROJECT_PREVIEW_THUMBNAILS_QUERY, {
  options: props => ( {
    variables: {
      id: props.id
    },
  } )
} )( DownloadThumbnail );

export { VIDEO_PROJECT_PREVIEW_THUMBNAILS_QUERY };
