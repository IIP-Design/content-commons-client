import React, { Fragment } from 'react';
import { Select } from 'semantic-ui-react';
import { subtitleOptions } from './fileSelectOptions';

const SelectSubtitleOptions = () => (
  <Fragment>
    <p className="videoProjectFiles_asset_options_mobileLabel">Subtitles</p>
    <Select
      options={ subtitleOptions }
      className="videoProjectFiles_asset_options videoProjectFiles_asset_options--subtitles"
      placeholder="-"
    />
  </Fragment>
);

export default SelectSubtitleOptions;
