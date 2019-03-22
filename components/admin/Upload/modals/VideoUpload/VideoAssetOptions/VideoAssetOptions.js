import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import SelectLanguageOptions from './SelectLanguageOptions';
import SelectSubtitleOptions from './SelectSubtitleOptions';
import SelectQualityOptions from './SelectQualityOptions';
import RenderOptionsForVideo from './RenderOptionsForVideo';
import RenderTypeUseOptions from './RenderTypeUseOptions';

const VideoAssetOptions = props => {
  const { isMobileDevice, activeStep, file } = props;
  if ( isMobileDevice ) {
    return (
      <Fragment>
        <SelectLanguageOptions />
        <RenderOptionsForVideo file={ file }><SelectSubtitleOptions /></RenderOptionsForVideo>
        <RenderTypeUseOptions file={ file } />
        <RenderOptionsForVideo file={ file }><SelectQualityOptions /></RenderOptionsForVideo>
      </Fragment>
    );
  }

  return (
    <Fragment>
      { activeStep === 1 && <SelectLanguageOptions /> }
      { activeStep === 1 && <RenderOptionsForVideo file={ file }><SelectSubtitleOptions /></RenderOptionsForVideo> }
      { activeStep === 2 && <RenderTypeUseOptions file={ file } /> }
      { activeStep === 2 && <RenderOptionsForVideo file={ file }><SelectQualityOptions /></RenderOptionsForVideo> }
    </Fragment>
  );
};

VideoAssetOptions.propTypes = {
  file: PropTypes.string,
  isMobileDevice: PropTypes.bool,
  activeStep: PropTypes.number
};

export default VideoAssetOptions;
