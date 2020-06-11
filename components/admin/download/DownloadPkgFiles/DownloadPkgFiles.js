import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import getConfig from 'next/config';
import { Item, Dimmer, Loader } from 'semantic-ui-react';
import downloadIcon from 'static/icons/icon_download.svg';
import { downloadPackage } from 'lib/utils';
import { useAuth } from 'context/authContext';

 
const DownloadPkgFiles = props => {
  const { id, title, files, instructions, isPreview } = props;
  const [loading, setLoading] = useState( false )
  const { user } = useAuth();
 
  const styles = {
    text: {
      fontSize: '0.75rem',
      fontWeight: 'normal',
      fontStyle: 'italic',
      color: '#5b616b',
    },
    dotWrapper: {
      marginTop: '-15px',
      marginBottom: '-15px',
      textAlign: 'center',
    },
    dot: {
      height: '7px',
      width: '7px',
      backgroundColor: '#ccc',
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: '10px',
    },
  };


  const downloadAll = async () => {  
    // Loading flag ensure only one download if one is in progress
    if ( !loading ) {
      setLoading( true )  
      const response = await downloadPackage(title, files, user?.esToken, ['docx', 'doc']);
      setLoading( false );  
    }  
  }

  const renderDownloadAllItem = () => {   
    return (
      <Item.Group key={`fs_${id}`} className={`download-item${isPreview ? ' preview' : ''}`}>
        <Item 
          as={isPreview ? 'span' : 'a'} 
          onClick={isPreview ? null : downloadAll}>
          <Item.Image
            size="mini"
            src={downloadIcon}
            alt="download icon"
            className="download-icon"
          />
          <Item.Content>
            <Item.Header className="download-header">
              { loading && (
                <Dimmer active inverted>
                  <Loader size="small" />
                </Dimmer>
              )}
              {'Download All '}
              <span style={{ fontWeight: 'normal' }}>{title}</span>
              <div style={styles.text}>
                {/* <div style={{ lineHeight: 1 }}>Zip file size: </div> */}
                <div>Files: {files.length}</div>
              </div>
            </Item.Header>
            <span className="item_hover">
              {`Download ${title}`}
              {isPreview && (
                <span className="preview-text">The link will be active after publishing.</span>
              )}
            </span>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  };

  const renderFormItem = file => {
    const { id, filename, url } = file;

    return (
      <Item.Group key={`fs_${id}`} className={`download-item${isPreview ? ' preview' : ''}`}>
        <Item
          as={isPreview ? 'span' : 'a'}
          href={isPreview ? null : url}
          download={isPreview ? null : filename}
        >
          <Item.Image
            size="mini"
            src={downloadIcon}
            alt="download icon"
            className="download-icon"
          />
          <Item.Content>
            <Item.Header className="download-header">
              { 'Download ' }
              <span style={{ fontWeight: 'normal' }}>{filename}</span>
            </Item.Header>
            <span className="item_hover">
              {`Download ${filename}`}
              { isPreview && (
                <span className="preview-text">The link will be active after publishing.</span>
              )}
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
      <p className="form-group_instructions">{instructions}</p>
      {/* If more than one file exists, provide download all option */}
      { files?.length > 1 && (
          <>
            { renderDownloadAllItem() }
            <div style={ styles.dotWrapper }>
              <span style={ styles.dot }></span>
              <span style={ styles.dot }></span>
              <span style={ styles.dot }></span>
            </div>
          </>
        )
      }
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
