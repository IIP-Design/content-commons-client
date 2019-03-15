import React from 'react';
import { Select } from 'semantic-ui-react';
import { typeUseOptionsImages } from './fileSelectOptions';

const SelectTypeUseOptionsImages = () => (
  <Select
    options={ typeUseOptionsImages }
    className="videoProjectFiles_asset_options videoProjectFiles_asset_options--typeUse"
    placeholder="-"
  />
);

export default SelectTypeUseOptionsImages;
