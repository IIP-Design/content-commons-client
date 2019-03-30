import React, { Fragment } from 'react';
import { Item } from 'semantic-ui-react';
import { object, string } from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import downloadIcon from 'static/icons/icon_download.svg';

const DownloadThumbnail = ( { instructions, data } ) => {
  const { error, loading, project } = data;

  if ( loading ) return 'Loading the project...';
  if ( error ) return `Error! ${error.message}`;

  if ( !project || !Object.keys( project ).length ) return null;

  const { units } = project;

  const renderFormItem = unit => {
    const { id, url, language: { displayName } } = unit;
    return (
      <Item.Group key={ `fs_${id}` } className="download-item">
        <Item as="a" href={ url } download={ `${displayName}_thumbnail` }>
          <Item.Image size="mini" src={ downloadIcon } className="download-icon" />
          <Item.Content>
            <Item.Header className="download-header">
              { `Download ${displayName} Thumbnail` }
            </Item.Header>
            <span className="item_hover">
              { `Download ${displayName} Thumbnail` }
            </span>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  };

  const renderFormItems = () => {
    const t = units
      .filter( unit => unit && unit.url )
      .map( unit => renderFormItem( unit ) );
    return t.length ? t : 'There are no thumbnails available for download at this time';
  };

  return (
    <Fragment>
      <p className="form-group_instructions">{ instructions }</p>
      { units && renderFormItems( units ) }
    </Fragment>
  );
};

DownloadThumbnail.propTypes = {
  data: object,
  instructions: string
};

const VIDEO_PROJECT_PREVIEW_THUMBNAILS_QUERY = gql`
  query VideoProjectPreviewThumbnails($id: ID!) {
    project: videoProject(id: $id) {
      units: supportFiles(
        where: {
          OR: [
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
