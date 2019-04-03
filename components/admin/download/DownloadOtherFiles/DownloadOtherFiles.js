import React, { Fragment } from 'react';
import { object, string } from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Item, Loader } from 'semantic-ui-react';

import downloadIcon from 'static/icons/icon_download.svg';

const DownloadOtherFiles = ( { instructions, data } ) => {
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

  if ( error ) return `Error! ${error.message}`;

  if ( !project || !Object.keys( project ).length ) return null;

  const { units } = project;

  const renderFormItem = unit => {
    const {
      id, filename, filetype, url,
      language: { displayName }
    } = unit;

    return (
      <Item.Group key={ `fs_${id}` } className="download-item">
        <Item as="a" href={ url } download={ filename }>
          <Item.Image size="mini" src={ downloadIcon } className="download-icon" />
          <Item.Content>
            <Item.Header className="download-header">
              { `Download ${displayName} ${filetype} file` }
            </Item.Header>
            <span className="item_hover">
              { `Download ${displayName} ${filetype} file` }
            </span>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  };

  const renderFormItems = () => {
    const otherFiles = units
      .filter( unit => unit && unit.url )
      .map( unit => renderFormItem( unit ) );
    return otherFiles.length ? otherFiles : 'There are no other files available for download at this time';
  };

  return (
    <Fragment>
      <p className="form-group_instructions">{ instructions }</p>
      { units && renderFormItems( units ) }
    </Fragment>
  );
};

DownloadOtherFiles.propTypes = {
  data: object,
  instructions: string
};

const VIDEO_PROJECT_PREVIEW_OTHER_FILES_QUERY = gql`
  query VideoProjectPreviewOtherfiles($id: ID!) {
    project: videoProject(id: $id) {
      id
      units: supportFiles(
        where: {
          AND: [
            { filetype_not: "srt" },
            { filetype_not: "jpg" },
            { filetype_not: "png" }
          ]
        },
        orderBy: filename_ASC
      ) {
        id
        filename
        filetype
        url
        language {
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
