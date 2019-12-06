import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';
import { object, string } from 'prop-types';
import downloadIcon from 'static/icons/icon_download.svg';
import { maybeGetUrlToProdS3 } from '../../lib/utils';

class DownloadCaption extends Component {
  renderFormItems( item ) {
    const files = item.supportFiles.filter( f => f.supportFileType === 'srt' || f.supportFileType === 'vtt' );
    item.units.forEach( unit => {
      if ( !unit.srt || !unit.srt.srcUrl ) return;
      if ( files.find( f => f.srcUrl === unit.srt.srcUrl ) ) return;
      files.push( {
        ...unit.srt,
        language: unit.language
      } );
    } );
    const srts = files.map( ( file, i ) => this.renderFormItem( file, i ) );
    return srts.length ? srts : 'There are no caption files available for download at this time';
  }

  renderFormItem = ( file, i ) => {
    const downloadFileText = `Download ${file.language.display_name} ${file.srcUrl.includes( '.vtt' ) ? 'VTT' : 'SRT'}`;
    return (
      <Item.Group key={ `fs_${i}` } className="download-item">
        <Item
          as="a"
          href={ maybeGetUrlToProdS3( file.srcUrl ) }
          download={ `${file.language.display_name}_${file.srcUrl.includes( '.vtt' ) ? 'VTT' : 'SRT'}` }
        >
          <Item.Image size="mini" src={ downloadIcon } className="download-icon" />
          <Item.Content>
            <Item.Header className="download-header">{ downloadFileText }</Item.Header>
            <span className="item_hover">{ downloadFileText }</span>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  }

  render() {
    const { item } = this.props;
    return (
      <div>
        <div className="form-group_instructions">{ this.props.instructions }</div>
        { item && this.renderFormItems( item ) }
      </div>
    );
  }
}

DownloadCaption.propTypes = {
  item: object,
  instructions: string
};

export default DownloadCaption;
