import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid, Icon } from 'semantic-ui-react';
import replaceIcon from '../../../../../../static/icons/icon_replace.svg';
import removeIcon from '../../../../../../static/icons/icon_remove.svg';
import '../../../../../../styles/tooltip.scss';
import { truncateAndReplaceStr } from '../../../../../../lib/utils';
import { isMobile } from '../../../../../../lib/browser';
import VideoAssetOptions from '../VideoAssetOptions/VideoAssetOptions';
import './VideoAssetFile.scss';

class VideoAssetFile extends PureComponent {
  state = {
    isMobileDevice: false,
    actionsMenuActive: false,
    selectOptionsActive: false
  }

  componentDidMount() {
    const isMobileDevice = isMobile();
    this.setState( { isMobileDevice } );
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
      fileDisplayName = truncateAndReplaceStr( file, 18, 9 );
    } else {
      fileDisplayName = file;
    }

    return (
      <Grid.Row className="videoProjectFiles_asset">
        <Grid.Column mobile={ 16 } computer={ 6 }>
          <p className="videoProjectFiles_asset_file" title={ file }>{ fileDisplayName }</p>
        </Grid.Column>
        <Grid.Column mobile={ 16 } computer={ 10 }>
          <div className={ `videoProjectFiles_asset_options_wrapper ${selectOptionsActive ? 'active' : ''}` }>
            <VideoAssetOptions isMobileDevice={ isMobileDevice } activeStep={ activeStep } file={ file } />
          </div>
          <div className={ `videoProjectFiles_asset_actionBtns ${actionsMenuActive ? 'active' : ''}` }>
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
                  { !isMobileDevice && <img src={ replaceIcon } alt="Replace Video File Button" /> }
                  { isMobileDevice && <span>Replace File</span> }
                </button>
              </label>
            </span>
            <span tooltip="Remove">
              <button type="button" onClick={ () => removeVideoAssetFile( file ) }>
                { !isMobileDevice && <img src={ removeIcon } alt="Remove Video File Button" className="videoProjectFiles_asset_removeBtn" /> }
                { isMobileDevice && <span>Delete File</span> }
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
        </Grid.Column>
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
      </Grid.Row>
    );
  }
}

VideoAssetFile.propTypes = {
  file: PropTypes.string,
  activeStep: PropTypes.string,
  removeVideoAssetFile: PropTypes.func,
  replaceVideoAssetFile: PropTypes.func
};

export default VideoAssetFile;
