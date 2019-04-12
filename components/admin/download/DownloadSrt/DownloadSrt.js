import React, { Fragment } from 'react';
import { object, string } from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Item, Loader } from 'semantic-ui-react';

import downloadIcon from 'static/icons/icon_download.svg';

const DownloadSrt = ( { instructions, data } ) => {
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

  if ( error ) return `Error! ${error.message}`;

  if ( !project || !Object.keys( project ).length ) return null;

  const { units } = project;

  const renderFormItem = unit => {
    const { id, url, language: { displayName } } = unit;
    return (
      <Item.Group key={ `fs_${id}` } className="download-item">
        <Item as="a" href={ url } download={ `${displayName}_SRT` }>
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
    const srts = units
      .filter( unit => unit && unit.url )
      .map( unit => renderFormItem( unit ) );
    return srts.length ? srts : 'There are no SRTs available for download at this time';
  };

  return (
    <Fragment>
      <p className="form-group_instructions">{ instructions }</p>
      { units && renderFormItems( units ) }
    </Fragment>
  );
};

DownloadSrt.propTypes = {
  data: object,
  instructions: string
};

const VIDEO_PROJECT_PREVIEW_SRTS_QUERY = gql`
  query VideoProjectPreviewSrts($id: ID!) {
    project: videoProject(id: $id) {
      id
      units: supportFiles(
        where: {filetype: "srt"},
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
