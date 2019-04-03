import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'semantic-ui-react';
import { subtitleOptions } from './fileSelectOptions';

const SelectSubtitleOptions = ( { subtitles, handleSubtitlesChange } ) => (
  <Fragment>
    <p className="videoProjectFiles_asset_options_mobileLabel">Subtitles</p>
    <Select
      options={ subtitleOptions }
      className="videoProjectFiles_asset_options videoProjectFiles_asset_options--subtitles subtitles"
      placeholder="-"
      value={ subtitles }
      onChange={ ( e, { value } ) => handleSubtitlesChange( value ) }
    />
  </Fragment>
);

SelectSubtitleOptions.propTypes = {
  subtitles: PropTypes.string,
  handleSubtitlesChange: PropTypes.func
};

export default SelectSubtitleOptions;
