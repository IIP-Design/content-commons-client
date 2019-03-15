import React from 'react';
import { Select } from 'semantic-ui-react';
import { subtitleOptions } from './fileSelectOptions';

const SelectSubtitleOptions = () => (
  <Select
    options={ subtitleOptions }
    className="videoProjectFiles_asset_options videoProjectFiles_asset_options--subtitles"
    placeholder="-"
  />
);

export default SelectSubtitleOptions;
