import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Item, Dimmer, Loader } from 'semantic-ui-react';
import downloadIcon from 'static/icons/icon_download.svg';
import { downloadPackage } from 'lib/utils';
import SignedUrlLink from './SignedUrlLink/SignedUrlLink';
import { useAuth } from 'context/authContext';

const DownloadPkgFiles = ( { files, id, isPreview, title } ) => {
  const [loading, setLoading] = useState( false );
  const { user } = useAuth();

  const styles = {
    text: {
      fontSize: '0.75rem',
      fontWeight: 'normal',
      fontStyle: 'italic',
      color: '#5b616b',
    },
    dotWrapper: {
      marginBottom: '5px',
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
      setLoading( true );
      const response = await downloadPackage( title, files, user?.esToken, ['docx', 'doc'] );

      setLoading( false );
    }
  };

  const renderDownloadAllItem = () => (
    <a className="download-item" onClick={ downloadAll } onKeyDown={ downloadAll } role="button" tabIndex="0">
      <div className="item-icon"><img src={ downloadIcon } alt={ `Download All ${title}` } /></div>
      <div className="item-content">
        <p className="item-content__title">
          <strong>{ `Download All ${title}` }</strong>
        </p>
        <p className="item-content__meta">{ `Files: ${files.length}` }</p>
      </div>
      <span className="item-hover">
        { `Download All ${title}` }
        { isPreview && <span className="preview-text">The link will be active after publishing.</span> }
      </span>
    </a>
    // <Item.Group key={ `fs_${id}` } className={ `download-item${isPreview ? ' preview' : ''}` }>
    //   <Item
    //     as={ isPreview ? 'span' : 'a' }
    //     onClick={ isPreview ? null : downloadAll }
    //   >
    //     <Item.Image
    //       size="mini"
    //       src={ downloadIcon }
    //       alt="download icon"
    //       className="download-icon"
    //     />
    //     <Item.Content>
    //       <Item.Header className="download-header">
    //         { loading && (
    //           <Dimmer active inverted>
    //             <Loader size="small" />
    //           </Dimmer>
    //         ) }
    //         {'Download All '}
    //         <span style={ { fontWeight: 'normal' } }>{ title }</span>
    //         <div style={ styles.text }>
    //           {/* <div style={{ lineHeight: 1 }}>Zip file size: </div> */}
    //           <div>
    //             { `Files: ${files.length}` }
    //           </div>
    //         </div>
    //       </Item.Header>
    //       <span className="item_hover">
    //         { `Download ${title}` }
    //         { isPreview && <span className="preview-text">The link will be active after publishing.</span> }
    //       </span>
    //     </Item.Content>
    //   </Item>
    // </Item.Group>
  );

  const items = files.reduce( ( acc, file ) => {
    if ( file && file.url ) {
      acc.push( file );
    }

    return acc;
  }, [] );

  return (
    <Fragment>
      { ( !items || items.length < 1 ) && 'There are no files available for download at this time.' }
      { files?.length > 1 && (
        <Fragment>
          { renderDownloadAllItem() }
          <div style={ styles.dotWrapper }>
            <span style={ styles.dot } />
            <span style={ styles.dot } />
            <span style={ styles.dot } />
          </div>
        </Fragment>
      )}
      { items?.length > 0 && items.map(
        item => <SignedUrlLink key={ item.id } file={ item } isPreview={ isPreview } />,
      ) }
    </Fragment>
  );
};

DownloadPkgFiles.propTypes = {
  files: PropTypes.array,
  id: PropTypes.string,
  isPreview: PropTypes.bool,
  title: PropTypes.string,
};

export default DownloadPkgFiles;
