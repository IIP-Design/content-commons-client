import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import SelectLanguageOptions from './SelectLanguageOptions';
import SelectSubtitleOptions from './SelectSubtitleOptions';
import SelectQualityOptions from './SelectQualityOptions';
import RenderOptionsForVideo from './RenderOptionsForVideo';
import RenderTypeUseOptions from './RenderTypeUseOptions';

const VideoAssetOptions = props => {
  const {
    isMobileDevice,
    activeStep,
    file,
    language,
    handleLanguageChange,
    subtitles,
    handleSubtitlesChange,
    typeUse,
    handleTypeUseChange,
    quality,
    handleQualityChange
  } = props;

  if ( isMobileDevice ) {
    return (
      <Fragment>
        <SelectLanguageOptions language={ language } handleLanguageChange={ handleLanguageChange } />
        <RenderOptionsForVideo file={ file } selectOption="subtitles">
          <SelectSubtitleOptions subtitles={ subtitles } handleSubtitlesChange={ handleSubtitlesChange } />
        </RenderOptionsForVideo>
        <RenderTypeUseOptions file={ file } typeUse={ typeUse } handleTypeUseChange={ handleTypeUseChange } />
        <RenderOptionsForVideo file={ file } selectOption="quality">
          <SelectQualityOptions quality={ quality } handleQualityChange={ handleQualityChange } />
        </RenderOptionsForVideo>
      </Fragment>
    );
  }

  return (
    <Fragment>
      { activeStep === 'step_1' && (
        <SelectLanguageOptions language={ language } handleLanguageChange={ handleLanguageChange } />
      ) }
      { activeStep === 'step_1' && (
        <RenderOptionsForVideo file={ file } selectOption="subtitles">
          <SelectSubtitleOptions subtitles={ subtitles } handleSubtitlesChange={ handleSubtitlesChange } />
        </RenderOptionsForVideo>
      ) }
      { activeStep === 'step_2' && (
        <RenderTypeUseOptions file={ file } typeUse={ typeUse } handleTypeUseChange={ handleTypeUseChange } />
      ) }
      { activeStep === 'step_2' && (
        <RenderOptionsForVideo file={ file } selectOption="quality">
          <SelectQualityOptions quality={ quality } handleQualityChange={ handleQualityChange } />
        </RenderOptionsForVideo>
      ) }
    </Fragment>
  );
};

VideoAssetOptions.propTypes = {
  file: PropTypes.string,
  isMobileDevice: PropTypes.bool,
  activeStep: PropTypes.string,
  language: PropTypes.string,
  handleLanguageChange: PropTypes.func,
  subtitles: PropTypes.string,
  handleSubtitlesChange: PropTypes.func,
  typeUse: PropTypes.string,
  handleTypeUseChange: PropTypes.func,
  quality: PropTypes.string,
  handleQualityChange: PropTypes.func
};

export default VideoAssetOptions;
