import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Item, Loader } from 'semantic-ui-react';
import { getS3Url } from 'lib/utils';
import ApolloError from 'components/errors/ApolloError';
import downloadIcon from 'static/icons/icon_download.svg';

const DownloadCaption = props => {
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
          content="Loading Caption file(s)..."
        />
      </div>
    );
  }

  if ( error ) return <ApolloError error={ error } />;
  if ( !project || !Object.keys( project ).length ) return null;

  const { files } = project;

  const renderFormItem = unit => {
    const { id, url, language: { displayName } } = unit;
    return (
      <Item.Group key={ `fs_${id}` } className={ `download-item${isPreview ? ' preview' : ''}` }>
        <Item
          as={ isPreview ? 'span' : 'a' }
          href={ isPreview ? null : getS3Url( url ) }
          download={ isPreview ? null : `${displayName}_SRT` }
        >
          <Item.Image
            size="mini"
            src={ downloadIcon }
            className="download-icon"
          />
          <Item.Content>
            <Item.Header className="download-header">
              { url.includes( '.srt' ) && `Download ${displayName} SRT` }
              { url.includes( '.vtt' ) && `Download ${displayName} VTT` }
            </Item.Header>
            <span className="item_hover">
              { url.includes( '.srt' ) && `Download ${displayName} SRT` }
              { url.includes( '.vtt' ) && `Download ${displayName} VTT` }
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
    const captions = files
      .filter( unit => unit && unit.url )
      .map( unit => renderFormItem( unit ) );
    return captions.length ? captions : 'There are no caption files available for download at this time';
  };

  return (
    <Fragment>
      <p className="form-group_instructions">{ instructions }</p>
      { files && renderFormItems( files ) }
    </Fragment>
  );
};

DownloadCaption.propTypes = {
  data: PropTypes.object,
  instructions: PropTypes.string,
  isPreview: PropTypes.bool
};

const VIDEO_PROJECT_PREVIEW_CAPTIONS_QUERY = gql`
  query VideoProjectPreviewCaptions($id: ID!) {
    project: videoProject(id: $id) {
      id
      files: supportFiles(
        where: {
          OR:[
            { filetype: "application/x-subrip" },
            { filename_ends_with: "srt" },
            { filename_ends_with: "vtt" },
          ]
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

export default graphql( VIDEO_PROJECT_PREVIEW_CAPTIONS_QUERY, {
  options: props => ( {
    variables: {
      id: props.id
    },
  } )
} )( DownloadCaption );

export { VIDEO_PROJECT_PREVIEW_CAPTIONS_QUERY };
