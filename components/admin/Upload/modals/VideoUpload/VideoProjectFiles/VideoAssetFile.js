import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid, Icon } from 'semantic-ui-react';
import replaceIcon from 'static/icons/icon_replace.svg';
import removeIcon from 'static/icons/icon_remove.svg';
import 'styles/tooltip.scss';
import { truncateAndReplaceStr } from 'lib/utils';
import { isWindowWidthLessThanOrEqualTo } from 'lib/browser';
import VideoAssetOptions from '../VideoAssetOptions/VideoAssetOptions';
import './VideoAssetFile.scss';

class VideoAssetFile extends PureComponent {
  state = {
    isMobileDevice: false,
    actionsMenuActive: false,
    selectOptionsActive: false
  }

  componentDidMount() {
    window.addEventListener( 'resize', this.fileOnResize );
    const isMobileDevice = isWindowWidthLessThanOrEqualTo( 640 );
    this.setState( { isMobileDevice } );
  }

  componentWillUnmount() {
    window.removeEventListener( 'resize', this.fileOnResize );
  }

  fileOnResize = () => {
    let fileResizeTimer = null;
    clearTimeout( fileResizeTimer );
    fileResizeTimer = setTimeout( () => {
      const mobileWidth = isWindowWidthLessThanOrEqualTo( 640 );
      this.setState( { isMobileDevice: mobileWidth } );
    }, 500 );
  }

  toggleAssetFileActionsMenu = () => this.setState( prevState => ( {
    actionsMenuActive: !prevState.actionsMenuActive
  } ) );

  toggleSelectOptionsDisplay = () => this.setState( prevState => ( {
    selectOptionsActive: !prevState.selectOptionsActive
  } ) );

  render() {
    const {
      activeStep,
      file,
      removeVideoAssetFile,
      replaceVideoAssetFile
    } = this.props;

    const {
      isMobileDevice,
      actionsMenuActive,
      selectOptionsActive
    } = this.state;

    let fileDisplayName;
    if ( file.length > 30 ) {
      fileDisplayName = isMobileDevice
        ? truncateAndReplaceStr( file, 10, 9 )
        : truncateAndReplaceStr( file, 18, 9 );
    } else {
      fileDisplayName = file;
    }

    return (
      <Grid.Row className="videoProjectFiles_asset">
        <Grid.Column mobile={ 16 } tablet={ 6 } computer={ 6 } className="videoProjectFiles_asset_file_wrapper">
          <p className="videoProjectFiles_asset_file" title={ file }>{ fileDisplayName }</p>
          <p className={ `videoProjectFiles_asset_file--fullFileName ${selectOptionsActive ? 'active' : ''}` }>
            <Icon name="info" size="small" />
            { file }
          </p>
        </Grid.Column>
        <Grid.Column mobile={ 16 } tablet={ 10 } computer={ 10 }>
          <div className={ `videoProjectFiles_asset_options_wrapper ${selectOptionsActive ? 'active' : ''}` }>
            <VideoAssetOptions isMobileDevice={ isMobileDevice } activeStep={ activeStep } file={ file } />
          </div>
          { !isMobileDevice && (
            <div className="videoProjectFiles_asset_actionBtns">
              <span tooltip="Replace">
                <label htmlFor="replace_videoAssetFile" className="videoProjectFiles_asset_replaceBtn">
                  <input
                    type="file"
                    name="replace_videoAssetFile"
                    data-filename={ file }
                    ref={ ref => { this.replaceFile = ref; } }
                    onChange={ replaceVideoAssetFile }
                  />
                  <button type="button" onClick={ () => this.replaceFile.click() }>
                    <img src={ replaceIcon } alt="Replace Video File Button" />
                  </button>
                </label>
              </span>
              <span tooltip="Remove">
                <button type="button" onClick={ () => removeVideoAssetFile( file ) }>
                  <img src={ removeIcon } alt="Remove Video File Button" className="videoProjectFiles_asset_removeBtn" />
                </button>
              </span>
              <span
                className="actionsMenuCloseButton"
                role="button"
                onClick={ this.toggleAssetFileActionsMenu }
                onKeyPress={ this.toggleAssetFileActionsMenu }
                tabIndex="0"
              />
            </div>
          ) }
        </Grid.Column>

        { /* MOBILE ELEMENTS */ }
        <Icon
          name={ `${selectOptionsActive ? 'chevron up' : 'chevron down'}` }
          size="small"
          className="mobileSelectOptionsToggle"
          onClick={ this.toggleSelectOptionsDisplay }
          onKeyPress={ this.toggleSelectOptionsDisplay }
        />
        { !actionsMenuActive && (
          <Icon
            name="ellipsis vertical"
            size="small"
            className="mobileActionsMenuToggle"
            onClick={ this.toggleAssetFileActionsMenu }
            onKeyPress={ this.toggleAssetFileActionsMenu }
          />
        ) }
        { actionsMenuActive && isMobileDevice && (
          <div className="videoProjectFiles_asset_actionBtns active">
            <label htmlFor="replace_videoAssetFile" className="videoProjectFiles_asset_replaceBtn">
              <input
                type="file"
                name="replace_videoAssetFile"
                data-filename={ file }
                ref={ ref => { this.replaceFile = ref; } }
                onChange={ replaceVideoAssetFile }
              />
              <button type="button" onClick={ () => this.replaceFile.click() }>
                <span>Replace File</span>
              </button>
            </label>
            <button
              className="videoProjectFiles_asset_removeBtn"
              type="button"
              onClick={ () => removeVideoAssetFile( file ) }
            >
              <span>Delete File</span>
            </button>
            <span
              className="actionsMenuCloseButton"
              role="button"
              onClick={ this.toggleAssetFileActionsMenu }
              onKeyPress={ this.toggleAssetFileActionsMenu }
              tabIndex="0"
            />
          </div>
        ) }
      </Grid.Row>
    );
  }
}

VideoAssetFile.propTypes = {
  file: PropTypes.string,
  activeStep: PropTypes.number,
  removeVideoAssetFile: PropTypes.func,
  replaceVideoAssetFile: PropTypes.func
};

export default VideoAssetFile;
