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
    selectOptionsActive: false,
    language: null,
    subtitles: null,
    typeUse: null,
    quality: null,
    optionsCount: 0,
  }

  componentDidMount() {
    const isMobileDevice = isWindowWidthLessThanOrEqualTo( 640 );

    window.addEventListener( 'resize', this.fileOnResize );

    const options = Array.from( this.fileAsset.querySelectorAll( '.videoProjectFiles_asset_options' ) );
    const subtitles = options.filter( option => option.classList.contains( 'subtitles' ) )[0];
    const subtitlesCount = subtitles.className.includes( 'notApplicable' ) ? 0 : 1;
    const languageCount = 1;

    this.setState( {
      isMobileDevice,
      optionsCount: languageCount + subtitlesCount
    } );
  }

  componentDidUpdate() {
    const {
      isMobileDevice,
      language,
      subtitles,
      typeUse,
      quality
    } = this.state;
    const options = Array.from( this.fileAsset.querySelectorAll( '.videoProjectFiles_asset_options' ) );
    const languageCount = language !== null ? 0 : 1;

    let typeUseDOM;
    let typeUseCount;
    let qualityDOM;
    let qualityCount;

    if ( isMobileDevice ) {
      const subtitlesDOM = options.filter( option => option.classList.contains( 'subtitles' ) )[0];
      const subtitlesCount = subtitlesDOM.className.includes( 'notApplicable' ) || subtitles !== null
        ? 0
        : 1;
      [typeUseDOM] = options.filter( option => option.classList.contains( 'typeUse' ) );
      typeUseCount = typeUseDOM.className.includes( 'notApplicable' ) || typeUse !== null
        ? 0
        : 1;
      [qualityDOM] = options.filter( option => option.classList.contains( 'quality' ) );
      qualityCount = qualityDOM.className.includes( 'notApplicable' ) || quality !== null
        ? 0
        : 1;
      /* eslint-disable-next-line react/no-did-update-set-state */
      return this.setState( {
        optionsCount: languageCount + subtitlesCount + typeUseCount + qualityCount
      } );
    }

    if ( this.props.activeStep === 'step_1' ) {
      const subtitlesDOM = options.filter( option => option.classList.contains( 'subtitles' ) )[0];
      const subtitlesCount = subtitlesDOM.className.includes( 'notApplicable' ) || subtitles !== null
        ? 0
        : 1;
      /* eslint-disable-next-line react/no-did-update-set-state */
      return this.setState( { optionsCount: languageCount + subtitlesCount } );
    }

    [typeUseDOM] = options.filter( option => option.classList.contains( 'typeUse' ) );
    typeUseCount = typeUseDOM.className.includes( 'notApplicable' ) || typeUse !== null
      ? 0
      : 1;
    [qualityDOM] = options.filter( option => option.classList.contains( 'quality' ) );
    qualityCount = qualityDOM.className.includes( 'notApplicable' ) || quality !== null
      ? 0
      : 1;
    /* eslint-disable-next-line react/no-did-update-set-state */
    return this.setState( { optionsCount: typeUseCount + qualityCount } );
  }

  componentWillUnmount() {
    window.removeEventListener( 'resize', this.fileOnResize );
  }

  handleLanguageChange = language => {
    this.props.setOptionsComplete();
    this.setState( { language } );
  }

  handleSubtitlesChange = subtitles => {
    this.props.setOptionsComplete();
    this.setState( { subtitles } );
  }

  handleTypeUseChange = typeUse => {
    this.props.setOptionsComplete();
    this.setState( { typeUse } );
  }

  handleQualityChange = quality => {
    this.props.setOptionsComplete();
    this.setState( { quality } );
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
      selectOptionsActive,
      language,
      subtitles,
      typeUse,
      quality,
      optionsCount,
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
          <p
            className={
              optionsCount > 0
                ? 'videoProjectFiles_asset_file incomplete'
                : 'videoProjectFiles_asset_file complete'
            }
            title={ file }
            data-optionscount={ optionsCount }
          >
            { fileDisplayName }
          </p>
          <p className={ `videoProjectFiles_asset_file--fullFileName ${selectOptionsActive ? 'active' : ''}` }>
            <Icon name="info" size="small" />
            { file }
          </p>
        </Grid.Column>
        <Grid.Column mobile={ 16 } tablet={ 10 } computer={ 10 }>
          <div
            ref={ fileAsset => { this.fileAsset = fileAsset; } }
            className={ `videoProjectFiles_asset_options_wrapper ${selectOptionsActive ? 'active' : ''}` }
          >
            <VideoAssetOptions
              isMobileDevice={ isMobileDevice }
              activeStep={ activeStep }
              file={ file }
              language={ language }
              handleLanguageChange={ this.handleLanguageChange }
              subtitles={ subtitles }
              handleSubtitlesChange={ this.handleSubtitlesChange }
              typeUse={ typeUse }
              handleTypeUseChange={ this.handleTypeUseChange }
              quality={ quality }
              handleQualityChange={ this.handleQualityChange }
            />
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
  activeStep: PropTypes.string,
  removeVideoAssetFile: PropTypes.func,
  replaceVideoAssetFile: PropTypes.func,
  setOptionsComplete: PropTypes.func
};

export default VideoAssetFile;
