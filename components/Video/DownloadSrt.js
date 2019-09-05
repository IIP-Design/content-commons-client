import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';
import { object, string } from 'prop-types';
import downloadIcon from 'static/icons/icon_download.svg';
import { maybeGetUrlToProdS3 } from '../../lib/utils';

class DownloadSrt extends Component {
  renderFormItems( item ) {
    const files = item.supportFiles.filter( f => f.supportFileType === 'srt' );
    item.units.forEach( unit => {
      if ( !unit.srt || !unit.srt.srcUrl ) return;
      if ( files.find( f => f.srcUrl === unit.srt.srcUrl ) ) return;
      files.push( {
        ...unit.srt,
        language: unit.language
      } );
    } );
    const srts = files.map( ( file, i ) => this.renderFormItem( file, i ) );
    return srts.length ? srts : 'There are no SRTs available for download at this time';
  }

  renderFormItem = ( file, i ) => (
    <Item.Group key={ `fs_${i}` } className="download-item">
      <Item as="a" href={ maybeGetUrlToProdS3( file.srcUrl ) } download={ `${file.language.display_name}_SRT` }>
        <Item.Image size="mini" src={ downloadIcon } className="download-icon" />
        <Item.Content>
          <Item.Header className="download-header">{ `Download ${file.language.display_name} SRT` }</Item.Header>
          <span className="item_hover">{ `Download ${file.language.display_name} SRT` }</span>
        </Item.Content>
      </Item>
    </Item.Group>
  );

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

DownloadSrt.propTypes = {
  item: object,
  instructions: string
};

export default DownloadSrt;
