import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';
import { object, string } from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import downloadIcon from 'static/icons/icon_download.svg';

class DownloadSrt extends Component {
  renderFormItems( units ) {
    const srts = units.filter( unit => unit && unit.url ).map( ( unit, i ) => this.renderFormItem( unit, i ) );
    return srts.length ? srts : 'There are no SRTs available for download at this time';
  }

  renderFormItem = unit => {
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

  render() {
    const { error, loading, project } = this.props.data;

    if ( loading ) return 'Loading the project...';
    if ( error ) return `Error! ${error.message}`;

    if ( !project || !Object.keys( project ).length ) return null;

    const { units } = project;

    return (
      <div>
        <div className="form-group_instructions">{ this.props.instructions }</div>
        { units && this.renderFormItems( units ) }
      </div>
    );
  }
}

DownloadSrt.propTypes = {
  data: object,
  instructions: string
};

const VIDEO_PROJECT_SRTS_QUERY = gql`
  query VideoProjectPreviewSrts($id: ID!) {
    project: videoProject(id: $id) {
      units: supportFiles(
        where: {filetype: "srt"},
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

export default graphql( VIDEO_PROJECT_SRTS_QUERY, {
  options: props => ( {
    variables: {
      id: props.id
    },
  } )
} )( DownloadSrt );

export { VIDEO_PROJECT_SRTS_QUERY };
