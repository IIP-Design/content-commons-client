import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid, Icon } from 'semantic-ui-react';
import replaceIcon from '../../../../../../static/icons/icon_replace.svg';
import removeIcon from '../../../../../../static/icons/icon_remove.svg';
import '../../../../../../styles/tooltip.scss';
import { truncateAndReplaceStr } from '../../../../../../lib/utils';
import { isMobile } from '../../../../../../lib/browser';
import {
  SelectLangaugeOptions,
  SelectTypeUseOptionsImages,
  SelectTypeUseOptionsVideo,
  SelectSubtitleOptions,
  SelectQualityOptions
} from './VideoAssetOptions';
import './VideoAssetFile.scss';

class VideoAssetFile extends PureComponent {
  state = {
    isMobileDevice: false,
    actionsMenuActive: false
  }

  componentDidMount() {
    const isMobileDevice = isMobile();
    this.setState( { isMobileDevice } );
  }

  openAssetFileActionsMenu = () => this.setState( { actionsMenuActive: true } );

  closeAssetFileActionsMenu = () => this.setState( { actionsMenuActive: false } );

  renderOptionsForVideo = Component => {
    const { file } = this.props;
    if ( file.indexOf( 'mp4' ) > -1 ) return <Component />;

    return (
      <p className="videoProjectFiles_asset_options videoProjectFiles_asset_options--notApplicable">
        Not Applicable
      </p>
    );
  }

  renderTypeUseOptions = () => {
    const { file } = this.props;
    const isImage = ( /\.(gif|jpg|jpeg|tiff|png)$/i ).test( file );
    const isVideo = file.indexOf( 'mp4' ) > -1;

    if ( isImage ) return <SelectTypeUseOptionsImages />;
    if ( isVideo ) return <SelectTypeUseOptionsVideo />;
    return (
      <p className="videoProjectFiles_asset_options videoProjectFiles_asset_options--notApplicable">
        Not Applicable
      </p>
    );
  }

  render() {
    const {
      activeStep,
      file,
      removeVideoAssetFile,
      replaceVideoAssetFile
    } = this.props;

    const { isMobileDevice, actionsMenuActive } = this.state;

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
          { activeStep === 'step_1' && <SelectLangaugeOptions /> }
          { activeStep === 'step_1' && this.renderOptionsForVideo( SelectSubtitleOptions ) }
          { activeStep === 'step_2' && this.renderTypeUseOptions() }
          { activeStep === 'step_2' && this.renderOptionsForVideo( SelectQualityOptions ) }

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
              onClick={ this.closeAssetFileActionsMenu }
              onKeyPress={ this.closeAssetFileActionsMenu }
              tabIndex="0"
            />
          </div>
        </Grid.Column>
        { isMobile && !actionsMenuActive && (
          <Icon
            name="ellipsis vertical"
            className="mobileActionsMenuToggle"
            onClick={ this.openAssetFileActionsMenu }
            onKeyPress={ this.openAssetFileActionsMenu }
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
