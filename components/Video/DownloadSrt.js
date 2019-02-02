import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';
import { array, string } from 'prop-types';
import downloadIcon from 'static/icons/icon_download.svg';

class DownloadSrt extends Component {
  renderFormItems( units ) {
    const srts = units.filter( unit => unit.srt && unit.srt.srcUrl ).map( ( unit, i ) => this.renderFormItem( unit, i ) );
    return srts.length ? srts : 'There are no SRTs available for download at this time';
  }

  renderFormItem = ( unit, i ) => (
    <Item.Group key={ `fs_${i}` } className="download-item">
      <Item as="a" href={ unit.srt.srcUrl } download={ `${unit.language.display_name}_SRT` }>
        <Item.Image size="mini" src={ downloadIcon } className="download-icon" />
        <Item.Content>
          <Item.Header className="download-header">{ `Download ${unit.language.display_name} SRT` }</Item.Header>
          <span className="item_hover">{ `Download ${unit.language.display_name} SRT` }</span>
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

DownloadSrt.propTypes = {
  units: array,
  instructions: string
};

export default DownloadSrt;
