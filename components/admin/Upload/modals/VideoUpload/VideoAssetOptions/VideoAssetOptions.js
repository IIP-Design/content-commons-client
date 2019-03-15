import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import SelectLangaugeOptions from './SelectLangaugeOptions';
import SelectSubtitleOptions from './SelectSubtitleOptions';
import SelectQualityOptions from './SelectQualityOptions';
import RenderOptionsForVideo from './RenderOptionsForVideo';
import RenderTypeUseOptions from './RenderTypeUseOptions';

const VideoAssetOptions = props => {
  const { isMobileDevice, activeStep, file } = props;
  if ( isMobileDevice ) {
    return (
      <Fragment>
        <SelectLangaugeOptions />
        <RenderOptionsForVideo file={ file }><SelectSubtitleOptions /></RenderOptionsForVideo>
        <RenderTypeUseOptions file={ file } />
        <RenderOptionsForVideo file={ file }><SelectQualityOptions /></RenderOptionsForVideo>
      </Fragment>
    );
  }

  return (
    <Fragment>
      { activeStep === 'step_1' && <SelectLangaugeOptions /> }
      { activeStep === 'step_1' && <RenderOptionsForVideo file={ file }><SelectSubtitleOptions /></RenderOptionsForVideo> }
      { activeStep === 'step_2' && <RenderTypeUseOptions file={ file } /> }
      { activeStep === 'step_2' && <RenderOptionsForVideo file={ file }><SelectQualityOptions /></RenderOptionsForVideo> }
    </Fragment>
  );
};

VideoAssetOptions.propTypes = {
  file: PropTypes.string,
  isMobileDevice: PropTypes.bool,
  activeStep: PropTypes.string,
};

export default VideoAssetOptions;
