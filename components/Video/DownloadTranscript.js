import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import downloadIcon from 'static/icons/icon_download.svg';

class DownloadTranscript extends Component {
  renderFormItems( units ) {
    const transcripts = units
      .filter( unit => unit.srt && unit.transcript.srcUrl )
      .map( ( unit, i ) => this.renderFormItem( unit, i ) );
    return transcripts.length ? transcripts : 'There are no transcripts available for download at this time';
  }

  renderFormItem = ( unit, i ) => (
    <Item.Group key={ `fs_${i}` } className="download-item">
      <Item as="a" href={ unit.transcript.srcUrl } download={ `${unit.language.display_name}_Transcript` }>
        <Item.Image size="mini" src={ downloadIcon } className="download-icon" />
        <Item.Content>
          <Item.Header className="download-header">{ `Download ${unit.language.display_name} Transcript` }</Item.Header>
          <span className="item_hover">{ `Download ${unit.language.display_name} Transcript` }</span>
        </Item.Content>
      </Item>
    </Item.Group>
  );

  render() {
    const { units } = this.props;
    return (
      <div>
        <div className="form-group_instructions">{ this.props.instructions }</div>
        { units && this.renderFormItems( units ) }
      </div>
    );
  }
}

DownloadTranscript.propTypes = {
  units: PropTypes.array,
  instructions: PropTypes.string
};

export default DownloadTranscript;
