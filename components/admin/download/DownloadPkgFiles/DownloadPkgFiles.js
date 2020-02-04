import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Item } from 'semantic-ui-react';
import downloadIcon from 'static/icons/icon_download.svg';

const DownloadPkgFiles = props => {
  const { files, instructions, isPreview } = props;

  const renderFormItem = file => {
    const { id, filename, url } = file;

    return (
      <Item.Group key={ `fs_${id}` } className={ `download-item${isPreview ? ' preview' : ''}` }>
        <Item
          as={ isPreview ? 'span' : 'a' }
          href={ isPreview ? null : url }
          download={ isPreview ? null : filename }
        >
          <Item.Image size="mini" src={ downloadIcon } alt="download icon" className="download-icon" />
          <Item.Content>
            <Item.Header className="download-header">
              { `Download ${filename}` }
            </Item.Header>
            <span className="item_hover">
              { `Download ${filename}` }
              { isPreview
                && (
                  <span className="preview-text">
                    The link will be active after publishing.
                  </span>
                ) }
            </span>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  };

  const renderFormItems = () => {
    const items = files.reduce( ( acc, file ) => {
      if ( file && file.url ) {
        acc.push( renderFormItem( file ) );
      }
      return acc;
    }, [] );

    return items.length
      ? items
      : 'There are no files available for download at this time.';
  };

  return (
    <Fragment>
      <p className="form-group_instructions">{ instructions }</p>
      { files && renderFormItems() }
    </Fragment>
  );
};

DownloadPkgFiles.propTypes = {
  files: PropTypes.array,
  instructions: PropTypes.string,
  isPreview: PropTypes.bool
};

export default DownloadPkgFiles;
