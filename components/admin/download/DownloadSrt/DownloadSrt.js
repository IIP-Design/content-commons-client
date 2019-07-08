import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Item, Loader } from 'semantic-ui-react';
import { getS3Url } from 'lib/utils';
import ApolloError from 'components/errors/ApolloError';
import downloadIcon from 'static/icons/icon_download.svg';

const DownloadSrt = props => {
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
          content="Loading SRT(s)..."
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
              { `Download ${displayName} SRT` }
            </Item.Header>
            <span className="item_hover">
              { `Download ${displayName} SRT` }
            </span>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  };

  const renderFormItems = () => {
    const srts = files
      .filter( unit => unit && unit.url )
      .map( unit => renderFormItem( unit ) );
    return srts.length ? srts : 'There are no SRTs available for download at this time';
  };

  return (
    <Fragment>
      <p className="form-group_instructions">{ instructions }</p>
      { files && renderFormItems( files ) }
    </Fragment>
  );
};

DownloadSrt.propTypes = {
  data: PropTypes.object,
  instructions: PropTypes.string,
  isPreview: PropTypes.bool
};

const VIDEO_PROJECT_PREVIEW_SRTS_QUERY = gql`
  query VideoProjectPreviewSrts($id: ID!) {
    project: videoProject(id: $id) {
      id
      files: supportFiles(
        where: {
          OR:[
            { filetype: "application/x-subrip" },
            { filename_ends_with: "srt" }
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

export default graphql( VIDEO_PROJECT_PREVIEW_SRTS_QUERY, {
  options: props => ( {
    variables: {
      id: props.id
    },
  } )
} )( DownloadSrt );

export { VIDEO_PROJECT_PREVIEW_SRTS_QUERY };
