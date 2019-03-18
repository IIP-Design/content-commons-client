import React from 'react';
import { Select } from 'semantic-ui-react';
import { typeUseOptionsVideo } from './fileSelectOptions';

const SelectTypeUseOptionsVideo = () => (
  <Select
    options={ typeUseOptionsVideo }
    className="videoProjectFiles_asset_options videoProjectFiles_asset_options--typeUse"
    placeholder="-"
    data-label="Video Type"
  />
);

export default SelectTypeUseOptionsVideo;
