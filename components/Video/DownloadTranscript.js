import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import downloadIcon from 'static/icons/icon_download.svg';
import { maybeGetUrlToProdS3 } from '../../lib/utils';

class DownloadTranscript extends Component {  
  renderFormItems( item ) {
    console.log(item)
    const files = item.supportFiles.filter( f => f.supportFileType === 'transcript' );
    item.units.forEach( unit => {
      if ( !unit.transcript || !unit.transcript.srcUrl ) return;
      if ( files.find( f => f.srcUrl === unit.transcript.srcUrl ) ) return;
      files.push( {
        ...unit.transcript,
        language: unit.language
      } );
    } );
    const transcripts = files.map( ( file, i ) => this.renderFormItem( file, i ) );
    return transcripts.length ? transcripts : 'There are no transcripts available for download at this time';
  }

  renderFormItem = ( file, i ) => (
    <Item.Group key={ `fs_${i}` } className="download-item">
      <Item as="a" href={ maybeGetUrlToProdS3( file.srcUrl ) } download={ `${file.language.display_name}_Transcript` }>
        <Item.Image size="mini" src={ downloadIcon } className="download-icon" />
        <Item.Content>
          <Item.Header className="download-header">{ `Download ${file.language.display_name} Transcript` }</Item.Header>
          <span className="item_hover">{ `Download ${file.language.display_name} Transcript` }</span>
        </Item.Content>
      </Item>
    </Item.Group>
  );

  render() {
    const { item } = this.props;
    return (
      <div>
        <div className="form-group_instructions">{ this.props.instructions }</div>
        { this.renderFormItems( item ) }
      </div>
    );
  }
}

DownloadTranscript.propTypes = {
  item: PropTypes.object,
  instructions: PropTypes.string
};

export default DownloadTranscript;
